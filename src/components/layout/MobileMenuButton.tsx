
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
        size="icon" 
        className="bg-slate-800/60 backdrop-blur-sm border-slate-700"
        onClick={onClick}
      >
        <MenuIcon className="h-5 w-5" />
      </Button>
    </div>
  );
};
