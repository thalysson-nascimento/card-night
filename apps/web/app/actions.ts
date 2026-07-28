"use server";

import { prisma } from "@repo/database";

export async function getRandomCards(limit: number = 30) {
  try {
    // Get all card IDs
    const allIds = await prisma.card.findMany({
      select: { id: true }
    });
    
    if (allIds.length === 0) {
      return [];
    }

    // Shuffle and pick 'limit' ids
    const shuffledIds = allIds
      .map(c => c.id)
      .sort(() => 0.5 - Math.random())
      .slice(0, limit);
      
    // Fetch full card records
    const cards = await prisma.card.findMany({
      where: {
        id: { in: shuffledIds }
      }
    });
    
    // Shuffle the final list to guarantee random order
    return cards.sort(() => 0.5 - Math.random());
  } catch (error) {
    console.error("Failed to fetch random cards:", error);
    return [];
  }
}
