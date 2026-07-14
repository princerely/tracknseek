# CLAUDE.md

## Project Overview

**Track & Seek** is a real-world hide-and-seek game for college students, played across a campus. Seekers hunt hiders whose GPS locations are periodically pinged onto a shared map, so a round stays bounded and keeps progressing even over a large play area, while preserving the tension of hiding.

**Who it's for**: college students playing on their own campus, in groups of roughly ten or fewer (occasionally up to fifteen). Casual, in-person, same-group play — not designed for large-scale sessions.

**Core features (planned)**:
- Create/join a session via a short code; a session's lobby persists across multiple rounds.
- Host-configured settings: ping interval, grace period, warning countdown before a ping, seeker assignment (random/fixed-count/manual), end condition (all hiders found / time limit / last hider standing), an optional host-drawn play-area boundary, and an out-of-bounds forced-ping toggle.
- Live gameplay loop: grace period (seekers see only their own live position) → hiders pinged on each interval as a persistent last-known dot → seekers close in → tapping a found hider prompts confirmation, then eliminates them and converts them to a seeker (manhunt-style, always on).
- Warm, muted visual style with a custom color palette (sage/cream/tan/terracotta) and role-specific pin colors (seekers = terracotta, hiders = sage) instead of default map pin colors.
- Explicitly out of scope for this version: statistics/leaderboards, GPS spoofing/anti-cheat, and sessions larger than ~15 players.

**Current state of this repo**: freshly scaffolded. It contains the default Next.js App Router template (`src/app/layout.tsx`, `src/app/page.tsx`) plus the intended dependencies installed (see Stack below). No game logic, database schema, map integration, or environment configuration has been implemented yet — those come next.

## Stack & Versions

Exact versions as currently installed (from `npm list --depth=0`; run Node v24.15.0 / npm 11.12.1 locally):

| Layer | Package | Version |
|---|---|---|
| Framework | `next` | 16.2.10 |
| UI | `react` / `react-dom` | 19.2.4 |
| Language | `typescript` | 5.9.3 |
| Styling | `tailwindcss` | 4.3.2 |
| Styling (PostCSS plugin) | `@tailwindcss/postcss` | 4.3.2 |
| ORM | `drizzle-orm` | 0.45.2 |
| ORM tooling | `drizzle-kit` | 0.31.10 |
| Postgres driver | `postgres` | 3.4.9 |
| Backend/Realtime | `@supabase/supabase-js` | 2.110.3 |
| Map rendering | `mapbox-gl` | 3.26.0 |
| Map (React bindings) | `react-map-gl` | 8.1.1 |
| Map (boundary drawing) | `@mapbox/mapbox-gl-draw` | 1.5.1 |
| Linting | `eslint` | 9.39.5 |
| Linting (Next config) | `eslint-config-next` | 16.2.10 |

Deploy target: Vercel. Supabase provides Postgres storage plus Realtime (Presence for live seeker positions, Broadcast for ping/elimination events). Neither a Supabase project nor a Mapbox token is configured yet — no `.env.local` exists in this repo.

## Install & Run

From the project root (`C:\Users\sleep\Claude\Projects\tracknseek`):

```bash
npm install       # install dependencies
npm run dev       # start the dev server at http://localhost:3000
npm run build     # production build
npm run start     # run the production build (after npm run build)
npm run lint      # run ESLint
```

## Code Conventions

These reflect what's actually configured in this repo, not aspirational style rules:

- **App Router with `src/` directory**: routes and components live under `src/app`, per `tsconfig.json`'s `include` and the scaffold layout. Do not create a top-level `app/` or `pages/` directory.
- **Import alias**: `@/*` maps to `./src/*` (`tsconfig.json` → `compilerOptions.paths`). Use `@/...` imports for anything under `src/`, not deep relative paths.
- **TypeScript strict mode** is on (`"strict": true` in `tsconfig.json`). `noEmit` is set — TypeScript is used for type-checking only, Next.js/SWC handles transpilation.
- **Linting**: `eslint.config.mjs` extends `eslint-config-next/core-web-vitals` and `eslint-config-next/typescript`. Run `npm run lint` before considering a change done; there is no separate Prettier config, so ESLint is the only enforced style check.
- **Styling**: Tailwind CSS v4, wired through PostCSS (`postcss.config.mjs` → `@tailwindcss/postcss`). No CSS Modules convention beyond what the scaffold already has in `page.module.css`-style files; prefer Tailwind utility classes for new UI.
- **No test framework is installed.** Don't add test files assuming Jest/Vitest/Playwright exist — none are configured in `package.json`.

## Verifying a Change Works

There is no automated test suite in this repo yet, so verification is currently manual:

1. `npm run lint` — must pass with no errors.
2. `npm run build` — must complete successfully (catches type errors, since `tsconfig.json` has `noEmit` and relies on the build step / editor for type-checking).
3. `npm run dev`, then open `http://localhost:3000` in a browser and manually exercise the change — there is no existing page beyond the default template, so any UI change should be checked visually against the intended behavior.
4. For anything touching data (once Drizzle/Supabase are wired up) or the map (once Mapbox is wired up), manual verification will need real Supabase/Mapbox credentials in `.env.local`, since none exist in this repo yet.
