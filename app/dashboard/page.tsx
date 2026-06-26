"use client";

import Navbar from "@/components/Navbar";
import { useState, useMemo } from "react";
import { 
  Plus, 
  Search, 
  Trash2, 
  Sparkles, 
  Brain,
  MessageSquare,
  X,
  Flame,
  Scale
} from "lucide-react";

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

const FOOD_DATABASE = [
  { name: "Masala Dosa", calories: 350, protein: 7, carbs: 54, fat: 12, servingLabel: "1 plate" },
  { name: "Paneer Butter Masala", calories: 380, protein: 14, carbs: 10, fat: 32, servingLabel: "1 bowl" },
  { name: "Veg Biryani", calories: 420, protein: 8, carbs: 70, fat: 12, servingLabel: "1 plate" },
  { name: "Samosa", calories: 260, protein: 4, carbs: 32, fat: 14, servingLabel: "1 piece" },
  { name: "Alloo Paratha", calories: 290, protein: 5, carbs: 48, fat: 9, servingLabel: "1 piece" },
  { name: "Boiled Egg", calories: 75, protein: 6.5, carbs: 0.6, fat: 5.3, servingLabel: "1 egg" },
  { name: "Chicken Tikka (6 pieces)", calories: 280, protein: 34, carbs: 4, fat: 14, servingLabel: "1 plate" },
  { name: "Gulab Jamun (2 pieces)", calories: 300, protein: 4, carbs: 48, fat: 11, servingLabel: "1 serving" },
];

export default function Dashboard() {
  // Goal Settings
  const calorieGoal = 2000;
  const proteinGoal = 75;
  const carbsGoal = 250;
  const fatGoal = 65;

  // Logs state
  const [logs, setLogs] = useState<MealLog[]>(INITIAL_LOGS);

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<typeof FOOD_DATABASE>([]);
  const [selectedFood, setSelectedFood] = useState<typeof FOOD_DATABASE[0] | null>(null);
  const [selectedMealType, setSelectedMealType] = useState<"Breakfast" | "Lunch" | "Dinner" | "Snack">("Breakfast");
  const [quantity, setQuantity] = useState(1);

  // AI Analyser state
  const [aiInput, setAiInput] = useState("");
  const [isAnalysing, setIsAnalysing] = useState(false);
  const [aiResult, setAiResult] = useState<AiResult | null>(null);

  // Chatbot state
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ sender: "user" | "ai"; text: string }>>([
    { sender: "ai", text: "Namaste! I am your DietDost. Ask me anything about Indian food swaps, recipes, or daily macros." }
  ]);
  const [chatInput, setChatInput] = useState("");

  // Summary Metrics calculations
  const totals = useMemo(() => {
    return logs.reduce((acc, log) => {
      const multiplier = log.quantity;
      return {
        calories: acc.calories + (log.calories * multiplier),
        protein: acc.protein + (log.protein * multiplier),
        carbs: acc.carbs + (log.carbs * multiplier),
        fat: acc.fat + (log.fat * multiplier),
      };
    }, { calories: 0, protein: 0, carbs: 0, fat: 0 });
  }, [logs]);

  const caloriesRemaining = Math.max(0, calorieGoal - totals.calories);
  const caloriePercent = Math.min(100, (totals.calories / calorieGoal) * 100);

  // Handlers
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.trim() === "") {
      setSearchResults([]);
    } else {
      const filtered = FOOD_DATABASE.filter(f => 
        f.name.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(filtered);
    }
  };

  const handleAddLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFood) return;

    const newLog: MealLog = {
      id: Date.now().toString(),
      name: selectedFood.name,
      category: selectedMealType,
      calories: selectedFood.calories,
      protein: selectedFood.protein,
      carbs: selectedFood.carbs,
      fat: selectedFood.fat,
      quantity: quantity,
      servingLabel: selectedFood.servingLabel,
    };

    setLogs([...logs, newLog]);
    setSearchQuery("");
    setSearchResults([]);
    setSelectedFood(null);
    setQuantity(1);
  };

  const handleDeleteLog = (id: string) => {
    setLogs(logs.filter(log => log.id !== id));
  };

  const handleAiAnalyse = () => {
    if (aiInput.trim() === "") return;
    setIsAnalysing(true);
    setAiResult(null);

    // Simulate AI parsing after a delay
    setTimeout(() => {
      // Mock Gemini AI structured parsing
      const mockResult = {
        dishes: [
          { name: "Masala Dosa", quantity: 1, servingLabel: "1 plate", calories: 350, protein: 7, carbs: 54, fat: 12 },
          { name: "Filter Coffee (with milk & sugar)", quantity: 1, servingLabel: "1 cup", calories: 85, protein: 2.5, carbs: 10, fat: 3.5 }
        ],
        calories: 435,
        protein: 9.5,
        carbs: 64,
        fat: 15.5
      };
      setAiResult(mockResult);
      setIsAnalysing(false);
    }, 1500);
  };

  const handleAddAiLogs = () => {
    if (!aiResult) return;
    
    const newLogs: MealLog[] = aiResult.dishes.map((dish, i) => ({
      id: `${Date.now()}-${i}`,
      name: dish.name,
      category: "Breakfast", // Default categorisation
      calories: dish.calories,
      protein: dish.protein,
      carbs: dish.carbs,
      fat: dish.fat,
      quantity: dish.quantity,
      servingLabel: dish.servingLabel
    }));

    setLogs([...logs, ...newLogs]);
    setAiResult(null);
    setAiInput("");
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (chatInput.trim() === "") return;

    const userMsg = chatInput;
    setChatMessages(prev => [...prev, { sender: "user", text: userMsg }]);
    setChatInput("");

    // Simulate AI Chatbot response
    setTimeout(() => {
      let aiText = "I can help with that. Let me look up options.";
      if (userMsg.toLowerCase().includes("samosa")) {
        aiText = "A classic fried Samosa has about 260 kcal and 14g of fat. For a healthier evening swap, try 1 plate of boiled chana chaat (approx. 120 kcal) or roasted makhana (approx. 90 kcal) which are high in protein and fiber!";
      } else if (userMsg.toLowerCase().includes("protein") && userMsg.toLowerCase().includes("paneer")) {
        aiText = "100g of raw paneer offers about 18-20g of protein, but also contains around 20g of fat. If you want lower fat, try skimmed milk paneer (low-fat paneer) or low-fat tofu (approx. 8g protein, 2g fat per 100g).";
      } else if (userMsg.toLowerCase().includes("breakfast") || userMsg.toLowerCase().includes("weight loss")) {
        aiText = "A high-protein, calorie-conscious Indian breakfast could be: 1. Moong Dal Chilla (savory pancake) with curd, 2. Vegetable Oats Upma with peanuts, or 3. Paneer Bhurji with 1 slice of whole-wheat toast.";
      }
      setChatMessages(prev => [...prev, { sender: "ai", text: aiText }]);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans selection:bg-amber-500 selection:text-black pb-24 md:pb-8">
      <Navbar />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 pt-24 md:pt-28 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Overview, Ring, Macros, Search, logs (lg:col-span-8) */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          
          {/* Daily Circular Ring and Macro Progress Bars */}
          <div className="glass-card rounded-3xl p-6 md:p-8 flex flex-col md:flex-row gap-8 items-center justify-between">
            {/* Calorie Ring Section */}
            <div className="flex flex-col items-center gap-4">
              <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Today&rsquo;s Energy</h2>
              
              <div className="relative w-44 h-44 flex items-center justify-center">
                {/* SVG circular track */}
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="88"
                    cy="88"
                    r="76"
                    className="stroke-zinc-800"
                    strokeWidth="10"
                    fill="transparent"
                  />
                  <circle
                    cx="88"
                    cy="88"
                    r="76"
                    className="stroke-amber-500 transition-all duration-1000 ease-out"
                    strokeWidth="10"
                    fill="transparent"
                    strokeDasharray={2 * Math.PI * 76}
                    strokeDashoffset={2 * Math.PI * 76 * (1 - caloriePercent / 100)}
                    strokeLinecap="round"
                  />
                </svg>
                
                {/* Inner Text */}
                <div className="absolute flex flex-col items-center text-center">
                  <Flame className="h-6 w-6 text-amber-500 mb-1 animate-pulse" />
                  <span className="text-2xl font-bold font-mono">{Math.round(totals.calories)}</span>
                  <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wide">
                    / {calorieGoal} kcal
                  </span>
                </div>
              </div>

              <div className="text-center text-xs">
                {caloriesRemaining > 0 ? (
                  <p className="text-zinc-400">
                    You can consume <span className="text-amber-500 font-bold font-mono">{caloriesRemaining}</span> more kcal today.
                  </p>
                ) : (
                  <p className="text-red-500 font-bold">You have exceeded today&rsquo;s calorie goal!</p>
                )}
              </div>
            </div>

            {/* Macro Progress Bars Section */}
            <div className="flex-1 w-full flex flex-col gap-5 justify-center">
              <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider text-center md:text-left">
                Macronutrient Status
              </h3>
              
              {/* Protein Progress */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center text-xs font-semibold">
                  <span className="text-zinc-300">Protein (Saffron Target)</span>
                  <span className="font-mono">
                    <span className="text-amber-500">{Math.round(totals.protein)}g</span> / {proteinGoal}g
                  </span>
                </div>
                <div className="h-2.5 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
                  <div 
                    className="h-full bg-amber-500 transition-all duration-500" 
                    style={{ width: `${Math.min(100, (totals.protein / proteinGoal) * 100)}%` }}
                  ></div>
                </div>
              </div>

              {/* Carbs Progress */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center text-xs font-semibold">
                  <span className="text-zinc-300">Carbohydrates</span>
                  <span className="font-mono">
                    <span className="text-white">{Math.round(totals.carbs)}g</span> / {carbsGoal}g
                  </span>
                </div>
                <div className="h-2.5 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
                  <div 
                    className="h-full bg-zinc-300 transition-all duration-500" 
                    style={{ width: `${Math.min(100, (totals.carbs / carbsGoal) * 100)}%` }}
                  ></div>
                </div>
              </div>

              {/* Fat Progress */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center text-xs font-semibold">
                  <span className="text-zinc-300">Fats (Terracotta Target)</span>
                  <span className="font-mono">
                    <span className="text-red-500">{Math.round(totals.fat)}g</span> / {fatGoal}g
                  </span>
                </div>
                <div className="h-2.5 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
                  <div 
                    className="h-full bg-red-600 transition-all duration-500" 
                    style={{ width: `${Math.min(100, (totals.fat / fatGoal) * 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Food Search bar and matches */}
          <div className="flex flex-col gap-3 relative">
            <h3 className="text-lg font-serif font-bold text-left">Search Indian Foods</h3>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500" />
              <input
                type="text"
                placeholder="Search breakfast, lunch, snack, desserts (e.g. Dosa, Paratha, Samosa)..."
                value={searchQuery}
                onChange={handleSearch}
                className="w-full pl-12 pr-4 py-3.5 bg-zinc-900/60 border border-zinc-800 hover:border-zinc-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-2xl text-sm transition-all outline-none text-white placeholder:text-zinc-500"
              />
            </div>

            {/* Dropdown list of matching items */}
            {searchResults.length > 0 && (
              <div className="absolute top-[88px] left-0 right-0 max-h-60 overflow-y-auto bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl z-40 p-2 flex flex-col gap-1">
                {searchResults.map((food) => (
                  <button
                    key={food.name}
                    onClick={() => setSelectedFood(food)}
                    className="flex justify-between items-center px-4 py-3 rounded-xl hover:bg-zinc-800/80 transition-colors text-left w-full cursor-pointer group"
                  >
                    <div>
                      <p className="font-medium text-sm text-zinc-200 group-hover:text-amber-500">{food.name}</p>
                      <p className="text-[10px] text-zinc-500 mt-0.5">Serving: {food.servingLabel}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono text-zinc-400">{food.calories} kcal</span>
                      <div className="w-6 h-6 rounded-md bg-amber-500/10 flex items-center justify-center text-amber-500 group-hover:bg-amber-500 group-hover:text-zinc-950 transition-colors">
                        <Plus className="h-4 w-4" />
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Add Log Modal (Glass Card Overlay) */}
          {selectedFood && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
              <div className="glass-card max-w-md w-full rounded-3xl p-6 border border-zinc-800 relative">
                <button 
                  onClick={() => setSelectedFood(null)}
                  className="absolute right-4 top-4 text-zinc-500 hover:text-white transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>

                <h3 className="text-xl font-serif font-bold text-amber-500 mb-2">Add to Log</h3>
                <p className="text-zinc-200 text-base font-semibold mb-4">{selectedFood.name}</p>

                <form onSubmit={handleAddLog} className="flex flex-col gap-5">
                  {/* Select Meal Type */}
                  <div className="flex flex-col gap-1.5 text-left">
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Meal Category</label>
                    <div className="grid grid-cols-4 gap-2">
                      {["Breakfast", "Lunch", "Dinner", "Snack"].map((m) => (
                        <button
                          key={m}
                          type="button"
                          onClick={() => setSelectedMealType(m as "Breakfast" | "Lunch" | "Dinner" | "Snack")}
                          className={`py-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                            selectedMealType === m 
                              ? "bg-amber-500/10 border-amber-500 text-amber-500" 
                              : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-800"
                          }`}
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Quantity adjustment */}
                  <div className="flex flex-col gap-1.5 text-left">
                    <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-zinc-400">
                      <span>Quantity</span>
                      <span className="font-mono text-amber-500 text-sm">{quantity}x ({selectedFood.servingLabel})</span>
                    </div>
                    <input
                      type="range"
                      min="0.5"
                      max="4"
                      step="0.5"
                      value={quantity}
                      onChange={(e) => setQuantity(parseFloat(e.target.value))}
                      className="w-full accent-amber-500 bg-zinc-800 h-1.5 rounded-full outline-none"
                    />
                    <div className="flex justify-between text-[10px] text-zinc-500 font-semibold px-1">
                      <span>0.5x</span>
                      <span>1.0x</span>
                      <span>2.0x</span>
                      <span>3.0x</span>
                      <span>4.0x</span>
                    </div>
                  </div>

                  {/* Live Nutrition Summary Box */}
                  <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 text-left">
                    <p className="text-xs text-zinc-500 font-semibold uppercase tracking-wider mb-2">Estimated Nutrients</p>
                    <div className="grid grid-cols-4 gap-2 text-center">
                      <div>
                        <p className="text-xs text-zinc-500 font-semibold">Calories</p>
                        <p className="text-sm font-bold text-white font-mono mt-0.5">{Math.round(selectedFood.calories * quantity)} kcal</p>
                      </div>
                      <div>
                        <p className="text-xs text-zinc-500 font-semibold">Protein</p>
                        <p className="text-sm font-bold text-amber-500 font-mono mt-0.5">{Math.round(selectedFood.protein * quantity)}g</p>
                      </div>
                      <div>
                        <p className="text-xs text-zinc-500 font-semibold">Carbs</p>
                        <p className="text-sm font-bold text-zinc-300 font-mono mt-0.5">{Math.round(selectedFood.carbs * quantity)}g</p>
                      </div>
                      <div>
                        <p className="text-xs text-zinc-500 font-semibold">Fats</p>
                        <p className="text-sm font-bold text-red-500 font-mono mt-0.5">{Math.round(selectedFood.fat * quantity)}g</p>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold rounded-xl transition-all shadow-lg hover:shadow-amber-500/10 cursor-pointer"
                  >
                    Confirm & Add to Log
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Today's Log Section */}
          <div className="flex flex-col gap-4 text-left">
            <h3 className="text-lg font-serif font-bold">Today&rsquo;s Food Logs</h3>

            <div className="flex flex-col gap-6">
              {["Breakfast", "Lunch", "Dinner", "Snack"].map((category) => {
                const categoryLogs = logs.filter(log => log.category === category);
                
                return (
                  <div key={category} className="flex flex-col gap-2">
                    <h4 className="text-xs font-bold text-amber-500/80 uppercase tracking-wider pl-1">
                      {category}
                    </h4>

                    {categoryLogs.length === 0 ? (
                      <div className="p-4 rounded-2xl bg-zinc-900/30 border border-zinc-900 border-dashed text-center text-xs text-zinc-600 font-medium">
                        No items logged for {category.toLowerCase()}
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2.5">
                        {categoryLogs.map((log) => (
                          <div
                            key={log.id}
                            className="flex justify-between items-center p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-zinc-800 transition-all group"
                          >
                            <div className="flex-1">
                              <p className="font-semibold text-sm text-zinc-100">{log.name}</p>
                              <p className="text-[10px] text-zinc-500 font-medium mt-0.5">
                                Quantity: {log.quantity}x ({log.servingLabel}) &middot; P: {Math.round(log.protein * log.quantity)}g | C: {Math.round(log.carbs * log.quantity)}g | F: {Math.round(log.fat * log.quantity)}g
                              </p>
                            </div>
                            <div className="flex items-center gap-4">
                              <span className="text-xs font-mono font-bold text-zinc-300">
                                {Math.round(log.calories * log.quantity)} kcal
                              </span>
                              <button
                                onClick={() => handleDeleteLog(log.id)}
                                className="text-zinc-600 hover:text-red-500 transition-colors p-1"
                              >
                                <Trash2 className="h-4.5 w-4.5" />
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

        {/* RIGHT COLUMN: AI Analyser & Diagnostics (lg:col-span-4) */}
        <div className="lg:col-span-4 flex flex-col gap-8">
          
          {/* AI Meal Analyser Section */}
          <div className="glass-card rounded-3xl p-6 border border-zinc-800 text-left flex flex-col gap-4 relative overflow-hidden">
            {/* Glowing corner indicator */}
            <div className="absolute top-0 right-0 w-16 h-16 bg-amber-500/5 rounded-full blur-xl pointer-events-none"></div>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500">
                <Brain className="h-4 w-4" />
              </div>
              <h3 className="font-serif font-bold text-lg text-white">AI Meal Analyser</h3>
            </div>

            <p className="text-zinc-400 text-xs leading-relaxed">
              Describe your meal in plain English. We will extract portion-aware calories &amp; macros.
            </p>

            <div className="flex flex-col gap-3 mt-1">
              <textarea
                placeholder="Example: I had 2 cups of tea, 1 plate of poha, and a banana."
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                rows={3}
                className="w-full p-3.5 bg-zinc-900/60 border border-zinc-800 hover:border-zinc-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-xl text-xs transition-all outline-none text-white placeholder:text-zinc-600 resize-none leading-relaxed"
              />

              <button
                onClick={handleAiAnalyse}
                disabled={isAnalysing || aiInput.trim() === ""}
                className="flex items-center justify-center gap-2 py-3 bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold rounded-xl transition-all shadow-md hover:shadow-amber-500/5 text-xs cursor-pointer disabled:opacity-50"
              >
                <Sparkles className="h-4 w-4 fill-zinc-950" />
                {isAnalysing ? "Analysing with Gemini..." : "Analyse Meal Log"}
              </button>
            </div>

            {/* AI Results */}
            {aiResult && (
              <div className="mt-3 p-4 rounded-xl bg-zinc-900 border border-zinc-800 flex flex-col gap-3 animate-slide-up">
                <div className="flex justify-between items-center text-xs border-b border-zinc-800 pb-2">
                  <span className="font-semibold text-zinc-400">Detected Items</span>
                  <span className="font-mono text-amber-500 font-bold">{aiResult.calories} kcal</span>
                </div>
                
                <div className="flex flex-col gap-1.5">
                  {aiResult.dishes.map((dish, i) => (
                    <div key={i} className="flex justify-between text-xs">
                      <span className="text-zinc-300 font-medium">{dish.name}</span>
                      <span className="text-zinc-500 font-mono">{dish.calories} kcal</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleAddAiLogs}
                  className="w-full py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-950 font-bold rounded-lg text-[11px] transition-colors mt-1"
                >
                  Add all to Today&rsquo;s Log
                </button>
              </div>
            )}
          </div>

          {/* Quick Info & Goal Targets Card */}
          <div className="glass-card rounded-3xl p-6 border border-zinc-800 text-left flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                <Scale className="h-4 w-4" />
              </div>
              <h3 className="font-serif font-bold text-lg text-white">Diagnostics</h3>
            </div>

            <div className="flex flex-col gap-3 mt-1 text-xs">
              <div className="flex justify-between items-center p-2.5 rounded-lg bg-zinc-900/30 border border-zinc-800">
                <span className="text-zinc-400">Target Diet Goal</span>
                <span className="font-semibold text-amber-500">Weight Maintenance</span>
              </div>
              <div className="flex justify-between items-center p-2.5 rounded-lg bg-zinc-900/30 border border-zinc-800">
                <span className="text-zinc-400">TDEE Calculated</span>
                <span className="font-semibold text-zinc-200">2,000 kcal / day</span>
              </div>
              <div className="flex justify-between items-center p-2.5 rounded-lg bg-zinc-900/30 border border-zinc-800">
                <span className="text-zinc-400">Food Logging Ratio</span>
                <span className="font-semibold text-emerald-500">5/5 complete</span>
              </div>
            </div>
          </div>

          {/* Button to open chatbot */}
          <button
            onClick={() => setIsChatOpen(true)}
            className="flex items-center justify-center gap-2.5 w-full py-4 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-white font-bold rounded-2xl transition-all shadow-md cursor-pointer hover:border-amber-500/40 group"
          >
            <MessageSquare className="h-5 w-5 text-amber-500 group-hover:scale-110 transition-transform" />
            <span>Chat with DietDost AI</span>
          </button>

        </div>
      </main>

      {/* CHATBOT DRAWER SIDE PANEL */}
      {isChatOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-end animate-fade-in">
          <div className="w-full max-w-md h-full bg-zinc-950 border-l border-zinc-800 flex flex-col justify-between shadow-2xl relative">
            
            {/* Header */}
            <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/40">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500">
                  <Sparkles className="h-4.5 w-4.5 fill-amber-500" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-sm">DietDost Assistant</h3>
                  <p className="text-[10px] text-emerald-500 font-semibold uppercase tracking-wider flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-ping"></span>
                    online
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsChatOpen(false)}
                className="text-zinc-400 hover:text-white transition-colors p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Message History area */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
              {chatMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex flex-col max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed text-left ${
                    msg.sender === "user"
                      ? "bg-amber-500 text-zinc-950 self-end rounded-tr-none font-medium"
                      : "bg-zinc-900 text-zinc-200 self-start rounded-tl-none border border-zinc-800"
                  }`}
                >
                  <p>{msg.text}</p>
                </div>
              ))}
            </div>

            {/* Chat Input area */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-zinc-800 bg-zinc-900/20 flex gap-2">
              <input
                type="text"
                placeholder="Ask about samosas, biryani swap, paneer protein..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="flex-1 px-4 py-3 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-xl text-xs transition-all outline-none text-white placeholder:text-zinc-600"
              />
              <button
                type="submit"
                className="px-4 py-3 bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold rounded-xl text-xs transition-colors cursor-pointer"
              >
                Send
              </button>
            </form>

          </div>
        </div>
      )}
    </div>
  );
}
