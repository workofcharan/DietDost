# DietDost

DietDost is a polished nutrition tracker for Indian meals. It focuses on practical logging for foods like dal, roti, dosa, poha, biryani, paneer, chai, and home-style portions that generic calorie apps often handle poorly.

The app is built with Next.js, Tailwind CSS, local session persistence, local meal-log storage, and a public nutrition lookup route backed by Open Food Facts.

## Features

- Light mode by default with a dark mode toggle
- Minimal neobrutalist design language: flat surfaces, hard shadows, thick borders, vibrant accents
- Modern Google font pairing: Space Grotesk for UI and Archivo Black for headings
- Local sign-up/sign-in flow that persists a user profile in browser storage
- Dashboard meal logging with saved logs across reloads
- Public nutrition search through `/api/nutrition/search`
- Curated Indian seed foods as a reliable fallback for common dishes
- AI-style meal parsing demos for free-text meal descriptions
- Route loading skeletons and snappy interaction transitions

## Data Model

DietDost uses two nutrition sources:

1. Curated Indian seed foods in `lib/nutrition.ts`
2. Open Food Facts search results through `app/api/nutrition/search/route.ts`

The public API route normalizes third-party products into the app's internal shape:

```ts
{
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  servingLabel: string;
  source: "seed" | "open-food-facts";
}
```

This avoids calling an AI model for every nutrition lookup. AI can be added later for fuzzy parsing, but the base food database path is deterministic.

## Auth And Storage

The current implementation is intentionally local-first:

- User profile is stored in `localStorage` under `dietdost:user`
- Meal logs are stored in `localStorage` under `dietdost:meal-logs`
- Sign-up calculates a calorie goal and saves it to the local profile
- Login creates or restores a local session and routes to the dashboard

For production, replace the local auth helpers in `lib/auth.ts` with Supabase Auth or another backend auth provider, then move meal logs into a real user-scoped table.

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Build for production:

```bash
npm run build
```

## Project Structure

```text
app/
  api/nutrition/search/route.ts  Public nutrition lookup route
  auth/login/page.tsx            Local login screen
  auth/signup/page.tsx           Local onboarding flow
  dashboard/page.tsx             Meal logging dashboard
  ai/page.tsx                    AI-style helper tools
  review/page.tsx                Weekly review UI
components/
  AppSkeleton.tsx                Route loading skeleton
  Navbar.tsx                     Navigation and auth links
  ThemeProvider.tsx              next-themes provider
  ThemeToggle.tsx                Light/dark control
lib/
  auth.ts                        Local user session helpers
  nutrition.ts                   Seed foods and shared nutrition types
```

## Notes

- No API key is required for the current nutrition lookup.
- The app keeps light mode as the default theme.
- The UI uses hard shadows and bold borders from the attached design system, but keeps the layout minimal for a cleaner nutrition-product feel.
