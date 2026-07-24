# Pahuna Client

Next.js 16 App Router frontend for Pahuna.

## What Lives Here

- `src/app` - public routes, dashboard routes, Next integration API handlers
- `src/actions` - server actions used by the Next app
- `src/components` - UI, forms, maps, layouts, dashboard components
- `public` - static frontend assets
- `next.config.ts`, `postcss.config.mjs`, `components.json` - frontend configuration

The client imports backend code through the local `server` package using the `@server/*` TypeScript path alias. This keeps the existing Next.js runtime behavior intact while separating backend-only source into `../server`.

## Commands

```bash
npm install
npm run dev
npm run build
npm run start
npm run lint
```

Run these commands from this `client/` directory.

## Environment

Copy `.env.example` to `.env.local` and set the values required by the Next.js app, including `NEXTAUTH_URL`, `NEXTAUTH_SECRET`, and any public analytics keys.
