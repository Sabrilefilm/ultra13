
import React from "react";
import { Button } from "@/components/ui/button";
import { MenuIcon } from "lucide-react";

interface MobileMenuButtonProps {
  onClick: () => void;
}

export const MobileMenuButton: React.FC<MobileMenuButtonProps> = ({ onClick }) => {
  return (
    <div className="md:hidden fixed top-3 left-3 z-50">
      <Button 
        variant="outline" 
        size="sm"
        className="bg-slate-800/60 backdrop-blur-sm border-slate-700 h-8 w-8 p-0"
        onClick={onClick}
      >
        <MenuIcon className="h-4 w-4" />
      </Button>
    </div>
  );
};
