"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
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
    <div className="min-h-screen bg-zinc-950 text-white font-sans selection:bg-amber-500 selection:text-black pb-16 md:pb-0">
      <Navbar />

      {/* Hero Section */}
      <main className="pt-24 md:pt-36 px-6 md:px-8 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Text Content */}
        <div className="lg:col-span-7 flex flex-col gap-6 text-left animate-slide-up">
          <div className="inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold tracking-wider text-amber-500 uppercase bg-amber-500/10 rounded-full w-fit">
            <Sparkles className="h-3.5 w-3.5" />
            AI-Powered & Localised
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold leading-none tracking-tight font-serif">
            Built for the <span className="text-amber-500 italic">Thali</span>, not the burger bowl
          </h1>
          
          <p className="text-zinc-400 text-base md:text-lg max-w-xl leading-relaxed">
            Most trackers fail when you log home-cooked Indian food. 
            <strong className="text-zinc-200"> DietDost</strong> understands portion labels like 
            <span className="text-amber-500 font-medium"> &ldquo;1 katori dal&rdquo;</span> or 
            <span className="text-amber-500 font-medium"> &ldquo;2 rotis&rdquo;</span>, and uses Gemini AI 
            to analyze your meals instantly.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-2">
            <Link
              href="/dashboard"
              className="flex items-center justify-center gap-2 px-6 py-3.5 text-base font-semibold bg-amber-500 hover:bg-amber-600 text-zinc-950 rounded-xl transition-all shadow-lg hover:shadow-amber-500/10 group"
            >
              Start Logging Free
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/auth/signup"
              className="flex items-center justify-center gap-2 px-6 py-3.5 text-base font-semibold bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-white rounded-xl transition-colors"
            >
              Sign Up
            </Link>
          </div>

          {/* Social Proof / Stats */}
          <div className="grid grid-cols-3 gap-6 pt-8 border-t border-zinc-900 mt-4">
            <div>
              <p className="text-2xl font-bold text-white font-serif">100+</p>
              <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">Indian Dishes</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-white font-serif">3x</p>
              <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">AI Assistant Tools</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-white font-serif">100%</p>
              <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">Data Privacy</p>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Thali Demo */}
        <div className="lg:col-span-5 flex justify-center animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="relative w-80 h-80 md:w-[400px] md:h-[400px] rounded-full border border-zinc-800 bg-zinc-900/40 backdrop-blur-xl flex items-center justify-center shadow-2xl overflow-hidden group">
            {/* Background grid lines */}
            <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>
            
            {/* Outer steel rim circle */}
            <div className="absolute inset-4 rounded-full border-2 border-zinc-700/50 flex items-center justify-center">
              <div className="absolute inset-6 rounded-full border border-dashed border-zinc-800 flex items-center justify-center">
                {/* Center Core Next.js logo block */}
                <div className="w-20 h-20 rounded-full bg-black/90 border border-zinc-800 flex flex-col items-center justify-center z-20 text-center p-2">
                  <span className="text-[10px] text-zinc-500 font-mono tracking-wider font-bold">NEXT.JS</span>
                  <span className="text-[11px] text-amber-500 font-serif font-bold leading-none">DietDost</span>
                </div>
              </div>
            </div>

            {/* Interactive Dish Nodes inside the Plate */}
            {dishes.map((dish) => (
              <button
                key={dish.name}
                onMouseEnter={() => setHoveredDish(dish.name)}
                onMouseLeave={() => setHoveredDish(null)}
                className={`absolute w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 z-30 cursor-pointer ${
                  hoveredDish === dish.name 
                    ? "bg-amber-500 text-zinc-950 scale-125 border-4 border-amber-500/20" 
                    : "bg-zinc-850 hover:bg-zinc-800 text-zinc-300 border border-zinc-750"
                }`}
                style={{ top: dish.y, left: dish.x }}
              >
                <UtensilsCrossed className="h-5 w-5" />
              </button>
            ))}

            {/* Hover Card Overlay inside the Plate */}
            {hoveredDish && (
              <div className="absolute z-40 bottom-6 left-6 right-6 p-4 rounded-xl glass-card text-left border border-amber-500/20 animate-slide-up">
                {dishes
                  .filter((d) => d.name === hoveredDish)
                  .map((d) => (
                    <div key={d.name}>
                      <h4 className="font-serif font-bold text-amber-500 text-sm">{d.name}</h4>
                      <div className="flex items-center justify-between mt-1 text-xs">
                        <span className="text-white font-bold">{d.calories} kcal</span>
                        <span className="text-zinc-400 font-mono">{d.macros}</span>
                      </div>
                    </div>
                  ))}
              </div>
            )}

            {/* Default Instruction overlay */}
            {!hoveredDish && (
              <div className="absolute z-20 bottom-6 left-6 right-6 text-center bg-black/60 backdrop-blur-md py-2 px-4 rounded-lg border border-zinc-800/80">
                <p className="text-xs text-zinc-400 font-medium">
                  Hover over the thali items to inspect nutrients
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Feature Section */}
      <section className="py-24 px-6 md:px-8 max-w-7xl mx-auto border-t border-zinc-900 mt-20">
        <div className="text-center max-w-3xl mx-auto flex flex-col gap-4">
          <h2 className="text-3xl md:text-5xl font-bold font-serif tracking-tight">
            How DietDost Redefines Calorie Tracking
          </h2>
          <p className="text-zinc-400 text-base md:text-lg">
            A standard application doesn&rsquo;t know the calories in a paratha. 
            DietDost makes Indian diet logging visual, conversational, and highly personalized.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          {/* Card 1: Curated Database */}
          <div className="p-6 rounded-2xl glass-card text-left relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-amber-500/10 transition-colors"></div>
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 mb-6">
              <Search className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold font-serif mb-3 text-white">Desi Food Database</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Over 100 regional Indian recipes (Dosa, Rajma, Poha, Biryani) with localized serving measurements. Log items in terms of bowls or counts easily.
            </p>
            <Link href="/food" className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-500 mt-6 group-hover:underline">
              Search Food Database <ChevronRight className="h-3 w-3" />
            </Link>
          </div>

          {/* Card 2: AI Meal Analyser */}
          <div className="p-6 rounded-2xl glass-card text-left relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-emerald-500/10 transition-colors"></div>
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-6">
              <Brain className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold font-serif mb-3 text-white">AI Meal Analyser</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              No searching required. Just type &ldquo;I had 2 rotis with a small bowl of paneer and cucumber salad&rdquo; and let Gemini extract nutrition details.
            </p>
            <Link href="/ai" className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-500 mt-6 group-hover:underline">
              Try AI Analyser <ChevronRight className="h-3 w-3" />
            </Link>
          </div>

          {/* Card 3: Diet Review & Reports */}
          <div className="p-6 rounded-2xl glass-card text-left relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-amber-500/10 transition-colors"></div>
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 mb-6">
              <PieChart className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold font-serif mb-3 text-white">Goal-Aware Dashboards</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Track weight changes, calorie intake trends, and macronutrient balances with responsive charts. Get a weekly summary detailing your successes.
            </p>
            <Link href="/review" className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-500 mt-6 group-hover:underline">
              View Weekly Review <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </section>

      {/* AI Assistant Banner */}
      <section className="px-6 md:px-8 max-w-7xl mx-auto my-12">
        <div className="p-8 md:p-12 rounded-3xl relative overflow-hidden bg-gradient-to-r from-zinc-900 to-zinc-950 border border-zinc-800 text-left flex flex-col md:flex-row gap-8 items-center justify-between">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[300px] rounded-full bg-amber-500/5 blur-3xl pointer-events-none"></div>
          
          <div className="flex flex-col gap-4 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-bold uppercase text-amber-500 tracking-wider">
              <Zap className="h-4 w-4 fill-amber-500" />
              nutrition chatbot included
            </div>
            <h3 className="text-2xl md:text-4xl font-bold font-serif text-white">
              Chat with an Expert in Desi Nutrition
            </h3>
            <p className="text-zinc-450 text-sm md:text-base leading-relaxed">
              Need a healthier replacement for samosas? Curious about the protein content of paneer vs tofu? Our chatbot is tuned to regional Indian culinary habits and suggests custom local alternatives.
            </p>
          </div>

          <Link
            href="/ai"
            className="flex items-center justify-center gap-2 px-6 py-3.5 bg-white text-zinc-950 font-bold rounded-xl hover:bg-zinc-200 transition-colors whitespace-nowrap"
          >
            Chat with AI Dost
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Academic Project Footer */}
      <footer className="bg-zinc-950 border-t border-zinc-900 py-12 px-6 md:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <UtensilsCrossed className="h-5 w-5 text-amber-500" />
            <span className="font-serif font-bold text-lg">DietDost</span>
          </div>

          <div className="flex flex-col md:items-end gap-1 text-xs text-zinc-500">
            <p>DietDost v1.0 &middot; Solo Project &middot; 5th Semester</p>
            <p>Loyola Academy &middot; Stack: Next.js &middot; Supabase &middot; Gemini API</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
