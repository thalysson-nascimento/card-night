"use server";

import { prisma } from "@repo/database";
import { resolveLocale } from "../src/i18n/locale";

export async function getRandomCards(
  limit: number = 30,
  language: string = "en",
) {
  const locale = resolveLocale(language);
  const size = Number.isFinite(limit)
    ? Math.max(0, Math.min(201, Math.trunc(limit)))
    : 30;
  const available = await prisma.card.findMany({
    where: locale === "en" ? { contentEn: { not: "" } } : undefined,
    select: { id: true, content: true, contentEn: true },
  });
  // Fisher-Yates keeps the sample unbiased and samples without replacement.
  for (let index = available.length - 1; index > 0; index--) {
    const other = Math.floor(Math.random() * (index + 1));
    [available[index], available[other]] = [
      available[other]!,
      available[index]!,
    ];
  }
  return available.slice(0, size).map((card) => ({
    id: card.id,
    content: locale === "pt" ? card.content : card.contentEn,
  }));
}
