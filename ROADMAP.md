# ZaikaTrack — Project Roadmap
> AI-Powered Indian Food Calorie & Nutrition Tracker  
> Solo Project · 5th Semester · Loyola Academy  
> Stack: Next.js · Supabase · Gemini API · Vercel

---

## Overview

ZaikaTrack is a full-stack web application that lets users search, log, and track Indian food nutrition. It features user authentication, a curated desi food database, daily/weekly dashboards, and Gemini AI-powered meal analysis, diet review, and a nutrition chatbot.

---

## Phases at a Glance

| Phase | What | Timeline (suggested) |
|-------|------|----------------------|
| 0 | Setup & scaffolding | Day 1–2 |
| 1 | Database & food data | Day 3–5 |
| 2 | Auth & user system | Day 6–8 |
| 3 | Core tracker UI | Day 9–14 |
| 4 | Dashboard & charts | Day 15–18 |
| 5 | AI features (Gemini) | Day 19–23 |
| 6 | Polish, mobile, deploy | Day 24–28 |

---

## Phase 0 — Project Setup & Scaffolding

### Goals
Get the skeleton running locally and on Vercel before writing any real features.

### Tasks
- [ ] Init Next.js 14 project with App Router (`npx create-next-app@latest`)
- [ ] Set up Tailwind CSS
- [ ] Connect GitHub repo
- [ ] Deploy empty project to Vercel (confirm CI/CD pipeline works)
- [ ] Create Supabase project, copy environment keys
- [ ] Set up `.env.local` with all keys:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `GEMINI_API_KEY`
- [ ] Install core dependencies:
  - `@supabase/supabase-js`
  - `@supabase/auth-helpers-nextjs`
  - `recharts` (for charts)
  - `@google/generative-ai`
  - `lucide-react` (icons)
- [ ] Set up folder structure:
  ```
  /app
    /auth
    /dashboard
    /food
    /ai
    /api
  /components
  /lib
    supabase.ts
    gemini.ts
  /types
  ```

### Deliverable
Working Next.js app live on Vercel, nothing breaks, env vars set.

---

## Phase 1 — Food Database

### Goals
Build and seed the Indian food nutrition database in Supabase.

### Database Table: `foods`

```sql
create table foods (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  name_hindi text,
  category text,           -- breakfast, lunch, dinner, snack, beverage
  region text,             -- North, South, East, West, Pan-Indian
  serving_size_g integer,
  serving_label text,      -- "1 roti", "1 cup", "1 bowl"
  calories integer,
  protein_g numeric,
  carbs_g numeric,
  fat_g numeric,
  fiber_g numeric,
  sodium_mg numeric,
  sugar_g numeric,
  calcium_mg numeric,
  iron_mg numeric,
  created_at timestamptz default now()
);
```

### Tasks
- [ ] Create `foods` table in Supabase with above schema
- [ ] Source nutrition data — use these as references:
  - IFCT 2017 (Indian Food Composition Tables — free PDF, govt source)
  - Nutritionix API (has some Indian foods)
  - CalorieNinja / USDA API for cross-referencing
- [ ] Write a Node.js seed script (`scripts/seed-foods.js`) to bulk insert from a local JSON file
- [ ] Start with ~100 dishes across categories:
  - Breakfast: idli, dosa, poha, upma, paratha, bread omelette, etc.
  - Lunch: dal tadka, rajma, chole, sabzi varieties, rice dishes
  - Dinner: roti, biryani, paneer dishes, chicken curry, fish curry
  - Snacks: samosa, pakoda, bhel puri, chaat, murukku
  - Beverages: chai, lassi, nimbu pani, buttermilk
- [ ] Add a `search` index on `name` column (Supabase full-text search)
- [ ] Test search queries in Supabase dashboard

### Deliverable
~100 Indian food items in Supabase, searchable by name.

---

## Phase 2 — Auth & User System

### Goals
Users can sign up, log in, and have their data persisted across sessions.

### Database Tables

```sql
-- User profiles (extends Supabase auth.users)
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  age integer,
  weight_kg numeric,
  height_cm numeric,
  goal text,               -- 'lose', 'maintain', 'gain'
  daily_calorie_goal integer default 2000,
  daily_protein_goal integer default 50,
  created_at timestamptz default now()
);

-- Enable Row Level Security
alter table profiles enable row level security;
create policy "Users can only access own profile"
  on profiles for all using (auth.uid() = id);
```

### Tasks
- [ ] Enable Supabase Email Auth (in dashboard → Auth → Providers)
- [ ] Create `profiles` table with RLS policies
- [ ] Set up Supabase auth helpers in Next.js (middleware for protected routes)
- [ ] Build pages:
  - `/auth/signup` — name, email, password
  - `/auth/login` — email, password
  - `/auth/callback` — handles Supabase redirect
- [ ] Build onboarding flow after signup:
  - Step 1: Age, weight, height
  - Step 2: Goal (lose / maintain / gain weight)
  - Step 3: Auto-calculate TDEE and set calorie goal (Mifflin-St Jeor formula)
- [ ] Protected route middleware — redirect unauthenticated users to `/auth/login`
- [ ] Persistent session across desktop and mobile via Supabase cookies

### Deliverable
Users can register, complete onboarding, and log back in on any device.

---

## Phase 3 — Core Tracker UI

### Goals
The main feature: search Indian food, log it, see today's intake.

### Database Table

```sql
create table meal_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  food_id uuid references foods(id),
  meal_type text,          -- 'breakfast', 'lunch', 'dinner', 'snack'
  quantity numeric default 1,
  logged_date date default current_date,
  calories_consumed integer,
  protein_consumed numeric,
  carbs_consumed numeric,
  fat_consumed numeric,
  fiber_consumed numeric,
  created_at timestamptz default now()
);

alter table meal_logs enable row level security;
create policy "Users can only access own logs"
  on meal_logs for all using (auth.uid() = user_id);
```

### Tasks
- [ ] Build `/dashboard` page (main home after login)
- [ ] Food search component:
  - Search bar with debounced input
  - Results dropdown with food name, serving size, calories
  - Click to open "Add to log" modal
- [ ] "Add to log" modal:
  - Select meal type (breakfast / lunch / dinner / snack)
  - Adjust quantity (1x, 2x, or custom grams)
  - Shows live nutrition preview as quantity changes
  - Confirm button saves to `meal_logs`
- [ ] Today's log section:
  - Grouped by meal type (Breakfast, Lunch, Dinner, Snacks)
  - Each item shows food name, quantity, calories
  - Delete item option
- [ ] Daily summary bar at top:
  - Calories consumed vs goal (progress bar)
  - Quick macro pills: Protein / Carbs / Fat
- [ ] Nutrition detail modal — click any food to see full breakdown (fiber, sodium, sugar, minerals)
- [ ] Date picker to view/edit logs for past dates

### Deliverable
Users can search, log meals, and see today's full nutrition breakdown.

---

## Phase 4 — Dashboard & Charts

### Goals
Weekly view with visual data to make the app feel complete and impressive.

### Tasks
- [ ] Build `/dashboard/weekly` page
- [ ] Charts using Recharts:
  - **Calorie trend** — line chart, 7 days, goal line overlaid
  - **Macro breakdown** — stacked bar chart per day (protein/carbs/fat)
  - **Meal distribution** — donut chart (what % comes from each meal type)
- [ ] Weekly summary cards:
  - Avg daily calories
  - Days on target vs over/under
  - Most logged food this week
  - Best macro day
- [ ] Daily view enhancements:
  - Circular calorie ring (consumed vs remaining vs goal)
  - Macro progress bars with color coding
- [ ] Toggle between daily and weekly from a tab on the dashboard
- [ ] Charts are fully responsive (Recharts handles this well)

### Deliverable
Visual, data-rich dashboard that looks good in screenshots for the project report.

---

## Phase 5 — AI Features (Gemini API)

### Goals
Three AI-powered features using Google Gemini (free tier via AI Studio).

> **Note:** These are real working features using `gemini-1.5-flash` (free, fast). If rate limits hit during demo, add graceful fallback messages.

### Setup
- [ ] Get Gemini API key from [aistudio.google.com](https://aistudio.google.com)
- [ ] Add to `.env.local` as `GEMINI_API_KEY`
- [ ] Create `/lib/gemini.ts` wrapper

### Feature 5A — Meal Analyser (Text Input)
**Route:** `/api/ai/analyse-meal`

User types: *"I had 2 rotis with dal and a small bowl of sabzi for lunch"*
Gemini responds with estimated calories and macros, matched to Indian portions.

- [ ] Build `/ai/analyse` page with text area input
- [ ] API route calls Gemini with a structured prompt:
  - Instructs it to identify Indian dishes from free text
  - Returns JSON: `{ dishes: [...], total_calories, total_protein, total_carbs, total_fat, notes }`
- [ ] Display results in a clean card breakdown
- [ ] "Add this to today's log" button to save the AI-estimated entry

### Feature 5B — Weekly Diet Review
**Route:** `/api/ai/diet-review`

Pulls last 7 days of `meal_logs`, sends summary to Gemini, gets back a personalised review.

- [ ] Triggered by a button on the weekly dashboard: "Get AI Review"
- [ ] Prompt includes: avg calories, top foods logged, macro balance, user's goal
- [ ] Gemini returns: what's going well, what to improve, 3 specific suggestions
- [ ] Display as a card with sections, save review to Supabase for history

### Feature 5C — Nutrition Chatbot
**Route:** `/api/ai/chat`

A simple chat interface where users can ask nutrition questions.

- [ ] Build `/ai/chat` page with chat bubble UI
- [ ] Maintain conversation history in React state (passed to Gemini each turn)
- [ ] System prompt: "You are a helpful Indian nutrition assistant. Focus on desi food, regional cuisines, and practical dietary advice."
- [ ] Works for questions like:
  - *"Is samosa worse than pakoda?"*
  - *"How much protein is in paneer per 100g?"*
  - *"What's a healthy Indian breakfast for weight loss?"*
- [ ] Rate limit: 10 messages per session to stay within free tier

### Deliverable
Three working AI features — analyser, review, chatbot — all powered by Gemini free tier.

---

## Phase 6 — Polish, Mobile & Deployment

### Goals
Ship a production-ready, publicly accessible app.

### UI Polish
- [ ] Consistent design system — dark background (#0F0F0F), saffron accent (#F4A416), green (#2ECC71)
- [ ] Skeleton loaders on all data-fetching components
- [ ] Toast notifications (success/error) on all user actions
- [ ] Empty states for: no logs today, no weekly data, no search results
- [ ] Error boundaries on all pages

### Mobile Responsiveness
- [ ] Test every page at 375px (iPhone SE) and 390px (iPhone 14)
- [ ] Bottom nav bar on mobile (Dashboard, Food, AI, Profile)
- [ ] Top nav on desktop
- [ ] Touch-friendly tap targets (min 44px)
- [ ] Food search works well on mobile keyboard

### SEO & Meta
- [ ] Add `<title>` and `<meta description>` to all pages
- [ ] Open Graph image for the landing page (for sharing)
- [ ] `/` landing page (public) explaining the app before login

### Deployment Checklist
- [ ] All environment variables added in Vercel project settings
- [ ] Supabase RLS verified — no user can access another user's data
- [ ] Gemini API key restricted to your domain in Google AI Studio
- [ ] Test full user flow on a real phone before demo
- [ ] Custom domain (optional — Vercel gives a free `.vercel.app` URL)

### Documentation
- [ ] `README.md` with setup instructions
- [ ] This `ROADMAP.md` kept updated
- [ ] Screenshots folder for project report

### Deliverable
Live public URL, works on mobile, zero broken flows.

---

## Supabase Schema Summary

```
auth.users          <- managed by Supabase
    |
    |-- profiles    <- user goals, weight, calorie targets
    |-- meal_logs   <- every food item logged per day
    └-- (foods)     <- shared table, no user ownership
```

---

## Gemini Prompt Strategy

| Feature | Model | Approach |
|---------|-------|----------|
| Meal Analyser | `gemini-1.5-flash` | Single turn, JSON output mode |
| Diet Review | `gemini-1.5-flash` | Single turn, structured sections |
| Chatbot | `gemini-1.5-flash` | Multi-turn with history array |

Always include in system prompt: *"You are an expert in Indian cuisine and nutrition. Use standard Indian portion sizes."*

---

## Known Limitations & Scope Decisions

| Decision | Reason |
|----------|--------|
| Text-only AI meal input (no photo) | Photo analysis requires Vision API billing |
| ~100 dishes at launch | Enough for demo; expandable via seed script |
| Gemini free tier only | College project, no budget |
| Email auth only (no Google/OTP) | Keeps scope manageable |
| No meal planning feature | Out of scope for this semester |

---

## Project Report Sections (reference)

1. Introduction & Motivation
2. Literature Survey
3. System Requirements (hardware + software)
4. System Design (architecture diagram, DB schema, data flow)
5. Implementation (phase-wise, with screenshots)
6. AI Integration (Gemini API — how it works, prompts used)
7. Testing
8. Results & Screenshots
9. Conclusion & Future Work
10. References

---

*Last updated: June 2025 | ZaikaTrack v1.0*
