import { copyFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { PrismaClient } from "@prisma/client";
import { migrateCardTranslations } from "./translations";

const dbPath = fileURLToPath(new URL("./dev.db", import.meta.url));
const backupPath = `${dbPath}.before-i18n.bak`;
if (existsSync(dbPath) && !existsSync(backupPath))
  copyFileSync(dbPath, backupPath);
const prisma = new PrismaClient({
  datasourceUrl: `file:${dbPath.replaceAll("\\", "/")}`,
});
migrateCardTranslations(prisma)
  .then(() => console.log("Bilingual cards ready (Portuguese and English)."))
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
