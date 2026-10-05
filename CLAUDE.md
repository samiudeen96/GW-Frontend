# CLAUDE.md

Guidance for Claude Code (and developers) working in this repo.

## Project

GW-Frontend is the storefront for Green Wealth hair-care products. It is being migrated from TanStack Start (React) to **Astro 5**, as a **frontend only** app. The backend is a separate service that provides all data (products, banners, images, blogs, reviews, translations) and handles auth.

- Roadmap and decisions: [PLAN.md](PLAN.md)
- Progress and change history: [LOG.md](LOG.md)

## Working rules

1. **Always ask before making changes.** Propose what you will do, wait for approval, then act. This includes creating, editing or deleting files, installing packages, and running git commits or pushes.
2. **Update [LOG.md](LOG.md) after every change** (newest entry at the top).
3. Work one phase from PLAN.md at a time; don't start the next phase without approval.
4. Never commit `.env` or secrets. Add new env vars to `.env.example` with no values.
5. No backend code in this repo: no database clients, no server functions, no secrets beyond the public API URL.

## Stack (target)

- Astro 5, `output: "server"`, `@astrojs/node` adapter (standalone, own server)
- React only for interactive islands; shadcn/ui (Radix) inside islands
- Tailwind CSS v4, mobile-first
- nanostores for shared client state (cart, currency)
- zod for API response schemas and env validation
- Package manager: **bun** (`bunfig.toml` has a 24h supply-chain guard; don't add exclusions without asking)

## Commands

Until the Astro scaffold (Phase 2) lands, the old Vite/TanStack scripts in `package.json` still apply. After it lands:

```
bun install
bun run dev          # astro dev
bun run build        # astro build -> dist/ (node server)
bun run preview
bun run check        # astro check (types)
bun run lint
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
