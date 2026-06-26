"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Utensils, Mail, Lock, ArrowRight, AlertCircle } from "lucide-react";
import { syncSession } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        setIsLoading(false);
        return;
      }

      if (data.session) {
        syncSession(data.session);
        router.push("/dashboard");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An unexpected error occurred.";
      setError(message);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-secondary-soft dark:bg-zinc-950 flex flex-col justify-center items-center px-4 relative font-sans selection:bg-brand selection:text-black">
      <div className="w-full max-w-md z-10">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2 justify-center mb-8">
          <Utensils className="h-6 w-6 text-brand" />
          <span className="text-3xl font-extrabold font-serif tracking-tight text-black dark:text-white">
            Diet<span className="text-brand">Dost</span>
          </span>
        </Link>

        {/* Card */}
        <div className="bg-white dark:bg-zinc-900 border-2 border-black dark:border-zinc-300 shadow-md p-8 text-left rounded-none">
          <h2 className="text-2xl font-black font-serif text-black dark:text-white mb-2">Welcome Back</h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-6">Log in to track today&rsquo;s Indian meals &amp; macros</p>

          {error && (
            <div className="mb-4 p-4 bg-danger-soft border-2 border-danger text-danger-strong dark:text-danger text-sm flex items-start gap-2 rounded-none">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="login-email" className="text-xs font-bold text-black dark:text-zinc-300 uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                <input
                  id="login-email"
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white dark:bg-zinc-900 border-2 border-black dark:border-zinc-300 hover:border-black dark:hover:border-white focus:border-brand focus:ring-0 shadow-xs focus:shadow-sm rounded-none text-sm transition-all outline-none text-black dark:text-white placeholder:text-zinc-500"
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="login-password" className="text-xs font-bold text-black dark:text-zinc-300 uppercase tracking-wider">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                <input
                  id="login-password"
                  type="password"
                  required
                  placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white dark:bg-zinc-900 border-2 border-black dark:border-zinc-300 hover:border-black dark:hover:border-white focus:border-brand focus:ring-0 shadow-xs focus:shadow-sm rounded-none text-sm transition-all outline-none text-black dark:text-white placeholder:text-zinc-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center justify-center gap-2 w-full py-3.5 mt-2 bg-brand hover:bg-brand-strong text-black font-extrabold border-2 border-black dark:border-zinc-300 shadow-sm hover:shadow-md active:shadow-2xs transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 rounded-none disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? "Signing In..." : "Sign In"}
              {!isLoading && <ArrowRight className="h-4 w-4" />}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-zinc-500 dark:text-zinc-400">
            Don&rsquo;t have an account?{" "}
            <Link href="/auth/signup" className="text-brand-strong dark:text-brand hover:underline font-bold">
              Create one here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
