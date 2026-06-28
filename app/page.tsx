"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import BrandLogo from "@/components/BrandLogo";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  Brain,
  CalendarCheck,
  ChevronRight,
  ClipboardCheck,
  MessageCircleQuestion,
  Search,
  ShieldCheck,
  Sparkles,
  Utensils,
  Wand2,
} from "lucide-react";

const mealRows = [
  { name: "2 rotis", amount: "240 kcal", macro: "36g carbs", width: "78%" },
  { name: "1 katori dal", amount: "150 kcal", macro: "8g protein", width: "48%" },
  { name: "Paneer sabzi", amount: "320 kcal", macro: "12g protein", width: "88%" },
  { name: "Raita + salad", amount: "155 kcal", macro: "low GI side", width: "38%" },
];

const macroBars = [
  { label: "Protein", value: "32g", width: "58%", color: "bg-success" },
  { label: "Carbs", value: "82g", width: "78%", color: "bg-brand" },
  { label: "Fat", value: "29g", width: "46%", color: "bg-danger" },
];

const featureCards = [
  {
    title: "Indian Food Search",
    text: "Find dosa, poha, rajma chawal, chai, biryani, paneer dishes, and everyday portions without translating your food into generic western entries.",
    href: "/dashboard",
    action: "Open dashboard",
    icon: Search,
  },
  {
    title: "AI Meal Parser",
    text: "Type natural food logs like '2 rotis, dal, rice and raita' and let DietDost split the plate into editable nutrition items.",
    href: "/ai",
    action: "Try assistant",
    icon: Wand2,
  },
  {
    title: "Weekly Diet Review",
    text: "Review trends, weak spots, protein gaps, and practical improvements after several days of logs.",
    href: "/review",
    action: "View review",
    icon: ClipboardCheck,
  },
];

const flowSteps = [
  {
    title: "Log the meal",
    text: "Search a dish or write the whole plate in one sentence.",
    icon: Utensils,
  },
  {
    title: "Check the estimate",
    text: "Adjust serving size, calories, protein, carbs, and fat before saving.",
    icon: BarChart3,
  },
  {
    title: "Review the week",
    text: "Turn daily entries into a simple health summary and next actions.",
    icon: CalendarCheck,
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-neutral-secondary-soft text-black selection:bg-brand selection:text-black dark:bg-zinc-950 dark:text-white pb-16 md:pb-0">
      <Navbar />

      <main className="px-5 pt-24 md:px-8 md:pt-28">
        <section className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 lg:min-h-[calc(100vh-7rem)] lg:grid-cols-12 lg:gap-12">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="flex flex-col gap-6 text-left lg:col-span-7"
          >
            <div className="inline-flex w-fit items-center gap-2 border-2 border-black bg-brand-softer px-3 py-1 text-xs font-extrabold uppercase tracking-[0.18em] text-black shadow-xs dark:border-zinc-300 dark:bg-zinc-900 dark:text-brand">
              <Sparkles className="h-3.5 w-3.5" />
              AI-powered and localised
            </div>

            <div className="space-y-6">
              <h1 className="max-w-4xl text-5xl font-black leading-[0.88] tracking-tight md:text-7xl lg:text-8xl">
                Built for the{" "}
                <span className="relative inline-block italic text-brand-strong dark:text-brand">
                  Thali
                  <span className="absolute -bottom-1 left-1 right-1 h-2 border-2 border-black bg-white dark:border-zinc-300 dark:bg-zinc-900" />
                </span>
                , not the burger bowl.
              </h1>
              <p className="max-w-2xl text-lg leading-relaxed text-zinc-600 dark:text-zinc-300 md:text-xl">
                DietDost understands messy Indian meals:{" "}
                <strong className="font-black text-black dark:text-white">1 katori dal</strong>,{" "}
                <strong className="font-black text-black dark:text-white">2 rotis</strong>, poha,
                paneer, chai, biryani, snacks, and the way people actually describe food.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/dashboard"
                className="flex items-center justify-center gap-2 border-2 border-black bg-brand px-6 py-3.5 text-base font-extrabold text-black shadow-sm transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-brand-strong hover:shadow-md active:translate-x-0.5 active:translate-y-0.5 active:shadow-2xs dark:border-zinc-300"
              >
                Start logging
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/ai"
                className="flex items-center justify-center gap-2 border-2 border-black bg-white px-6 py-3.5 text-base font-extrabold text-black shadow-sm transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-zinc-100 hover:shadow-md active:translate-x-0.5 active:translate-y-0.5 active:shadow-2xs dark:border-zinc-300 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800"
              >
                Ask DietDost AI
                <MessageCircleQuestion className="h-5 w-5" />
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-3 border-t-2 border-black pt-5 dark:border-zinc-700 sm:max-w-2xl">
              <div className="border-l-4 border-brand pl-3">
                <p className="text-3xl font-black leading-none">100+</p>
                <p className="mt-1 text-xs font-bold uppercase tracking-wider text-zinc-500">Indian dishes</p>
              </div>
              <div className="border-l-4 border-success pl-3">
                <p className="text-3xl font-black leading-none">3x</p>
                <p className="mt-1 text-xs font-bold uppercase tracking-wider text-zinc-500">AI tools</p>
              </div>
              <div className="border-l-4 border-danger pl-3">
                <p className="text-3xl font-black leading-none">Local</p>
                <p className="mt-1 text-xs font-bold uppercase tracking-wider text-zinc-500">Session-first</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 28, rotate: 1.5 }}
            animate={{ opacity: 1, x: 0, rotate: 0 }}
            transition={{ duration: 0.55, ease: "easeOut", delay: 0.1 }}
            className="lg:col-span-5"
          >
            <div className="relative mx-auto max-w-[520px]">
              <motion.div
                aria-hidden="true"
                animate={{ y: [0, -10, 0], rotate: [-2, 2, -2] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -right-3 top-8 z-20 border-2 border-black bg-brand px-4 py-2 text-xs font-black uppercase tracking-wider text-black shadow-md dark:border-zinc-300"
              >
                AI parsed
              </motion.div>

              <motion.div
                aria-hidden="true"
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
                className="absolute -left-4 bottom-16 z-20 border-2 border-black bg-success-soft px-4 py-3 text-sm font-black text-black shadow-md dark:border-zinc-300"
              >
                865 kcal
              </motion.div>

              <div className="border-[3px] border-black bg-white p-4 shadow-xl dark:border-zinc-300 dark:bg-zinc-900 md:p-5">
                <div className="mb-4 flex items-center justify-between border-2 border-black bg-zinc-100 px-3 py-2 dark:border-zinc-300 dark:bg-zinc-950">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 bg-danger" />
                    <span className="h-3 w-3 bg-warning" />
                    <span className="h-3 w-3 bg-success" />
                  </div>
                  <span className="font-mono text-[11px] font-black uppercase tracking-wider text-zinc-500">
                    meal-parser.ai
                  </span>
                </div>

                <div className="border-2 border-black bg-brand-softer p-4 dark:border-zinc-300 dark:bg-zinc-950">
                  <p className="font-mono text-xs font-black uppercase tracking-wider text-zinc-500">User typed</p>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.4 }}
                    className="mt-2 text-lg font-black leading-snug md:text-xl"
                  >
                    “2 rotis, dal, paneer sabzi, raita and salad”
                  </motion.p>
                </div>

                <div className="mt-4 space-y-3">
                  {mealRows.map((row, index) => (
                    <motion.div
                      key={row.name}
                      initial={{ opacity: 0, x: 24 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.35, delay: 0.55 + index * 0.12 }}
                      className="border-2 border-black bg-white p-3 shadow-xs dark:border-zinc-300 dark:bg-zinc-950"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-black">{row.name}</p>
                          <p className="mt-0.5 text-xs font-bold uppercase tracking-wider text-zinc-500">{row.macro}</p>
                        </div>
                        <p className="shrink-0 font-mono text-sm font-black">{row.amount}</p>
                      </div>
                      <div className="mt-3 h-2 border border-black bg-zinc-100 dark:border-zinc-300 dark:bg-zinc-800">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: row.width }}
                          transition={{ duration: 0.65, delay: 0.8 + index * 0.12, ease: "easeOut" }}
                          className="h-full bg-brand"
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {macroBars.map((macro, index) => (
                    <div key={macro.label} className="border-2 border-black bg-white p-3 dark:border-zinc-300 dark:bg-zinc-950">
                      <div className="flex items-center justify-between text-xs font-black">
                        <span>{macro.label}</span>
                        <span>{macro.value}</span>
                      </div>
                      <div className="mt-2 h-2 border border-black bg-zinc-100 dark:border-zinc-300 dark:bg-zinc-800">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: macro.width }}
                          transition={{ duration: 0.75, delay: 1.2 + index * 0.12 }}
                          className={`h-full ${macro.color}`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </section>
      </main>

      <section className="mt-16 border-y-2 border-black bg-white py-14 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 px-5 md:grid-cols-3 md:px-8">
          {flowSteps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.35, delay: index * 0.08 }}
                className="border-2 border-black bg-brand-softer p-5 shadow-sm dark:border-zinc-300 dark:bg-zinc-950"
              >
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center border-2 border-black bg-brand text-black dark:border-zinc-300">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="font-mono text-xs font-black text-zinc-500">0{index + 1}</span>
                </div>
                <h3 className="text-xl font-black">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">{step.text}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 md:px-8">
        <div className="max-w-3xl">
          <p className="text-xs font-extrabold uppercase tracking-wider text-brand-strong dark:text-brand">Built beyond calorie lookup</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight md:text-5xl">
            More useful when meals are messy, homemade, and regional.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-300 md:text-lg">
            DietDost combines database search, conversational AI, dashboards, and weekly review
            without pretending Indian food is a simple barcode scan.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {featureCards.map((feature) => {
            const Icon = feature.icon;
            return (
              <motion.article
                key={feature.title}
                whileHover={{ x: -4, y: -4 }}
                transition={{ type: "spring", stiffness: 320, damping: 22 }}
                className="border-2 border-black bg-white p-6 shadow-md transition-shadow hover:shadow-lg dark:border-zinc-300 dark:bg-zinc-900"
              >
                <div className="mb-6 flex h-12 w-12 items-center justify-center border-2 border-black bg-brand text-black dark:border-zinc-300">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-black">{feature.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">{feature.text}</p>
                <Link href={feature.href} className="mt-6 inline-flex items-center gap-1.5 text-sm font-extrabold text-brand-strong dark:text-brand">
                  {feature.action}
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </motion.article>
            );
          })}
        </div>
      </section>

      <section className="border-y-2 border-black bg-[#E9F7F4] py-16 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-5 md:grid-cols-12 md:px-8">
          <div className="md:col-span-5">
            <p className="text-xs font-extrabold uppercase tracking-wider text-zinc-500">Why DietDost feels different</p>
            <h2 className="mt-3 text-3xl font-black md:text-5xl">It starts from how people actually eat.</h2>
          </div>
          <div className="grid gap-4 md:col-span-7">
            {[
              ["Portion language", "Katori, plate, cup, piece, and count-based entries are first-class labels."],
              ["AI where it helps", "Free-text parsing and chatbot guidance support the database instead of replacing it."],
              ["Review, not guilt", "Weekly feedback focuses on patterns and realistic swaps for Indian routines."],
              ["Project-friendly stack", "Next.js, Supabase auth, public nutrition data, local session storage, and Gemini AI."],
            ].map(([title, text]) => (
              <div key={title} className="grid grid-cols-[auto_1fr] gap-4 border-2 border-black bg-white p-4 shadow-xs dark:border-zinc-300 dark:bg-zinc-950">
                <ShieldCheck className="mt-1 h-5 w-5 text-success-strong dark:text-success" />
                <div>
                  <h3 className="font-black">{title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 md:px-8">
        <div className="flex flex-col items-start justify-between gap-8 border-2 border-black bg-white p-6 shadow-lg dark:border-zinc-300 dark:bg-zinc-900 md:flex-row md:items-center md:p-10">
          <div className="max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 border-2 border-black bg-brand px-3 py-1 text-xs font-black uppercase tracking-wider text-black dark:border-zinc-300">
              <Brain className="h-4 w-4" />
              DietDost AI included
            </div>
            <h2 className="text-2xl font-black md:text-4xl">Log a meal, ask a question, or generate a review.</h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300 md:text-base">
              The app gives the core nutrition workflow a clear path from first entry to weekly improvement.
            </p>
          </div>
          <Link
            href="/dashboard"
            className="flex w-full items-center justify-center gap-2 border-2 border-black bg-brand px-6 py-3.5 font-extrabold text-black shadow-sm transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-brand-strong hover:shadow-md active:translate-x-0.5 active:translate-y-0.5 active:shadow-2xs dark:border-zinc-300 sm:w-auto"
          >
            Go to dashboard
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      <footer className="border-t-2 border-black bg-white px-5 py-10 dark:border-zinc-800 dark:bg-zinc-950 md:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-5 md:flex-row md:items-center">
          <BrandLogo size="sm" />
          <div className="flex flex-col gap-1 text-xs text-zinc-500 md:items-end">
            <p>DietDost v1.0 &middot; Solo Project &middot; 5th Semester</p>
            <p>Loyola Academy &middot; Stack: Next.js &middot; Supabase &middot; Gemini AI &middot; Public nutrition data</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
