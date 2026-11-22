export type Locale = "pt" | "en";
export function resolveLocale(language?: string | null): Locale {
  return /^pt(?:[-_]|$)/i.test(language ?? "") ? "pt" : "en";
}
