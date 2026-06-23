# Foodala — Web (Website + Admin)

The web counterpart to the Foodala food-delivery platform: a public **customer
website** (browse restaurants and menus) plus an internal **admin dashboard**
(orders + restaurant/menu operations). Built with **Next.js (App Router) +
TypeScript + Tailwind CSS**.

This app lives alongside the Expo customer app in the same monorepo:

```
foodala/
├── apps/
│   ├── customer-mobile/   # Expo / React Native customer app
│   └── web/               # ← this app (website + admin)
```

> **⚡ Runs in MOCK-DATA mode.** Like `customer-mobile`, the web app ships a
> local catalog (`src/data/`) and needs **no database or env vars** to run.
> Supabase is wired but optional, reserved for a future backend.

## Quick start

```bash
cd apps/web
npm install
npm run dev          # http://localhost:3000
```

Other scripts:

```bash
npm run build        # production build
npm run start        # serve the production build
npm run typecheck    # tsc --noEmit
npm run lint         # next lint
```

## Deploy to Vercel

This app is **Vercel-ready out of the box** — it builds with **zero required env
vars**, and every route is statically prerendered or SSG (the build prints
`○ (Static)` / `● (SSG)` for all pages, including the generated Open Graph image).

This repo is a monorepo, so the one thing that matters is the **Root Directory**.

1. **Import the repo** into Vercel (New Project → import the Git repo).
2. **Set Root Directory to `apps/web`** (Project Settings → General → Root
   Directory → `apps/web`). This is the only required setting. Vercel then
   auto-detects Next.js — Framework: *Next.js*, Build Command: `next build`,
   Install: `npm install`, Output: `.next` (leave these as detected).
3. **Env vars: none required.** The app runs in mock-data mode. Optionally set:
   - `NEXT_PUBLIC_SITE_URL` — your canonical production URL (e.g.
     `https://foodala.vercel.app`) so Open Graph / Twitter share previews use
     absolute URLs. If unset, the app falls back to Vercel's `VERCEL_URL` and
     then a sensible default, so previews still work without it.
   - `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` — only when you
     later wire a real backend (see below). Not needed for the demo.
4. **Deploy.** Subsequent pushes to the production branch redeploy automatically.

To deploy from the CLI instead:

```bash
npm i -g vercel
cd apps/web
vercel            # first run links the project; set Root Directory to apps/web
vercel --prod     # promote a production deployment
```

### SEO / social metadata

- Title + description and a templated per-page title live in `app/layout.tsx`.
- Open Graph + Twitter (`summary_large_image`) tags are set there too.
- `app/opengraph-image.tsx` generates a branded 1200×630 share image at build
  time with `next/og`, embedding the shared Foodala logo. Prerendered statically.
- The favicon / apple-touch-icon use the same approved logo asset.

### Branding asset (single source of truth)

The Foodala logo is **one shared master**, not duplicated per app:

```
foodala/assets/branding/
  foodala-logo.png              # opaque master
  foodala-logo-transparent.png  # transparent master (used everywhere)
```

`apps/web/public/foodala-logo-transparent.png` is a **symlink** to that master
(as is the mobile app's copy), so the website header, footer, login, admin
sidebar, favicon, and OG image all render the exact same artwork the mobile app
ships. To change the logo, replace the file in `assets/branding/` once.

## What's inside

**Public website** (`app/(site)/`)
- `/` — hero, category grid, featured + all restaurants, "how it works"
- `/restaurants` — full restaurant listing
- `/restaurants/[id]` — cover, stats, and a menu with sticky scroll-spy category
  tabs and availability states (statically generated per restaurant)

**Admin dashboard** (`app/admin/`)
- `/admin` — KPI cards (revenue, active orders, delivered) + recent orders
- `/admin/orders` — filter by status, expand line items / delivery details, and
  advance an order's status (mutates local state in mock mode)
- `/admin/restaurants` — restaurants with live menus and availability

## Design system

Brand tokens are kept in sync with `apps/customer-mobile/src/theme` so both apps
share one premium, dark-mode-first identity (Foodala Red `#C40000`, near-black
surfaces, warm cream + soft gold accents). On the web they live in
`tailwind.config.ts` (primary surface) and `src/theme/tokens.ts` (raw values).

## Shared shapes & the backend

- `src/types/database.ts` mirrors the Supabase schema in
  `apps/customer-mobile/supabase/migrations/0001_init.sql`.
- `src/data/catalog.ts` and `src/data/orders.ts` are the mock data sources.
- `src/lib/supabase.ts` is a lazy browser client (mirrors the mobile one). It
  reads `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` (see
  `.env.example`) and returns `null` when unset, so callers fall back to mock
  data instead of crashing.

To go live: set the env vars, run the existing migration against your Supabase
project, then have the `src/data` helpers query Supabase instead of the mock
arrays.
