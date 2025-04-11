
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { Switch } from "./switch";

export function ThemeToggle() {
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    // Force dark mode
    document.documentElement.classList.add("dark");
    localStorage.setItem("theme", "dark");
    setIsDarkMode(true);
  }, []);

  const toggleTheme = () => {
    // Always keep dark mode
    setIsDarkMode(true);
    document.documentElement.classList.add("dark");
    localStorage.setItem("theme", "dark");
  };

  return (
    <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm px-3 py-1 rounded-full border border-white/10">
      <Sun className="h-4 w-4 text-gray-400" />
      <Switch 
        checked={isDarkMode} 
        onCheckedChange={toggleTheme}
        aria-label="Toggle dark mode"
        disabled
      />
      <Moon className="h-4 w-4 text-purple-400" />
    </div>
  );
}
