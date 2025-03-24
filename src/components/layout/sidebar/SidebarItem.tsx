
import React from "react";
import { Button } from "@/components/ui/button";
import { SidebarItemProps } from "./types";

export const SidebarItem: React.FC<SidebarItemProps> = ({ item, isActive, onClick }) => {
  const getItemClass = (item: SidebarItemProps['item'], isActive: boolean) => {
    const baseClass = "w-full flex items-center justify-start px-3 py-2 text-sm rounded-md";
    
    if (isActive) {
      return `${baseClass} ${item.animated ? 'bg-gradient-to-r from-blue-500 to-blue-700 text-white animate-pulse' : 'bg-purple-900/50 text-white'}`;
    }
    
    return `${baseClass} text-slate-300 hover:bg-slate-700/50 hover:text-white`;
  };

  return (
    <Button 
      variant="ghost" 
      className={getItemClass(item, isActive)}
      onClick={() => onClick(item.action, item.data)}
    >
      <item.icon className="h-5 w-5 mr-3" />
      <span>{item.label}</span>
    </Button>
  );
};
