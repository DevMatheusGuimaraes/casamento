# Convite Jéssica & Caio Augusto

Site de convite de casamento criado com Next.js, React e TailwindCSS.

## Como rodar

```bash
npm install
npm run dev
```

Depois acesse:

```bash
http://localhost:3000
```

## Onde editar as informações

As informações principais estão em `app/page.jsx`.

Procure por:

```js
const links = {
  confirmarPresenca: "...",
  listaPresentes: "#presentes",
  detalhes: "#detalhes",
  local: "#local",
  mapa: "...",
};
```

Troque esses links pelos links reais do casamento.

## Onde ficam as imagens

As artes estão em:

```bash
public/convite
```

Se quiser trocar alguma imagem, mantenha o mesmo nome do arquivo ou atualize o caminho em `app/page.jsx`.
