import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LayoutProvider } from "@/contexts/LayoutContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Calculadora de Notas",
  description: "Uma simples calculadora de notas. Descubra suas médias, quanto precisa tirar, e registre suas datas de provas!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body className={inter.className}>
        <LayoutProvider>
          {children}
        </LayoutProvider>
      </body>
    </html>
  );
}
