import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        "foreground-muted": "var(--foreground-muted)",
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          hover: "var(--primary-hover)",
          foreground: "var(--primary-foreground)",
          soft: "var(--primary-soft)",
          // Palette tints
          50: "#F0F7F7",
          100: "#E0EFF0",
          200: "#C2DFE2",
          300: "#94C7CC",
          400: "#5FA5AD",
          500: "#37868F",
          600: "#0D5C63", // Core Primary
          700: "#0A4E54",
          800: "#084146",
          900: "#063539",
        },
        warm: {
          DEFAULT: "var(--accent-warm)",
          soft: "var(--accent-warm-soft)",
          foreground: "var(--accent-warm-foreground)",
          50: "#FFF7F5",
          100: "#FDF2EE",
          200: "#F9DDD4",
          300: "#F3C1B2",
          400: "#EB9C87",
          500: "#E07A5F", // Core Accent
          600: "#CB6246",
          700: "#A94D36",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        border: {
          DEFAULT: "var(--border)",
          subtle: "var(--border-subtle)",
        },
        risk: {
          low: "var(--risk-low)",
          "low-bg": "var(--risk-low-bg)",
          "low-border": "var(--risk-low-border)",
          med: "var(--risk-med)",
          "med-bg": "var(--risk-med-bg)",
          "med-border": "var(--risk-med-border)",
          high: "var(--risk-high)",
          "high-bg": "var(--risk-high-bg)",
          "high-border": "var(--risk-high-border)",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "system-ui", "-apple-system", "sans-serif"],
        heading: ["var(--font-heading)", "Plus Jakarta Sans", "Inter", "sans-serif"],
        hindi: ["var(--font-devanagari)", "Noto Sans Devanagari", "sans-serif"],
      },
      fontSize: {
        sm: ["0.875rem", { lineHeight: "1.4" }],       // 14px (minimum)
        base: ["1.0625rem", { lineHeight: "1.6" }],    // 17px body
        lg: ["1.1875rem", { lineHeight: "1.5" }],      // 19px
        xl: ["1.375rem", { lineHeight: "1.4" }],       // 22px
        "2xl": ["1.75rem", { lineHeight: "1.25" }],    // 28px
        "3xl": ["2.25rem", { lineHeight: "1.2" }],     // 36px
        "4xl": ["2.75rem", { lineHeight: "1.15" }],    // 44px
        "5xl": ["3.25rem", { lineHeight: "1.1" }],     // 52px
      },
      spacing: {
        // 4/8 scale
        "1": "4px",
        "2": "8px",
        "3": "12px",
        "4": "16px",
        "5": "20px",
        "6": "24px",
        "8": "32px",
        "10": "40px",
        "12": "48px",
        "16": "64px",
        "20": "80px",
        "24": "96px",
      },
      boxShadow: {
        subtle: "var(--shadow-subtle)",
        card: "var(--shadow-card)",
        hover: "var(--shadow-hover)",
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
        full: "var(--radius-full)",
      },
    },
  },
  plugins: [],
};

export default config;
