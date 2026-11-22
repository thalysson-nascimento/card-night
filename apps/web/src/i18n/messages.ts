import en from "./en.json";
import type { Locale } from "./locale";

export type Message = keyof typeof en;
export type Values = Record<string, string | number>;
export function translate(locale: Locale, key: Message, values: Values = {}) {
  const message = locale === "pt" ? key : en[key];
  return message
    .replace(/\{(\w+)\}/g, (match, name: string) =>
      String(values[name] ?? match),
    )
    .replaceAll("&quot;", '"');
}
