
import React from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { LeaveAgencyDialog } from "@/components/agency/LeaveAgencyDialog";

export const LeaveAgencyButton = () => {
  return (
    <div className="flex justify-center mt-4">
      <Button variant="ghost" className="text-xs text-gray-500 hover:text-red-400 hover:bg-red-900/10 relative h-8 px-3 group">
        <div className="flex items-center justify-center gap-1">
          <AlertTriangle className="h-3 w-3 mr-1 opacity-50 group-hover:opacity-100" />
          Je souhaite quitter l'agence
        </div>
        <LeaveAgencyDialog />
      </Button>
    </div>
  );
};

export default LeaveAgencyButton;
