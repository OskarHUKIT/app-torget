import type { Config } from "tailwindcss";

const config: Config = {
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
        muted: "var(--muted)",
        "nytti-pink": "#E93B8A",
        "nytti-pink-dark": "#C41E6B",
        "nytti-pink-light": "var(--nytti-light)",
        surface: "var(--card)",
        "surface-hover": "var(--card-hover)",
        border: "var(--border)",
        contrast: "var(--contrast)",
      },
      fontFamily: {
        display: ["Space Grotesk", "system-ui", "sans-serif"],
        body: ["Outfit", "system-ui", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.4s ease-out forwards",
        "slide-up": "slideUp 0.5s ease-out forwards",
        "pulse-nytti": "pulse-nytti 2s ease-in-out infinite",
        "float-soft": "float-soft 3s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        slideUp: { "0%": { opacity: "0", transform: "translateY(20px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        "pulse-nytti": { "0%, 100%": { opacity: "1" }, "50%": { opacity: "0.7" } },
        "float-soft": { "0%, 100%": { transform: "translateY(0px)" }, "50%": { transform: "translateY(-6px)" } },
      },
      boxShadow: {
        card: "0 2px 16px rgba(233, 59, 138, 0.08), 0 1px 3px rgba(0,0,0,0.04)",
        "card-hover": "0 16px 48px rgba(233, 59, 138, 0.18), 0 4px 12px rgba(0,0,0,0.08)",
        glow: "0 0 48px rgba(233, 59, 138, 0.25)",
      },
    },
  },
  plugins: [],
};
export default config;
