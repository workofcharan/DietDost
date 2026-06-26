import type { Metadata } from "next";
import { Fraunces, JetBrains_Mono, Outfit } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  style: ["normal", "italic"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "DietDost - AI-Powered Indian Food Calorie & Nutrition Tracker",
  description:
    "An AI-powered nutrition tracker that finally understands what's actually on an Indian plate. Seeded database, free-text logging, chatbot, and weekly reviews.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${outfit.variable} ${fraunces.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        <ThemeProvider>
          <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(245,158,11,0.08),transparent_360px)]" />
            <div className="relative z-10">{children}</div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
