import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { PrismaClient } from "@prisma/client";
import { migrateCardTranslations } from "../prisma/translations";
import cards from "../prisma/data/cards.json";
import { resolveLocale } from "../../../apps/web/src/i18n/locale";
import en from "../../../apps/web/src/i18n/en.json";

test("Portuguese variants select Portuguese; every other browser language selects English", () => {
  for (const language of ["pt", "pt-BR", "pt-PT", "PT-br", "pt_AO"])
    assert.equal(resolveLocale(language), "pt");
  for (const language of [
    "en",
    "en-US",
    "de-DE",
    "es",
    "ja-JP",
    "ptx",
    "",
    undefined,
    null,
  ])
    assert.equal(resolveLocale(language), "en");
});

test("UI translations preserve interpolation placeholders", () => {
  for (const [pt, english] of Object.entries(en)) {
    assert(english.trim(), `Missing translation: ${pt}`);
    assert.deepEqual(
      [...pt.matchAll(/\{\w+\}/g)].map((m) => m[0]).sort(),
      [...english.matchAll(/\{\w+\}/g)].map((m) => m[0]).sort(),
      pt,
    );
  }
});

test("migration preserves legacy cards, custom translations and IDs and is safe to repeat", async () => {
  const dir = mkdtempSync(join(tmpdir(), "cards-i18n-"));
  const prisma = new PrismaClient({
    datasourceUrl: `file:${join(dir, "test.db").replaceAll("\\", "/")}`,
  });
  try {
    await prisma.$executeRawUnsafe(
      'CREATE TABLE "Card" ("id" TEXT NOT NULL PRIMARY KEY, "content" TEXT NOT NULL, "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP)',
    );
    await prisma.$executeRaw`INSERT INTO Card (id, content) VALUES (${"existing-id"}, ${cards[0]!.pt})`;
    const before = await prisma.$queryRaw<
      Array<{ createdAt: Date }>
    >`SELECT createdAt FROM Card WHERE id = 'existing-id'`;
    await migrateCardTranslations(prisma);
    assert.equal(await prisma.card.count(), cards.length);
    const existing = await prisma.card.findUniqueOrThrow({
      where: { id: "existing-id" },
    });
    assert.equal(existing.content, cards[0]!.pt);
    assert.equal(existing.contentEn, cards[0]!.en);
    assert.equal(
      existing.createdAt.getTime(),
      new Date(before[0]!.createdAt).getTime(),
    );
    await prisma.card.update({
      where: { id: "existing-id" },
      data: { contentEn: "Custom English translation" },
    });
    await migrateCardTranslations(prisma);
    assert.equal(await prisma.card.count(), cards.length);
    assert.equal(
      (await prisma.card.findUniqueOrThrow({ where: { id: "existing-id" } }))
        .contentEn,
      "Custom English translation",
    );
    const rows = await prisma.card.findMany();
    assert(rows.every((card) => card.content.trim() && card.contentEn.trim()));
    assert.equal(new Set(cards.map((card) => card.pt)).size, cards.length);
  } finally {
    await prisma.$disconnect();
    rmSync(dir, { recursive: true, force: true });
  }
});

test("migration also initializes an empty SQLite database", async () => {
  const dir = mkdtempSync(join(tmpdir(), "cards-i18n-empty-"));
  const prisma = new PrismaClient({
    datasourceUrl: `file:${join(dir, "test.db").replaceAll("\\", "/")}`,
  });
  try {
    await migrateCardTranslations(prisma);
    assert.equal(await prisma.card.count(), cards.length);
  } finally {
    await prisma.$disconnect();
    rmSync(dir, { recursive: true, force: true });
  }
});
