
import React from "react";
import { Button } from "@/components/ui/button";
import { SidebarItemProps } from "./types";
import { useNavigate } from "react-router-dom";

export const SidebarItemCollapsed: React.FC<SidebarItemProps> = ({ item, isActive, onClick }) => {
  const navigate = useNavigate();
  
  const getItemClass = (item: SidebarItemProps['item'], isActive: boolean) => {
    const baseClass = "w-full flex items-center justify-center px-3 py-2 text-sm rounded-md";
    
    if (isActive) {
      return `${baseClass} ${item.animated ? 'bg-gradient-to-r from-blue-600 to-blue-800 text-white animate-pulse' : 'bg-blue-800 text-white'}`;
    }
    
    return `${baseClass} text-slate-300 hover:bg-slate-700/50 hover:text-white`;
  };

  const handleClick = () => {
    const data = typeof item.data === 'function' ? item.data('') : item.data;
    
    if (item.action === "navigateTo" && typeof data === 'string') {
      if (data.startsWith('/')) {
        navigate(data);
      } else {
        navigate(`/${data}`);
      }
    } else {
      onClick(item.action, data);
    }
  };

  return (
    <Button 
      variant="ghost" 
      className={getItemClass(item, isActive)}
      onClick={handleClick}
    >
      <item.icon className="h-5 w-5" />
    </Button>
  );
};
