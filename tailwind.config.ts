import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: "hsl(var(--card))",
        muted: "hsl(var(--muted))",
        border: "hsl(var(--border))",
        brand: {
          DEFAULT: "var(--brand)",
          strong: "var(--brand-strong)",
          soft: "var(--brand-soft)",
          softer: "var(--brand-softer)",
        },
        success: {
          DEFAULT: "var(--success)",
          strong: "var(--success-strong)",
          soft: "var(--success-soft)",
        },
        danger: {
          DEFAULT: "var(--danger)",
          strong: "var(--danger-strong)",
          soft: "var(--danger-soft)",
        },
        warning: {
          DEFAULT: "var(--warning)",
          strong: "var(--warning-strong)",
          soft: "var(--warning-soft)",
        },
        // convenience aliases
        "brand-primary": "var(--brand)",
        "success-soft": "var(--success-soft)",
        "danger-soft": "var(--danger-soft)",
        "warning-soft": "var(--warning-soft)",
      },
      borderRadius: {
        none: "0px",
        sm: "0px",
        DEFAULT: "0px",
        md: "0px",
        lg: "0px",
        xl: "0px",
        "2xl": "0px",
        "3xl": "0px",
      },
      boxShadow: {
        "2xs": "1px 1px 0 0 var(--color-border-default)",
        xs: "2px 2px 0 0 var(--color-border-default)",
        sm: "3px 3px 0 0 var(--color-border-default)",
        md: "4px 4px 0 0 var(--color-border-default)",
        lg: "6px 6px 0 0 var(--color-border-default)",
        xl: "10px 10px 0 1px var(--color-border-default)",
        "2xl": "16px 16px 0 1px var(--color-border-default)",
      },
      borderWidth: {
        "3": "3px",
      },
    },
  },
  plugins: [],
};
export default config;
