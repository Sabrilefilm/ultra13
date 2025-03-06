
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { Switch } from "./switch";

export function ThemeToggle() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check if user previously set dark mode
    const storedTheme = localStorage.getItem("theme");
    const initialDarkMode = 
      storedTheme === "dark" || 
      (!storedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches);
    
    setIsDarkMode(initialDarkMode);
    
    // Apply the theme on initial load
    if (initialDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    
    if (isDarkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Sun className="h-4 w-4 text-gray-500 dark:text-gray-400" />
      <Switch 
        checked={isDarkMode} 
        onCheckedChange={toggleTheme}
        aria-label="Toggle dark mode"
      />
      <Moon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
    </div>
  );
}
