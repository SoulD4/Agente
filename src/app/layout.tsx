import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://zaia-two.vercel.app";

export const metadata: Metadata = {
  title: {
    default: "Zaia — Seu time de IA no WhatsApp",
    template: "%s · Zaia",
  },
  description:
    "Crie agentes de IA que vendem, atendem e agendam pelo WhatsApp 24/7. Configure em minutos, sem código. A plataforma de agentes de IA para empresas que querem escalar.",
  metadataBase: new URL(siteUrl),
  applicationName: "Zaia",
  keywords: [
    "agente de IA",
    "WhatsApp",
    "atendimento automatizado",
    "chatbot",
    "SDR de IA",
    "automação de vendas",
    "WhatsApp Business",
  ],
  authors: [{ name: "Zaia" }],
  alternates: { canonical: "/" },
  openGraph: {
    title: "Zaia — Seu time de IA no WhatsApp",
    description:
      "Agentes de IA que vendem, atendem e agendam pelo WhatsApp 24/7. Configure em minutos, sem código.",
    type: "website",
    locale: "pt_BR",
    siteName: "Zaia",
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "Zaia — Seu time de IA no WhatsApp",
    description:
      "Agentes de IA que vendem, atendem e agendam pelo WhatsApp 24/7.",
  },
  robots: { index: true, follow: true },
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#0a0a0f",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html
        lang="pt-BR"
        className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      >
        <body className="min-h-full flex flex-col">{children}</body>
      </html>
    </ClerkProvider>
  );
}
