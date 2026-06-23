# Foodala — Customer Mobile App (Phase 1 MVP)

A one-city food delivery customer app built with **Expo + React Native + TypeScript**, with a
premium, dark-mode-first UI. Phase 1 lets a customer sign in (mock), browse restaurants, build a
cart, enter delivery details, and place a Cash-on-Delivery order. No payments, rider tracking, or
restaurant dashboard yet.

> **⚡ The app currently runs in MOCK-DATA mode.** All restaurants, menus, and orders are
> local — there is **no database connection** and **no Supabase setup or env vars required**
> to run it. Just install and `npm start`. Supabase is optional and reserved for a future
> backend integration (the SQL files and a lazy client are kept for that).

## Design

Premium, dark-mode-first aesthetic — high contrast, minimal, restaurant-photography-led.
Everything is driven by a central design system in `src/theme/` (`colors`, `spacing`,
`typography`, `shadows`, `radius`) so the look stays consistent and is easy to retune.

- **Brand colors:** Foodala Red `#C40000`, Black `#050505`, White `#FFFFFF`, Warm Cream `#F2DFC2`,
  Soft Gold `#D8B56A`.
- **Typography:** bold, tightly-tracked headings; clean system sans body; large premium buttons.
- **Subtle animation:** spring press-feedback on buttons/cards (`PressableScale`), shimmer
  skeleton loaders, fade/slide screen transitions, animated success illustration.
- **Logo:** `assets/images/foodala-logo-transparent.png` is used as a brand element only — on the
  splash screen (centered, via `app.json`), the login hero, the home header (small), and order
  confirmation — never repeated on restaurant cards.
- **Photography:** real, dish-accurate food/drink photos from TheMealDB + TheCocktailDB (stable
  CDN URLs), mapped per dish in `src/data/mockRestaurants.ts`.

## Features

- **Login experience** (mock): logo, premium dark hero, email/password, **Sign In** /
  **Continue as Guest**, plus **Create Account** / **Forgot Password** links.
- **App header:** logged-out → Login button; guest → Guest badge; user → avatar with initial.
- **Home:** welcome hero + search, image-backed **categories carousel** (filters the list),
  **featured** restaurant carousel, and premium restaurant cards (large photo, rating, ETA,
  delivery fee, cuisine tags).
- **Restaurant page:** large cover image, info stats (rating / delivery time / fee),
  **sticky category tabs** with scroll-spy, clean menu cards; unavailable items can't be added.
- **Cart:** modern order-summary card, quantity +/- (item removed at 0), prominent total,
  premium checkout button. Persists across navigation and restarts (AsyncStorage).
- **Checkout:** multi-step section cards (Delivery Information, Payment Method, Order Summary),
  validation (name, phone, address; notes optional). Creates a local order `FOOD-######`.
- **Order confirmation:** animated success illustration, large order number, status badge,
  Track Order + Back to Home.
- One-restaurant-per-order: adding from another restaurant prompts to clear the cart first.
- Loading (skeletons), empty, and error states throughout.

## Tech stack

| Concern        | Choice                                       |
| -------------- | -------------------------------------------- |
| Framework      | Expo (SDK 52) + React Native                 |
| Language       | TypeScript (strict)                          |
| Navigation     | Expo Router (file-based, `app/`)             |
| Design system  | Central theme (`src/theme/`)                 |
| UI extras      | expo-linear-gradient, RN `Animated`          |
| Data           | Local mock data (`src/data/`)                |
| State          | Zustand — cart (persisted), order + auth (in-memory) |
| Backend        | Supabase — *optional/future, not used*       |

## Project structure

```
app/
  _layout.tsx              Stack navigator (dark theme, transitions)
  login.tsx                Login / guest entry (mock auth)
  index.tsx                Home (hero, search, categories, featured, list)
  restaurant/[id].tsx      Restaurant detail (cover, sticky tabs, menu)
  cart.tsx                 Cart
  checkout.tsx             Multi-step checkout + order creation
  order-confirmation.tsx   Animated confirmation
assets/images/             foodala-logo-transparent.png (brand mark, also app icon/splash)
src/
  theme/                   Design system: colors, spacing, typography, shadows, radius
  components/              Button, PressableScale, Skeleton(s), Logo, SearchBar, Tag,
                           CategoryCarousel, RestaurantCard, FeaturedCard, RestaurantMeta,
                           MenuItemRow, FloatingCartButton, TextField, AuthHeaderButton,
                           EmptyState, ErrorState, Loading
  data/mockRestaurants.ts  Local mock data + fetch helpers (the active data source)
  lib/supabase.ts          Lazy Supabase client — UNUSED in mock mode, kept for future
  stores/cartStore.ts      Cart state + one-restaurant rule (persisted)
  stores/orderStore.ts     Last placed order (in-memory) + fake order-ID generator
  stores/authStore.ts      Mock auth state (loggedOut / guest / user)
  types/database.ts        TypeScript types (shared by mock data and future backend)
  utils/                   format.ts (PHP), constants.ts (delivery fee, payment method)
supabase/                  Kept for future backend integration (not needed to run)
  migrations/0001_init.sql Tables + RLS policies
  seed.sql                 5 restaurants + menu items (mirrors src/data/mockRestaurants.ts)
```

## Setup

No environment variables or backend are needed — the app runs on local mock data.

### 1. Install dependencies

```bash
cd apps/customer-mobile
npm install
```

### 2. Run the app

```bash
npm start            # starts Metro and shows a QR code
```

- **Scan the QR code with the Expo Go app** on your phone (recommended — no native toolchain), or
- **Press `w`** to open it in your web browser.

#### Recommended: Expo Go on a physical device (no native toolchain needed)

`npm start` (or `npx expo start -c` to clear the cache) prints a QR code. Install the
**Expo Go** app on your phone and scan it — the app loads over your network with no Android
Studio or Xcode required. This is the easiest mobile dev flow on a fresh Mac.

#### Other targets (require local native tooling)

```bash
npm run web          # opens in a browser — needs no native SDK
npm run ios          # requires Xcode + an iOS Simulator (macOS only)
npm run android      # requires Android Studio, the Android SDK, and adb on your PATH
```

- **`npm run ios`** needs **Xcode** installed with at least one iOS Simulator runtime.
- **`npm run android`** needs **Android Studio**, the **Android SDK**, and **`adb`**
  configured (set `ANDROID_HOME`/`ANDROID_SDK_ROOT` and add `platform-tools` to your `PATH`).
  Without these you'll see `Failed to resolve the Android SDK path` / `spawn adb ENOENT` —
  that's a missing local toolchain, **not an app bug**. Use the Expo Go flow above instead, or
  install Android Studio. See <https://docs.expo.dev/get-started/set-up-your-environment/>.

## Verification scripts

```bash
npm run typecheck    # tsc --noEmit
npm run lint         # expo lint (configures ESLint on first run)
```

## Notes & assumptions

- **Data:** mock-data mode. Restaurants/menus come from `src/data/mockRestaurants.ts`; orders are
  created locally with a fake ID (`FOOD-######`) and held in memory (`src/stores/orderStore.ts`).
- **Currency:** PHP, displayed as `₱`.
- **Delivery fee:** flat `₱50` (`src/utils/constants.ts`).
- **Payment:** Cash on Delivery only.
- **One order = one restaurant.** Switching restaurants clears the cart after a confirmation prompt.
- The cart still persists across navigation and restarts via AsyncStorage. The last order is
  in-memory only and is lost on reload (fine for the mock flow).

## Optional / future: Supabase backend

The app does **not** require Supabase today. The pieces below are kept so a real backend can be
wired up later without reworking the UI:

- `supabase/migrations/0001_init.sql` — tables + RLS policies.
- `supabase/seed.sql` — sample data, mirroring `src/data/mockRestaurants.ts`.
- `src/lib/supabase.ts` — a lazy client (`getSupabase()`) that returns `null` and warns if the
  env vars are unset, instead of throwing. Nothing imports it in mock mode.

To switch to a real backend: create a Supabase project, run the two SQL files, set
`EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY` in a `.env` (see `.env.example`),
then replace the calls to the `src/data` helpers in the screens with Supabase queries via
`getSupabase()`.
