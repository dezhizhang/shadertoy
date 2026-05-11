import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#0a0a0c",
          "1": "#0f0f12",
          "2": "#161619",
          "3": "#1f1f24",
          "4": "#2a2a30",
        },
        bone: {
          DEFAULT: "#f4f4ee",
          muted: "#9d9da6",
          dim: "#5b5b63",
        },
        acid: {
          DEFAULT: "#d6ff3a",
          dim: "#b8df1d",
        },
        flare: "#ff5d2a",
        wave: "#5eead4",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "ui-serif", "Georgia", "serif"],
        sans: ["var(--font-bricolage)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      letterSpacing: {
        tightest: "-0.045em",
        widerer: "0.22em",
      },
      animation: {
        "drift-a": "drift-a 22s ease-in-out infinite",
        "drift-b": "drift-b 28s ease-in-out infinite",
        "drift-c": "drift-c 34s ease-in-out infinite",
        "pulse-dot": "pulseDot 2.4s ease-in-out infinite",
        "fade-up": "fadeUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) both",
        "marquee": "marquee 36s linear infinite",
        "spin-slow": "spin 22s linear infinite",
      },
      keyframes: {
        "drift-a": {
          "0%, 100%": { transform: "translate(-8%, -6%) scale(1)" },
          "50%": { transform: "translate(18%, 12%) scale(1.18)" },
        },
        "drift-b": {
          "0%, 100%": { transform: "translate(12%, 8%) scale(1.1)" },
          "50%": { transform: "translate(-14%, -8%) scale(0.95)" },
        },
        "drift-c": {
          "0%, 100%": { transform: "translate(0%, 0%) scale(1)" },
          "50%": { transform: "translate(-18%, 20%) scale(1.12)" },
        },
        pulseDot: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.4", transform: "scale(0.7)" },
        },
        fadeUp: {
          from: { opacity: "0", transform: "translateY(14px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        marquee: {
          from: { transform: "translateX(0%)" },
          to: { transform: "translateX(-50%)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
