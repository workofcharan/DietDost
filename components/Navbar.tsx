"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Sparkles, 
  ClipboardList, 
  Utensils 
} from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { getUser, clearUser } from "@/lib/auth";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Navbar() {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    setUser(getUser());
    
    // Subscribe to auth state updates to reactively update navigation header
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        const meta = session.user.user_metadata || {};
        setUser({
          name: meta.name || session.user.email?.split("@")[0] || "DietDost User",
          email: session.user.email || "",
          calorieGoal: Number(meta.calorieGoal) || 2000,
          goal: meta.goal || "maintain",
        });
      } else {
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    clearUser();
    setUser(null);
    window.location.href = "/";
  };

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "AI Assistant", href: "/ai", icon: Sparkles },
    { name: "Weekly Review", href: "/review", icon: ClipboardList },
  ];

  return (
    <>
      {/* Desktop Top Header / Navbar */}
      <header className="hidden md:flex fixed top-0 left-0 right-0 h-16 items-center justify-between px-8 bg-white border-b-2 border-black z-50 dark:bg-zinc-950 dark:border-zinc-300">
        <Link href="/" className="flex items-center gap-2">
          <Utensils className="h-6 w-6 text-brand" />
          <span className="text-xl font-black font-serif tracking-tight text-black dark:text-white">
            Diet<span className="text-brand">Dost</span>
          </span>
        </Link>

        <nav className="flex items-center gap-1 border-2 border-black bg-brand p-1 shadow-sm dark:border-zinc-300 dark:bg-zinc-900">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-3 py-2 text-sm font-extrabold transition-colors rounded-none ${
                  isActive
                    ? "bg-white text-black border border-black dark:bg-zinc-100 dark:text-black dark:border-zinc-700"
                    : "text-black hover:bg-brand-strong dark:text-zinc-300 dark:hover:text-white"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-black dark:text-zinc-300">Namaste, {user.name}</span>
              <button
                onClick={handleSignOut}
                className="border-2 border-black dark:border-zinc-300 bg-white hover:bg-zinc-100 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-black dark:text-white px-3 py-1.5 text-xs font-bold shadow-xs active:translate-x-0.5 active:translate-y-0.5 rounded-none cursor-pointer transition-all"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="text-sm font-bold text-zinc-600 hover:text-black dark:text-zinc-400 dark:hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                className="bg-brand border-2 border-black dark:border-zinc-300 hover:bg-brand-strong text-black font-extrabold px-4 py-2 text-sm shadow-sm hover:shadow-md active:shadow-2xs hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 rounded-none transition-all"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t-2 border-black flex items-center justify-around px-2 z-50 pb-safe dark:bg-zinc-950 dark:border-zinc-300">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-1 w-14 h-12 transition-all rounded-none ${
                isActive ? "text-brand-strong dark:text-brand" : "text-zinc-500"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-[10px] font-bold leading-none">{item.name.split(" ")[0]}</span>
            </Link>
          );
        })}
      </nav>
      <div className="fixed right-4 top-4 z-50 md:hidden">
        <ThemeToggle />
      </div>
    </>
  );
}
