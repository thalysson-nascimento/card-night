import type { Metadata } from "next";
import { Space_Grotesk, Outfit } from "next/font/google";
import "swiper/css";
import "swiper/css/effect-cards";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "CardsNight - Jogo de Cartas Picantes",
  description: "O jogo de cartas mais quente para a sua noite. 200 desafios picantes e contagem de 7 segundos.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" style={{ backgroundColor: "#050507", color: "#ededef" }}>
      <body className={`${spaceGrotesk.variable} ${outfit.variable}`} style={{ margin: 0, padding: 0 }}>
        {children}
      </body>
    </html>
  );
}
