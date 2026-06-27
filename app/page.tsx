"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import BrandLogo from "@/components/BrandLogo";
import { 
  ArrowRight, 
  Sparkles, 
  Search, 
  Brain, 
  UtensilsCrossed, 
  PieChart, 
  Zap, 
  ChevronRight
} from "lucide-react";
import { useState } from "react";

export default function Home() {
  const [hoveredDish, setHoveredDish] = useState<string | null>(null);

  const dishes = [
    { name: "Butter Paneer", calories: 320, macros: "P: 12g | C: 8g | F: 26g", x: "30%", y: "35%" },
    { name: "2 Butter Rotis", calories: 240, macros: "P: 6g | C: 36g | F: 8g", x: "70%", y: "45%" },
    { name: "Dal Tadka", calories: 150, macros: "P: 8g | C: 20g | F: 4g", x: "45%", y: "70%" },
    { name: "Jeera Rice", calories: 180, macros: "P: 3g | C: 38g | F: 1g", x: "55%", y: "25%" },
    { name: "Boondi Raita", calories: 110, macros: "P: 4g | C: 8g | F: 7g", x: "25%", y: "60%" },
  ];

  return (
    <div className="min-h-screen bg-neutral-secondary-soft dark:bg-zinc-950 text-black dark:text-white font-sans selection:bg-brand selection:text-black pb-16 md:pb-0">
      <Navbar />

      {/* Hero Section */}
      <main className="pt-24 md:pt-36 px-6 md:px-8 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Text Content */}
        <div className="lg:col-span-7 flex flex-col gap-6 text-left animate-slide-up">
          <div className="inline-flex items-center gap-2 px-3 py-1 text-xs font-extrabold tracking-wider text-brand-strong dark:text-brand bg-brand-softer dark:bg-brand-soft border-2 border-brand-strong dark:border-brand rounded-none w-fit">
            <Sparkles className="h-3.5 w-3.5" />
            AI-POWERED & LOCALISED
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black leading-none tracking-tight">
            Built for the <span className="text-brand-strong dark:text-brand italic font-extrabold">Thali</span>, not the burger bowl
          </h1>
          
          <p className="text-zinc-600 dark:text-zinc-400 text-base md:text-lg max-w-xl leading-relaxed">
            Most trackers fail when you log home-cooked Indian food. 
            <strong className="text-black dark:text-white"> DietDost</strong> understands portion labels like 
            <span className="text-brand-strong dark:text-brand font-bold"> &ldquo;1 katori dal&rdquo;</span> or 
            <span className="text-brand-strong dark:text-brand font-bold"> &ldquo;2 rotis&rdquo;</span>, uses public nutrition data,
            and keeps AI for conversational meal parsing.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-2">
            <Link
              href="/dashboard"
              className="flex items-center justify-center gap-2 px-6 py-3.5 text-base font-extrabold bg-brand hover:bg-brand-strong text-black border-2 border-black dark:border-zinc-300 shadow-sm hover:shadow-md active:shadow-2xs hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 rounded-none transition-all group cursor-pointer"
            >
              Start Logging Free
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/auth/signup"
              className="flex items-center justify-center gap-2 px-6 py-3.5 text-base font-extrabold bg-white hover:bg-zinc-100 dark:bg-zinc-900 dark:hover:bg-zinc-800 border-2 border-black dark:border-zinc-300 text-black dark:text-white shadow-sm hover:shadow-md active:shadow-2xs hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 rounded-none transition-all cursor-pointer"
            >
              Sign Up
            </Link>
          </div>

          {/* Social Proof / Stats */}
          <div className="grid grid-cols-3 gap-6 pt-8 border-t-2 border-black dark:border-zinc-700 mt-4">
            <div>
              <p className="text-2xl font-black text-black dark:text-white">100+</p>
              <p className="text-xs text-zinc-500 uppercase tracking-wider font-bold">Indian Dishes</p>
            </div>
            <div>
              <p className="text-2xl font-black text-black dark:text-white">3x</p>
              <p className="text-xs text-zinc-500 uppercase tracking-wider font-bold">AI Assistant Tools</p>
            </div>
            <div>
              <p className="text-2xl font-black text-black dark:text-white">100%</p>
              <p className="text-xs text-zinc-500 uppercase tracking-wider font-bold">Data Privacy</p>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Thali Demo */}
        <div className="lg:col-span-5 flex justify-center animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="relative w-[88vw] max-w-[430px] aspect-square rounded-full border-[3px] border-black dark:border-brand bg-white dark:bg-[#23202d] flex items-center justify-center shadow-md dark:shadow-[4px_4px_0_0_#FFE45E] overflow-hidden group">
            {/* Background grid lines */}
            <div className="absolute inset-0 bg-[radial-gradient(rgba(0,0,0,0.04)_1px,transparent_1px)] dark:bg-[radial-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>
            
            {/* Outer steel rim circle */}
            <div className="absolute inset-4 rounded-full border-2 border-black dark:border-zinc-500/70 flex items-center justify-center">
              <div className="absolute inset-8 rounded-full border border-dashed border-black/50 dark:border-brand/30 flex items-center justify-center">
                {/* Center Core Next.js logo block */}
                <div className="w-24 h-24 rounded-full bg-white dark:bg-[#101017] border-2 border-black dark:border-brand flex flex-col items-center justify-center z-20 text-center p-2 shadow-xs">
                  <span className="text-[9px] text-zinc-500 font-mono tracking-wider font-bold">NEXT.JS</span>
                  <span className="text-[11px] text-brand-strong dark:text-brand font-black leading-none">DietDost</span>
                </div>
              </div>
            </div>

            {/* Interactive Dish Nodes inside the Plate */}
            {dishes.map((dish) => (
              <button
                key={dish.name}
                onMouseEnter={() => setHoveredDish(dish.name)}
                onMouseLeave={() => setHoveredDish(null)}
                className={`absolute w-14 h-14 rounded-full flex items-center justify-center transition-all duration-100 z-30 cursor-pointer ${
                  hoveredDish === dish.name 
                    ? "bg-brand text-black scale-125 border-2 border-black" 
                    : "bg-brand-softer dark:bg-[#393346] hover:bg-brand text-black dark:text-white border-2 border-black dark:border-zinc-400"
                }`}
                style={{ top: dish.y, left: dish.x, transform: "translate(-50%, -50%)" }}
              >
                <UtensilsCrossed className="h-5 w-5" />
              </button>
            ))}

            {/* Hover Card Overlay inside the Plate */}
            {hoveredDish && (
              <div className="absolute z-40 bottom-8 left-8 right-8 p-4 bg-brand border-2 border-black text-left shadow-sm animate-slide-up rounded-none">
                {dishes
                  .filter((d) => d.name === hoveredDish)
                  .map((d) => (
                    <div key={d.name} className="text-black">
                      <h4 className="font-extrabold text-sm">{d.name}</h4>
                      <div className="flex items-center justify-between mt-1 text-xs font-bold">
                        <span>{d.calories} kcal</span>
                        <span className="font-mono">{d.macros}</span>
                      </div>
                    </div>
                  ))}
              </div>
            )}

            {/* Default Instruction overlay */}
            {!hoveredDish && (
              <div className="absolute z-20 bottom-8 left-12 right-12 text-center bg-white/95 dark:bg-[#101017] border-2 border-black dark:border-zinc-400 py-2 px-4 rounded-none shadow-xs">
                <p className="text-[11px] text-black dark:text-zinc-400 font-bold uppercase tracking-wider">
                  Hover thali items to inspect
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Feature Section */}
      <section className="py-24 px-6 md:px-8 max-w-7xl mx-auto border-t-2 border-black dark:border-zinc-800 mt-20">
        <div className="text-center max-w-3xl mx-auto flex flex-col gap-4">
          <h2 className="text-3xl md:text-5xl font-black tracking-tight">
            How DietDost Redefines Calorie Tracking
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 text-base md:text-lg">
            A standard application doesn&rsquo;t know the calories in a paratha. 
            DietDost makes Indian diet logging visual, conversational, and highly personalized.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          {/* Card 1: Curated Database */}
          <div className="p-6 bg-white dark:bg-zinc-900 border-2 border-black dark:border-zinc-300 shadow-md hover:shadow-lg transition-all hover:-translate-x-1 hover:-translate-y-1 active:translate-x-0.5 active:translate-y-0.5 rounded-none text-left relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-brand/5 rounded-full pointer-events-none group-hover:bg-brand/10 transition-colors"></div>
            <div className="w-12 h-12 border-2 border-black bg-brand/10 flex items-center justify-center text-brand-strong dark:text-brand mb-6 rounded-none">
              <Search className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-extrabold mb-3 text-black dark:text-white">Desi Food Database</h3>
            <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
              Over 100 regional Indian recipes (Dosa, Rajma, Poha, Biryani) with localized serving measurements. Log items in terms of bowls or counts easily.
            </p>
            <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-strong dark:text-brand mt-6 group-hover:underline">
              Log from the food database <ChevronRight className="h-3 w-3" />
            </Link>
          </div>

          {/* Card 2: AI Meal Analyser */}
          <div className="p-6 bg-white dark:bg-zinc-900 border-2 border-black dark:border-zinc-300 shadow-md hover:shadow-lg transition-all hover:-translate-x-1 hover:-translate-y-1 active:translate-x-0.5 active:translate-y-0.5 rounded-none text-left relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-brand/5 rounded-full pointer-events-none group-hover:bg-brand/10 transition-colors"></div>
            <div className="w-12 h-12 border-2 border-black bg-brand/10 flex items-center justify-center text-brand-strong dark:text-brand mb-6 rounded-none">
              <Brain className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-extrabold mb-3 text-black dark:text-white">AI Meal Analyser</h3>
            <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
              No repetitive lookup required. Search public nutrition data first, then use AI only when a meal needs conversational parsing.
            </p>
            <Link href="/ai" className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-strong dark:text-brand mt-6 group-hover:underline">
              Try AI Analyser <ChevronRight className="h-3 w-3" />
            </Link>
          </div>

          {/* Card 3: Diet Review & Reports */}
          <div className="p-6 bg-white dark:bg-zinc-900 border-2 border-black dark:border-zinc-300 shadow-md hover:shadow-lg transition-all hover:-translate-x-1 hover:-translate-y-1 active:translate-x-0.5 active:translate-y-0.5 rounded-none text-left relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-brand/5 rounded-full pointer-events-none group-hover:bg-brand/10 transition-colors"></div>
            <div className="w-12 h-12 border-2 border-black bg-brand/10 flex items-center justify-center text-brand-strong dark:text-brand mb-6 rounded-none">
              <PieChart className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-extrabold mb-3 text-black dark:text-white">Goal-Aware Dashboards</h3>
            <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
              Track weight changes, calorie intake trends, and macronutrient balances with responsive charts. Get a weekly summary detailing your successes.
            </p>
            <Link href="/review" className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-strong dark:text-brand mt-6 group-hover:underline">
              View Weekly Review <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </section>

      {/* AI Assistant Banner */}
      <section className="px-6 md:px-8 max-w-7xl mx-auto my-12">
        <div className="p-8 md:p-12 bg-white dark:bg-zinc-900 border-2 border-black dark:border-zinc-300 shadow-lg text-left flex flex-col md:flex-row gap-8 items-center justify-between rounded-none">
          <div className="flex flex-col gap-4 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-bold uppercase text-brand-strong dark:text-brand tracking-wider">
              <Zap className="h-4 w-4 fill-brand" />
              NUTRITION CHATBOT INCLUDED
            </div>
            <h3 className="text-2xl md:text-4xl font-black text-black dark:text-white">
              Chat with an Expert in Desi Nutrition
            </h3>
            <p className="text-zinc-600 dark:text-zinc-400 text-sm md:text-base leading-relaxed">
              Need a healthier replacement for samosas? Curious about the protein content of paneer vs tofu? Our chatbot is tuned to regional Indian culinary habits and suggests custom local alternatives.
            </p>
          </div>

          <Link
            href="/ai"
            className="flex items-center justify-center gap-2 px-6 py-3.5 bg-brand hover:bg-brand-strong text-black font-extrabold border-2 border-black dark:border-zinc-300 shadow-sm hover:shadow-md active:shadow-2xs hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 rounded-none transition-all whitespace-nowrap cursor-pointer"
          >
            Chat with AI Dost
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Academic Project Footer */}
      <footer className="bg-white dark:bg-zinc-950 border-t-2 border-black dark:border-zinc-800 py-12 px-6 md:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <BrandLogo size="sm" />

          <div className="flex flex-col md:items-end gap-1 text-xs text-zinc-500">
            <p>DietDost v1.0 &middot; Solo Project &middot; 5th Semester</p>
            <p>Loyola Academy &middot; Stack: Next.js &middot; Public nutrition API &middot; Local session storage</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
