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
        primary: {
          50: "#ecfeff",
          100: "#cffafe",
          200: "#a5f3fc",
          300: "#67e8f9",
          400: "#22d3ee",
          500: "#06b6d4",
          600: "#0891b2",
          700: "#0e7490",
          800: "#155e75",
          900: "#164e63",
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        accent: {
          50: "#ecfdf5",
          100: "#d1fae5",
          500: "#10b981",
          600: "#059669",
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        calm: {
          slate: "#f1f5f9",
          mint: "#e6f4ea",
          sky: "#e0f2fe",
          amber: "#fef3c7",
          rose: "#ffe4e6",
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        border: "var(--border)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"],
        heading: ["var(--font-heading)", "Plus Jakarta Sans", "Inter", "sans-serif"],
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
        "3xl": "1.75rem",
      },
      boxShadow: {
        soft: "0 4px 20px -2px rgba(14, 116, 144, 0.08), 0 2px 6px -1px rgba(0, 0, 0, 0.04)",
        card: "0 10px 30px -5px rgba(0, 0, 0, 0.05), 0 2px 8px -2px rgba(0, 0, 0, 0.02)",
      },
    },
  },
  plugins: [],
};

export default config;
