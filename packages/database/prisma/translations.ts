import { randomUUID } from "node:crypto";
import { PrismaClient } from "@prisma/client";
import cards from "./data/cards.json";

// Preserve existing Portuguese content, IDs and creation dates. Safe to rerun.
export async function migrateCardTranslations(prisma: PrismaClient) {
  await prisma.$transaction(
    async (tx) => {
      const columns = await tx.$queryRawUnsafe<Array<{ name: string }>>(
        'PRAGMA table_info("Card")',
      );
      if (columns.length === 0) {
        await tx.$executeRawUnsafe(
          'CREATE TABLE "Card" ("id" TEXT NOT NULL PRIMARY KEY, "content" TEXT NOT NULL, "contentEn" TEXT NOT NULL DEFAULT \'\', "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP)',
        );
      } else if (!columns.some((column) => column.name === "contentEn")) {
        await tx.$executeRawUnsafe(
          'ALTER TABLE "Card" ADD COLUMN "contentEn" TEXT NOT NULL DEFAULT \'\'',
        );
      }
      for (const card of cards) {
        const existing = await tx.$queryRaw<
          Array<{ id: string }>
        >`SELECT id FROM Card WHERE content = ${card.pt}`;
        if (existing.length) {
          await tx.$executeRaw`UPDATE Card SET contentEn = ${card.en} WHERE content = ${card.pt} AND contentEn = ''`;
        } else {
          await tx.$executeRaw`INSERT INTO Card (id, content, contentEn) VALUES (${randomUUID()}, ${card.pt}, ${card.en})`;
        }
      }
    },
    { timeout: 60000 },
  );
}
