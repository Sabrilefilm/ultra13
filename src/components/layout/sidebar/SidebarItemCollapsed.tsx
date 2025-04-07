
import React from "react";
import { Button } from "@/components/ui/button";
import { SidebarItemProps } from "./types";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const SidebarItemCollapsed: React.FC<SidebarItemProps> = ({ item, isActive, onClick }) => {
  const getItemClass = (item: SidebarItemProps['item'], isActive: boolean) => {
    const baseClass = "w-full flex items-center justify-center p-1.5 text-sm rounded-md";
    
    if (isActive) {
      return `${baseClass} ${item.animated ? 'bg-gradient-to-r from-blue-600 to-blue-800 text-white animate-pulse' : 'bg-blue-800 text-white'}`;
    }
    
    return `${baseClass} text-slate-300 hover:bg-slate-700/50 hover:text-white`;
  };

  const handleClick = () => {
    try {
      if (item.action === 'toggle' && typeof item.data === 'string') {
        // Action spéciale pour les items avec enfants
        onClick('toggle', item.data);
        return;
      }
      
      const data = typeof item.data === 'function' ? item.data(item.roles[0] || '') : item.data;
      if (item.action === 'navigate' && typeof data === 'string') {
        // Ensure data starts with a valid path character
        const path = data.startsWith('/') ? data : `/${data}`;
        onClick(item.action, path);
      } else {
        onClick(item.action, data);
      }
    } catch (error) {
      console.error("Error in SidebarItemCollapsed click handler:", error);
    }
  };

  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <Button 
            variant="ghost" 
            className={getItemClass(item, isActive)}
            onClick={handleClick}
          >
            <item.icon className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>{item.label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
