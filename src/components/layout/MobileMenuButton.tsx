
import React from "react";
import { Button } from "@/components/ui/button";
import { MenuIcon } from "lucide-react";

interface MobileMenuButtonProps {
  onClick: () => void;
}

export const MobileMenuButton: React.FC<MobileMenuButtonProps> = ({ onClick }) => {
  return (
    <div className="md:hidden fixed top-4 left-4 z-50">
      <Button 
        variant="outline" 
        size="sm"
        className="bg-slate-800/90 backdrop-blur-sm border-slate-700 h-9 w-9 p-0 shadow-lg"
        onClick={onClick}
        aria-label="Menu"
      >
        <MenuIcon className="h-4 w-4 text-white" />
      </Button>
    </div>
  );
};
