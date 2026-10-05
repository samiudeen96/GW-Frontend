# CLAUDE.md

Guidance for Claude Code (and developers) working in this repo.

## Project

GW-Frontend is the storefront for Green Wealth hair-care products. It is being migrated from TanStack Start (React) to **Astro 7**, as a **frontend only** app.

`legacy/` holds the old React code (routes, components, hardcoded data, images) **for reference only** while pages are ported. It is excluded from the build, type check and lint. Never import from it; it is deleted in Phase 8. The backend is a separate service that provides all data (products, banners, images, blogs, reviews, translations) and handles auth.

- Roadmap and decisions: [PLAN.md](PLAN.md)
- Progress and change history: [LOG.md](LOG.md)

## Working rules

1. **Always ask before making changes.** Propose what you will do, wait for approval, then act. This includes creating, editing or deleting files, installing packages, and running git commits or pushes.
2. **Update [LOG.md](LOG.md) after every change** (newest entry at the top).
3. Work one phase from PLAN.md at a time; don't start the next phase without approval.
4. Never commit `.env` or secrets. Add new env vars to `.env.example` with no values.
5. No backend code in this repo: no database clients, no server functions, no secrets beyond the public API URL.

## Stack (target)

- Astro 7, `output: "server"`, `@astrojs/node` adapter (standalone, own server)
- React 19 only for interactive islands; shadcn/ui (Radix) inside islands. Add primitives as needed with `npx shadcn add <name>`.
- Tailwind CSS v4, mobile-first; theme tokens live in `src/styles/global.css`
- nanostores for shared client state (cart, currency)
- zod for API response schemas; env vars are typed through `env.schema` in `astro.config.mjs` (import from `astro:env/server` or `astro:env/client`)
- Node 22 (`nvm use`), **npm**, TypeScript 6.0 (don't upgrade to 7 until `@astrojs/check` supports it)

## Commands

```
npm install
npm run dev            # astro dev
npm run build          # astro build -> dist/ (node server)
npm start              # run the built server (PORT / HOST env vars)
npm run check          # astro check (types)
npm run lint           # eslint
npm run format         # prettier
```

## Structure (target)

```
src/pages/          routes (keep existing URLs)
src/layouts/        BaseLayout, PageLayout
src/components/
  common/           reusable .astro building blocks
  layout/           Header, Footer, Nav
  seo/              SEO, JsonLd
  features/         page sections grouped by feature (.astro)
  islands/          interactive React components (.tsx)
  ui/               shadcn primitives (islands only)
src/lib/api/        client.ts, endpoints/, schemas/
src/lib/stores/     nanostores
src/lib/i18n/       locale, t(), RTL
src/middleware.ts
```

## Conventions

- Fetch data in page frontmatter through `src/lib/api`; never call `fetch` directly in pages or components.
- Validate every API response with its zod schema.
- Default to `.astro`. Use a React island only when the component needs browser state or events, with the narrowest `client:*` directive (`client:visible`/`client:idle` before `client:load`).
- No hardcoded content or images; everything comes from the API.
- Handle loading, empty and error states for every data view.
- One responsive component per feature (no separate Mobile/Desktop components); use `srcset`/`<picture>` for images.
- RTL: set `lang`/`dir` from the locale; use logical Tailwind utilities (`ms-`, `me-`, `ps-`, `pe-`, `start-`, `end-`).
- Every page sets title, description, canonical and Open Graph tags through `SEO.astro`.
- Components: PascalCase filenames; props typed with an exported `Props` interface.

## Git

- Remote: `origin` → https://github.com/samiudeen96/GW-Frontend.git
- `main` = stable; migration work happens on `astro-migration`.
- Commit messages: short, imperative (`Add ProductCard component`).
