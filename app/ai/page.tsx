"use client";

import Navbar from "@/components/Navbar";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { Sparkles, Brain, MessageSquare, ArrowRight, Zap, Send, RotateCcw } from "lucide-react";

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

const EXAMPLE_QUERIES = [
  "Is samosa worse than pakoda?",
  "How much protein is in 100g of paneer?",
  "Best high-protein Indian breakfast for weight loss?",
  "Is ghee bad for health?",
];

const MACRO_EXAMPLES = [
  "2 idlis, 1 vada, and a cup of sambar for breakfast.",
  "Rice with rajma curry and 1 roti for lunch.",
  "Khichdi with ghee and a glass of buttermilk.",
];

export default function AIPage() {
  const [activeTab, setActiveTab] = useState<"analyser" | "chat">("analyser");
  const [mealText, setMealText] = useState("");
  const [isAnalysing, setIsAnalysing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AiResult | null>(null);
  const [analyseError, setAnalyseError] = useState<string | null>(null);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { sender: "ai", text: "Namaste! 🙏 I'm your DietDost AI nutritionist. I specialise in Indian food, regional cuisines, and practical dietary advice. Ask me anything!" },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, isChatLoading]);

  const handleAnalyse = async () => {
    if (mealText.trim() === "") return;
    setIsAnalysing(true);
    setAnalysisResult(null);
    setAnalyseError(null);
    try {
      const res = await fetch("/api/ai/analyse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ meal: mealText }),
      });
      const data = await res.json() as AiResult & { error?: string };
      if (!res.ok || data.error) throw new Error(data.error || "Analysis failed");
      setAnalysisResult(data);
    } catch (err: unknown) {
      setAnalyseError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setIsAnalysing(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (chatInput.trim() === "" || isChatLoading) return;
    const userText = chatInput.trim();
    const updatedMessages: ChatMessage[] = [...chatMessages, { sender: "user", text: userText }];
    setChatMessages(updatedMessages);
    setChatInput("");
    setIsChatLoading(true);
    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: chatMessages, query: userText }),
      });
      const data = await res.json() as { reply?: string; error?: string };
      if (!res.ok || data.error) throw new Error(data.error || "Chat failed");
      setChatMessages(prev => [...prev, { sender: "ai", text: data.reply ?? "" }]);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong.";
      setChatMessages(prev => [...prev, { sender: "ai", text: `⚠️ Error: ${msg}` }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans pb-24 md:pb-12 page-enter selection:bg-brand selection:text-black">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 md:px-8 pt-24 md:pt-28">
        {/* Page Header */}
        <div className="text-center mb-10 flex flex-col gap-4 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-3 py-1 text-xs font-black tracking-widest text-brand-strong dark:text-brand uppercase bg-brand-softer dark:bg-brand-soft border-2 border-brand-strong dark:border-brand rounded-none w-fit mx-auto">
            <Sparkles className="h-3.5 w-3.5" />
            AI HELPER · MEAL PARSING
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-black dark:text-white">
            AI-Powered Nutrition Tools
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            DietDost uses AI to parse messy meal descriptions and provide conversational guidance tuned specifically for Indian food culture.
          </p>
        </div>

        {/* Tab switcher (Pills variant) */}
        <div className="flex gap-0 w-fit mx-auto mb-10 border-2 border-black dark:border-zinc-300 shadow-sm overflow-hidden rounded-none animate-fade-in" style={{ animationDelay: "0.1s" }}>
          {([
            { key: "analyser", label: "Meal Analyser", Icon: Brain },
            { key: "chat", label: "Nutrition Chatbot", Icon: MessageSquare },
          ] as const).map(({ key, label, Icon }) => (
            <button key={key} onClick={() => setActiveTab(key)}
              className={`flex items-center gap-2 px-6 py-3 text-sm font-extrabold border-r-2 last:border-r-0 border-black dark:border-zinc-300 transition-all cursor-pointer rounded-none ${
                activeTab === key
                  ? "bg-brand text-black shadow-none"
                  : "bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              }`}>
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>

        {/* ── ANALYSER TAB ── */}
        {activeTab === "analyser" && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 animate-fade-in">
            {/* Input */}
            <div className="md:col-span-5 flex flex-col gap-4">
              <div className="bg-white dark:bg-zinc-900 border-2 border-black dark:border-zinc-300 shadow-md p-6 flex flex-col gap-4 rounded-none relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-brand" />
                <div className="flex items-center gap-3 mt-1">
                  <div className="w-9 h-9 border-2 border-black bg-brand flex items-center justify-center text-black rounded-none">
                    <Brain className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="font-black text-base text-black dark:text-white">Describe Your Meal</h2>
                    <p className="text-[10px] text-zinc-500 font-bold">Plain language — Indian portions</p>
                  </div>
                </div>

                <textarea
                  rows={5}
                  placeholder="Example: I had a masala dosa for breakfast with filter coffee, and 2 rotis with dal and bhindi sabzi for lunch."
                  value={mealText}
                  onChange={(e) => setMealText(e.target.value)}
                  className="w-full p-4 bg-zinc-50 dark:bg-zinc-800 border-2 border-black dark:border-zinc-300 focus:border-brand shadow-xs focus:shadow-sm rounded-none text-sm transition-all outline-none text-black dark:text-white placeholder:text-zinc-400 resize-none leading-relaxed"
                />

                <button onClick={handleAnalyse} disabled={isAnalysing || mealText.trim() === ""}
                  className="flex items-center justify-center gap-2 w-full py-3.5 bg-brand hover:bg-brand-strong text-black font-extrabold border-2 border-black shadow-sm hover:shadow-md active:shadow-2xs hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 rounded-none transition-all cursor-pointer disabled:opacity-50 text-sm">
                  {isAnalysing ? (
                    <><div className="w-4 h-4 border-2 border-black border-t-transparent animate-spin-slow rounded-full" />Analysing meal...</>
                  ) : (
                    <><Zap className="h-4 w-4" />Analyse Meal</>
                  )}
                </button>

                {/* Example prompts */}
                <div className="flex flex-col gap-2 pt-3 border-t-2 border-black/10 dark:border-zinc-700">
                  <p className="text-[10px] font-black text-zinc-500 uppercase tracking-wider">Try an example</p>
                  {MACRO_EXAMPLES.map((ex) => (
                    <button key={ex} onClick={() => setMealText(ex)}
                      className="text-left text-xs text-zinc-500 hover:text-brand-strong dark:hover:text-brand transition-colors py-1.5 px-2 border border-dashed border-zinc-300 dark:border-zinc-700 hover:border-brand hover:bg-brand-softer rounded-none cursor-pointer">
                      &ldquo;{ex}&rdquo;
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="md:col-span-7 flex flex-col gap-4">
              {!analysisResult && !isAnalysing && (
                <div className="flex-1 flex flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-900 border-2 border-dashed border-zinc-300 dark:border-zinc-700 p-12 text-center gap-4 rounded-none min-h-[300px]">
                  <div className="w-16 h-16 border-2 border-zinc-300 dark:border-zinc-600 flex items-center justify-center text-zinc-400 rounded-none">
                    <Brain className="h-8 w-8" />
                  </div>
                  <p className="text-zinc-500 text-sm font-bold">
                    Describe a meal on the left and hit &ldquo;Analyse Meal&rdquo; to see structured nutrition data.
                  </p>
                </div>
              )}

              {isAnalysing && (
                <div className="flex-1 flex flex-col items-center justify-center bg-brand-softer border-2 border-brand-strong p-12 text-center gap-5 rounded-none min-h-[300px] animate-fade-in">
                  <div className="w-16 h-16 border-4 border-black border-t-brand animate-spin-slow rounded-full" />
                  <div>
                    <p className="text-black font-extrabold">Asking Gemini AI...</p>
                    <p className="text-xs text-black/60 font-bold mt-1">Mapping to Indian portion standards</p>
                  </div>
                </div>
              )}

              {analyseError && !isAnalysing && (
                <div className="flex flex-col gap-3 p-5 bg-danger-soft border-2 border-danger animate-fade-in rounded-none min-h-[120px] justify-center">
                  <p className="font-extrabold text-danger">⚠ Analysis Failed</p>
                  <p className="text-xs text-danger font-medium">{analyseError}</p>
                  <button onClick={() => setAnalyseError(null)}
                    className="self-start text-xs font-extrabold border-2 border-danger text-danger px-3 py-1 hover:bg-danger hover:text-white transition-all cursor-pointer rounded-none">
                    Dismiss
                  </button>
                </div>
              )}

              {analysisResult && (
                <div className="flex flex-col gap-4 animate-bounce-in">
                  {/* Total highlight */}
                  <div className="bg-brand border-2 border-black shadow-md p-6 flex items-center justify-between rounded-none">
                    <div>
                      <p className="text-xs font-black text-black/70 uppercase tracking-widest mb-1">Total Estimated</p>
                      <p className="text-5xl font-black font-mono text-black">{analysisResult.total_calories}</p>
                      <p className="text-xs text-black/70 font-bold mt-0.5">kilocalories</p>
                    </div>
                    <div className="grid grid-cols-3 gap-6 text-center">
                      {[
                        { label: "Protein", val: `${analysisResult.total_protein}g` },
                        { label: "Carbs", val: `${analysisResult.total_carbs}g` },
                        { label: "Fats", val: `${analysisResult.total_fat}g` },
                      ].map(({ label, val }) => (
                        <div key={label}>
                          <p className="text-xl font-black font-mono text-black">{val}</p>
                          <p className="text-[10px] text-black/70 font-black uppercase tracking-wider">{label}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Individual dishes */}
                  <div className="bg-white dark:bg-zinc-900 border-2 border-black dark:border-zinc-300 shadow-md p-6 flex flex-col gap-4 rounded-none">
                    <h3 className="text-sm font-black text-black dark:text-white uppercase tracking-wider">Detected Dishes</h3>
                    <div className="flex flex-col gap-2">
                      {analysisResult.dishes.map((dish, i) => (
                        <div key={i} className="flex justify-between items-center p-4 bg-zinc-50 dark:bg-zinc-800 border-2 border-black dark:border-zinc-600 hover:shadow-xs transition-all rounded-none">
                          <div>
                            <p className="font-extrabold text-sm text-black dark:text-white">{dish.name}</p>
                            <p className="text-[10px] text-zinc-500 font-medium mt-0.5">{dish.servingLabel} · P:{dish.protein}g C:{dish.carbs}g F:{dish.fat}g</p>
                          </div>
                          <span className="text-sm font-black font-mono text-brand-strong dark:text-brand">{dish.calories} kcal</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* AI Notes */}
                  <div className="p-4 bg-success-soft border-2 border-success flex gap-3 rounded-none">
                    <div className="w-7 h-7 border border-success bg-success/10 flex items-center justify-center text-success shrink-0 rounded-none mt-0.5">
                      <Sparkles className="h-3.5 w-3.5" />
                    </div>
                    <p className="text-xs text-success-strong font-medium leading-relaxed">{analysisResult.notes}</p>
                  </div>

                  <div className="flex gap-3">
                    <Link href="/dashboard"
                      className="flex-1 flex items-center justify-center gap-2 py-3 bg-black dark:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-100 border-2 border-black text-white dark:text-black font-extrabold shadow-sm hover:shadow-md active:shadow-2xs hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 rounded-none transition-all text-sm cursor-pointer">
                      Add to Dashboard <ArrowRight className="h-4 w-4" />
                    </Link>
                    <button onClick={() => { setAnalysisResult(null); setMealText(""); }}
                      className="px-4 py-3 bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 border-2 border-black dark:border-zinc-300 text-black dark:text-white font-extrabold shadow-xs hover:shadow-sm rounded-none transition-all cursor-pointer">
                      <RotateCcw className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── CHAT TAB ── */}
        {activeTab === "chat" && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 animate-fade-in">
            {/* Quick Queries Sidebar */}
            <div className="md:col-span-4 flex flex-col gap-4">
              <div className="bg-white dark:bg-zinc-900 border-2 border-black dark:border-zinc-300 shadow-md p-6 flex flex-col gap-4 rounded-none">
                <h3 className="font-black text-base text-black dark:text-white">Quick Questions</h3>
                <p className="text-zinc-500 text-xs font-bold">Click any question to instantly ask DietDost AI.</p>
                <div className="flex flex-col gap-2">
                  {EXAMPLE_QUERIES.map((q) => (
                    <button key={q} onClick={() => { setActiveTab("chat"); setChatInput(q); }}
                      className="text-left text-xs text-black dark:text-zinc-300 p-3 border-2 border-black dark:border-zinc-600 hover:bg-brand hover:border-black hover:text-black font-bold cursor-pointer transition-all rounded-none">
                      &ldquo;{q}&rdquo;
                    </button>
                  ))}
                </div>
                <div className="pt-3 border-t-2 border-black/10 dark:border-zinc-700 text-[10px] text-zinc-500 leading-relaxed font-medium">
                  <p className="font-black text-zinc-400 uppercase tracking-wider mb-1">AI Context</p>
                  <p>Tuned for Indian food culture: regional cuisines, home-cooked dishes, and practical dietary advice for South Asian eating habits.</p>
                </div>
              </div>
            </div>

            {/* Chat Interface */}
            <div className="md:col-span-8 flex flex-col">
              <div className="bg-white dark:bg-zinc-900 border-2 border-black dark:border-zinc-300 shadow-md overflow-hidden flex flex-col rounded-none" style={{ height: "540px" }}>
                {/* Header */}
                <div className="p-4 border-b-2 border-black dark:border-zinc-300 bg-black flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-brand border-2 border-brand flex items-center justify-center">
                      <Sparkles className="h-4 w-4 text-black" />
                    </div>
                    <div>
                      <p className="font-black text-sm text-white">DietDost AI</p>
                      <p className="text-[10px] text-brand font-bold flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-success inline-block animate-ping" />Online · Nutrition helper
                      </p>
                    </div>
                  </div>
                  <button onClick={() => setChatMessages([{ sender: "ai", text: "Chat reset! Ask me anything about Indian nutrition." }])}
                    className="text-xs text-zinc-400 hover:text-white border border-zinc-600 hover:border-white px-2 py-1 transition-all rounded-none cursor-pointer flex items-center gap-1">
                    <RotateCcw className="h-3 w-3" /> Clear
                  </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 bg-zinc-50 dark:bg-zinc-800">
                  {chatMessages.map((msg, i) => (
                    <div key={i} className={`flex flex-col max-w-[88%] p-3.5 text-xs leading-relaxed border-2 rounded-none animate-fade-in ${
                      msg.sender === "user"
                        ? "bg-brand border-black text-black self-end font-extrabold"
                        : "bg-white dark:bg-zinc-900 border-black dark:border-zinc-600 text-black dark:text-zinc-200 self-start font-medium"
                    }`}>
                      <p className="whitespace-pre-line">{msg.text}</p>
                    </div>
                  ))}
                  {isChatLoading && (
                    <div className="flex gap-1.5 items-center p-3.5 bg-white dark:bg-zinc-900 border-2 border-black dark:border-zinc-600 w-16 self-start rounded-none">
                      {[0, 150, 300].map(delay => (
                        <span key={delay} className="w-1.5 h-1.5 rounded-full bg-brand-strong animate-bounce" style={{ animationDelay: `${delay}ms` }} />
                      ))}
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                {/* Input */}
                <form onSubmit={handleSendMessage} className="p-4 border-t-2 border-black dark:border-zinc-300 bg-white dark:bg-zinc-900 flex gap-2">
                  <input
                    type="text"
                    placeholder="Ask about Indian food, macros, swaps..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    className="flex-1 px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border-2 border-black dark:border-zinc-300 focus:border-brand shadow-xs focus:shadow-sm rounded-none text-xs transition-all outline-none text-black dark:text-white placeholder:text-zinc-400"
                  />
                  <button type="submit" disabled={isChatLoading || chatInput.trim() === ""}
                    className="px-4 py-3 bg-brand hover:bg-brand-strong text-black font-extrabold border-2 border-black shadow-xs hover:shadow-sm active:shadow-2xs hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 rounded-none text-xs transition-all cursor-pointer disabled:opacity-50">
                    <Send className="h-4 w-4" />
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
