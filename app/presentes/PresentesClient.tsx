'use client'

import Image from 'next/image'
import { useMemo, useState } from 'react'
import { motion, type Variants } from 'framer-motion'
import { Leaf } from 'lucide-react'
import { gerarPixCopiaECola } from '../../lib/pix'
import { supabase } from '../../lib/supabase'
import { X } from 'lucide-react'
import { AnimatePresence } from 'framer-motion'

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

  const [itemSelecionado, setItemSelecionado] = useState<PresenteView | null>(null)
  const [nomePessoa, setNomePessoa] = useState('')
  const [textoMensagem, setTextoMensagem] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [erroEnvio, setErroEnvio] = useState<string | null>(null)
  const [enviadoComSucesso, setEnviadoComSucesso] = useState(false)

  async function enviarMensagem() {
    if (!itemSelecionado) return
    setErroEnvio(null)

    if (!nomePessoa.trim()) {
      setErroEnvio('Por favor, digite seu nome.')
      return
    }

    setEnviando(true)
    const { error } = await supabase.from('mensagem').insert({
      produto: itemSelecionado.id,
      mensagem: textoMensagem.trim() || null,
      pessoa: nomePessoa.trim(),
    })
    setEnviando(false)

    if (error) {
      setErroEnvio('Não foi possível enviar. Tente novamente.')
      return
    }

    // FIX: em vez de fechar o modal na hora (setItemSelecionado(null)),
    // ativamos o estado de sucesso — o modal continua aberto, mas troca
    // o formulário pela telinha de agradecimento.
    setEnviadoComSucesso(true)
  }

  function fecharModal() {
    setItemSelecionado(null)
    setErroEnvio(null)
    setEnviadoComSucesso(false)
  }

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

    // FIX: faltava resetar o formulário e abrir o modal para este item.
    // Sem essas linhas, o Pix era copiado mas nada aparecia na tela.
    setErroEnvio(null)
    setEnviadoComSucesso(false)
    setNomePessoa('')
    setTextoMensagem('')
    setItemSelecionado(item)
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
        .gift-input {
          transition: border-color 0.2s ease;
        }
        .gift-input:focus {
          outline: none;
          border-color: #6d7f55 !important;
        }
        .gift-close-btn:hover {
          background-color: rgba(0, 0, 0, 0.05);
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
                      onClick={() => {
                        handlePresentear(item)
                      }}
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

      <AnimatePresence>
        {itemSelecionado ? (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={fecharModal}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 50,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1.5rem',
              backgroundColor: 'rgba(51, 45, 41, 0.45)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
            }}
          >
            <motion.div
              key="modal"
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.97 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              onClick={(e) => e.stopPropagation()}
              style={{
                position: 'relative',
                width: '100%',
                maxWidth: '30rem',
                borderRadius: '1rem',
                border: `1px solid ${cores.borda}80`,
                backgroundColor: cores.cardBg,
                padding: '2.5rem 2rem 2rem',
                boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
                textAlign: 'center',
              }}
            >
              <button
                type="button"
                onClick={fecharModal}
                className="gift-close-btn"
                aria-label="Fechar"
                style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '2rem',
                  height: '2rem',
                  borderRadius: '9999px',
                  border: 'none',
                  backgroundColor: 'transparent',
                  color: cores.muted,
                  cursor: 'pointer',
                  transition: 'background-color 0.2s ease',
                }}
              >
                <X size={18} />
              </button>

              {enviadoComSucesso ? (
                <>
                  <div
                    style={{
                      marginBottom: '1rem',
                      display: 'flex',
                      justifyContent: 'center',
                      color: cores.verde,
                    }}
                  >
                    <Leaf size={32} strokeWidth={1.5} />
                  </div>
                  <h3
                    style={{
                      marginBottom: '0.75rem',
                      fontFamily: 'var(--font-cormorant)',
                      fontSize: '1.75rem',
                      color: cores.texto,
                    }}
                  >
                    Muito obrigado, {nomePessoa.split(' ')[0]}!
                  </h3>
                  <p
                    style={{
                      marginBottom: '1.5rem',
                      fontSize: '0.9rem',
                      lineHeight: 1.6,
                      color: cores.muted,
                    }}
                  >
                    O código Pix já está copiado. É só colar no seu app do banco para finalizar o presente de{' '}
                    <strong style={{ color: cores.texto }}>{itemSelecionado.nome}</strong>.
                  </p>
                  <button
                    type="button"
                    onClick={fecharModal}
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
                      backgroundColor: cores.verde,
                      cursor: 'pointer',
                    }}
                  >
                    Fechar
                  </button>
                </>
              ) : (
                <>
                  <div
                    style={{
                      marginBottom: '0.5rem',
                      fontFamily: 'var(--font-cormorant)',
                      fontSize: '1.75rem',
                      fontStyle: 'italic',
                      color: cores.gold,
                    }}
                  >
                    J &amp; C
                  </div>

                  <h3
                    style={{
                      marginBottom: '0.5rem',
                      fontFamily: 'var(--font-cormorant)',
                      fontSize: '1.875rem',
                      color: cores.texto,
                    }}
                  >
                    Deixe uma mensagem
                  </h3>

                  <p
                    style={{
                      marginBottom: '1.75rem',
                      fontSize: '0.9rem',
                      lineHeight: 1.6,
                      color: cores.muted,
                    }}
                  >
                    Você está presenteando{' '}
                    <strong style={{ color: cores.texto }}>{itemSelecionado.nome}</strong>. O código Pix já
                    foi copiado — antes de colar no seu banco, conte pra gente quem está presenteando!
                  </p>

                  <div style={{ marginBottom: '1rem', textAlign: 'left' }}>
                    <label
                      htmlFor="nomePessoa"
                      style={{
                        display: 'block',
                        marginBottom: '0.4rem',
                        fontSize: '0.75rem',
                        fontWeight: 500,
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        color: cores.texto,
                      }}
                    >
                      Seu nome
                    </label>
                    <input
                      id="nomePessoa"
                      type="text"
                      value={nomePessoa}
                      onChange={(e) => setNomePessoa(e.target.value)}
                      placeholder="Como devemos te chamar?"
                      className="gift-input"
                      style={{
                        width: '100%',
                        borderRadius: '0.5rem',
                        border: `1px solid ${cores.borda}`,
                        backgroundColor: cores.fundo,
                        padding: '0.65rem 0.9rem',
                        fontSize: '0.9rem',
                        color: cores.texto,
                        fontFamily: 'var(--font-montserrat)',
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '1.5rem', textAlign: 'left' }}>
                    <label
                      htmlFor="textoMensagem"
                      style={{
                        display: 'block',
                        marginBottom: '0.4rem',
                        fontSize: '0.75rem',
                        fontWeight: 500,
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        color: cores.texto,
                      }}
                    >
                      Mensagem para o casal (opcional)
                    </label>
                    <textarea
                      id="textoMensagem"
                      value={textoMensagem}
                      onChange={(e) => setTextoMensagem(e.target.value)}
                      placeholder="Escreva um recadinho carinhoso..."
                      rows={3}
                      className="gift-input"
                      style={{
                        width: '100%',
                        resize: 'none',
                        borderRadius: '0.5rem',
                        border: `1px solid ${cores.borda}`,
                        backgroundColor: cores.fundo,
                        padding: '0.65rem 0.9rem',
                        fontSize: '0.9rem',
                        color: cores.texto,
                        fontFamily: 'var(--font-montserrat)',
                      }}
                    />
                  </div>

                  {erroEnvio ? (
                    <p
                      style={{
                        marginBottom: '1rem',
                        fontSize: '0.8rem',
                        color: '#b91c1c',
                      }}
                    >
                      {erroEnvio}
                    </p>
                  ) : null}

                  <button
                    type="button"
                    onClick={enviarMensagem}
                    disabled={enviando}
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
                      backgroundColor: enviando ? cores.botaoDesabilitado : cores.verde,
                      cursor: enviando ? 'not-allowed' : 'pointer',
                      transition: 'background-color 0.2s ease',
                    }}
                  >
                    {enviando ? 'Enviando...' : 'Enviar mensagem'}
                  </button>
                </>
              )}
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
