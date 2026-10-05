# GW-Frontend — Astro Migration Plan

Goal: rebuild GW-Frontend in **Astro** as a frontend-only app. All content (products, banners, images, blogs, reviews, translations) comes from the backend API, which also handles auth. Pages render on the server, components are reusable, the layout is responsive, and all backend code is removed.

## Decisions

| Topic | Decision |
| --- | --- |
| Framework | Astro 5, `output: "server"` (server-side rendering) |
| Server | `@astrojs/node` adapter (standalone) on our own server |
| Components | `.astro` components by default (no JS shipped to the browser) |
| Interactivity | React islands **only** where needed (cart, checkout, forms, carousels) |
| Shared client state | `nanostores` (cart, currency); works across islands |
| Styling | Tailwind CSS v4, mobile-first |
| UI primitives | shadcn/ui (Radix) reused **inside React islands only** |
| Data | Backend REST API, tested in Swagger/Postman |
| API types | zod schemas per resource (or types generated from the Swagger JSON, if available) |
| Auth | Handled by the backend; the frontend only forwards the session/token |
| Content & translations | From the API; nothing hardcoded |
| Admin pages | Removed |
| Backend code | Removed (Supabase client, `*.functions.ts`, `rpc-client.ts`, `server.ts`, `@backend`/`@shared` aliases) |
| Repo | GitHub only: https://github.com/samiudeen96/GW-Frontend.git (Azure remote removed) |
| CI | GitHub Actions: install, lint, typecheck (`astro check`), build |

## Target structure

```
astro.config.mjs           node adapter, react, tailwind, env schema, image domains
src/
  pages/                   file-based routes (URLs stay the same as today)
    index.astro
    shop.astro
    product/[slug].astro
    combo/[code].astro
    blogs/index.astro  blogs/[slug].astro  blogs/series.astro
    ingredients/index.astro  ingredients/[slug].astro
    countries/[slug].astro
    cart.astro  checkout.astro  order-confirmation.astro
    payment/callback/[intent].astro
    account.astro  reset-password.astro
    verify.astro  track-order.astro
    about, contact, faq, reviews, testimonials, wholesale, how-to-use,
    hair-science, real-vs-fake, comparison/..., legal pages
    sitemap.xml.ts  robots.txt.ts
    404.astro  500.astro
  layouts/
    BaseLayout.astro       <html lang dir>, <head>, SEO
    PageLayout.astro       Header + main + Footer
  components/
    common/                Container, Section, Heading, ResponsiveImage, Price,
                           Rating, Breadcrumbs, EmptyState, ErrorState  (.astro)
    layout/                Header, Footer, Nav  (.astro)
    seo/                   SEO.astro, JsonLd.astro
    features/              home/, product/, shop/, blog/, ingredients/...  (.astro)
    islands/               React .tsx, interactive only: CartDrawer, AddToCart,
                           QuickView, CheckoutForm, SignIn, CurrencySelect,
                           LanguageSwitcher, Carousel, VerifyForm, TrackOrderForm
    ui/                    shadcn primitives (used by islands)
  lib/
    api/
      client.ts            single fetch wrapper: base URL, auth, timeout, errors
      endpoints/           products.ts, banners.ts, blogs.ts, orders.ts, content.ts...
      schemas/             zod response schemas
    stores/                cart.ts, currency.ts (nanostores)
    i18n/                  locale detection, t(), RTL helpers
    seo.ts  format.ts  utils.ts
  middleware.ts            locale, auth forwarding, cache headers
  styles/global.css
.github/workflows/ci.yml
```

## Rules

- Pages fetch data in the frontmatter (on the server) through `src/lib/api`, never with direct `fetch` calls.
- Default to `.astro`; use a React island only when the component needs browser state or events.
- Islands use the narrowest `client:*` directive (`client:visible` / `client:idle` before `client:load`).
- No hardcoded content or images; everything comes from the API.
- Every data view handles loading, empty and error states.
- Mobile-first; one component per feature (no separate mobile and desktop components). Images use `srcset`/`<picture>`.
- Arabic: `lang` and `dir="rtl"` set from the locale; use logical CSS (`ms-`, `me-`, `ps-`, `pe-`).
- Keep the existing URLs so SEO is not lost.

## Phases

| # | Phase | Output |
| --- | --- | --- |
| 0 | Docs & repo | `PLAN.md`, `CLAUDE.md`, `LOG.md`, `.gitignore`, `.env.example`; git repo inside `GW-Frontend`; GitHub remote |
| 1 | Baseline | Commit the current React code as a reference point, then start an `astro-migration` branch |
| 2 | Astro scaffold | Astro + node adapter + React + Tailwind; remove TanStack, Lovable, Supabase and backend files and the admin pages |
| 3 | CI workflow | `.github/workflows/ci.yml` |
| 4 | API layer | Client, endpoints, zod schemas, env validation |
| 5 | Layouts & common components | BaseLayout, PageLayout, Header, Footer, SEO, ResponsiveImage, Banner, ProductCard |
| 6 | Pages (one at a time) | Home → Shop → Product → Combo → Blog → Ingredients → Cart/Checkout → Account → Verify/Track → static and legal pages |
| 7 | i18n from API | Locale switching, RTL |
| 8 | Remove dead code | Delete old React routes, hardcoded data files and unused images |
| 9 | Deploy | Node server build; deploy step in CI (method TBD) |

Each phase is logged in `LOG.md`, and each phase needs approval before it starts.

## Open questions

1. **API docs:** is there a Swagger URL (it usually exposes a JSON link such as `/swagger.json` or `/api-docs-json`) or a Postman collection export? Either one lets the frontend match the API exactly.
2. **Auth:** does the backend use cookies or bearer tokens? This decides how islands and middleware send credentials.
3. **Deploy:** method and Node version on the server (to be decided later).
