"use server";

import { prisma } from "@repo/database";

export async function getRandomCards(limit: number = 30) {
  const allIds = await prisma.card.findMany({
    select: { id: true },
  });

  if (allIds.length === 0) {
    return [];
  }

  const shuffledIds = allIds
    .map((card: { id: string }) => card.id)
    .sort(() => 0.5 - Math.random())
    .slice(0, limit);

  const cards = await prisma.card.findMany({
    where: {
      id: { in: shuffledIds },
    },
  });

  return cards.sort(() => 0.5 - Math.random());
}
