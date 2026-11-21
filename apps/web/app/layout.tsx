import type { Metadata } from "next";
import { Montserrat, Outfit, Plus_Jakarta_Sans, Space_Grotesk } from "next/font/google";
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

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-home-montserrat",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-home-jakarta",
});

export const metadata: Metadata = {
  title: "Cards Night - Jogo de Cartas Picantes",
  description: "O jogo de cartas mais quente para a sua noite. 200 desafios picantes e contagem de 7 segundos.",
  icons: {
    icon: "/cards-night-icon.png",
    apple: "/cards-night-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" style={{ backgroundColor: "#050507", color: "#ededef" }}>
      <body className={`${spaceGrotesk.variable} ${outfit.variable} ${montserrat.variable} ${plusJakartaSans.variable}`} style={{ margin: 0, padding: 0 }}>
        {children}
      </body>
    </html>
  );
}
