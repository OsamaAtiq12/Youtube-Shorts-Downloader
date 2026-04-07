import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(240 5% 84%)",
        input: "hsl(240 5% 84%)",
        ring: "hsl(252 100% 67%)",
        background: "hsl(240 20% 98%)",
        foreground: "hsl(240 10% 12%)",
        primary: {
          DEFAULT: "hsl(252 100% 67%)",
          foreground: "hsl(0 0% 100%)",
        },
        card: {
          DEFAULT: "hsl(0 0% 100%)",
          foreground: "hsl(240 10% 12%)",
        },
      },
      boxShadow: {
        premium: "0 8px 30px rgba(72, 61, 255, 0.15)",
      },
    },
  },
  plugins: [],
};

export default config;
