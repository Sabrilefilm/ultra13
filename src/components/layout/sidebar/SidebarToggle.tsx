
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface SidebarToggleProps {
  collapsed: boolean;
  onToggle: () => void;
}

export const SidebarToggle: React.FC<SidebarToggleProps> = ({ collapsed, onToggle }) => {
  return (
    <Button variant="ghost" size="icon" onClick={onToggle} className="text-slate-300 hover:text-white">
      {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
    </Button>
  );
};
