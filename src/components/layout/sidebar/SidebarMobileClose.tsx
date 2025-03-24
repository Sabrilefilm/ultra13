
import React from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface SidebarMobileCloseProps {
  onClose: () => void;
}

export const SidebarMobileClose: React.FC<SidebarMobileCloseProps> = ({ onClose }) => {
  return (
    <div className="flex justify-end p-2">
      <Button variant="ghost" size="icon" onClick={onClose} className="text-slate-300 hover:text-white">
        <X className="h-5 w-5" />
      </Button>
    </div>
  );
};
