"use client";

import Link from "next/link";
import { UtensilsCrossed } from "lucide-react";

interface BrandLogoProps {
  href?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizes = {
  sm: {
    icon: "h-8 w-8",
    text: "text-xl",
    sub: "text-[8px]",
  },
  md: {
    icon: "h-10 w-10",
    text: "text-2xl",
    sub: "text-[9px]",
  },
  lg: {
    icon: "h-12 w-12",
    text: "text-3xl",
    sub: "text-[10px]",
  },
};

export default function BrandLogo({ href = "/", size = "md", className = "" }: BrandLogoProps) {
  const s = sizes[size];
  const content = (
    <>
      <span className={`${s.icon} grid place-items-center border-2 border-black dark:border-brand bg-brand text-black shadow-xs`}>
        <UtensilsCrossed className="h-5/6 w-5/6 stroke-[2.5]" />
      </span>
      <span className="flex flex-col leading-none">
        <span className={`${s.text} font-black tracking-tight text-black dark:text-white`}>
          Diet<span className="text-brand-strong dark:text-brand">Dost</span>
        </span>
        <span className={`${s.sub} font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-400`}>
          Indian nutrition AI
        </span>
      </span>
    </>
  );

  return (
    <Link href={href} className={`inline-flex items-center gap-2.5 ${className}`}>
      {content}
    </Link>
  );
}
