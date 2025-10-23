import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Chronos.work - Controle de Tempo Simplificado',
  description: 'Uma solução moderna de controle de tempo que ajuda você a monitorar horas de trabalho com funcionalidade simples de entrada e saída.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
