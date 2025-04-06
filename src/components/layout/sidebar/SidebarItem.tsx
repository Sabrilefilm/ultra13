
import React from "react";
import { Button } from "@/components/ui/button";
import { SidebarItemProps } from "./types";

export const SidebarItem: React.FC<SidebarItemProps> = ({ item, isActive, onClick }) => {
  const getItemClass = (item: SidebarItemProps['item'], isActive: boolean) => {
    const baseClass = "w-full flex items-center justify-start px-2 py-1.5 text-sm rounded-md";
    
    if (isActive) {
      return `${baseClass} ${item.animated ? 'bg-gradient-to-r from-blue-600 to-blue-800 text-white animate-pulse' : 'bg-blue-800 text-white'}`;
    }
    
    return `${baseClass} text-slate-300 hover:bg-slate-700/50 hover:text-white`;
  };

  const handleClick = () => {
    try {
      const data = typeof item.data === 'function' ? item.data('') : item.data;
      if (item.action === 'navigate' && typeof data === 'string') {
        // Ensure data starts with a valid path character
        const path = data.startsWith('/') ? data : `/${data}`;
        onClick(item.action, path);
      } else {
        onClick(item.action, data);
      }
    } catch (error) {
      console.error("Error in SidebarItem click handler:", error);
    }
  };

  return (
    <Button 
      variant="ghost" 
      className={getItemClass(item, isActive)}
      onClick={handleClick}
    >
      <item.icon className="h-4 w-4 mr-2" />
      <span className="text-sm">{item.label}</span>
    </Button>
  );
};
