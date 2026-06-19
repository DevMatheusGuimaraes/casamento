import "./globals.css";

export const metadata = {
  title: "Jéssica & Caio Augusto",
  description: "Convite de casamento de Jéssica e Caio Augusto",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
