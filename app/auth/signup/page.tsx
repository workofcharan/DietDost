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
  Calculator,
  AlertCircle
} from "lucide-react";
import { syncSession } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (step < 3) {
      setStep(step + 1);
    } else {
      setIsLoading(true);
      try {
        const calorieGoal = calculateCalorieGoal();
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name: name || "DietDost User",
              age: parseInt(age) || 25,
              weight: parseFloat(weight) || 70,
              height: parseFloat(height) || 170,
              gender,
              goal,
              calorieGoal,
            }
          }
        });

        if (error) {
          setError(error.message);
          setIsLoading(false);
          return;
        }

        if (data.session) {
          syncSession(data.session);
          router.push("/dashboard");
        } else {
          setError("Check your email for a confirmation link to complete registration!");
          setIsLoading(false);
        }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "An unexpected error occurred during signup.";
        setError(message);
        setIsLoading(false);
      }
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setError(null);
      setStep(step - 1);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-secondary-soft dark:bg-zinc-950 flex flex-col justify-center items-center px-4 relative font-sans selection:bg-brand selection:text-black">
      <div className="w-full max-w-md z-10">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2 justify-center mb-6">
          <Utensils className="h-6 w-6 text-brand" />
          <span className="text-3xl font-extrabold font-serif tracking-tight text-black dark:text-white">
            Diet<span className="text-brand">Dost</span>
          </span>
        </Link>

        {/* Steps indicator */}
        <div className="flex justify-between items-center px-2 mb-4 text-xs text-zinc-500 dark:text-zinc-400 font-bold uppercase tracking-wider">
          <span className={step >= 1 ? "text-brand-strong dark:text-brand" : ""}>1. Profile</span>
          <div className="h-1 flex-1 mx-2 bg-zinc-200 dark:bg-zinc-800 rounded-none border border-black dark:border-zinc-700">
            <div className="h-full bg-brand transition-all" style={{ width: step === 1 ? "0%" : step === 2 ? "50%" : "100%" }}></div>
          </div>
          <span className={step >= 2 ? "text-brand-strong dark:text-brand" : ""}>2. Metrics</span>
          <div className="h-1 flex-1 mx-2 bg-zinc-200 dark:bg-zinc-800 rounded-none border border-black dark:border-zinc-700">
            <div className="h-full bg-brand transition-all" style={{ width: step <= 2 ? "0%" : "100%" }}></div>
          </div>
          <span className={step >= 3 ? "text-brand-strong dark:text-brand" : ""}>3. Goal</span>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-zinc-900 border-2 border-black dark:border-zinc-300 shadow-md p-8 text-left rounded-none">
          {error && (
            <div className="mb-4 p-4 bg-danger-soft border-2 border-danger text-danger-strong dark:text-danger text-sm flex items-start gap-2 rounded-none">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleNext} className="flex flex-col gap-5">
            {step === 1 && (
              <div className="flex flex-col gap-4 animate-fade-in">
                <div>
                  <h2 className="text-2xl font-black font-serif text-black dark:text-white mb-1">Create Account</h2>
                  <p className="text-zinc-500 dark:text-zinc-400 text-xs">Let&rsquo;s get started on your health journey</p>
                </div>

                {/* Name */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="signup-name" className="text-xs font-bold text-black dark:text-zinc-300 uppercase tracking-wider">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                    <input
                      id="signup-name"
                      type="text"
                      required
                      placeholder="Sri charan"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-white dark:bg-zinc-900 border-2 border-black dark:border-zinc-300 hover:border-black dark:hover:border-white focus:border-brand focus:ring-0 shadow-xs focus:shadow-sm rounded-none text-sm transition-all outline-none text-black dark:text-white placeholder:text-zinc-500"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="signup-email" className="text-xs font-bold text-black dark:text-zinc-300 uppercase tracking-wider">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                    <input
                      id="signup-email"
                      type="email"
                      required
                      placeholder="charan@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-white dark:bg-zinc-900 border-2 border-black dark:border-zinc-300 hover:border-black dark:hover:border-white focus:border-brand focus:ring-0 shadow-xs focus:shadow-sm rounded-none text-sm transition-all outline-none text-black dark:text-white placeholder:text-zinc-500"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="signup-password" className="text-xs font-bold text-black dark:text-zinc-300 uppercase tracking-wider">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                    <input
                      id="signup-password"
                      type="password"
                      required
                      placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-white dark:bg-zinc-900 border-2 border-black dark:border-zinc-300 hover:border-black dark:hover:border-white focus:border-brand focus:ring-0 shadow-xs focus:shadow-sm rounded-none text-sm transition-all outline-none text-black dark:text-white placeholder:text-zinc-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="flex flex-col gap-4 animate-fade-in">
                <div>
                  <h2 className="text-2xl font-black font-serif text-black dark:text-white mb-1">Your Metrics</h2>
                  <p className="text-zinc-500 dark:text-zinc-400 text-xs">Used to calculate your custom daily calorie budget</p>
                </div>

                {/* Gender */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-black dark:text-zinc-300 uppercase tracking-wider">Gender</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setGender("male")}
                      className={`py-3 text-sm font-extrabold rounded-none border-2 transition-all cursor-pointer ${gender === "male"
                        ? "bg-brand border-black text-black shadow-xs translate-x-0 translate-y-0"
                        : "bg-white dark:bg-zinc-900 border-black dark:border-zinc-300 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                        }`}
                    >
                      Male
                    </button>
                    <button
                      type="button"
                      onClick={() => setGender("female")}
                      className={`py-3 text-sm font-extrabold rounded-none border-2 transition-all cursor-pointer ${gender === "female"
                        ? "bg-brand border-black text-black shadow-xs translate-x-0 translate-y-0"
                        : "bg-white dark:bg-zinc-900 border-black dark:border-zinc-300 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                        }`}
                    >
                      Female
                    </button>
                  </div>
                </div>

                {/* Grid Age, Weight, Height */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="signup-age" className="text-xs font-bold text-black dark:text-zinc-300 uppercase tracking-wider">Age</label>
                    <input
                      id="signup-age"
                      type="number"
                      required
                      placeholder="24"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      className="w-full px-2 py-3 bg-white dark:bg-zinc-900 border-2 border-black dark:border-zinc-300 hover:border-black dark:hover:border-white focus:border-brand focus:ring-0 shadow-xs focus:shadow-sm rounded-none text-sm transition-all outline-none text-black dark:text-white text-center"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="signup-weight" className="text-xs font-bold text-black dark:text-zinc-300 uppercase tracking-wider">Weight (kg)</label>
                    <input
                      id="signup-weight"
                      type="number"
                      required
                      placeholder="68"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      className="w-full px-2 py-3 bg-white dark:bg-zinc-900 border-2 border-black dark:border-zinc-300 hover:border-black dark:hover:border-white focus:border-brand focus:ring-0 shadow-xs focus:shadow-sm rounded-none text-sm transition-all outline-none text-black dark:text-white text-center"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="signup-height" className="text-xs font-bold text-black dark:text-zinc-300 uppercase tracking-wider">Height (cm)</label>
                    <input
                      id="signup-height"
                      type="number"
                      required
                      placeholder="172"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      className="w-full px-2 py-3 bg-white dark:bg-zinc-900 border-2 border-black dark:border-zinc-300 hover:border-black dark:hover:border-white focus:border-brand focus:ring-0 shadow-xs focus:shadow-sm rounded-none text-sm transition-all outline-none text-black dark:text-white text-center"
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="flex flex-col gap-4 animate-fade-in">
                <div>
                  <h2 className="text-2xl font-black font-serif text-black dark:text-white mb-1">Select Goal</h2>
                  <p className="text-zinc-500 dark:text-zinc-400 text-xs">We will adjust calories according to your target</p>
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
                      className={`flex justify-between items-center p-4 border-2 transition-all cursor-pointer rounded-none text-left ${goal === g.id
                        ? "bg-brand-soft border-black text-black shadow-sm translate-x-0 translate-y-0"
                        : "bg-white dark:bg-zinc-900 border-black dark:border-zinc-300 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                        }`}
                    >
                      <div>
                        <p className="font-extrabold text-sm text-black dark:text-white">{g.label}</p>
                        <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-0.5">{g.desc}</p>
                      </div>
                      <Activity className={`h-5 w-5 ${goal === g.id ? "text-brand-strong" : "text-zinc-400"}`} />
                    </button>
                  ))}
                </div>

                {/* Live calculation box */}
                <div className="p-4 bg-brand-softer border-2 border-brand-strong flex items-center justify-between mt-1 rounded-none text-black">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 bg-brand-soft border border-black flex items-center justify-center text-black">
                      <Calculator className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider">Calculated Goal</p>
                      <p className="text-[10px] text-zinc-600">Mifflin-St Jeor formula</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-black font-mono text-black">{calculateCalorieGoal()}</span>
                    <span className="text-[10px] text-zinc-600 font-bold ml-1">kcal / day</span>
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
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 border-2 border-black dark:border-zinc-300 text-black dark:text-white rounded-none transition-all cursor-pointer shadow-xs active:shadow-2xs active:translate-x-0.5 active:translate-y-0.5"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
              )}
              <button
                type="submit"
                disabled={isLoading}
                className="flex items-center justify-center gap-2 flex-1 py-3.5 bg-brand hover:bg-brand-strong text-black font-extrabold border-2 border-black dark:border-zinc-300 shadow-sm hover:shadow-md active:shadow-2xs hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 rounded-none disabled:opacity-50 transition-all cursor-pointer"
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
            <div className="mt-6 text-center text-xs text-zinc-500 dark:text-zinc-400">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-brand-strong dark:text-brand hover:underline font-bold">
                Sign in here
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
