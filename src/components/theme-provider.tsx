
"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes"

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: string;
  storageKey?: string;
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  // Force dark theme for the whole application
  React.useEffect(() => {
    document.documentElement.classList.add("dark");
    localStorage.setItem("theme", "dark");
  }, []);
  
  return <NextThemesProvider defaultTheme="dark" forcedTheme="dark" {...props}>{children}</NextThemesProvider>
}

export { useTheme }
