import type { Metadata } from "next";
import { headers } from "next/headers";
import { resolveLocale } from "../src/i18n/locale";
import { translate } from "../src/i18n/messages";
import {
  Montserrat,
  Outfit,
  Plus_Jakarta_Sans,
  Space_Grotesk,
} from "next/font/google";
import "swiper/css";
import "swiper/css/effect-cards";
import "./globals.css";
import { I18nProvider } from "../src/i18n/provider";

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

async function requestLocale() {
  const language = (await headers())
    .get("accept-language")
    ?.split(",")[0]
    ?.split(";")[0]
    ?.trim();
  return resolveLocale(language);
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await requestLocale();
  return {
    title: translate(locale, "Cards After Dark - Jogo de Cartas Picantes"),
    description: translate(
      locale,
      "O jogo de cartas mais quente para a sua noite. 200 desafios picantes e contagem de 7 segundos.",
    ),
    icons: {
      icon: "/favicon.ico",
      apple: "/logo-cards-nigth-transparent.png",
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await requestLocale();
  return (
    <html
      lang={locale === "pt" ? "pt-BR" : "en"}
      style={{ backgroundColor: "#050507", color: "#ededef" }}
    >
      <body
        className={`${spaceGrotesk.variable} ${outfit.variable} ${montserrat.variable} ${plusJakartaSans.variable}`}
        style={{ margin: 0, padding: 0 }}
      >
        <I18nProvider initialLocale={locale}>{children}</I18nProvider>
      </body>
    </html>
  );
}
