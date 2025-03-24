
import React from "react";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

interface RewardsPanelFooterProps {
  hasPendingRewards: boolean;
  onResetRewards: () => Promise<void>;
}

export function RewardsPanelFooter({ 
  hasPendingRewards, 
  onResetRewards 
}: RewardsPanelFooterProps) {
  if (!hasPendingRewards) {
    return null;
  }

  return (
    <div className="flex justify-end">
      <Button 
        onClick={onResetRewards}
        className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700"
      >
        <RotateCcw className="h-4 w-4" />
        Marquer toutes les récompenses comme payées
      </Button>
    </div>
  );
}
