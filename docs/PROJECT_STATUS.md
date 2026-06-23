# Foodala — Project Status

_Last updated: 2026-06-23_

Foodala is a premium, one-city (Davao City) food-delivery product, presented as
a demo across two front-ends that share **one brand identity** and run entirely
on **local mock data** — no backend, auth, payments, or rider tracking yet.

- **`apps/customer-mobile`** — the customer ordering app (Expo / React Native).
- **`apps/web`** — the public marketing/customer website **plus** an internal
  admin dashboard (Next.js App Router).

Both apps are independently runnable and deployable; they are intentionally
**not** coupled at runtime.

---

## 1. Current architecture

```
foodala/
├── apps/
│   ├── customer-mobile/   # Expo + React Native + TypeScript (customer app)
│   └── web/               # Next.js (App Router) + TypeScript + Tailwind (site + admin)
└── docs/
    └── PROJECT_STATUS.md  # ← this file
```

**Operating mode: mock-data only.** Every screen reads from in-repo data
modules. There is no network dependency except food photography, which loads
from stable public CDNs (TheMealDB / TheCocktailDB).

**Shared brand, two implementations.** The design system is duplicated (not a
shared package) but kept in lockstep:

| Concern        | Mobile (`customer-mobile`)            | Web (`web`)                                  |
| -------------- | ------------------------------------- | -------------------------------------------- |
| Tokens         | `src/theme/*` (colors/spacing/etc.)   | `tailwind.config.ts` + `src/theme/tokens.ts` |
| Framework      | Expo SDK 52, Expo Router (file-based) | Next.js 14 App Router                        |
| Styling        | `StyleSheet` + theme objects          | Tailwind utility classes + `globals.css`     |
| State          | Zustand (cart persisted, order/auth)  | Local component state + in-memory mock store |
| Language       | TypeScript (strict)                   | TypeScript (strict)                          |

**Brand palette (identical in both):** Foodala Red `#C40000`, near-black
`#050505`, white `#FFFFFF`, warm cream `#F2DFC2`, soft gold `#D8B56A`, with a
dark surface ramp (`#111` → `#1A1A1A` → `#242424`). Bold, tightly-tracked
headings; clean system sans body; pill buttons; rounded cards with soft
shadows. Dark-mode-first throughout.

---

## 2. `apps/customer-mobile` routes (Expo Router, `app/`)

| Route                     | Screen                | Notes                                                                 |
| ------------------------- | --------------------- | --------------------------------------------------------------------- |
| `_layout.tsx`             | Root stack            | Dark theme, slide/fade transitions, status bar.                       |
| `login.tsx`               | Login / guest entry   | Logo hero over a food photo, email/password (mock), Sign In / Continue as Guest, Create Account + Forgot Password links. |
| `index.tsx`               | Home                  | Greeting hero + search, image-backed category carousel, featured carousel, restaurant cards. Top-right **Login button / Guest badge / avatar** via `AuthHeaderButton`. Redirects to `/login` when logged out. |
| `restaurant/[id].tsx`     | Restaurant detail     | Cover image, stats (rating / ETA / fee), **sticky category tabs** with scroll-spy, menu cards, floating cart button. |
| `cart.tsx`                | Cart                  | Order-summary card, quantity steppers, subtotal/fee/total, checkout CTA. Empty state. |
| `checkout.tsx`            | Checkout              | Multi-step section cards (Delivery Info, Payment Method = COD, Order Summary), field validation, creates a local `FOOD-######` order. |
| `order-confirmation.tsx`  | Confirmation          | Animated success ring, large order number, status badge, Track Order / Back to Home. |

**Splash screen:** configured in `app.json` (centered transparent logo on
`#050505`). The logo asset (`assets/images/foodala-logo-transparent.png`) also
serves as the app icon and Android adaptive icon.

**Auth model (mock):** `src/stores/authStore.ts` tracks `loggedOut | guest |
user`. No real provider — sign-in just sets state and enters the app.

---

## 3. `apps/web` routes (Next.js App Router, `app/`)

**Public website** — `app/(site)/` (wrapped in `SiteHeader` + `SiteFooter`):

| Route                      | Page                                                              |
| -------------------------- | ----------------------------------------------------------------- |
| `/`                        | Home: hero, category grid, featured + all restaurants, how-it-works. |
| `/restaurants`             | Full restaurant listing.                                          |
| `/restaurants/[id]`        | Restaurant detail: cover, stats, menu with sticky scroll-spy tabs. **SSG** — one static page per restaurant (`r1`–`r5`). |
| `/partners`                | "Become a partner restaurant" recruit landing.                    |
| `/partners/apply`          | Partner application (mock form).                                  |
| `/riders`                  | "Become a rider" recruit landing.                                 |
| `/riders/apply`            | Rider application (mock form).                                     |
| `/login`                   | Customer login (mock, UI only).                                   |

**Admin dashboard** — `app/admin/` (own layout, no site chrome):

| Route                | Page                                                                 |
| -------------------- | -------------------------------------------------------------------- |
| `/admin`             | KPI cards (revenue / active / delivered) + recent orders.            |
| `/admin/orders`      | Filter by status, expand line items + delivery details, advance order status (mutates in-memory mock state). |
| `/admin/restaurants` | Restaurants with live menus + availability.                          |

**Portals (placeholders):** `/portal/restaurant`, `/portal/rider` — "coming
soon" surfaces for future partner/rider self-service.

**Other:** `not-found.tsx` (branded 404), `opengraph-image.tsx` (build-time
generated social card).

**Build profile:** every route is `○ (Static)` or `● (SSG)` — there are no
dynamic/server-rendered routes and no required env vars.

---

## 4. Mock data

Both apps mirror the same catalog so the demo is consistent.

- **Mobile:** `src/data/mockRestaurants.ts` — restaurants, categories, menu
  items, featured set, hero image, plus async `getRestaurants()` /
  `getRestaurantById()` / `getMenuForRestaurant()` helpers (simulate fetches).
- **Web catalog:** `src/data/catalog.ts` — the same 5 restaurants, categories,
  and menu items (mirrors the mobile file, including photography URLs).
- **Web orders:** `src/data/orders.ts` — `MOCK_ORDERS` (with fixed timestamps)
  seed the admin dashboard's in-memory store; the admin UI reads and mutates
  these locally.
- **Photography:** dish-accurate images from TheMealDB + TheCocktailDB (stable
  CDN URLs), keyed by restaurant/category/item id. Next image optimizer is
  disabled (`images.unoptimized`) so there's no build/network coupling.
- **Shapes:** `src/types/database.ts` (in each app) mirrors the Supabase schema
  in `apps/customer-mobile/supabase/migrations/0001_init.sql`, so screens are
  already backend-shaped.
- **Currency:** PHP (`₱`). **Delivery fee:** flat `₱50`. **Payment:** Cash on
  Delivery only.

---

## 5. Vercel deployment (`apps/web`)

The web app is **Vercel-ready with zero required env vars**; all routes are
static/SSG.

1. Import the repo into Vercel (New Project).
2. **Set Root Directory to `apps/web`** — the only required setting. Vercel
   auto-detects Next.js (Build: `next build`, Install: `npm install`).
3. **Env vars: none required.** Optional:
   - `NEXT_PUBLIC_SITE_URL` — canonical production URL for absolute Open
     Graph / Twitter preview URLs (falls back to `VERCEL_URL`, then a default).
   - `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` — only for a
     future real backend.
4. Deploy. Pushes to the production branch redeploy automatically.

CLI alternative:

```bash
npm i -g vercel
cd apps/web
vercel            # link project; set Root Directory to apps/web
vercel --prod
```

**Local parity checks** (run before deploying):

```bash
cd apps/web
npm run typecheck   # tsc --noEmit
npm run build       # next build — should print ○/● for all routes, no errors
```

**SEO / social:** title + description + per-page title template, Open Graph and
Twitter (`summary_large_image`) tags live in `app/layout.tsx`;
`app/opengraph-image.tsx` renders a branded 1200×630 PNG at build (no binary
asset); favicon is an inline SVG data-URI.

> The Expo app is **not** deployed to Vercel. It's run via Expo Go / simulators
> (`npm start` in `apps/customer-mobile`), or exported to web with
> `npm run web` for a quick preview.

---

## 6. Known limitations

- **Mock-only.** No backend, database, real authentication, payments, or live
  rider/order tracking. Auth is UI state; "Track Order" returns home.
- **No shared package.** The design system and `types/database.ts` are
  duplicated across apps and kept in sync by hand.
- **Mobile order state is in-memory.** The cart persists (AsyncStorage), but the
  last placed order is lost on reload. Admin order mutations are in-memory and
  reset on refresh.
- **Photography depends on external CDNs** (TheMealDB / TheCocktailDB) at view
  time; images won't render fully offline.
- **Portals are placeholders** (`/portal/*`) and recruit forms are non-submitting
  mock forms.
- **Single city / single currency / COD only** by design for Phase 1.

---

## 7. Next phases

1. **Backend integration (Supabase).** Run the existing migration
   (`apps/customer-mobile/supabase/migrations/0001_init.sql`) + seed, set the
   `*_SUPABASE_*` env vars, and swap the `src/data` helpers for `getSupabase()`
   queries. The lazy clients (`src/lib/supabase.ts`) already no-op safely when
   unset.
2. **Real authentication.** Replace the mock `authStore` / `/login` with
   Supabase Auth (email + social), guard customer + admin routes.
3. **Payments.** Add an online payment method alongside COD at checkout.
4. **Live order tracking.** Real order lifecycle + rider assignment and a
   customer-facing tracking screen (replace the stub "Track Order").
5. **Partner & rider portals.** Build out `/portal/restaurant` and
   `/portal/rider` into real self-service dashboards; wire the apply forms.
6. **Shared design package.** Extract the brand tokens (and `types/database.ts`)
   into a shared workspace package to remove hand-syncing.
7. **Multi-city / i18n / multiple currencies** as the product expands beyond
   Davao City.
```
