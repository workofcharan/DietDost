"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Search, 
  Sparkles, 
  ClipboardList, 
  User, 
  Utensils 
} from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Food Search", href: "/food", icon: Search },
    { name: "AI Assistant", href: "/ai", icon: Sparkles },
    { name: "Weekly Review", href: "/review", icon: ClipboardList },
    { name: "Profile", href: "/profile", icon: User },
  ];

  return (
    <>
      {/* Desktop Top Header / Navbar */}
      <header className="hidden md:flex fixed top-0 left-0 right-0 h-16 items-center justify-between px-8 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800 z-50">
        <Link href="/" className="flex items-center gap-2">
          <Utensils className="h-6 w-6 text-amber-500" />
          <span className="text-xl font-bold font-serif tracking-tight">
            Diet<span className="text-amber-500">Dost</span>
          </span>
        </Link>

        <nav className="flex items-center gap-6">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-amber-500 ${
                  isActive ? "text-amber-500" : "text-zinc-400"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-4">
          <Link
            href="/auth/login"
            className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/auth/signup"
            className="flex items-center justify-center px-4 py-2 text-sm font-medium bg-amber-500 hover:bg-amber-600 text-zinc-950 rounded-lg transition-colors font-semibold"
          >
            Sign Up
          </Link>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-zinc-950/90 backdrop-blur-lg border-t border-zinc-800 flex items-center justify-around px-2 z-50 pb-safe">
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
    </>
  );
}
