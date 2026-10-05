# Progress Log

Tracks every change to the project. Newest entries first.

Status: ✅ done · 🚧 in progress · ⏸ waiting on input

## Phase overview

| # | Phase | Status |
| --- | --- | --- |
| 0 | Docs & repo | 🚧 |
| 1 | Baseline commit + `astro-migration` branch | ⏸ |
| 2 | Astro scaffold + remove backend/admin/TanStack | ⏸ |
| 3 | CI workflow | ⏸ |
| 4 | API layer | ⏸ waiting on Swagger JSON / Postman collection |
| 5 | Layouts & common components | ⏸ |
| 6 | Pages | ⏸ |
| 7 | i18n from API | ⏸ |
| 8 | Remove dead code | ⏸ |
| 9 | Deploy | ⏸ waiting on server details |

---

## 2026-10-05 — Phase 0: Docs & repo setup 🚧

- Audited the existing project: TanStack Start + React 19, 47 routes, hardcoded content in `src/lib/*.ts`, ~100 bundled images, RPC stubs pointing to a missing `../backend`.
- Found the git repo root was the home folder (`/Users/samiudeen`) with an Azure DevOps remote; the project now gets its own repo.
- Decided to migrate to Astro 5 (server-side rendering, Node adapter) with React islands; see PLAN.md.
- Added `.gitignore`.
- Added `PLAN.md` (roadmap), `CLAUDE.md` (working rules and conventions), `LOG.md` (this file), `.env.example`.
- Git: the repo in `GW-Frontend` already existed with `origin` set to https://github.com/samiudeen96/GW-Frontend.git, and one commit (`first commit`) was already pushed.
- ⚠️ That commit (public repo) contains `.env`, `.output/` (1,411 files) and `node_modules/` (2,363 files). These need removing; fix awaiting approval.
