
import React from "react";
import { Badge } from "@/components/ui/badge";
import { ThemeFilterProps } from "./types";

export const ThemeFilter: React.FC<ThemeFilterProps> = ({ 
  themes, 
  selectedTheme, 
  onThemeSelect 
}) => {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {themes.map(theme => (
        <Badge 
          key={theme} 
          variant={selectedTheme === theme ? "default" : "outline"}
          className={`cursor-pointer ${selectedTheme === theme ? 'bg-blue-500' : ''}`}
          onClick={() => onThemeSelect(theme)}
        >
          {theme === "all" ? "Toutes les thématiques" : theme}
        </Badge>
      ))}
    </div>
  );
};
