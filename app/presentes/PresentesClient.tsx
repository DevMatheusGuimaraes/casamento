'use client'

import Image from 'next/image'
import { useMemo, useState } from 'react'
import { motion, type Variants } from 'framer-motion'
import { Leaf } from 'lucide-react'
import { gerarPixCopiaECola } from '../../lib/pix'

type PresenteView = {
  id: number
  nome: string
  imagem: string
  totalCotas: number
  valorCota: number
  cotasPagas: number
  finalizado: string | null
}

type Props = {
  presentes: PresenteView[]
  erroSupabase?: string
}

const pixKey = process.env.NEXT_PUBLIC_PIX_KEY || ''
const pixReceiverName = process.env.NEXT_PUBLIC_PIX_RECEIVER_NAME || 'JESSICA E CAIO'
const pixReceiverCity = process.env.NEXT_PUBLIC_PIX_RECEIVER_CITY || 'JI-PARANA'

// Paleta centralizada — mude aqui e reflete no componente inteiro
const cores = {
  fundo: '#f7f2e9',
  texto: '#332d29',
  gold: '#c79a2f',
  muted: '#777067',
  verde: '#6d7f55',
  borda: '#ddd3c6',
  cardBg: '#fffdf9',
  trilhaBarra: '#ede8df',
  botaoDesabilitado: '#b8ad9e',
  botaoTexto: '#fbf7ef',
}

function formatarMoeda(valor: number) {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(valor)
}

async function copiarTexto(texto: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(texto)
    return
  }

  const textarea = document.createElement('textarea')
  textarea.value = texto
  textarea.style.position = 'fixed'
  textarea.style.opacity = '0'
  document.body.appendChild(textarea)
  textarea.focus()
  textarea.select()
  document.execCommand('copy')
  document.body.removeChild(textarea)
}

function presenteFinalizado(item: PresenteView) {
  return item.finalizado?.trim().toUpperCase() === 'FINALIZADO' || item.cotasPagas >= item.totalCotas
}

export function PresentesClient({ presentes, erroSupabase }: Props) {
  const [copiadoId, setCopiadoId] = useState<number | null>(null)
  const [erroPix, setErroPix] = useState<string | null>(null)

  const totalCotas = useMemo(
    () => presentes.reduce((total, item) => total + item.totalCotas, 0),
    [presentes],
  )

  const cotasPresenteadas = useMemo(
    () => presentes.reduce((total, item) => total + Math.min(item.cotasPagas, item.totalCotas), 0),
    [presentes],
  )

  const porcentagem = totalCotas > 0 ? Math.round((cotasPresenteadas / totalCotas) * 100) : 0

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  }

  async function handlePresentear(item: PresenteView) {
    setErroPix(null)
    try {
      const codigoPix = gerarPixCopiaECola({
        pixKey,
        merchantName: pixReceiverName,
        merchantCity: pixReceiverCity,
        amount: item.valorCota,
        txid: `PRES${item.id}`,
      })
      await copiarTexto(codigoPix)
      setCopiadoId(item.id)
      window.setTimeout(() => setCopiadoId(null), 2800)
    } catch (error) {
      setErroPix(error instanceof Error ? error.message : 'Não foi possível gerar o Pix.')
    }
  }

  return (
    <div
      style={{
        position: 'relative',
        minHeight: '100dvh',
        width: '100%',
        overflow: 'hidden',
        backgroundColor: cores.fundo,
        fontFamily: 'var(--font-montserrat)',
        color: cores.texto,
      }}
    >
      {/* CSS local do Next.js — não depende do Tailwind, sempre funciona */}
      <style jsx global>{`
        @keyframes giftSlide {
          from { background-position: 0 0; }
          to { background-position: 20px 0; }
        }
        .gift-page ::selection {
          background-color: rgba(109, 127, 85, 0.2);
        }
        .gift-card {
          transition: box-shadow 0.3s ease;
        }
        .gift-card:hover {
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
        }
        .gift-card-shine {
          opacity: 0;
          transition: opacity 0.7s ease;
        }
        .gift-card:hover .gift-card-shine {
          opacity: 1;
        }
        .gift-card-image {
          transition: transform 0.5s ease;
        }
        .gift-card:hover .gift-card-image {
          transform: scale(1.05);
        }
        .gift-button:hover:not(:disabled) {
          background-color: #5d6e47;
        }
      `}</style>

      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: -1,
          backgroundImage: "url('/presentes/fundo-floral.jpg')",
          backgroundRepeat: 'repeat',
          backgroundSize: '400px 400px',
          opacity: 0.4,
        }}
      />

      {/* HERO */}
      <section
        style={{
          maxWidth: '56rem',
          margin: '0 auto',
          padding: '6rem 1.5rem 4rem',
          textAlign: 'center',
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        >
          {/* <div
            style={{
              marginBottom: '1.5rem',
              fontFamily: 'var(--font-cormorant)',
              fontSize: 'clamp(2.25rem, 5vw, 3rem)',
              fontStyle: 'italic',
              letterSpacing: '0.05em',
              color: cores.gold,
            }}
          >
            J &amp; C
          </div> */}

          <div
            style={{
              marginBottom: '1rem',
              fontSize: '0.8rem',
              fontWeight: 500,
              textTransform: 'uppercase',
              letterSpacing: '0.3em',
              color: cores.muted,
            }}
          >
            Lista de Presentes
          </div>

          <h1
            style={{
              marginBottom: '2rem',
              fontFamily: 'var(--font-cormorant)',
              fontSize: 'clamp(3rem, 8vw, 4.5rem)',
              lineHeight: 1,
              color: cores.texto,
              fontWeight: 400,
            }}
          >
            Jéssica &amp; Caio Augusto
          </h1>

          <div
            style={{
              marginBottom: '2rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              color: `${cores.verde}99`,
            }}
          >
            <div style={{ height: '1px', width: '3rem', backgroundColor: `${cores.verde}4d` }} />
            <Leaf size={20} strokeWidth={1.5} />
            <div style={{ height: '1px', width: '3rem', backgroundColor: `${cores.verde}4d` }} />
          </div>

          <p
            style={{
              maxWidth: '42rem',
              fontSize: '1.05rem',
              fontWeight: 300,
              lineHeight: 1.7,
              color: cores.muted,
            }}
          >
            Sua presença já é o nosso maior presente, mas se desejar nos presentear, escolha uma cota e clique no botão. O Pix copia e cola será gerado automaticamente com o valor certinho.
          </p>
        </motion.div>
      </section>

      {/* BARRA DE PROGRESSO */}
      <section style={{ maxWidth: '48rem', margin: '0 auto', padding: '3rem 1.5rem' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            borderRadius: '1rem',
            border: `1px solid ${cores.borda}80`,
            backgroundColor: `${cores.cardBg}cc`,
            padding: '2rem',
            textAlign: 'center',
            boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
          }}
        >
          <h2
            style={{
              marginBottom: '1.5rem',
              fontSize: '0.8rem',
              fontWeight: 500,
              textTransform: 'uppercase',
              letterSpacing: '0.2em',
              color: cores.texto,
            }}
          >
            Cotas Presenteadas {cotasPresenteadas}/{totalCotas}
          </h2>

          <div
            style={{
              marginBottom: '1rem',
              height: '0.75rem',
              width: '100%',
              overflow: 'hidden',
              borderRadius: '9999px',
              border: `1px solid ${cores.borda}80`,
              backgroundColor: cores.trilhaBarra,
            }}
          >
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${porcentagem}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: 'easeOut', delay: 0.2 }}
              style={{
                position: 'relative',
                height: '100%',
                backgroundColor: `${cores.verde}cc`,
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  animation: 'giftSlide 1s linear infinite',
                  backgroundImage:
                    'linear-gradient(45deg, transparent 25%, rgba(255,255,255,0.22) 50%, transparent 75%, transparent 100%)',
                  backgroundSize: '20px 20px',
                }}
              />
            </motion.div>
          </div>

          <p
            style={{
              fontFamily: 'var(--font-cormorant)',
              fontSize: '1.125rem',
              fontStyle: 'italic',
              fontWeight: 300,
              color: cores.muted,
            }}
          >
            {porcentagem}% da lista já foi presenteada
          </p>
        </motion.div>
      </section>

      {erroSupabase ? (
        <div
          style={{
            margin: '0 auto 1rem',
            maxWidth: '48rem',
            borderRadius: '1rem',
            border: '1px solid #fecaca',
            backgroundColor: 'rgba(254,242,242,0.9)',
            padding: '1rem 1.5rem',
            fontSize: '0.875rem',
            color: '#b91c1c',
          }}
        >
          Não foi possível carregar os presentes no Supabase: {erroSupabase}
        </div>
      ) : null}

      {erroPix ? (
        <div
          style={{
            margin: '0 auto 1rem',
            maxWidth: '48rem',
            borderRadius: '1rem',
            border: '1px solid #fde68a',
            backgroundColor: 'rgba(255,251,235,0.9)',
            padding: '1rem 1.5rem',
            fontSize: '0.875rem',
            color: '#92400e',
          }}
        >
          {erroPix}
        </div>
      ) : null}

      {/* GRID DE PRESENTES */}
      <section style={{ maxWidth: '72rem', margin: '0 auto', padding: '3rem 1.5rem 6rem' }}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2rem',
          }}
        >
          {presentes.map((item, index) => {
            const finalizado = presenteFinalizado(item)
            const cotasPagas = Math.min(item.cotasPagas, item.totalCotas)
            const botaoDesabilitado = finalizado || item.valorCota <= 0

            return (
              <motion.div
                key={item.id}
                variants={itemVariants}
                whileHover={{ y: -6 }}
                className="gift-card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                  borderRadius: '0.75rem',
                  border: `1px solid ${cores.borda}99`,
                  backgroundColor: cores.cardBg,
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                }}
              >
                <div
                  style={{
                    position: 'relative',
                    aspectRatio: '1 / 1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    backgroundColor: `${cores.trilhaBarra}4d`,
                    padding: '2rem',
                  }}
                >
                  <div
                    className="gift-card-shine"
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background:
                        'linear-gradient(to top right, transparent, rgba(255,255,255,0.4), transparent)',
                    }}
                  />

                  {item.imagem ? (
                    <Image
                      src={item.imagem}
                      alt={item.nome}
                      width={900}
                      height={900}
                      sizes="(max-width: 640px) 82vw, (max-width: 1024px) 42vw, 330px"
                      className="gift-card-image"
                      style={{
                        position: 'relative',
                        height: '100%',
                        width: '100%',
                        objectFit: 'contain',
                        mixBlendMode: 'multiply',
                        filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.08))',
                      }}
                      priority={index < 2}
                    />
                  ) : (
                    <div
                      style={{
                        display: 'flex',
                        height: '6rem',
                        width: '6rem',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '9999px',
                        border: `1px solid ${cores.borda}`,
                        backgroundColor: cores.trilhaBarra,
                      }}
                    >
                      <span
                        style={{
                          fontFamily: 'var(--font-cormorant)',
                          fontSize: '0.875rem',
                          fontStyle: 'italic',
                          color: cores.muted,
                        }}
                      >
                        Imagem
                      </span>
                    </div>
                  )}
                </div>

                <div
                  style={{
                    display: 'flex',
                    flexGrow: 1,
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '1.5rem',
                    textAlign: 'center',
                  }}
                >
                  <h3
                    style={{
                      marginBottom: '0.5rem',
                      maxWidth: '100%',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      fontFamily: 'var(--font-cormorant)',
                      fontSize: '1.5rem',
                      color: cores.texto,
                    }}
                  >
                    {item.nome}
                  </h3>

                  <div
                    style={{
                      marginBottom: '1rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                    }}
                  >
                    <span style={{ fontSize: '0.875rem', fontWeight: 500, color: cores.texto }}>
                      R$ {formatarMoeda(item.valorCota)}
                    </span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 300, color: cores.muted }}>
                      / cota
                    </span>
                  </div>

                  <div
                    style={{
                      marginBottom: '1.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                    }}
                  >
                    <Leaf size={12} color={`${cores.verde}99`} />
                    <span
                      style={{
                        fontSize: '0.75rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        color: cores.muted,
                      }}
                    >
                      {cotasPagas}/{item.totalCotas} cotas presenteadas
                    </span>
                    <Leaf size={12} color={`${cores.verde}99`} style={{ transform: 'scaleX(-1)' }} />
                  </div>

                  <div style={{ marginTop: 'auto', width: '100%' }}>
                    <button
                      type="button"
                      onClick={() => handlePresentear(item)}
                      disabled={botaoDesabilitado}
                      className="gift-button"
                      style={{
                        width: '100%',
                        borderRadius: '0.375rem',
                        border: 'none',
                        padding: '0.75rem 1.5rem',
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        textTransform: 'uppercase',
                        letterSpacing: '0.15em',
                        color: cores.botaoTexto,
                        backgroundColor: botaoDesabilitado ? cores.botaoDesabilitado : cores.verde,
                        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                        cursor: botaoDesabilitado ? 'not-allowed' : 'pointer',
                        transition: 'background-color 0.2s ease',
                      }}
                    >
                      {finalizado
                        ? 'Casal já Presenteado!'
                        : copiadoId === item.id
                          ? 'Pix copiado!'
                          : 'Presentear'}
                    </button>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer
        style={{
          borderTop: `1px solid ${cores.borda}66`,
          backgroundColor: `${cores.cardBg}4d`,
          padding: '1rem 1.5rem',
          textAlign: 'center',
        }}
      >
        <Image
          src="/convite/monograma2.webp"
          alt="Envelope fechado do convite"
          width={2000}
          height={100}
          className="transition duration-700 scale-[0.6]"
          priority
        />

      </footer>
    </div>
  )
}