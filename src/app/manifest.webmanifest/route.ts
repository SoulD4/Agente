import { NextResponse } from "next/server";

// PWA manifest served as a route so it stays in sync with the brand.
export function GET() {
  return NextResponse.json({
    name: "Zaia — Seu time de IA no WhatsApp",
    short_name: "Zaia",
    description:
      "Agentes de IA que vendem, atendem e agendam pelo WhatsApp 24/7.",
    start_url: "/dashboard",
    display: "standalone",
    background_color: "#0a0a0f",
    theme_color: "#0a0a0f",
    lang: "pt-BR",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  });
}
