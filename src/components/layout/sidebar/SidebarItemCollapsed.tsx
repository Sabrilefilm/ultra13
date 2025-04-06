
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
    const data = typeof item.data === 'function' ? item.data('') : item.data;
    onClick(item.action, data);
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
