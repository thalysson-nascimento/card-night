"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { translate } from "./messages";
import type { Message, Values } from "./messages";
import { resolveLocale } from "./locale";
import type { Locale } from "./locale";

const I18nContext = createContext<Locale>("en");
export function I18nProvider({
  children,
  initialLocale,
}: {
  children: ReactNode;
  initialLocale: Locale;
}) {
  const pathname = usePathname();
  const [locale, setLocale] = useState<Locale>(initialLocale);
  useEffect(() => {
    setLocale(resolveLocale(navigator.language));
  }, []);
  useEffect(() => {
    document.documentElement.lang = locale === "pt" ? "pt-BR" : "en";
    document.title = translate(
      locale,
      "Cards After Dark - Jogo de Cartas Picantes",
    );
    const description = document.querySelector('meta[name="description"]');
    description?.setAttribute(
      "content",
      translate(
        locale,
        "O jogo de cartas mais quente para a sua noite. 200 desafios picantes e contagem de 7 segundos.",
      ),
    );
  }, [locale, pathname]);
  return <I18nContext.Provider value={locale}>{children}</I18nContext.Provider>;
}
export function useI18n() {
  const locale = useContext(I18nContext);
  return {
    locale,
    t: (key: Message, values?: Values) => translate(locale, key, values),
  };
}
