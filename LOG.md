# Progress Log

Tracks every change to the project. Newest entries first.

Status: ✅ done · 🚧 in progress · ⏸ waiting on input

## Phase overview

| #   | Phase                                          | Status                                   |
| --- | ---------------------------------------------- | ---------------------------------------- |
| 0   | Docs & repo                                    | ✅                                       |
| 1   | Baseline commit + `astro-migration` branch     | ✅                                       |
| 2   | Astro scaffold + remove backend/admin/TanStack | ✅                                       |
| 3   | CI workflow                                    | ✅                                       |
| 4   | API layer                                      | 🚧 placeholders in place; real API later |
| 5   | Layouts & common components                    | ✅                                       |
| 6   | Pages                                          | ✅ all pages ported (local data)         |
| 7   | i18n from API                                  | ⏸                                        |
| 8   | Remove dead code                               | ✅                                       |
| 9   | Deploy                                         | ⏸ waiting on server details              |

---

## 2026-10-06 — Phase 8: Cleanup & social tags ✅

- Wired the legacy `og:title` / `og:description` / `robots` onto every page that had separate social copy (home, shop, product, about, contact, faq, reviews, how-to-use, legal pages, blog, ingredients, hair science, verify, track-order, cart, checkout, account, ...). Verified in the rendered HTML (EN + AR). `cart` = `noindex`; checkout/confirmation/account/legal = `noindex, follow`; FAQ = `index, follow, max-snippet…`.
- Wholesale form now shows "not connected yet" (new `src/lib/api/wholesale.ts` placeholder) instead of a false "Application received".
- Product page audited section by section against the old page (all sections, 330 translation keys, JSON-LD, 4 products + Arabic render): only the og tags were missing, now fixed. Left out on purpose: the "Voices" block that loaded reviews from Supabase (needs the API) and an unused slider that the old site never rendered.
- Deleted `legacy/` and its ESLint/Prettier/tsconfig exclusions. The old React version stays in git history on `main` (`111b1d5`).
- Re-verified: ESLint, Prettier, build, and all key routes (200); type check run on the final tree.

---

## 2026-10-06 — Phase 6: All pages ported ✅

Ported by 8 parallel groups, then verified together. 36 route files under `src/pages/` (EN + `/ar` for each).

| Group          | Pages                                                                                                                                                        |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Home           | `/` (merged mobile/desktop banner, verify strip, ingredients, FAQ, newsletter)                                                                               |
| Product        | `/product/[slug]` (gallery, buy box + tiers, sticky bar, editorial, FAQ, reviews, quick view, JSON-LD)                                                       |
| Shop           | `/shop`, `/combo/[code]`, `/wholesale`                                                                                                                       |
| Checkout       | `/cart`, `/checkout`, `/order-confirmation`, `/payment/callback/[intent]`                                                                                    |
| Account        | `/account`, `/reset-password`                                                                                                                                |
| Authenticity   | `/verify`, `/track-order`, `/real-vs-fake`                                                                                                                   |
| Content        | `/blogs`, `/blogs/[slug]`, `/blogs/series`, `/ingredients`, `/ingredients/[slug]`, `/hair-science`, `/sitemap.xml`                                           |
| Static & legal | about, contact, faq, reviews, how-to-use, comparison, countries/[slug], legal, privacy, terms, refund-policy, shipping-returns, cookie-policy, accessibility |

**Shared changes made after the port**

- `BaseLayout`: new optional `robots`, `ogTitle`, `ogDescription` props; `noindex` now emits `noindex, follow` and hreflang is skipped only for noindex pages.
- `dialog.tsx`: RTL-safe close button, translatable close label (`header.close`).
- `orders.trackOrder`: accepts `email` or `phone`.
- `sitemap.xml`: removed 5 URLs that now 301-redirect.

**Verified (built server):** `astro check` 0 errors (252 files) · ESLint clean · Prettier clean · build OK · every route returns 200 (EN + AR); unknown product/combo slugs 404; all 12 articles and 19 ingredients load; prices follow the currency cookie (USD 40.00 → AED 135.00); sitemap lists 140 URLs; Arabic dictionary not in any client bundle.

**Known gaps / follow-ups**

- Not yet browser-checked (no visual comparison against the old site yet).
- Several pages still reuse the page title/description for `og:title`/`og:description`; legacy had separate social copy on home, shop, about, contact, faq, reviews, blog, ingredients, hair-science and legal pages. The new props exist; wiring them per page is pending.
- Cart is `noindex, follow` (legacy: `noindex`); account was `noindex, follow` in legacy and now matches.
- Wholesale form still shows "Application received" without sending anything (same as the old site). Needs an endpoint.
- Placeholder API: verify, orders (place/track), payments, auth, account/profile, contact, newsletter, review submit. All return "not connected yet".
- Review photos (16) and the authenticity sticker crop were Lovable-CDN-only; reviews render without photos until the files are supplied.
- Checkout island bundles shipping rules (~44 KB) so rates compute in the browser.

---

## 2026-10-05 — Phase 5: Site foundation ✅ (commit `cbbe3cc`)

Decision: port every page to Astro first using the existing content; connect the real API later. All data access goes through `src/lib/api/` so the swap touches one layer.

**Data & assets**

- Content moved from `legacy/lib` to `src/data/` (products, blog, reviews, combos, pricing, shipping, ingredients, countries, hair-science); images back to `src/assets/` (bundled, AVIF/WebP via `astro:assets`).
- `src/lib/api/catalog.ts`: async reads over `src/data` (`TODO(api)` markers). Browser actions are placeholders that return a clear "not connected yet" error: `verify`, `orders` (place/track), `auth`, `newsletter`.
- 18 images were Lovable-CDN-only (`.asset.json`, not in the repo or on the live site): 16 review photos and the authenticity sticker. Review photos are disabled until the files are supplied; the sticker uses the local `/images/authenticity-sticker-*.webp`.

**Runtime**

- `middleware.ts`: `/ar/*` rewritten to bare routes with `locals.locale`; currency from `gw-currency` cookie; legacy URLs now real 301s (`/testimonials`, `/blog/:slug`, …) keeping the `/ar` prefix.
- i18n: `createT()` for pages, `islandI18n()` + `useI18n()` for islands; only the needed key prefixes are sent to the browser (Arabic dictionary stays server-side).
- Currency: server-rendered prices; changing currency sets the cookie and reloads; first-visit IP detection kept.
- Cart: nanostores store persisted to `localStorage` (`gw_cart_v1`, same key as before).

**Components**

- Layouts: `BaseLayout` (lang/dir, canonical, hreflang, OG/Twitter, Organization + WebSite JSON-LD), `SiteLayout` (header, footer, cart drawer, WhatsApp).
- Layout: Header (mobile menu as vanilla script), Footer, LanguageSwitcher, WhatsAppButton.
- Common: ResponsiveImage, Reveal (+ `scripts/reveal.ts`), Stars, PageHeader, Prose, ProductCard, LegalSections.
- Social: TrustBar, TrustMicroBar, ReviewStrip (island), CustomerQuote, RatingChip, CartTrustBanner.
- Islands: CartButton, CartDrawer, CurrencySelect, NewsletterForm. Shared React: VerifyResultPanel, TrackingPanel, EmailOtpSignIn.
- 404 page. Added `@lucide/astro` for icons in `.astro` files.

**Verified:** `astro check` 0 errors · ESLint clean · Prettier clean · build OK · EN/AR render with correct lang/dir/canonical · 404 in both locales · 301 redirects · currency cookie · Arabic dictionary absent from client JS (largest bundle is React itself, 213 KB raw).

**Next:** 8 page groups being ported in parallel (Home, Product, Shop/Combo/Wholesale, Cart/Checkout, Account, Verify/Track/Real-vs-fake, Blog/Ingredients/Hair-science/Sitemap, Static & legal).

---

## 2026-10-05 — Phase 3: CI workflow ✅

- Added `.github/workflows/ci.yml`: runs on pushes to `main`/`astro-migration` and PRs to `main`.
- Steps: `npm ci` → Prettier check → ESLint → `astro check` → `astro build`, on Node from `.nvmrc`, with npm cache.
- Read-only permissions; a newer run cancels an older one on the same branch. No secrets needed (build doesn't require `.env`).
- Deploy step comes in Phase 9, once the server details are known.

## 2026-10-05 — Phase 2: Astro scaffold ✅

Branch: `astro-migration`

**Decisions:** npm (bun not installed), Node 22, old code moved to `legacy/` for reference.

**Removed**

- Backend stubs: `src/lib/*.functions.ts` (11 files), `rpc-client.ts`
- Supabase: `src/integrations/supabase`, `use-session.ts`, `use-profile.ts`
- Admin: `admin*.tsx` routes, `src/components/admin`
- TanStack / Lovable / Cloudflare: `start.ts`, `server.ts`, `router.tsx`, `routeTree.gen.ts`, `vite.config.ts`, `error-capture.ts`, `error-page.ts`, `lovable-error-reporting.ts`, `bunfig.toml`, local `.output`/`.tanstack`/`.wrangler`
- 44 unused shadcn primitives (kept `button`, `dialog`)

**Moved to `legacy/`** (reference only; excluded from build/check/lint)

- `routes/`, page components (`home`, `site`, `shop`, `product`, `verify`, `hair-science`), `hooks/`, data files in `lib/`, `assets/`, `scripts/`, `public/_headers`

**Added**

- `astro.config.mjs`: server output, Node adapter (standalone), React, Tailwind v4, typed env schema (`API_URL`, `PUBLIC_API_URL`, `PUBLIC_SITE_URL`)
- `package.json`: Astro 7, React 19, Tailwind 4.3, nanostores, zod 4, TypeScript 6.0; Node ≥ 22.12
- `tsconfig.json` (Astro strict, `@/*` alias), `eslint.config.js` (TS + Astro + React hooks), `.prettierrc` (Astro + Tailwind plugins), `.nvmrc`
- `src/layouts/BaseLayout.astro` (lang/dir, fonts), placeholder `src/pages/index.astro`
- `src/styles.css` → `src/styles/global.css`
- Local `.env`: `VITE_API_URL` renamed to `API_URL` + `PUBLIC_API_URL`

**Verified:** `npm run check` 0 errors · `npm run lint` clean · `npm run build` OK · built server serves `/` (200) and returns 404 for unknown routes; Tailwind theme classes compile; Prettier clean. Builds without `.env` (secrets validated at runtime).

---

## 2026-10-05 — Phase 0 & 1: Docs, repo setup, baseline ✅

- Rewrote the first commit without `.env`/`node_modules`/`.output`; force-pushed to `main` (user ran the push). `main` = React baseline `111b1d5`.
- Created branch `astro-migration`.

## 2026-10-05 — Phase 0: Docs & repo setup

- Audited the existing project: TanStack Start + React 19, 47 routes, hardcoded content in `src/lib/*.ts`, ~100 bundled images, RPC stubs pointing to a missing `../backend`.
- Found the git repo root was the home folder (`/Users/samiudeen`) with an Azure DevOps remote; the project now gets its own repo.
- Decided to migrate to Astro 5 (server-side rendering, Node adapter) with React islands; see PLAN.md.
- Added `.gitignore`.
- Added `PLAN.md` (roadmap), `CLAUDE.md` (working rules and conventions), `LOG.md` (this file), `.env.example`.
- Git: the repo in `GW-Frontend` already existed with `origin` set to https://github.com/samiudeen96/GW-Frontend.git, and one commit (`first commit`) was already pushed.
- ⚠️ That commit (public repo) contains `.env`, `.output/` (1,411 files) and `node_modules/` (2,363 files). These need removing; fix approved.
- Removed all Supabase variables from local `.env` (only `VITE_API_URL` remains). Supabase code will be removed in Phase 2.
- Re-staged the repo with the new `.gitignore` applied (388 files; no `.env`, `node_modules` or `.output`).
- ⏸ Rewriting the first commit and force-pushing was blocked by the Claude Code permission check; waiting for the user to run it or allow it.
