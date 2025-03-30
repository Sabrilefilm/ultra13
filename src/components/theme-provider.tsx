
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
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  
  return <NextThemesProvider defaultTheme="dark" forcedTheme="dark" {...props}>{children}</NextThemesProvider>
}

export { useTheme }
