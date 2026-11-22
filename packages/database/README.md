# Cards After Dark — SQLite and translations

`prisma/data/cards.json` is the bilingual card catalog. Each entry contains `pt`
and `en`. SQLite keeps the original Portuguese text in `Card.content` and its
English translation in `Card.contentEn`.

From the repository root:

- `npm run db:generate --workspace=@repo/database` generates Prisma, migrates the
  database and synchronizes the runtime database copies.
- `npm run db:migrate:i18n --workspace=@repo/database` reruns the migration.
- `npm run db:seed --workspace=@repo/database` adds missing catalog entries without
  deleting existing cards.
- `npm run test --workspace=@repo/database` checks migration and locale rules.

The first migration saves `prisma/dev.db.before-i18n.bak`. Existing IDs, Portuguese
texts, creation dates and nonempty English translations are preserved. The migration
is transactional and safe to rerun. English queries exclude cards without an
English translation. To add a card, provide both translations in the catalog.

The root `npm run dev` and `npm run build` run this preparation automatically.
On Windows, stop a running Next.js server before regenerating Prisma, because it
can hold the native Prisma DLL open.
