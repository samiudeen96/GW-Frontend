# CLAUDE.md

Guidance for Claude Code (and developers) working in this repo.

## Project

GW-Frontend is the storefront for Green Wealth hair-care products, built with **Astro 7** as a **frontend-only** app. The backend is a separate service that will provide data and handle auth; until it is connected, content comes from local files in `src/data/` behind the `src/lib/api/` layer.

`legacy/` holds the old TanStack/React code **for reference only** while pages are ported. It is excluded from the build, type check and lint. Never import from it; it is deleted once every page is ported.

- Roadmap and decisions: [PLAN.md](PLAN.md)
- Progress and change history: [LOG.md](LOG.md)

## Working rules

1. **Always ask before making changes.** Propose what you will do, wait for approval, then act. This includes creating, editing or deleting files, installing packages, and running git commits or pushes.
2. **Update [LOG.md](LOG.md) after every change** (newest entry at the top).
3. Work one phase from PLAN.md at a time; don't start the next phase without approval.
4. Never commit `.env` or secrets. Add new env vars to `.env.example` with no values.
5. No backend code in this repo: no database clients, no server functions, no secrets beyond the API URL.

## Stack

- Astro 7, `output: "server"`, `@astrojs/node` adapter (standalone, own server)
- React 19 only for interactive islands; shadcn/ui (Radix) inside islands (`npx shadcn add <name>`)
- Tailwind CSS v4, mobile-first; theme tokens and utilities (`container-editorial`, `eyebrow`, `display-*`, `hairline`) in `src/styles/global.css`
- nanostores for shared client state (cart)
- Icons: `@lucide/astro` in `.astro`, `lucide-react` in islands
- Env vars typed through `env.schema` in `astro.config.mjs` (`astro:env/server`, `astro:env/client`)
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

## Structure

```
src/
  pages/                 routes; URLs match the old site
  layouts/
    BaseLayout.astro     <html lang/dir>, all SEO tags + JSON-LD
    SiteLayout.astro     header, footer, cart drawer, WhatsApp (use this for pages)
  components/
    common/              reusable .astro primitives (ResponsiveImage, Reveal, Stars, PageHeader,
                         Prose, ProductCard, LegalSections)
    social/              trust bars, review strip, quotes, rating chip
    layout/              Header, Footer, LanguageSwitcher, WhatsAppButton
    features/<feature>/  page sections owned by one feature (.astro + feature islands)
    islands/             shared hydrated React entry points (default export)
    react/               shared React components used *inside* islands (not hydrated alone)
    ui/                  shadcn primitives (islands only)
  data/                  local content source (products, blog, reviews, pricing...) — replaced by API
  lib/
    api/                 catalog reads + browser actions (placeholders, `TODO(api)`), types.ts
    i18n/                index.ts (server: createT, islandI18n), react.tsx (islands: useI18n),
                         core.ts, locale.ts, ar/ (Arabic dictionary)
    stores/              cart.ts, currency.ts
    seo.ts  pricing.ts  images.ts  cart-catalog.ts  tracking.ts  legal.ts  reviews.ts
  scripts/               small vanilla client scripts (reveal)
  middleware.ts          locale (/ar rewrite), currency cookie, legacy 301 redirects
```

## How things work

- **Locale**: `/ar/...` is rewritten to the bare route; read `Astro.locals.locale` and `Astro.locals.pathname` (locale-agnostic). Build links with `withLocalePrefix(path, locale)`.
- **Translation**: `t(key, englishFallback)`. Pages: `const t = createT(Astro.locals.locale)`. Never import `@/lib/i18n` (index) from island code — it pulls in the whole Arabic dictionary. Islands either receive already-translated strings/labels as props, or `i18n={islandI18n(locale, ["prefix."])}` and use `useI18n()` from `@/lib/i18n/react` under an `<I18nProvider>`.
- **Currency/prices**: `Astro.locals.currency` (cookie). Render prices on the server with `formatMoney(getBasePrice(slug, currency), currency)` from `@/lib/pricing`. Changing currency reloads the page.
- **Cart**: `@/lib/stores/cart` (`addToCart`, `$cartItems`, `$cartOpen`...). Islands that show cart lines get a `catalog` prop from `buildCartCatalog()`.
- **Images**: bundled assets are `ImageMetadata`; render with `ResponsiveImage.astro`. For islands, pre-resolve on the server with `islandImage()` and pass `{ src, srcSet }`.
- **Data**: pages read entities via `@/lib/api/catalog` (async). Static content tables may be imported from `@/data/*` directly.
- **Backend actions** (forms): call functions in `@/lib/api/*` that return `ActionResult` placeholders; UI must show their error state gracefully.
- **SEO**: pass `title`, `description`, `path?`, `type?`, `image?`, `noindex?`, `jsonLd?` to `SiteLayout`; use `breadcrumbLd()` from `@/lib/seo`.

## Conventions

- Default to `.astro`. Use a React island only when the component needs browser state or events, with the narrowest `client:*` directive (`client:visible`/`client:idle` before `client:load`).
- Keep island props serialisable (no functions, no class instances).
- One responsive component per feature (no separate Mobile/Desktop components).
- RTL: logical utilities (`ms-`, `me-`, `ps-`, `pe-`, `start-`, `end-`, `border-s`, `border-e`, `text-start`).
- Components: PascalCase filenames; `.astro` props typed with an exported `Props` interface.
- Every page sets title + description via `SiteLayout`.

## Git

- Remote: `origin` → https://github.com/samiudeen96/GW-Frontend.git
- `main` = stable; migration work happens on `astro-migration`.
- Commit messages: short, imperative (`Add ProductCard component`).
