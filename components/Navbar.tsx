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

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "AI Assistant", href: "/ai", icon: Sparkles },
    { name: "Weekly Review", href: "/review", icon: ClipboardList },
  ];

  return (
    <>
      {/* Desktop Top Header / Navbar */}
      <header className="hidden md:flex fixed top-0 left-0 right-0 h-16 items-center justify-between px-8 bg-white/85 backdrop-blur-xl border-b border-zinc-200 z-50 dark:bg-zinc-950/80 dark:border-zinc-800">
        <Link href="/" className="flex items-center gap-2">
          <Utensils className="h-6 w-6 text-amber-500" />
          <span className="text-xl font-bold font-serif tracking-tight text-zinc-950 dark:text-white">
            Diet<span className="text-amber-500">Dost</span>
          </span>
        </Link>

        <nav className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-zinc-100/70 p-1 dark:border-zinc-800 dark:bg-zinc-900/60">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                  isActive
                    ? "bg-white text-zinc-950 shadow-sm dark:bg-zinc-800 dark:text-white"
                    : "text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white"
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
          <Link
            href="/auth/login"
            className="text-sm font-semibold text-zinc-500 hover:text-zinc-950 transition-colors dark:text-zinc-400 dark:hover:text-white"
          >
            Sign In
          </Link>
          <Link
            href="/auth/signup"
            className="flex items-center justify-center px-4 py-2 text-sm bg-zinc-950 hover:bg-zinc-800 text-white rounded-lg transition-colors font-semibold dark:bg-amber-500 dark:hover:bg-amber-600 dark:text-zinc-950"
          >
            Sign Up
          </Link>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white/90 backdrop-blur-lg border-t border-zinc-200 flex items-center justify-around px-2 z-50 pb-safe dark:bg-zinc-950/90 dark:border-zinc-800">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-1 w-14 h-12 transition-all rounded-lg ${
                isActive ? "text-amber-500" : "text-zinc-500"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-[10px] font-medium leading-none">{item.name.split(" ")[0]}</span>
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
