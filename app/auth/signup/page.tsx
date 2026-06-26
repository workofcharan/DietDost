"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { 
  Utensils, 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  ArrowLeft,
  Activity,
  Calculator
} from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [gender, setGender] = useState("male");
  const [goal, setGoal] = useState("maintain"); // lose, maintain, gain

  // Calculate Calorie Goal (Mifflin-St Jeor formula)
  const calculateCalorieGoal = () => {
    const w = parseFloat(weight) || 70;
    const h = parseFloat(height) || 170;
    const a = parseInt(age) || 25;
    
    // BMR calculation
    let bmr = 0;
    if (gender === "male") {
      bmr = 10 * w + 6.25 * h - 5 * a + 5;
    } else {
      bmr = 10 * w + 6.25 * h - 5 * a - 161;
    }
    
    // TDEE estimate (Light activity factor = 1.375)
    let tdee = Math.round(bmr * 1.375);
    
    // Adjust based on goal
    if (goal === "lose") {
      tdee -= 500; // Calorie deficit
    } else if (goal === "gain") {
      tdee += 300; // Calorie surplus
    }
    
    return Math.max(1200, tdee); // Safe minimum
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
    } else {
      setIsLoading(true);
      setTimeout(() => {
        router.push("/dashboard");
      }, 1200);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col justify-center items-center px-4 relative">
      {/* Background orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-amber-500/5 blur-3xl pointer-events-none animate-pulse-slow"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-emerald-500/5 blur-3xl pointer-events-none animate-pulse-slow" style={{ animationDelay: '-3s' }}></div>

      <div className="w-full max-w-md z-10">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2 justify-center mb-6">
          <Utensils className="h-6 w-6 text-amber-500" />
          <span className="text-2xl font-serif font-bold tracking-tight">
            Diet<span className="text-amber-500">Dost</span>
          </span>
        </Link>

        {/* Steps indicator */}
        <div className="flex justify-between items-center px-4 mb-4 text-xs text-zinc-500 font-semibold uppercase tracking-wider">
          <span className={step >= 1 ? "text-amber-500" : ""}>1. Profile</span>
          <div className="h-0.5 flex-1 mx-2 bg-zinc-800 rounded-full">
            <div className="h-full bg-amber-500 transition-all" style={{ width: step === 1 ? "0%" : step === 2 ? "50%" : "100%" }}></div>
          </div>
          <span className={step >= 2 ? "text-amber-500" : ""}>2. Metrics</span>
          <div className="h-0.5 flex-1 mx-2 bg-zinc-800 rounded-full">
            <div className="h-full bg-amber-500 transition-all" style={{ width: step <= 2 ? "0%" : "100%" }}></div>
          </div>
          <span className={step >= 3 ? "text-amber-500" : ""}>3. Goal</span>
        </div>

        {/* Card */}
        <div className="glass-card rounded-3xl p-8 border border-zinc-800 text-left">
          <form onSubmit={handleNext} className="flex flex-col gap-5">
            {step === 1 && (
              <div className="flex flex-col gap-4 animate-fade-in">
                <div>
                  <h2 className="text-2xl font-serif font-bold text-white mb-1">Create Account</h2>
                  <p className="text-zinc-400 text-xs">Let&rsquo;s get started on your health journey</p>
                </div>
                
                {/* Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-505" />
                    <input
                      type="text"
                      required
                      placeholder="Rahul Sharma"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-zinc-900/50 border border-zinc-850 hover:border-zinc-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-xl text-sm transition-all outline-none text-white placeholder:text-zinc-650"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-505" />
                    <input
                      type="email"
                      required
                      placeholder="rahul@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-zinc-900/50 border border-zinc-850 hover:border-zinc-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-xl text-sm transition-all outline-none text-white placeholder:text-zinc-655"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-505" />
                    <input
                      type="password"
                      required
                      placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-zinc-900/50 border border-zinc-850 hover:border-zinc-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-xl text-sm transition-all outline-none text-white placeholder:text-zinc-655"
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="flex flex-col gap-4 animate-fade-in">
                <div>
                  <h2 className="text-2xl font-serif font-bold text-white mb-1">Your Metrics</h2>
                  <p className="text-zinc-400 text-xs">Used to calculate your custom daily calorie budget</p>
                </div>

                {/* Gender */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Gender</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setGender("male")}
                      className={`py-3.5 text-sm font-semibold rounded-xl border transition-all cursor-pointer ${
                        gender === "male" 
                          ? "bg-amber-500/10 border-amber-500 text-amber-500" 
                          : "bg-zinc-900/50 border-zinc-850 text-zinc-400 hover:border-zinc-800"
                      }`}
                    >
                      Male
                    </button>
                    <button
                      type="button"
                      onClick={() => setGender("female")}
                      className={`py-3.5 text-sm font-semibold rounded-xl border transition-all cursor-pointer ${
                        gender === "female" 
                          ? "bg-amber-500/10 border-amber-500 text-amber-500" 
                          : "bg-zinc-900/50 border-zinc-850 text-zinc-400 hover:border-zinc-800"
                      }`}
                    >
                      Female
                    </button>
                  </div>
                </div>

                {/* Grid Age, Weight, Height */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Age</label>
                    <input
                      type="number"
                      required
                      placeholder="24"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-850 hover:border-zinc-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-xl text-sm transition-all outline-none text-white text-center"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Weight (kg)</label>
                    <input
                      type="number"
                      required
                      placeholder="68"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-850 hover:border-zinc-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-xl text-sm transition-all outline-none text-white text-center"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Height (cm)</label>
                    <input
                      type="number"
                      required
                      placeholder="172"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-850 hover:border-zinc-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-xl text-sm transition-all outline-none text-white text-center"
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="flex flex-col gap-4 animate-fade-in">
                <div>
                  <h2 className="text-2xl font-serif font-bold text-white mb-1">Select Goal</h2>
                  <p className="text-zinc-400 text-xs">We will adjust calories according to your target</p>
                </div>

                {/* Goals select */}
                <div className="flex flex-col gap-3">
                  {[
                    { id: "lose", label: "Lose Weight", desc: "500 kcal deficit target" },
                    { id: "maintain", label: "Maintain Weight", desc: "TDEE match target" },
                    { id: "gain", label: "Gain Weight / Muscle", desc: "300 kcal surplus target" }
                  ].map((g) => (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => setGoal(g.id)}
                      className={`flex justify-between items-center p-4 rounded-xl border text-left transition-all cursor-pointer ${
                        goal === g.id 
                          ? "bg-amber-500/10 border-amber-500 text-amber-500" 
                          : "bg-zinc-900/50 border-zinc-850 text-zinc-400 hover:border-zinc-800"
                      }`}
                    >
                      <div>
                        <p className="font-semibold text-sm">{g.label}</p>
                        <p className="text-[10px] text-zinc-500 mt-0.5">{g.desc}</p>
                      </div>
                      <Activity className={`h-5 w-5 ${goal === g.id ? "text-amber-500" : "text-zinc-600"}`} />
                    </button>
                  ))}
                </div>

                {/* Live calculation box */}
                <div className="p-4 rounded-2xl bg-zinc-900/50 border border-zinc-850 flex items-center justify-between mt-1">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500">
                      <Calculator className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-zinc-400">Calculated Goal</p>
                      <p className="text-[10px] text-zinc-550">Mifflin-St Jeor formula</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold text-amber-500 font-mono">{calculateCalorieGoal()}</span>
                    <span className="text-[10px] text-zinc-500 font-medium ml-1">kcal / day</span>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-4 mt-2">
              {step > 1 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex items-center justify-center gap-2 px-4 py-3.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white rounded-xl transition-all cursor-pointer"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
              )}
              <button
                type="submit"
                disabled={isLoading}
                className="flex items-center justify-center gap-2 flex-1 py-3.5 bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold rounded-xl transition-all shadow-lg hover:shadow-amber-500/10 cursor-pointer disabled:opacity-50"
              >
                {step === 3 
                  ? (isLoading ? "Setting Up..." : "Complete Setup") 
                  : "Continue"
                }
                {step < 3 && <ArrowRight className="h-4 w-4" />}
              </button>
            </div>
          </form>

          {step === 1 && (
            <div className="mt-6 text-center text-xs text-zinc-400">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-amber-500 hover:underline font-semibold">
                Sign in here
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
