import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Zaia — Seu time de IA no WhatsApp",
  description:
    "Crie agentes de IA que vendem, atendem e agendam pelo WhatsApp 24/7. Configure em minutos, sem código. A plataforma de agentes de IA para empresas que querem escalar.",
  metadataBase: new URL("https://zaia.app"),
  openGraph: {
    title: "Zaia — Seu time de IA no WhatsApp",
    description:
      "Crie agentes de IA que vendem, atendem e agendam pelo WhatsApp 24/7.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
