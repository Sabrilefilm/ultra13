
"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes"

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: string;
  storageKey?: string;
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  // Force dark theme for the whole application and apply additional styling
  React.useEffect(() => {
    document.documentElement.classList.add("dark");
    document.body.classList.add("dark");
    localStorage.setItem("theme", "dark");
    
    // Add additional styling to handle contrast issues
    const style = document.createElement('style');
    style.innerHTML = `
      .dark {
        color-scheme: dark;
      }
      .dark .bg-white, .dark .bg-white\/10, .dark .bg-white\/20, .dark .bg-white\/30 {
        background-color: rgba(30, 41, 59, 0.8) !important;
      }
      .dark .text-white {
        color: #ffffff !important;
      }
      .dark .border-white\/10 {
        border-color: rgba(139, 92, 246, 0.3) !important;
      }
      .dark .hover\\:bg-white\/10:hover {
        background-color: rgba(139, 92, 246, 0.2) !important;
      }
      .dark .hover\\:bg-white\/20:hover {
        background-color: rgba(139, 92, 246, 0.3) !important;
      }
      .dark .bg-slate-700 {
        background-color: rgba(51, 65, 85, 0.9) !important;
      }
      .dark .bg-slate-800 {
        background-color: rgba(30, 41, 59, 0.9) !important;
      }
      .dark .bg-slate-900 {
        background-color: rgba(15, 23, 42, 0.95) !important;
      }
      .dark .bg-card {
        background-color: rgba(30, 41, 59, 0.9) !important;
      }
      .dark .text-slate-200 {
        color: rgba(226, 232, 240, 0.95) !important;
      }
      .dark .text-slate-300 {
        color: rgba(203, 213, 225, 0.95) !important;
      }
      .dark .text-slate-400 {
        color: rgba(148, 163, 184, 0.95) !important;
      }
      .dark .from-slate-900 {
        --tw-gradient-from: rgba(15, 23, 42, 0.95) !important;
      }
      .dark .to-slate-950 {
        --tw-gradient-to: rgba(3, 6, 23, 0.98) !important;
      }
      .dark .border-slate-700\\/50 {
        border-color: rgba(51, 65, 85, 0.5) !important;
      }
      .dark .border-purple-800\\/30 {
        border-color: rgba(107, 33, 168, 0.3) !important;
      }
      .dark .border-purple-800\\/50 {
        border-color: rgba(107, 33, 168, 0.5) !important;
      }
      .dark .border-purple-900\\/30 {
        border-color: rgba(88, 28, 135, 0.3) !important;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  
  return <NextThemesProvider defaultTheme="dark" forcedTheme="dark" {...props}>{children}</NextThemesProvider>
}

export { useTheme }
