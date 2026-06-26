"use client";

import Navbar from "@/components/Navbar";
import { useState } from "react";
import {
  TrendingUp,
  BarChart3,
  Sparkles,
  Award,
  Target,
  Flame,
  AlertCircle,
} from "lucide-react";

interface DayData {
  date: string;
  label: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

const WEEKLY_DATA: DayData[] = [
  { date: "2026-06-20", label: "Mon", calories: 1820, protein: 58, carbs: 218, fat: 62 },
  { date: "2026-06-21", label: "Tue", calories: 2100, protein: 71, carbs: 248, fat: 74 },
  { date: "2026-06-22", label: "Wed", calories: 1950, protein: 63, carbs: 235, fat: 68 },
  { date: "2026-06-23", label: "Thu", calories: 2240, protein: 80, carbs: 260, fat: 78 },
  { date: "2026-06-24", label: "Fri", calories: 1780, protein: 54, carbs: 210, fat: 58 },
  { date: "2026-06-25", label: "Sat", calories: 2350, protein: 76, carbs: 278, fat: 82 },
  { date: "2026-06-26", label: "Sun", calories: 820, protein: 25, carbs: 95, fat: 28 },
];

const CALORIE_GOAL = 2000;
const PROTEIN_GOAL = 75;

export default function WeeklyReviewPage() {
  const [aiReviewLoading, setAiReviewLoading] = useState(false);
  const [aiReview, setAiReview] = useState<string | null>(null);

  const validDays = WEEKLY_DATA.filter((d) => d.calories > 0);
  const avgCalories = Math.round(validDays.reduce((a, d) => a + d.calories, 0) / validDays.length);
  const avgProtein = Math.round(validDays.reduce((a, d) => a + d.protein, 0) / validDays.length);
  const daysOnTarget = validDays.filter((d) => d.calories <= CALORIE_GOAL + 150 && d.calories >= CALORIE_GOAL - 300).length;
  const maxCalDay = [...WEEKLY_DATA].sort((a, b) => b.calories - a.calories)[0];
  const maxVal = Math.max(...WEEKLY_DATA.map((d) => d.calories), CALORIE_GOAL * 1.2);

  const handleGetAiReview = () => {
    setAiReviewLoading(true);
    setAiReview(null);
    setTimeout(() => {
      setAiReview(`**What's Going Well:**
Your protein intake is trending positively — averaging ${avgProtein}g per day this week, close to your ${PROTEIN_GOAL}g goal. Days like Thursday show excellent balance across all macronutrients.

**What to Improve:**
Your calorie intake is inconsistent, ranging from 1,780 to 2,350 kcal. Weekend days (especially Saturday) tend to spike significantly — likely due to social eating patterns. Try planning a lighter Sunday to compensate.

**3 Specific Suggestions for Next Week:**
1. Add a mid-morning protein snack (e.g., 1 boiled egg or a small bowl of sprouts) on weekdays to reduce hunger-driven evening overeating.
2. On high-calorie days like Saturday, opt for lighter Indian options: grilled tandoori items over fried, tawa vegetables over creamy curries.
3. Hit your 75g protein target consistently — consider adding a glass of buttermilk (chaas) or a handful of roasted chana as a regular snack.`);
      setAiReviewLoading(false);
    }, 2200);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans pb-24 md:pb-12">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 md:px-8 pt-24 md:pt-28 flex flex-col gap-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase text-amber-500 tracking-wider">
              <BarChart3 className="h-4 w-4" />
              Weekly Overview
            </div>
            <h1 className="text-3xl md:text-4xl font-serif font-bold tracking-tight">
              This Week&rsquo;s Diet Review
            </h1>
            <p className="text-zinc-400 text-sm">Jun 20 – Jun 26, 2026 · Personal calorie goal: {CALORIE_GOAL} kcal / day</p>
          </div>
          <button
            onClick={handleGetAiReview}
            disabled={aiReviewLoading}
            className="flex items-center gap-2 px-5 py-3 bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold rounded-xl transition-all text-sm cursor-pointer disabled:opacity-60 shrink-0"
          >
            <Sparkles className="h-4 w-4 fill-zinc-950" />
            {aiReviewLoading ? "Generating AI Review..." : "Get AI Diet Review"}
          </button>
        </div>

        {/* Summary Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Avg Daily Calories", value: `${avgCalories}`, unit: "kcal", icon: Flame, color: "text-amber-500", bg: "bg-amber-500/10" },
            { label: "Days On Target", value: `${daysOnTarget}/7`, unit: "days", icon: Target, color: "text-emerald-500", bg: "bg-emerald-500/10" },
            { label: "Avg Protein", value: `${avgProtein}g`, unit: "/ day", icon: Award, color: "text-blue-400", bg: "bg-blue-500/10" },
            { label: "Highest Cal Day", value: maxCalDay.label, unit: `${maxCalDay.calories} kcal`, icon: TrendingUp, color: "text-red-400", bg: "bg-red-500/10" },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="glass-card rounded-2xl p-5 border border-zinc-800 flex flex-col gap-3">
                <div className={`w-9 h-9 rounded-lg ${stat.bg} flex items-center justify-center ${stat.color}`}>
                  <Icon className="h-4.5 w-4.5" />
                </div>
                <div>
                  <p className={`text-2xl font-bold font-mono ${stat.color}`}>{stat.value}</p>
                  <p className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider mt-0.5">{stat.unit}</p>
                  <p className="text-xs text-zinc-400 mt-1">{stat.label}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bar Chart */}
        <div className="glass-card rounded-3xl p-6 border border-zinc-800 flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <h2 className="font-serif font-bold text-lg">Calorie Trend · 7 Days</h2>
            <div className="flex items-center gap-4 text-[10px] font-semibold uppercase tracking-wider">
              <span className="flex items-center gap-1.5 text-amber-500">
                <span className="w-3 h-1.5 rounded-full bg-amber-500 inline-block"></span>
                Consumed
              </span>
              <span className="flex items-center gap-1.5 text-zinc-500">
                <span className="w-3 h-0.5 bg-zinc-500 inline-block" style={{ borderTop: "2px dashed" }}></span>
                Goal
              </span>
            </div>
          </div>

          <div className="flex items-end gap-3 h-48 relative px-2">
            {/* Goal line */}
            <div
              className="absolute left-0 right-0 border-t border-dashed border-zinc-600 pointer-events-none"
              style={{ bottom: `${(CALORIE_GOAL / maxVal) * 100}%` }}
            >
              <span className="absolute right-0 -top-4 text-[9px] text-zinc-500 font-mono bg-zinc-950 px-1">
                Goal {CALORIE_GOAL}
              </span>
            </div>

            {WEEKLY_DATA.map((day) => {
              const heightPercent = (day.calories / maxVal) * 100;
              const isOverGoal = day.calories > CALORIE_GOAL + 150;
              const isUnder = day.calories < CALORIE_GOAL - 300;
              const isToday = day.label === "Sun";

              return (
                <div key={day.label} className="flex-1 flex flex-col items-center gap-2">
                  {/* Value label */}
                  <span className="text-[9px] font-mono text-zinc-500">
                    {day.calories > 0 ? day.calories : "-"}
                  </span>

                  {/* Bar */}
                  <div className="w-full flex-1 flex items-end">
                    <div
                      className={`w-full rounded-t-lg transition-all duration-700 ${
                        isToday
                          ? "bg-amber-500/40 border border-amber-500/40"
                          : isOverGoal
                          ? "bg-red-500/70"
                          : isUnder
                          ? "bg-zinc-700"
                          : "bg-amber-500"
                      }`}
                      style={{ height: `${heightPercent}%` }}
                    ></div>
                  </div>

                  {/* Day label */}
                  <span className={`text-[10px] font-bold ${isToday ? "text-amber-500" : "text-zinc-500"}`}>
                    {day.label}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex gap-4 text-[10px] font-semibold uppercase tracking-wider text-zinc-600 border-t border-zinc-900 pt-3">
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-amber-500"></span>On Target</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-red-500/70"></span>Over Goal</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-zinc-700"></span>Under Goal</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-amber-500/40 border border-amber-500/40"></span>Today</span>
          </div>
        </div>

        {/* Per-Day Breakdown */}
        <div className="glass-card rounded-3xl p-6 border border-zinc-800 flex flex-col gap-4">
          <h2 className="font-serif font-bold text-lg">Daily Breakdown</h2>
          <div className="flex flex-col gap-3">
            {WEEKLY_DATA.map((day) => {
              const isOverGoal = day.calories > CALORIE_GOAL + 150;
              return (
                <div
                  key={day.label}
                  className="flex items-center gap-4 p-3.5 rounded-xl bg-zinc-900/40 border border-zinc-800 hover:border-zinc-800 transition-all"
                >
                  <div className="w-10 text-center">
                    <p className="text-xs font-bold text-zinc-300">{day.label}</p>
                    <p className="text-[9px] text-zinc-600">{day.date.slice(5)}</p>
                  </div>

                  {/* Calorie progress bar */}
                  <div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${isOverGoal ? "bg-red-500" : "bg-amber-500"}`}
                      style={{ width: `${Math.min(100, (day.calories / (CALORIE_GOAL * 1.3)) * 100)}%` }}
                    ></div>
                  </div>

                  <div className="flex items-center gap-4 text-[10px] font-mono shrink-0">
                    <span className={`font-bold ${isOverGoal ? "text-red-400" : "text-zinc-200"}`}>
                      {day.calories} kcal
                    </span>
                    <span className="text-amber-500">{day.protein}g P</span>
                    <span className="text-zinc-500">{day.carbs}g C</span>
                    <span className="text-red-400/70">{day.fat}g F</span>
                  </div>

                  {isOverGoal && (
                    <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* AI Review */}
        {aiReview && (
          <div className="glass-card rounded-3xl p-6 border border-amber-500/20 flex flex-col gap-4 animate-slide-up">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500">
                <Sparkles className="h-4 w-4" />
              </div>
              <h3 className="font-serif font-bold text-lg">AI Diet Review</h3>
              <span className="ml-auto text-[10px] text-zinc-500 font-mono">Powered by Gemini 1.5 Flash</span>
            </div>

            <div className="flex flex-col gap-4 text-sm leading-relaxed text-zinc-300">
              {aiReview.split("\n\n").map((block, i) => {
                const isHeading = block.startsWith("**");
                if (isHeading) {
                  const [heading, ...rest] = block.split("\n");
                  return (
                    <div key={i}>
                      <p className="font-bold text-white mb-1">{heading.replace(/\*\*/g, "")}</p>
                      {rest.map((line, j) => (
                        <p key={j} className="text-zinc-400 text-xs leading-relaxed">
                          {line}
                        </p>
                      ))}
                    </div>
                  );
                }
                return <p key={i} className="text-zinc-400 text-xs leading-relaxed">{block}</p>;
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
