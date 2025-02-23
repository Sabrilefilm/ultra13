import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#8B5CF6",
          hover: "#7C3AED",
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#6B7280",
          hover: "#4B5563",
          foreground: "#ffffff",
        },
        accent: {
          DEFAULT: "#F0F9FF",
          hover: "#E0F2FE",
          foreground: "#1A1F2C",
        },
        card: {
          DEFAULT: "rgba(30, 41, 59, 0.8)",
          foreground: "#ffffff",
        },
        success: {
          DEFAULT: "#10B981",
          hover: "#059669",
          foreground: "#ffffff",
        },
        warning: {
          DEFAULT: "#F59E0B",
          hover: "#D97706",
          foreground: "#ffffff",
        },
        error: {
          DEFAULT: "#EF4444",
          hover: "#DC2626",
          foreground: "#ffffff",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "neon-pulse": {
          "0%, 100%": { 
            borderColor: "rgba(99, 102, 241, 0.7)",
            boxShadow: "0 0 20px rgba(99, 102, 241, 0.5)"
          },
          "50%": { 
            borderColor: "rgba(139, 92, 246, 0.7)",
            boxShadow: "0 0 30px rgba(139, 92, 246, 0.5)"
          }
        },
        "neon-night": {
          "0%, 100%": { 
            borderColor: "rgba(59, 130, 246, 0.7)",
            boxShadow: "0 0 20px rgba(59, 130, 246, 0.5)"
          },
          "50%": { 
            borderColor: "rgba(147, 51, 234, 0.7)",
            boxShadow: "0 0 30px rgba(147, 51, 234, 0.5)"
          }
        },
        "neon-night-2": {
          "0%, 100%": { 
            borderColor: "rgba(147, 51, 234, 0.7)",
            boxShadow: "0 0 20px rgba(147, 51, 234, 0.5)"
          },
          "50%": { 
            borderColor: "rgba(59, 130, 246, 0.7)",
            boxShadow: "0 0 30px rgba(59, 130, 246, 0.5)"
          }
        },
        "neon-day": {
          "0%, 100%": { 
            borderColor: "rgba(14, 165, 233, 0.7)",
            boxShadow: "0 0 20px rgba(14, 165, 233, 0.5)"
          },
          "50%": { 
            borderColor: "rgba(234, 179, 8, 0.7)",
            boxShadow: "0 0 30px rgba(234, 179, 8, 0.5)"
          }
        },
        "neon-day-2": {
          "0%, 100%": { 
            borderColor: "rgba(234, 179, 8, 0.7)",
            boxShadow: "0 0 20px rgba(234, 179, 8, 0.5)"
          },
          "50%": { 
            borderColor: "rgba(14, 165, 233, 0.7)",
            boxShadow: "0 0 30px rgba(14, 165, 233, 0.5)"
          }
        },
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideIn: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
        pulse: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-1000px 0" },
          "100%": { backgroundPosition: "1000px 0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "neon-pulse": "neon-pulse 4s ease-in-out infinite",
        "neon-night": "neon-night 4s ease-in-out infinite",
        "neon-night-2": "neon-night-2 4s ease-in-out infinite",
        "neon-day": "neon-day 4s ease-in-out infinite",
        "neon-day-2": "neon-day-2 4s ease-in-out infinite",
        fadeIn: "fadeIn 0.5s ease-out forwards",
        slideIn: "slideIn 0.3s ease-out forwards",
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        shimmer: "shimmer 2s linear infinite",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "gradient-shine": "linear-gradient(to right, transparent, rgba(255,255,255,0.1), transparent)",
      },
      boxShadow: {
        glass: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        glow: "0 0 15px rgba(139,92,246,0.5)",
        highlight: "inset 0 1px 0 0 rgba(255, 255, 255, 0.05)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
