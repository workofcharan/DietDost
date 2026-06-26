"use client";

import Navbar from "@/components/Navbar";
import { useEffect, useMemo, useState } from "react";
import { 
  Plus, 
  Search, 
  Trash2, 
  Sparkles, 
  Brain,
  MessageSquare,
  X,
  Flame,
  TrendingUp,
  Send,
} from "lucide-react";
import { getUser } from "@/lib/auth";
import type { NutritionFood } from "@/lib/nutrition";

interface MealLog {
  id: string;
  name: string;
  category: "Breakfast" | "Lunch" | "Dinner" | "Snack";
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  quantity: number;
  servingLabel: string;
}

interface AiDish {
  name: string;
  quantity: number;
  servingLabel: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface AiResult {
  dishes: AiDish[];
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

const INITIAL_LOGS: MealLog[] = [
  { id: "1", name: "2 Idlis with Coconut Chutney", category: "Breakfast", calories: 220, protein: 6, carbs: 42, fat: 3, quantity: 1, servingLabel: "1 plate" },
  { id: "2", name: "Masala Chai (with milk & sugar)", category: "Breakfast", calories: 90, protein: 2, carbs: 12, fat: 3, quantity: 1, servingLabel: "1 cup" },
  { id: "3", name: "2 Butter Rotis", category: "Lunch", calories: 240, protein: 6, carbs: 36, fat: 8, quantity: 1, servingLabel: "2 pieces" },
  { id: "4", name: "Dal Tadka", category: "Lunch", calories: 150, protein: 8, carbs: 20, fat: 4, quantity: 1, servingLabel: "1 bowl" },
  { id: "5", name: "Bhindi Masala", category: "Lunch", calories: 120, protein: 3, carbs: 14, fat: 6, quantity: 1, servingLabel: "1 bowl" },
];

const LOG_STORAGE_KEY = "dietdost:meal-logs";

const CATEGORY_COLORS: Record<string, string> = {
  Breakfast: "bg-brand border-black text-black",
  Lunch: "bg-success border-black text-white",
  Dinner: "bg-danger border-black text-white",
  Snack: "bg-warning border-black text-black",
};

const CATEGORY_ACCENT: Record<string, string> = {
  Breakfast: "text-brand-strong",
  Lunch: "text-success",
  Dinner: "text-danger",
  Snack: "text-warning",
};

export default function Dashboard() {
  const [mounted, setMounted] = useState(false);
  const [calorieGoal, setCalorieGoal] = useState(2000);
  const proteinGoal = 75;
  const carbsGoal = 250;
  const fatGoal = 65;

  const [logs, setLogs] = useState<MealLog[]>(INITIAL_LOGS);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<NutritionFood[]>([]);
  const [selectedFood, setSelectedFood] = useState<NutritionFood | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState<"Breakfast" | "Lunch" | "Dinner" | "Snack">("Breakfast");
  const [quantity, setQuantity] = useState(1);

  const [aiInput, setAiInput] = useState("");
  const [isAnalysing, setIsAnalysing] = useState(false);
  const [aiResult, setAiResult] = useState<AiResult | null>(null);

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ sender: "user" | "ai"; text: string }>>([
    { sender: "ai", text: "Namaste! 🙏 I'm your DietDost. Ask me anything about Indian food swaps, recipes, or daily macros." }
  ]);
  const [chatInput, setChatInput] = useState("");

  useEffect(() => {
    setMounted(true);
    const user = getUser();
    if (user?.calorieGoal) setCalorieGoal(user.calorieGoal);
    try {
      const rawLogs = window.localStorage.getItem(LOG_STORAGE_KEY);
      if (rawLogs) setLogs(JSON.parse(rawLogs) as MealLog[]);
    } catch {
      setLogs(INITIAL_LOGS);
    }
  }, []);

  useEffect(() => {
    if (mounted) window.localStorage.setItem(LOG_STORAGE_KEY, JSON.stringify(logs));
  }, [logs, mounted]);

  useEffect(() => {
    const query = searchQuery.trim();
    if (!query) { setSearchResults([]); setIsSearching(false); return; }
    const controller = new AbortController();
    const timeout = window.setTimeout(async () => {
      setIsSearching(true);
      try {
        const response = await fetch(`/api/nutrition/search?q=${encodeURIComponent(query)}`, { signal: controller.signal });
        const data = (await response.json()) as { foods?: NutritionFood[] };
        setSearchResults(data.foods || []);
      } catch {
        if (!controller.signal.aborted) setSearchResults([]);
      } finally {
        if (!controller.signal.aborted) setIsSearching(false);
      }
    }, 500);
    return () => { window.clearTimeout(timeout); controller.abort(); };
  }, [searchQuery]);

  const totals = useMemo(() => logs.reduce((acc, log) => {
    const m = log.quantity;
    return { calories: acc.calories + log.calories * m, protein: acc.protein + log.protein * m, carbs: acc.carbs + log.carbs * m, fat: acc.fat + log.fat * m };
  }, { calories: 0, protein: 0, carbs: 0, fat: 0 }), [logs]);

  const caloriesRemaining = Math.max(0, calorieGoal - totals.calories);
  const caloriePercent = Math.min(100, (totals.calories / calorieGoal) * 100);
  const isOverGoal = totals.calories > calorieGoal;

  const handleAddLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFood) return;
    setLogs([...logs, {
      id: Date.now().toString(), name: selectedFood.name, category: selectedMealType,
      calories: selectedFood.calories, protein: selectedFood.protein, carbs: selectedFood.carbs,
      fat: selectedFood.fat, quantity, servingLabel: selectedFood.servingLabel,
    }]);
    setSearchQuery(""); setSearchResults([]); setSelectedFood(null); setQuantity(1);
  };

  const handleDeleteLog = (id: string) => setLogs(logs.filter(l => l.id !== id));

  const handleAiAnalyse = async () => {
    if (aiInput.trim() === "") return;
    setIsAnalysing(true);
    setAiResult(null);
    try {
      const res = await fetch("/api/ai/analyse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ meal: aiInput }),
      });
      const data = await res.json() as {
        dishes: AiDish[];
        total_calories: number;
        total_protein: number;
        total_carbs: number;
        total_fat: number;
        error?: string;
      };
      if (!res.ok || data.error) throw new Error(data.error || "Analysis failed");
      // Map the API response shape to our internal AiResult shape
      setAiResult({
        dishes: data.dishes.map(d => ({ ...d, quantity: 1 })),
        calories: data.total_calories,
        protein: data.total_protein,
        carbs: data.total_carbs,
        fat: data.total_fat,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "AI analysis failed";
      // Show error as a temporary AI result with an error note
      console.error("[Dashboard AI Analyse]:", msg);
    } finally {
      setIsAnalysing(false);
    }
  };

  const handleAddAiLogs = () => {
    if (!aiResult) return;
    setLogs([...logs, ...aiResult.dishes.map((dish, i) => ({
      id: `${Date.now()}-${i}`, name: dish.name, category: "Breakfast" as const,
      calories: dish.calories, protein: dish.protein, carbs: dish.carbs,
      fat: dish.fat, quantity: dish.quantity, servingLabel: dish.servingLabel
    }))]);
    setAiResult(null); setAiInput("");
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (chatInput.trim() === "") return;
    const userMsg = chatInput.trim();
    setChatMessages(prev => [...prev, { sender: "user", text: userMsg }]);
    setChatInput("");
    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: chatMessages, query: userMsg }),
      });
      const data = await res.json() as { reply?: string; error?: string };
      if (!res.ok || data.error) throw new Error(data.error || "Chat failed");
      setChatMessages(prev => [...prev, { sender: "ai", text: data.reply ?? "" }]);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong.";
      setChatMessages(prev => [...prev, { sender: "ai", text: `⚠️ ${msg}` }]);
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-black border-t-brand animate-spin-slow rounded-full" />
          <p className="font-extrabold text-black dark:text-white uppercase tracking-widest text-xs">Loading DietDost...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-brand selection:text-black pb-24 md:pb-8 page-enter">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 md:px-8 pt-24 md:pt-28 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* ── LEFT COLUMN ── */}
        <div className="lg:col-span-8 flex flex-col gap-8">

          {/* Calorie Ring + Macro Bars */}
          <div className="bg-white dark:bg-zinc-900 border-2 border-black dark:border-zinc-300 shadow-md p-6 md:p-8 flex flex-col md:flex-row gap-8 items-center justify-between rounded-none animate-fade-in">
            {/* Ring */}
            <div className="flex flex-col items-center gap-3 shrink-0">
              <p className="text-xs font-black text-black dark:text-zinc-300 uppercase tracking-widest">Today&rsquo;s Energy</p>
              <div className="relative w-44 h-44 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="88" cy="88" r="76" stroke={isOverGoal ? "#E63946" : "#E5E7EB"} strokeWidth="12" fill="transparent" />
                  <circle
                    cx="88" cy="88" r="76"
                    stroke={isOverGoal ? "#E63946" : "#FFDB33"}
                    strokeWidth="12" fill="transparent"
                    strokeDasharray={2 * Math.PI * 76}
                    strokeDashoffset={2 * Math.PI * 76 * (1 - caloriePercent / 100)}
                    strokeLinecap="butt"
                    style={{ transition: "stroke-dashoffset 1s cubic-bezier(.4,0,.2,1)" }}
                  />
                </svg>
                <div className="absolute flex flex-col items-center text-center">
                  <Flame className={`h-6 w-6 mb-1 ${isOverGoal ? "text-danger animate-pulse" : "text-brand animate-pulse-brand"}`} />
                  <span className="text-2xl font-black font-mono text-black dark:text-white">{Math.round(totals.calories)}</span>
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide">/ {calorieGoal} kcal</span>
                </div>
              </div>
              <div className={`text-center text-xs font-bold px-3 py-1 border-2 border-black ${isOverGoal ? "bg-danger text-white" : "bg-brand-softer text-brand-strong"}`}>
                {isOverGoal ? `⚠ Goal exceeded!` : `${caloriesRemaining} kcal remaining`}
              </div>
            </div>

            {/* Macro bars */}
            <div className="flex-1 w-full flex flex-col gap-5 justify-center">
              <h3 className="text-xs font-black text-black dark:text-zinc-300 uppercase tracking-widest text-center md:text-left">Macronutrient Status</h3>
              {[
                { label: "Protein", val: totals.protein, goal: proteinGoal, color: "bg-brand", textColor: "text-brand-strong dark:text-brand" },
                { label: "Carbohydrates", val: totals.carbs, goal: carbsGoal, color: "bg-zinc-400 dark:bg-zinc-300", textColor: "text-black dark:text-zinc-200" },
                { label: "Fats", val: totals.fat, goal: fatGoal, color: "bg-danger", textColor: "text-danger" },
              ].map(({ label, val, goal, color, textColor }) => (
                <div key={label} className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-black dark:text-zinc-300">{label}</span>
                    <span className="font-mono">
                      <span className={textColor}>{Math.round(val)}g</span>
                      <span className="text-zinc-500"> / {goal}g</span>
                    </span>
                  </div>
                  <div className="macro-bar border-black dark:border-zinc-600">
                    <div className={`macro-bar-fill ${color}`} style={{ width: `${Math.min(100, (val / goal) * 100)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Food Search */}
          <div className="flex flex-col gap-3 relative">
            <h3 className="text-lg font-black text-black dark:text-white uppercase tracking-wide">Search Indian Foods</h3>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500" />
              <input
                type="text"
                placeholder="Search Dosa, Paratha, Biryani, Samosa..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-zinc-900 border-2 border-black dark:border-zinc-300 focus:border-brand dark:focus:border-brand shadow-xs focus:shadow-sm rounded-none text-sm transition-all outline-none text-black dark:text-white placeholder:text-zinc-500"
              />
            </div>

            {isSearching && (
              <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
                {[1,2,3].map(i => <div key={i} className="skeleton-brutal h-14" />)}
              </div>
            )}

            {!isSearching && searchResults.length > 0 && (
              <div className="absolute top-[100px] left-0 right-0 max-h-64 overflow-y-auto bg-white dark:bg-zinc-900 border-2 border-black dark:border-zinc-300 shadow-lg z-40 flex flex-col rounded-none animate-fade-in">
                {searchResults.map((food) => (
                  <button
                    key={food.name}
                    onClick={() => setSelectedFood(food)}
                    className="flex justify-between items-center px-4 py-3 hover:bg-brand/10 dark:hover:bg-brand/5 transition-colors text-left w-full cursor-pointer border-b border-black/10 dark:border-zinc-700 last:border-0 group"
                  >
                    <div>
                      <p className="font-bold text-sm text-black dark:text-zinc-200 group-hover:text-brand-strong dark:group-hover:text-brand">{food.name}</p>
                      <p className="text-[10px] text-zinc-500 font-medium mt-0.5">
                        Serving: {food.servingLabel} · {food.source === "open-food-facts" ? "Open Food Facts" : "Curated"}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono font-bold text-zinc-600 dark:text-zinc-400">{food.calories} kcal</span>
                      <div className="w-7 h-7 border-2 border-black bg-brand/10 flex items-center justify-center text-brand-strong group-hover:bg-brand group-hover:text-black transition-all rounded-none">
                        <Plus className="h-4 w-4" />
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Add Log Modal */}
          {selectedFood && (
            <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in">
              <div className="bg-white dark:bg-zinc-900 border-2 border-black dark:border-zinc-300 shadow-xl max-w-md w-full p-6 relative animate-bounce-in rounded-none">
                <button onClick={() => setSelectedFood(null)} className="absolute right-4 top-4 text-zinc-500 hover:text-black dark:hover:text-white transition-colors border border-zinc-300 p-1 rounded-none hover:border-black">
                  <X className="h-4 w-4" />
                </button>
                <div className="inline-block bg-brand border-2 border-black px-2 py-0.5 text-xs font-black uppercase tracking-wider text-black mb-3">Add to Log</div>
                <h3 className="text-xl font-black text-black dark:text-white mb-5">{selectedFood.name}</h3>
                <form onSubmit={handleAddLog} className="flex flex-col gap-5">
                  {/* Meal Type */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-black text-black dark:text-zinc-300 uppercase tracking-wider">Meal Category</label>
                    <div className="grid grid-cols-4 gap-2">
                      {(["Breakfast","Lunch","Dinner","Snack"] as const).map((m) => (
                        <button key={m} type="button" onClick={() => setSelectedMealType(m)}
                          className={`py-2 text-[11px] font-extrabold border-2 transition-all cursor-pointer rounded-none ${
                            selectedMealType === m
                              ? `${CATEGORY_COLORS[m]} shadow-xs`
                              : "bg-white dark:bg-zinc-900 border-black dark:border-zinc-300 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                          }`}>
                          {m}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Quantity */}
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center text-xs font-black uppercase tracking-wider text-black dark:text-zinc-300">
                      <span>Quantity</span>
                      <span className="font-mono text-brand-strong dark:text-brand">{quantity}x ({selectedFood.servingLabel})</span>
                    </div>
                    <input type="range" min="0.5" max="4" step="0.5" value={quantity}
                      onChange={(e) => setQuantity(parseFloat(e.target.value))}
                      className="w-full accent-brand bg-zinc-200 dark:bg-zinc-700 h-2 outline-none cursor-pointer" />
                    <div className="flex justify-between text-[10px] text-zinc-500 font-bold px-0.5">
                      {["0.5x","1.0x","2.0x","3.0x","4.0x"].map(s => <span key={s}>{s}</span>)}
                    </div>
                  </div>

                  {/* Nutrition Preview */}
                  <div className="p-4 bg-brand-softer border-2 border-brand-strong dark:border-brand rounded-none">
                    <p className="text-xs text-brand-strong font-black uppercase tracking-wider mb-3">Estimated Nutrients</p>
                    <div className="grid grid-cols-4 gap-2 text-center">
                      {[
                        { label: "Calories", val: `${Math.round(selectedFood.calories * quantity)} kcal`, cls: "text-black dark:text-white" },
                        { label: "Protein", val: `${Math.round(selectedFood.protein * quantity)}g`, cls: "text-brand-strong" },
                        { label: "Carbs", val: `${Math.round(selectedFood.carbs * quantity)}g`, cls: "text-black dark:text-zinc-300" },
                        { label: "Fats", val: `${Math.round(selectedFood.fat * quantity)}g`, cls: "text-danger" },
                      ].map(({ label, val, cls }) => (
                        <div key={label}>
                          <p className="text-[10px] text-zinc-600 font-bold">{label}</p>
                          <p className={`text-sm font-black font-mono mt-0.5 ${cls}`}>{val}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button type="submit"
                    className="w-full py-3 bg-brand hover:bg-brand-strong text-black font-extrabold border-2 border-black shadow-sm hover:shadow-md active:shadow-2xs hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 rounded-none transition-all cursor-pointer">
                    Confirm & Add to Log
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Today's Logs */}
          <div className="flex flex-col gap-4 text-left animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-black dark:text-white uppercase tracking-wide">Today&rsquo;s Food Logs</h3>
              <span className="text-xs font-bold text-zinc-500">{logs.length} items · {Math.round(totals.calories)} kcal total</span>
            </div>
            <div className="flex flex-col gap-5">
              {(["Breakfast","Lunch","Dinner","Snack"] as const).map((category) => {
                const categoryLogs = logs.filter(l => l.category === category);
                const catTotal = categoryLogs.reduce((a, l) => a + l.calories * l.quantity, 0);
                return (
                  <div key={category} className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <div className={`px-2 py-0.5 border-2 border-black text-[10px] font-black uppercase tracking-wider ${CATEGORY_COLORS[category]}`}>{category}</div>
                      {catTotal > 0 && <span className={`text-xs font-bold ${CATEGORY_ACCENT[category]}`}>{Math.round(catTotal)} kcal</span>}
                    </div>
                    {categoryLogs.length === 0 ? (
                      <div className="p-4 border-2 border-dashed border-zinc-300 dark:border-zinc-700 text-center text-xs text-zinc-500 font-bold">
                        No items logged for {category.toLowerCase()}
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2">
                        {categoryLogs.map((log) => (
                          <div key={log.id}
                            className="flex justify-between items-center p-4 bg-white dark:bg-zinc-900 border-2 border-black dark:border-zinc-300 shadow-xs hover:shadow-sm hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all group rounded-none animate-fade-in">
                            <div className="flex-1">
                              <p className="font-extrabold text-sm text-black dark:text-white">{log.name}</p>
                              <p className="text-[10px] text-zinc-500 font-medium mt-0.5">
                                {log.quantity}x ({log.servingLabel}) &middot; P: {Math.round(log.protein * log.quantity)}g | C: {Math.round(log.carbs * log.quantity)}g | F: {Math.round(log.fat * log.quantity)}g
                              </p>
                            </div>
                            <div className="flex items-center gap-4">
                              <span className="text-sm font-black font-mono text-black dark:text-white">{Math.round(log.calories * log.quantity)} kcal</span>
                              <button onClick={() => handleDeleteLog(log.id)}
                                className="text-zinc-400 hover:text-danger hover:border-danger border border-transparent p-1 transition-all rounded-none cursor-pointer">
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── RIGHT COLUMN ── */}
        <div className="lg:col-span-4 flex flex-col gap-6">

          {/* AI Meal Analyser */}
          <div className="bg-white dark:bg-zinc-900 border-2 border-black dark:border-zinc-300 shadow-md p-6 flex flex-col gap-4 relative overflow-hidden animate-fade-in rounded-none" style={{ animationDelay: "0.15s" }}>
            {/* Brand accent strip */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-brand" />
            <div className="flex items-center gap-3 mt-1">
              <div className="w-9 h-9 border-2 border-black bg-brand flex items-center justify-center text-black rounded-none">
                <Brain className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-black text-base text-black dark:text-white leading-none">AI Meal Analyser</h3>
                <p className="text-[10px] text-zinc-500 font-bold mt-0.5">Describe any Indian meal</p>
              </div>
            </div>

            <textarea
              placeholder="e.g. 2 cups of tea, 1 plate of poha, and a banana..."
              value={aiInput}
              onChange={(e) => setAiInput(e.target.value)}
              rows={3}
              className="w-full p-3 bg-zinc-50 dark:bg-zinc-800 border-2 border-black dark:border-zinc-300 focus:border-brand focus:shadow-xs rounded-none text-xs transition-all outline-none text-black dark:text-white placeholder:text-zinc-400 resize-none leading-relaxed"
            />

            <button
              onClick={handleAiAnalyse}
              disabled={isAnalysing || aiInput.trim() === ""}
              className="flex items-center justify-center gap-2 py-3 bg-brand hover:bg-brand-strong text-black font-extrabold border-2 border-black shadow-sm hover:shadow-md active:shadow-2xs hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 rounded-none transition-all text-xs cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAnalysing ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent animate-spin-slow rounded-full" />
                  Analysing...
                </>
              ) : (
                <><Sparkles className="h-4 w-4" />Analyse Meal Log</>
              )}
            </button>

            {aiResult && (
              <div className="mt-1 p-4 bg-brand-softer border-2 border-brand-strong flex flex-col gap-3 animate-slide-up rounded-none">
                <div className="flex justify-between items-center text-xs border-b-2 border-brand-strong/30 pb-2">
                  <span className="font-extrabold text-black uppercase tracking-wider">Detected Items</span>
                  <span className="font-black font-mono text-brand-strong">{aiResult.calories} kcal</span>
                </div>
                <div className="flex flex-col gap-1.5">
                  {aiResult.dishes.map((dish, i) => (
                    <div key={i} className="flex justify-between text-xs">
                      <span className="font-bold text-black">{dish.name}</span>
                      <span className="text-zinc-600 font-mono">{dish.calories} kcal</span>
                    </div>
                  ))}
                </div>
                <button onClick={handleAddAiLogs}
                  className="w-full py-2 bg-brand-strong border-2 border-black text-black font-extrabold text-[11px] hover:bg-brand transition-all hover:shadow-xs cursor-pointer rounded-none">
                  + Add all to Today&rsquo;s Log
                </button>
              </div>
            )}
          </div>

          {/* Diagnostics card */}
          <div className="bg-white dark:bg-zinc-900 border-2 border-black dark:border-zinc-300 shadow-md p-6 flex flex-col gap-4 animate-fade-in rounded-none" style={{ animationDelay: "0.2s" }}>
            <div className="absolute top-0 left-0 right-0 h-1 bg-success" />
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 border-2 border-black bg-success/10 flex items-center justify-center text-success rounded-none">
                <TrendingUp className="h-5 w-5" />
              </div>
              <h3 className="font-black text-base text-black dark:text-white">Diagnostics</h3>
            </div>
            <div className="flex flex-col gap-2 text-xs">
              {[
                { label: "Target Diet Goal", val: "Weight Maintenance", valCls: "text-brand-strong dark:text-brand" },
                { label: "TDEE Calculated", val: `${calorieGoal} kcal / day`, valCls: "text-black dark:text-white" },
                { label: "Logged today", val: `${logs.length} items`, valCls: "text-success" },
                { label: "Protein coverage", val: `${Math.round((totals.protein / proteinGoal) * 100)}%`, valCls: totals.protein >= proteinGoal ? "text-success" : "text-warning" },
              ].map(({ label, val, valCls }) => (
                <div key={label} className="flex justify-between items-center p-2.5 bg-zinc-50 dark:bg-zinc-800 border-2 border-black dark:border-zinc-600">
                  <span className="text-zinc-500 font-bold">{label}</span>
                  <span className={`font-extrabold ${valCls}`}>{val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Chat button */}
          <button
            onClick={() => setIsChatOpen(true)}
            className="flex items-center justify-center gap-3 w-full py-4 bg-black dark:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-100 border-2 border-black dark:border-white text-white dark:text-black font-extrabold shadow-md hover:shadow-lg active:shadow-xs hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 rounded-none transition-all cursor-pointer animate-pulse-brand"
          >
            <MessageSquare className="h-5 w-5" />
            Chat with DietDost AI
          </button>
        </div>
      </main>

      {/* ── CHATBOT DRAWER ── */}
      {isChatOpen && (
        <div className="fixed inset-0 bg-black/70 z-50 flex justify-end animate-fade-in">
          <div className="w-full max-w-md h-full bg-white dark:bg-zinc-950 border-l-2 border-black dark:border-zinc-300 flex flex-col shadow-xl animate-slide-in-right">
            <div className="p-4 border-b-2 border-black dark:border-zinc-300 bg-brand flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 border-2 border-black bg-black flex items-center justify-center text-brand rounded-none">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-black text-sm text-black">DietDost Assistant</h3>
                  <p className="text-[10px] text-black/70 font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-success inline-block animate-ping" />online
                  </p>
                </div>
              </div>
              <button onClick={() => setIsChatOpen(false)} className="text-black/60 hover:text-black transition-colors border border-black/30 hover:border-black p-1 rounded-none">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 bg-zinc-50 dark:bg-zinc-900">
              {chatMessages.map((msg, i) => (
                <div key={i} className={`flex flex-col max-w-[85%] p-3 text-xs leading-relaxed rounded-none border-2 animate-fade-in ${
                  msg.sender === "user"
                    ? "bg-brand border-black text-black self-end font-bold"
                    : "bg-white dark:bg-zinc-800 border-black dark:border-zinc-600 text-black dark:text-zinc-200 self-start"
                }`}>
                  <p className="whitespace-pre-line">{msg.text}</p>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendMessage} className="p-4 border-t-2 border-black dark:border-zinc-300 bg-white dark:bg-zinc-950 flex gap-2">
              <input
                type="text"
                placeholder="Ask about samosas, paneer protein, biryani..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="flex-1 px-4 py-3 bg-zinc-50 dark:bg-zinc-900 border-2 border-black dark:border-zinc-300 focus:border-brand shadow-xs focus:shadow-sm rounded-none text-xs transition-all outline-none text-black dark:text-white placeholder:text-zinc-500"
              />
              <button type="submit"
                className="px-4 py-3 bg-brand hover:bg-brand-strong text-black font-extrabold border-2 border-black shadow-xs hover:shadow-sm active:shadow-2xs hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 rounded-none text-xs transition-all cursor-pointer">
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
