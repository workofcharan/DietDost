"use client";

import Navbar from "@/components/Navbar";
import Link from "next/link";
import { useState } from "react";
import { Sparkles, Brain, MessageSquare, X, ArrowRight, Zap } from "lucide-react";

interface AiDish {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  servingLabel: string;
}

interface AiResult {
  dishes: AiDish[];
  total_calories: number;
  total_protein: number;
  total_carbs: number;
  total_fat: number;
  notes: string;
}

interface ChatMessage {
  sender: "user" | "ai";
  text: string;
}

export default function AIPage() {
  const [activeTab, setActiveTab] = useState<"analyser" | "chat">("analyser");

  // Analyser State
  const [mealText, setMealText] = useState("");
  const [isAnalysing, setIsAnalysing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AiResult | null>(null);

  // Chat State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      sender: "ai",
      text: "Namaste! 🙏 I'm your DietDost AI nutritionist. I specialise in Indian food, regional cuisines, and practical dietary advice. Ask me anything — from the protein in rajma to whether ghee is really that bad!",
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);

  const EXAMPLE_QUERIES = [
    "Is samosa worse than pakoda?",
    "How much protein is in 100g of paneer?",
    "Best high-protein Indian breakfast for weight loss?",
    "Is ghee bad for health?",
  ];

  const handleAnalyse = () => {
    if (mealText.trim() === "") return;
    setIsAnalysing(true);
    setAnalysisResult(null);

    setTimeout(() => {
      setAnalysisResult({
        dishes: [
          { name: "Masala Dosa", calories: 350, protein: 7, carbs: 54, fat: 12, servingLabel: "1 plate" },
          { name: "Coconut Chutney", calories: 80, protein: 1, carbs: 6, fat: 6, servingLabel: "2 tbsp" },
          { name: "Sambar", calories: 70, protein: 4, carbs: 10, fat: 2, servingLabel: "1 cup" },
        ],
        total_calories: 500,
        total_protein: 12,
        total_carbs: 70,
        total_fat: 20,
        notes: "A well-rounded South Indian breakfast. High carbs are from the rice-lentil crepe — perfectly fine if portion-controlled. The sambar provides additional plant-based protein and fibre.",
      });
      setIsAnalysing(false);
    }, 1800);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (chatInput.trim() === "" || isChatLoading) return;

    const userText = chatInput;
    setChatMessages((prev) => [...prev, { sender: "user", text: userText }]);
    setChatInput("");
    setIsChatLoading(true);

    setTimeout(() => {
      let reply = "That's a great question! Let me check my knowledge about Indian nutrition...";
      const q = userText.toLowerCase();
      if (q.includes("samosa") || q.includes("pakoda")) {
        reply = "Both are fried snacks, but Samosa (~260 kcal each) typically has more calories than Pakoda (~220 kcal per 100g) due to its pastry shell. However, Pakoda uses more oil per bite. Neither is great for frequent consumption, but Pakoda edges slightly better in protein from the besan (chickpea flour). For a healthier swap, try roasted chana or makhana!";
      } else if (q.includes("paneer") && q.includes("protein")) {
        reply = "100g of full-fat paneer contains about 18-20g of protein! That makes it one of the best vegetarian protein sources in Indian cuisine. However, it also has ~20g of fat. If watching calories, opt for low-fat paneer (half the fat, similar protein) or cottage cheese.";
      } else if (q.includes("breakfast") && (q.includes("protein") || q.includes("weight loss"))) {
        reply = "Top high-protein Indian breakfasts:\n1. Moong Dal Chilla + curd dip (~18g protein)\n2. Paneer Bhurji (scrambled paneer) + 1 whole wheat roti (~22g)\n3. Besan Cheela with vegetables (~15g)\n4. Egg whites + veggie uttapam (~20g)\nAll under 400 kcal and packed with energy for the morning!";
      } else if (q.includes("ghee")) {
        reply = "Ghee is rich in saturated fats (~62g per 100g) and often misunderstood! In moderation, ghee has benefits: it's rich in fat-soluble vitamins (A, D, E, K), has a high smoke point (making it stable for cooking), and is easily digestible. 1 tsp (5g) per day is generally fine for healthy adults. Avoid if you have high LDL cholesterol.";
      }
      setChatMessages((prev) => [...prev, { sender: "ai", text: reply }]);
      setIsChatLoading(false);
    }, 1200);
  };

  const handleExampleClick = (query: string) => {
    setActiveTab("chat");
    setChatInput(query);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans pb-24 md:pb-12">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 md:px-8 pt-24 md:pt-28">
        {/* Page Header */}
        <div className="text-center mb-10 flex flex-col gap-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 text-xs font-bold tracking-wider text-amber-500 uppercase bg-amber-500/10 rounded-full w-fit mx-auto">
            <Sparkles className="h-3.5 w-3.5" />
            Gemini AI · Three Features
          </div>
          <h1 className="text-3xl md:text-5xl font-serif font-bold tracking-tight">
            AI-Powered Nutrition Tools
          </h1>
          <p className="text-zinc-400 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            DietDost uses Gemini 1.5 Flash to understand Indian meal descriptions, give personalised feedback, and answer your food questions in plain language.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex gap-2 p-1.5 bg-zinc-900 rounded-2xl border border-zinc-800 w-fit mx-auto mb-8">
          <button
            onClick={() => setActiveTab("analyser")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
              activeTab === "analyser"
                ? "bg-amber-500 text-zinc-950 shadow-md"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <Brain className="h-4 w-4" />
            Meal Analyser
          </button>
          <button
            onClick={() => setActiveTab("chat")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
              activeTab === "chat"
                ? "bg-amber-500 text-zinc-950 shadow-md"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <MessageSquare className="h-4 w-4" />
            Nutrition Chatbot
          </button>
        </div>

        {/* Analyser Tab */}
        {activeTab === "analyser" && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 animate-fade-in">
            {/* Left: Input area */}
            <div className="md:col-span-5 flex flex-col gap-4">
              <div className="glass-card rounded-3xl p-6 border border-zinc-800 flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500">
                    <Brain className="h-4 w-4" />
                  </div>
                  <h2 className="font-serif font-bold text-lg">Describe Your Meal</h2>
                </div>

                <p className="text-zinc-400 text-xs leading-relaxed">
                  Write what you ate in plain language — DietDost AI will identify the dishes, map them to standard Indian portions, and return structured nutrition data.
                </p>

                <textarea
                  rows={5}
                  placeholder="Example: I had a masala dosa for breakfast with filter coffee, and 2 rotis with dal and bhindi sabzi for lunch."
                  value={mealText}
                  onChange={(e) => setMealText(e.target.value)}
                  className="w-full p-4 bg-zinc-900/60 border border-zinc-800 hover:border-zinc-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-xl text-sm transition-all outline-none text-white placeholder:text-zinc-600 resize-none leading-relaxed"
                />

                <button
                  onClick={handleAnalyse}
                  disabled={isAnalysing || mealText.trim() === ""}
                  className="flex items-center justify-center gap-2 w-full py-3.5 bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold rounded-xl transition-all shadow-md cursor-pointer disabled:opacity-50 text-sm"
                >
                  <Zap className="h-4 w-4 fill-zinc-950" />
                  {isAnalysing ? "Analysing with Gemini..." : "Analyse Meal"}
                </button>

                {/* Example prompts */}
                <div className="flex flex-col gap-2 pt-2 border-t border-zinc-900">
                  <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Try an example</p>
                  {[
                    "2 idlis, 1 vada, and a cup of sambar for breakfast.",
                    "Rice with rajma curry and 1 roti for lunch.",
                  ].map((ex) => (
                    <button
                      key={ex}
                      onClick={() => setMealText(ex)}
                      className="text-left text-xs text-amber-500/70 hover:text-amber-500 transition-colors py-1 cursor-pointer"
                    >
                      &ldquo;{ex}&rdquo;
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Results area */}
            <div className="md:col-span-7 flex flex-col gap-4">
              {!analysisResult && !isAnalysing && (
                <div className="flex-1 flex flex-col items-center justify-center glass-card rounded-3xl p-12 border border-zinc-800 border-dashed text-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-zinc-900 flex items-center justify-center text-zinc-600">
                    <Brain className="h-7 w-7" />
                  </div>
                  <p className="text-zinc-500 text-sm font-medium">
                    Describe a meal on the left and hit &ldquo;Analyse Meal&rdquo; to see structured nutrition data.
                  </p>
                </div>
              )}

              {isAnalysing && (
                <div className="flex-1 flex flex-col items-center justify-center glass-card rounded-3xl p-12 border border-amber-500/20 text-center gap-4 animate-pulse">
                  <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                    <Sparkles className="h-7 w-7" />
                  </div>
                  <p className="text-zinc-400 text-sm">Gemini is reading your meal description...</p>
                </div>
              )}

              {analysisResult && (
                <div className="flex flex-col gap-4 animate-slide-up">
                  {/* Total Calorie Highlight */}
                  <div className="glass-card rounded-3xl p-6 border border-amber-500/20 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Total Estimated</p>
                      <p className="text-4xl font-bold font-mono text-amber-500">{analysisResult.total_calories}</p>
                      <p className="text-xs text-zinc-400 mt-0.5">kilocalories</p>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-lg font-bold font-mono">{analysisResult.total_protein}g</p>
                        <p className="text-[10px] text-amber-500 font-bold uppercase">Protein</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold font-mono">{analysisResult.total_carbs}g</p>
                        <p className="text-[10px] text-zinc-400 font-bold uppercase">Carbs</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold font-mono">{analysisResult.total_fat}g</p>
                        <p className="text-[10px] text-red-400 font-bold uppercase">Fats</p>
                      </div>
                    </div>
                  </div>

                  {/* Individual dishes */}
                  <div className="glass-card rounded-3xl p-6 border border-zinc-800 flex flex-col gap-4">
                    <h3 className="text-sm font-bold text-zinc-300">Detected Dishes</h3>
                    <div className="flex flex-col gap-3">
                      {analysisResult.dishes.map((dish, i) => (
                        <div
                          key={i}
                          className="flex justify-between items-center p-4 rounded-xl bg-zinc-900 border border-zinc-800"
                        >
                          <div>
                            <p className="font-semibold text-sm text-zinc-100">{dish.name}</p>
                            <p className="text-[10px] text-zinc-500 mt-0.5">{dish.servingLabel} · P:{dish.protein}g C:{dish.carbs}g F:{dish.fat}g</p>
                          </div>
                          <span className="text-sm font-bold font-mono text-amber-500">{dish.calories} kcal</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* AI Notes */}
                  <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 flex gap-3">
                    <div className="w-6 h-6 mt-0.5 rounded-md bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0">
                      <Sparkles className="h-3.5 w-3.5" />
                    </div>
                    <p className="text-xs text-emerald-300 leading-relaxed">{analysisResult.notes}</p>
                  </div>

                  <Link
                    href="/dashboard"
                    className="flex items-center justify-center gap-2 py-3 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-200 font-bold rounded-xl transition-colors text-sm"
                  >
                    Add to Dashboard Logs
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Chat Tab */}
        {activeTab === "chat" && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 animate-fade-in">
            {/* Left: Suggestions */}
            <div className="md:col-span-4 flex flex-col gap-4">
              <div className="glass-card rounded-3xl p-6 border border-zinc-800 flex flex-col gap-4">
                <h3 className="font-serif font-bold text-base text-white">Quick Questions</h3>
                <p className="text-zinc-500 text-xs">Click any question to instantly ask DietDost AI.</p>
                <div className="flex flex-col gap-2">
                  {EXAMPLE_QUERIES.map((q) => (
                    <button
                      key={q}
                      onClick={() => handleExampleClick(q)}
                      className="text-left text-xs text-zinc-300 hover:text-amber-500 transition-colors p-3 rounded-xl bg-zinc-900 hover:bg-zinc-900/80 border border-zinc-800 hover:border-amber-500/30 cursor-pointer"
                    >
                      &ldquo;{q}&rdquo;
                    </button>
                  ))}
                </div>

                <div className="pt-2 border-t border-zinc-900 text-[10px] text-zinc-600 leading-relaxed">
                  <p className="font-bold text-zinc-500 uppercase tracking-wider mb-1">AI Context</p>
                  <p>This chatbot is tuned for Indian food culture: regional cuisines, home-cooked dishes, and practical dietary advice for South Asian eating habits.</p>
                </div>
              </div>
            </div>

            {/* Right: Chat interface */}
            <div className="md:col-span-8 flex flex-col">
              <div className="glass-card rounded-3xl border border-zinc-800 overflow-hidden flex flex-col" style={{ height: "520px" }}>
                {/* Chat header */}
                <div className="p-4 border-b border-zinc-800 bg-zinc-900/40 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center">
                      <Sparkles className="h-4 w-4 text-zinc-950" />
                    </div>
                    <div>
                      <p className="font-serif font-bold text-sm">DietDost AI</p>
                      <p className="text-[10px] text-emerald-500 font-semibold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-ping"></span>
                        Online · Gemini 1.5 Flash
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setChatMessages([{ sender: "ai", text: "Chat reset! Ask me anything about Indian nutrition." }])}
                    className="text-xs text-zinc-500 hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <X className="h-3.5 w-3.5" />
                    Clear
                  </button>
                </div>

                {/* Messages area */}
                <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
                  {chatMessages.map((msg, i) => (
                    <div
                      key={i}
                      className={`flex flex-col max-w-[88%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                        msg.sender === "user"
                          ? "bg-amber-500 text-zinc-950 self-end rounded-tr-none font-medium"
                          : "bg-zinc-900 text-zinc-200 self-start rounded-tl-none border border-zinc-800"
                      }`}
                    >
                      <p className="whitespace-pre-line">{msg.text}</p>
                    </div>
                  ))}
                  {isChatLoading && (
                    <div className="flex gap-1.5 items-center p-3.5 bg-zinc-900 rounded-2xl rounded-tl-none border border-zinc-800 w-16 self-start">
                      <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce" style={{ animationDelay: "0ms" }}></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce" style={{ animationDelay: "150ms" }}></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce" style={{ animationDelay: "300ms" }}></span>
                    </div>
                  )}
                </div>

                {/* Input area */}
                <form
                  onSubmit={handleSendMessage}
                  className="p-4 border-t border-zinc-800 bg-zinc-900/20 flex gap-2"
                >
                  <input
                    type="text"
                    placeholder="Ask about Indian food, macros, swaps..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    className="flex-1 px-4 py-3 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-xl text-xs transition-all outline-none text-white placeholder:text-zinc-600"
                  />
                  <button
                    type="submit"
                    disabled={isChatLoading || chatInput.trim() === ""}
                    className="px-4 py-3 bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold rounded-xl text-xs transition-colors cursor-pointer disabled:opacity-50"
                  >
                    Send
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
