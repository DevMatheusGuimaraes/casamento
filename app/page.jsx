"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const links = {
  confirmarPresenca:
    "https://wa.me/5569999999999?text=Confirmo%20minha%20presen%C3%A7a%20no%20casamento",
  listaPresentes: "#presentes",
  detalhes: "#detalhes",
  local: "#local",
  mapa: "https://www.google.com/maps/search/?api=1&query=Aldeia+do+Lago+Ji-Parana",
};

const imagens = {
  carta: "/convite/carta.png",
  aberto: "/convite/aberto.png",
  convidado: "/convite/convidado.png",
  detalhes: "/convite/detalhes.png",
  presentes: "/convite/presentes.png",
  local: "/convite/local.png",
  jipa: "/convite/jipa.png",
};

export default function Home() {
  const [aberto, setAberto] = useState(false);

  useEffect(() => {
    const elementos = document.querySelectorAll(".reveal");

    const observer = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((entrada) => {
          if (entrada.isIntersecting) {
            entrada.target.classList.add("is-visible");
          }
        });
      },
      { threshold: 0.18 }
    );

    elementos.forEach((elemento) => observer.observe(elemento));

    return () => observer.disconnect();
  }, []);

  return (
    <main className="min-h-screen overflow-hidden">

      <section className={`${aberto ? "hidden" : ""} relative grid min-h-screen place-items-center px-5 py-10`}>

        <div className="relative mx-auto flex w-full max-w-5xl flex-col items-center">
          {!aberto && (
            <div>
              <p className="fade-up mb-5 text-center text-sm uppercase tracking-[0.34em] text-[#646b45] sm:text-xl">
              O CONVIDAMOS COM A BÊNÇÃO DE NOSSOS PAIS
            </p>

            <h1 className="fade-up text-center font-[var(--font-script)] text-5xl leading-none text-[#334019] sm:text-8xl md:text-9xl">
              Jéssica & Caio Augusto
            </h1>
            </div>
          )}

          <div className="relative grid min-h-[390px] w-full place-items-center sm:min-h-[560px]">
            {!aberto && (
              <button
                type="button"
                onClick={() => setAberto(true)}
                className="group relative w-full max-w-[720px] cursor-pointer border-0 bg-transparent p-0"
                aria-label="Abrir convite"
              >
                <Image
                  src={imagens.carta}
                  alt="Envelope fechado do convite"
                  width={1300}
                  height={1264}
                  className="transition duration-700 scale-[1.13]"
                  priority
                />

                <span className="shine absolute top-[48%] -translate-x-1/2 px-7 py-3 text-[12px] font-semibold uppercase tracking-[0.16em] text-[#39431d] shadow-black/10 backdrop-blur-sm transition sm:text-lg">
                  CLIQUE PARA ABRIR
                </span>
              </button>
            )}
          </div>
        </div>
      </section>

      {aberto && (

      <section className="min-h-[1150px]">

        <div className="relative grid w-full">
          <Image
            src={imagens.aberto}
            alt="Envelope aberto do convite"
            width={1264}
            height={1264}
            className="open-envelope paper-shadow w-full max-w-[780px]"
            priority
          />

          <Image
            src={imagens.convidado}
            alt="Você é nosso convidado: Jéssica e Caio Augusto"
            width={1120}
            height={1456}
            className="open-envelope paper-shadow absolute top-[70%] w-[68%] max-w-[430px] sm:top-[4%] left-[40%] scale-[1]"
            priority
          />

          <Image
            src={imagens.local}
            alt="Você é  nosso convidado:Jéssica e Caio Augusto"
            width={1120}
            height={1456}
            priority
            className="open-envelope paper-shadow absolute top-[215%] w-[68%] max-w-[430px] sm:top-[4%] rigth-[40%] scale-[1.1]"
          />

          <Image
            src={imagens.presentes}
            alt="Você é  nosso convidado:Jéssica e Caio Augusto"
            width={1120}
            height={1456}
            priority
            className="open-envelope paper-shadow absolute top-[180%] w-[68%] max-w-[430px] sm:top-[4%] scale-[1.1] left-[40%]"
          />

          <Image
            src="/convite/detalhes.png"
            alt="Você é  nosso convidado:Jéssica e Caio Augusto"
            width={1120}
            height={1456}
            priority
            className="open-envelope paper-shadow absolute top-[140%] w-[68%] max-w-[430px] sm:top-[4%] rigth-[40%] scale-[1.1] z-99"
          />
        </div>

      <footer className="relative mt-[900px] overflow-hidden border-t border-[#d8c9a3]/60 bg-gradient-to-b from-[#f8f3e8] via-[#efe5cf] to-[#d9c79e] px-6 py-14 text-center">
        <div className="absolute left-1/2 top-0 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#c8a96a]/30 blur-3xl" />

        <div className="absolute -left-16 bottom-0 h-40 w-40 rounded-full bg-[#b9bd8b]/30 blur-3xl" />
        <div className="absolute -right-16 top-10 h-40 w-40 rounded-full bg-[#e8d8b0]/40 blur-3xl" />

        <div className="relative z-10">
          <p className="font-serif text-2xl italic tracking-[0.12em] text-[#6c6d4d]">
            Jéssica & Caio Augusto
          </p>

          <div className="mx-auto my-4 h-px w-32 bg-[#b7a16b]" />

          <p className="text-sm tracking-[0.35em] text-[#7c7454]">
            15 | 08 | 2026
          </p>
        </div>
      </footer>
        
      </section>

            )}


      {/* {aberto && (
        <div>
          <section
        id="programacao"
        className="relative mx-auto grid min-h-screen w-full max-w-6xl place-items-center px-5 py-24"
      >
        <div className="reveal text-center">
          <p className="text-lg uppercase tracking-[0.36em] text-[#7b7350]">
            Nossa programação
          </p>

          <h2 className="mt-4 font-[var(--font-script)] text-6xl text-[#344019] sm:text-8xl">
            15 de agosto
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-3xl leading-tight text-[#536039] sm:text-5xl">
            Esperamos você às 16:30h na Aldeia do Lago, em Ji-Paraná.
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href={links.confirmarPresenca}
              target="_blank"
              className="rounded-full bg-[#39431d] px-8 py-3 text-sm font-semibold uppercase tracking-[0.24em] text-[#fff7df] transition hover:-translate-y-1 hover:bg-[#28300f]"
            >
              Confirmar presença
            </a>

            <a
              href={links.mapa}
              target="_blank"
              className="rounded-full border border-[#a58d52] px-8 py-3 text-sm font-semibold uppercase tracking-[0.24em] text-[#39431d] transition hover:-translate-y-1 hover:bg-white/40"
            >
              Abrir localização
            </a>
          </div>
        </div>
      </section>

      <ConviteLink
        id="presentes"
        titulo="Lista de presentes"
        texto="Um espaço para direcionar seus convidados para a lista de presentes ou para uma chave Pix, caso prefiram presentear dessa forma."
        imagem={imagens.presentes}
        href={links.listaPresentes}
        lado="esquerda"
      />

      <section
        id="local"
        className="relative mx-auto grid min-h-screen w-full max-w-6xl items-center gap-8 px-5 py-24 lg:grid-cols-[1.05fr_0.95fr]"
      >
        <div className="reveal order-2 lg:order-1">
          <p className="text-lg uppercase tracking-[0.34em] text-[#7b7350]">
            Local e hospedagem
          </p>

          <h2 className="mt-4 font-[var(--font-script)] text-6xl leading-none text-[#344019] sm:text-8xl">
            Ji-Paraná
          </h2>

          <p className="mt-5 max-w-xl text-2xl leading-snug text-[#536039] sm:text-3xl">
            Reunimos orientações sobre o local da cerimônia e sugestões de
            hospedagem para quem vem celebrar esse dia conosco.
          </p>

          <a
            href={links.local}
            className="mt-8 inline-flex rounded-full bg-[#39431d] px-8 py-3 text-sm font-semibold uppercase tracking-[0.24em] text-[#fff7df] transition hover:-translate-y-1 hover:bg-[#28300f]"
          >
            Ver informações
          </a>
        </div>

        <div className="reveal relative order-1 grid place-items-center lg:order-2">
          <Image
            src={imagens.local}
            alt="Informações sobre local da cerimônia e hospedagem"
            width={1120}
            height={1456}
            className="floating paper-shadow w-full max-w-[570px]"
            style={{ "--rotate": "2deg" }}
          />
        </div>
      </section>

      <footer className="px-5 pb-12 text-center text-lg tracking-[0.18em] text-[#6c6d4d]">
        Com carinho, Jéssica & Caio Augusto
      </footer>
        </div>
      )} */}



    </main>
  );
}

function ConviteLink({ id, titulo, texto, imagem, href, lado }) {
  const imagemPrimeiro = lado === "esquerda";

  return (
    <section
      id={id}
    >
      <div
        className={`reveal grid place-items-center ${
          imagemPrimeiro ? "lg:order-1" : "lg:order-2"
        }`}
      >
        <a href={href} className="group block">
          <Image
            src={imagem}
            alt={titulo}
            width={1264}
            height={1264}
            className="floating paper-shadow w-full max-w-[540px] transition duration-700 group-hover:scale-[1.035]"
            style={{ "--rotate": imagemPrimeiro ? "-3deg" : "3deg" }}
          />
        </a>
      </div>

      <div
        className={`reveal text-center lg:text-left ${
          imagemPrimeiro ? "lg:order-2" : "lg:order-1"
        }`}
      >
        <p className="text-lg uppercase tracking-[0.34em] text-[#7b7350]">
          Clique no cartão
        </p>

        <h2 className="mt-4 font-[var(--font-script)] text-6xl leading-none text-[#344019] sm:text-8xl">
          {titulo}
        </h2>

        <p className="mt-5 max-w-xl text-2xl leading-snug text-[#536039] sm:text-3xl">
          {texto}
        </p>
      </div>
    </section>
  );
}
