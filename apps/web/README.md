This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Internationalization

The app selects Portuguese for browser languages `pt`, `pt-BR`, `pt-PT`, etc.
All other browser languages select English, including German and Japanese.
The server uses the primary `Accept-Language` value and the browser confirms it
with `navigator.language` after hydration. There is no persisted language override.
HTML language, title, description, accessibility labels and legal pages are localized
from the first response. When no language is available, the default is English.

UI messages live in `src/i18n/en.json`: Portuguese keys are the original messages;
English values are their translations. Use `useI18n().t(message, parameters)` in
components. Card requests send the detected locale to the server, which selects
Portuguese or English from SQLite. See `packages/database/README.md` for migration
and catalog maintenance.
