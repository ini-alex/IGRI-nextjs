import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ios: {
          bg: "var(--ios-bg)",
          surface: "var(--ios-surface)",
          "surface-secondary": "var(--ios-surface-secondary)",
          text: {
            primary: "var(--ios-text-primary)",
            secondary: "var(--ios-text-secondary)",
            tertiary: "var(--ios-text-tertiary)",
          },
          separator: "var(--ios-separator)",
          accent: "var(--ios-accent)",
          "accent-secondary": "var(--ios-accent-secondary)",
          green: "var(--ios-green)",
          orange: "var(--ios-orange)",
          red: "var(--ios-red)",
          yellow: "var(--ios-yellow)",
          purple: "var(--ios-purple)",
          teal: "var(--ios-teal)",
        },
      },
      borderRadius: {
        'ios-sm': '8px',
        'ios-md': '12px',
        'ios-lg': '16px',
        'ios-xl': '20px',
        'ios-full': '9999px',
      },
      boxShadow: {
        'ios-sm': '0 1px 3px rgba(0,0,0,0.1)',
        'ios-md': '0 4px 20px rgba(0,0,0,0.08)',
        'ios-lg': '0 10px 40px rgba(0,0,0,0.12)',
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "SF Pro Text", "sans-serif"],
      },
      keyframes: {
        iosSpring: {
          "0%": { transform: "scale(0.9)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        pulseDot: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.5", transform: "scale(1.2)" },
        },
        slideDown: {
          from: { transform: "translateX(-50%) translateY(-100px)" },
          to: { transform: "translateX(-50%) translateY(0)" },
        },
        skeletonShimmer: {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
        sirenPulse: {
          "0%, 100%": { transform: "scale(1)", opacity: "1" },
          "50%": { transform: "scale(1.3)", opacity: "0.5" },
        },
        bellShake: {
          "0%, 100%": { transform: "rotate(0)" },
          "25%": { transform: "rotate(-15deg)" },
          "75%": { transform: "rotate(15deg)" },
        },
        modalUp: {
          from: { opacity: "0", transform: "translateY(50px) scale(0.9)" },
          to: { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        fadeIn: {
          from: { opacity: "0", transform: "translateY(10px)" },
          to": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "ios-spring": "iosSpring 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
        "pulse-dot": "pulseDot 2s infinite",
        "slide-down": "slideDown 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
        skeleton: "skeletonShimmer 1.5s infinite",
      },
    },
  },
  plugins: [],
};

export default config;