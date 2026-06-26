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
  CheckCircle,
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

function getDayStatus(day: DayData) {
  if (day.calories === 0) return "empty";
  if (day.calories > CALORIE_GOAL + 150) return "over";
  if (day.calories < CALORIE_GOAL - 300) return "under";
  return "on-target";
}

const STATUS_BAR: Record<string, string> = {
  "on-target": "bg-brand",
  "over": "bg-danger",
  "under": "bg-zinc-400 dark:bg-zinc-600",
  "empty": "bg-zinc-200 dark:bg-zinc-800",
};

const STATUS_LABEL: Record<string, string> = {
  "on-target": "text-brand-strong dark:text-brand",
  "over": "text-danger",
  "under": "text-zinc-500",
  "empty": "text-zinc-400",
};

export default function WeeklyReviewPage() {
  const [aiReviewLoading, setAiReviewLoading] = useState(false);
  const [aiReview, setAiReview] = useState<string | null>(null);

  const validDays = WEEKLY_DATA.filter((d) => d.calories > 0);
  const avgCalories = Math.round(validDays.reduce((a, d) => a + d.calories, 0) / validDays.length);
  const avgProtein = Math.round(validDays.reduce((a, d) => a + d.protein, 0) / validDays.length);
  const daysOnTarget = validDays.filter((d) => d.calories <= CALORIE_GOAL + 150 && d.calories >= CALORIE_GOAL - 300).length;
  const maxCalDay = [...WEEKLY_DATA].sort((a, b) => b.calories - a.calories)[0];
  const maxVal = Math.max(...WEEKLY_DATA.map((d) => d.calories), CALORIE_GOAL * 1.2);

  const handleGetAiReview = async () => {
    setAiReviewLoading(true);
    setAiReview(null);

    // Build a structured data summary to send to the AI
    const weekSummary = WEEKLY_DATA.map(d =>
      `${d.label} (${d.date}): ${d.calories} kcal, ${d.protein}g protein, ${d.carbs}g carbs, ${d.fat}g fat`
    ).join("\n");

    const prompt = `You are DietDost, a nutrition coach specialised in Indian food. Analyse this user's weekly food log and give a concise, actionable review.

Weekly data (calorie goal: ${CALORIE_GOAL} kcal/day, protein goal: ${PROTEIN_GOAL}g/day):
${weekSummary}

Averages: ${avgCalories} kcal/day, ${avgProtein}g protein/day
Days on target: ${daysOnTarget}/7

Write a review using EXACTLY this format (no markdown code blocks, just plain text with these exact headings):
**What's Going Well:**
[2-3 positive observations]

**What to Improve:**
[2-3 specific weaknesses with Indian diet context]

**3 Specific Suggestions for Next Week:**
1. [Actionable tip with Indian food examples]
2. [Actionable tip with Indian food examples]
3. [Actionable tip with Indian food examples]`;

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [], query: prompt }),
      });
      const data = await res.json() as { reply?: string; error?: string };
      if (!res.ok || data.error) throw new Error(data.error || "Review failed");
      setAiReview(data.reply ?? "");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to generate AI review.";
      setAiReview(`**Error:**\n${msg}`);
    } finally {
      setAiReviewLoading(false);
    }
  };


  const STAT_CARDS = [
    {
      label: "Avg Daily Calories", value: `${avgCalories}`, unit: "kcal / day",
      Icon: Flame, bg: "bg-brand", textColor: "text-black", border: "border-black"
    },
    {
      label: "Days On Target", value: `${daysOnTarget}/7`, unit: "days this week",
      Icon: Target, bg: "bg-success", textColor: "text-white", border: "border-black"
    },
    {
      label: "Avg Protein", value: `${avgProtein}g`, unit: "per day",
      Icon: Award, bg: "bg-black dark:bg-white", textColor: "text-white dark:text-black", border: "border-black dark:border-white"
    },
    {
      label: "Highest Cal Day", value: maxCalDay.label, unit: `${maxCalDay.calories} kcal`,
      Icon: TrendingUp, bg: "bg-danger", textColor: "text-white", border: "border-black"
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground font-sans pb-24 md:pb-12 page-enter selection:bg-brand selection:text-black">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 md:px-8 pt-24 md:pt-28 flex flex-col gap-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 animate-fade-in">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-xs font-black uppercase text-brand-strong dark:text-brand tracking-widest">
              <BarChart3 className="h-4 w-4" />
              Weekly Overview
            </div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-black dark:text-white">
              This Week&rsquo;s Diet Review
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400 text-sm">
              Jun 20 – Jun 26, 2026 &middot; Personal calorie goal: <strong className="text-black dark:text-white">{CALORIE_GOAL} kcal / day</strong>
            </p>
          </div>
          <button
            onClick={handleGetAiReview}
            disabled={aiReviewLoading}
            className="flex items-center gap-2 px-6 py-3.5 bg-brand hover:bg-brand-strong text-black font-extrabold border-2 border-black shadow-sm hover:shadow-md active:shadow-2xs hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 rounded-none transition-all text-sm cursor-pointer disabled:opacity-60 shrink-0"
          >
            {aiReviewLoading ? (
              <><div className="w-4 h-4 border-2 border-black border-t-transparent animate-spin-slow rounded-full" />Generating AI Review...</>
            ) : (
              <><Sparkles className="h-4 w-4" />Get AI Diet Review</>
            )}
          </button>
        </div>

        {/* Summary Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          {STAT_CARDS.map(({ label, value, unit, Icon, bg, textColor, border }) => (
            <div key={label}
              className={`${bg} border-2 ${border} shadow-md p-5 flex flex-col gap-3 hover:shadow-lg hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-all rounded-none cursor-default`}>
              <Icon className={`h-5 w-5 ${textColor}`} />
              <div>
                <p className={`text-2xl font-black font-mono ${textColor}`}>{value}</p>
                <p className={`text-[10px] font-black uppercase tracking-wider mt-0.5 ${textColor} opacity-70`}>{unit}</p>
                <p className={`text-xs font-bold mt-1 ${textColor} opacity-80`}>{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Bar Chart */}
        <div className="bg-white dark:bg-zinc-900 border-2 border-black dark:border-zinc-300 shadow-md p-6 flex flex-col gap-5 animate-fade-in rounded-none" style={{ animationDelay: "0.2s" }}>
          <div className="flex items-center justify-between">
            <h2 className="font-black text-lg text-black dark:text-white">Calorie Trend · 7 Days</h2>
            <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-wider">
              {[
                { color: "bg-brand", label: "On Target" },
                { color: "bg-danger", label: "Over Goal" },
                { color: "bg-zinc-400 dark:bg-zinc-600", label: "Under Goal" },
              ].map(({ color, label }) => (
                <span key={label} className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400">
                  <span className={`w-2.5 h-2.5 inline-block border border-black/20 ${color}`} />{label}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-end gap-3 h-52 relative px-2">
            {/* Goal line */}
            <div
              className="absolute left-0 right-0 border-t-2 border-dashed border-black/30 dark:border-zinc-500 pointer-events-none"
              style={{ bottom: `${(CALORIE_GOAL / maxVal) * 100}%` }}
            >
              <span className="absolute right-0 -top-5 text-[9px] text-black dark:text-zinc-400 font-black bg-white dark:bg-zinc-900 px-1 border border-black/20 dark:border-zinc-600">
                Goal {CALORIE_GOAL}
              </span>
            </div>

            {WEEKLY_DATA.map((day, i) => {
              const heightPercent = (day.calories / maxVal) * 100;
              const status = getDayStatus(day);
              const isToday = day.label === "Sun";
              return (
                <div key={day.label} className="flex-1 flex flex-col items-center gap-1.5" style={{ animationDelay: `${i * 60}ms` }}>
                  <span className="text-[9px] font-black font-mono text-zinc-500">{day.calories > 0 ? day.calories : "-"}</span>
                  <div className="w-full flex-1 flex items-end">
                    <div
                      className={`w-full border-2 border-black transition-all duration-700 ${STATUS_BAR[status]} ${isToday ? "opacity-50" : ""}`}
                      style={{ height: `${Math.max(heightPercent, 2)}%` }}
                    />
                  </div>
                  <span className={`text-[10px] font-black ${isToday ? "text-brand-strong dark:text-brand" : "text-zinc-500"}`}>{day.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Daily Breakdown */}
        <div className="bg-white dark:bg-zinc-900 border-2 border-black dark:border-zinc-300 shadow-md p-6 flex flex-col gap-4 animate-fade-in rounded-none" style={{ animationDelay: "0.25s" }}>
          <h2 className="font-black text-lg text-black dark:text-white">Daily Breakdown</h2>
          <div className="flex flex-col gap-2">
            {WEEKLY_DATA.map((day) => {
              const status = getDayStatus(day);
              const isOver = status === "over";
              const isOnTarget = status === "on-target";
              return (
                <div key={day.label}
                  className={`flex items-center gap-4 p-3.5 border-2 border-black dark:border-zinc-600 hover:shadow-xs hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all rounded-none ${
                    isOver ? "bg-danger-soft" : isOnTarget ? "bg-brand-softer" : "bg-zinc-50 dark:bg-zinc-800"
                  }`}>
                  <div className="w-10 text-center shrink-0">
                    <p className="text-xs font-black text-black dark:text-white">{day.label}</p>
                    <p className="text-[9px] text-zinc-500 font-bold">{day.date.slice(5)}</p>
                  </div>

                  <div className="flex-1 macro-bar border-black/20 dark:border-zinc-700">
                    <div
                      className={`macro-bar-fill ${STATUS_BAR[status]}`}
                      style={{ width: `${Math.min(100, (day.calories / (CALORIE_GOAL * 1.3)) * 100)}%` }}
                    />
                  </div>

                  <div className="flex items-center gap-3 text-[10px] font-mono shrink-0">
                    <span className={`font-black ${STATUS_LABEL[status]}`}>{day.calories > 0 ? `${day.calories} kcal` : "—"}</span>
                    <span className="text-brand-strong dark:text-brand font-bold">{day.protein}g P</span>
                    <span className="text-zinc-500 hidden sm:block">{day.carbs}g C</span>
                    <span className="text-danger hidden sm:block">{day.fat}g F</span>
                  </div>

                  {isOver && <AlertCircle className="h-4 w-4 text-danger shrink-0" />}
                  {isOnTarget && <CheckCircle className="h-4 w-4 text-success shrink-0" />}
                </div>
              );
            })}
          </div>
        </div>

        {/* AI Review */}
        {aiReviewLoading && (
          <div className="bg-brand-softer border-2 border-brand-strong p-8 flex flex-col items-center gap-4 text-center animate-fade-in rounded-none">
            <div className="w-12 h-12 border-4 border-black border-t-brand animate-spin-slow rounded-full" />
            <div>
              <p className="font-black text-black">Generating AI Diet Review...</p>
              <p className="text-xs text-black/60 font-bold mt-1">Analysing your week&rsquo;s data</p>
            </div>
          </div>
        )}

        {aiReview && (
          <div className="bg-white dark:bg-zinc-900 border-2 border-black dark:border-zinc-300 shadow-md p-6 flex flex-col gap-4 animate-bounce-in rounded-none relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-brand" />
            <div className="flex items-center gap-3 mt-1">
              <div className="w-9 h-9 border-2 border-black bg-brand flex items-center justify-center text-black rounded-none">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-black text-base text-black dark:text-white">AI Diet Review</h3>
                <p className="text-[10px] text-zinc-500 font-bold">Generated from your week&rsquo;s logs</p>
              </div>
            </div>

            <div className="flex flex-col gap-4 text-sm leading-relaxed">
              {aiReview.split("\n\n").map((block, i) => {
                const isHeading = block.startsWith("**");
                if (isHeading) {
                  const [heading, ...rest] = block.split("\n");
                  return (
                    <div key={i} className={`p-4 border-2 border-black rounded-none ${
                      i === 0 ? "bg-success-soft border-success" : i === 1 ? "bg-warning-soft border-warning" : "bg-brand-softer border-brand-strong"
                    }`}>
                      <p className={`font-black text-sm mb-2 ${
                        i === 0 ? "text-success-strong" : i === 1 ? "text-warning-strong dark:text-warning" : "text-brand-strong"
                      }`}>{heading.replace(/\*\*/g, "")}</p>
                      {rest.map((line, j) => (
                        <p key={j} className="text-black dark:text-zinc-800 text-xs leading-relaxed font-medium">{line}</p>
                      ))}
                    </div>
                  );
                }
                return <p key={i} className="text-zinc-600 dark:text-zinc-400 text-xs leading-relaxed">{block}</p>;
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
