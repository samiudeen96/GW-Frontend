# Progress Log

Tracks every change to the project. Newest entries first.

Status: ✅ done · 🚧 in progress · ⏸ waiting on input

## Phase overview

| #   | Phase                                          | Status                                         |
| --- | ---------------------------------------------- | ---------------------------------------------- |
| 0   | Docs & repo                                    | ✅                                             |
| 1   | Baseline commit + `astro-migration` branch     | ✅                                             |
| 2   | Astro scaffold + remove backend/admin/TanStack | ✅                                             |
| 3   | CI workflow                                    | ⏸                                              |
| 4   | API layer                                      | ⏸ waiting on Swagger JSON / Postman collection |
| 5   | Layouts & common components                    | ⏸                                              |
| 6   | Pages                                          | ⏸                                              |
| 7   | i18n from API                                  | ⏸                                              |
| 8   | Remove dead code                               | ⏸                                              |
| 9   | Deploy                                         | ⏸ waiting on server details                    |

---

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
