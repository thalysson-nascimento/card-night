import { PrismaClient } from "@prisma/client";
import { migrateCardTranslations } from "./translations";
import { fileURLToPath } from "node:url";

const dbPath = fileURLToPath(new URL("./dev.db", import.meta.url));
const prisma = new PrismaClient({
  datasourceUrl: `file:${dbPath.replaceAll("\\", "/")}`,
});
migrateCardTranslations(prisma)
  .then(async () =>
    console.log(
      `Seed complete: ${await prisma.card.count()} cards. Existing cards preserved.`,
    ),
  )
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
