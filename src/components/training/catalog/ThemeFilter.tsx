
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ThemeFilterProps } from "./types";

export const ThemeFilter: React.FC<ThemeFilterProps> = ({ 
  themes, 
  selectedTheme, 
  onThemeSelect 
}) => {
  return (
    <div className="mb-4">
      <h3 className="text-sm font-medium mb-2">Filtrer par thème:</h3>
      <ScrollArea className="w-full whitespace-nowrap pb-2">
        <div className="flex gap-2">
          {themes.map(theme => (
            <Button
              key={theme}
              variant={selectedTheme === theme ? "default" : "outline"}
              size="sm"
              className={`text-xs ${selectedTheme === theme 
                ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
              onClick={() => onThemeSelect(theme)}
            >
              {theme === 'all' ? 'Tous les thèmes' : theme}
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
