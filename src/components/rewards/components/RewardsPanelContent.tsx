
import React from "react";
import { RewardsTable } from "../RewardsTable";

interface RewardsPanelContentProps {
  canViewRewards: boolean;
  platformSettings: any;
  rewards: any[];
}

export function RewardsPanelContent({ 
  canViewRewards, 
  platformSettings, 
  rewards 
}: RewardsPanelContentProps) {
  return (
    <>
      {canViewRewards && platformSettings && (
        <div className="mb-4 p-4 bg-muted/50 rounded-lg">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium">Valeur d'un diamant ✨</p>
              <p className="text-2xl font-bold">{platformSettings.diamondValue}€</p>
            </div>
            <div>
              <p className="text-sm font-medium">Paiement minimum 💰</p>
              <p className="text-2xl font-bold">{platformSettings.minimumPayout}€</p>
            </div>
          </div>
        </div>
      )}
      <RewardsTable rewards={rewards || []} />
    </>
  );
}
