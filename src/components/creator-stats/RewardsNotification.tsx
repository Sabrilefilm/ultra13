
import React from "react";
import { Coins } from "lucide-react";

interface RewardsNotificationProps {
  creatorsWithRewards: number;
  rewardThreshold: number;
}

export const RewardsNotification: React.FC<RewardsNotificationProps> = ({
  creatorsWithRewards,
  rewardThreshold
}) => {
  if (creatorsWithRewards === 0) return null;
  
  return (
    <div className="bg-green-900/20 border border-green-700/30 rounded-lg p-4 mb-6">
      <div className="flex items-center gap-3">
        <Coins className="h-6 w-6 text-green-400 animate-pulse" />
        <div>
          <h4 className="font-medium text-green-300">🎉 Récompenses disponibles!</h4>
          <p className="text-green-400/80 text-sm">
            {creatorsWithRewards} créateur(s) {creatorsWithRewards > 1 ? 'ont' : 'a'} atteint le seuil de {rewardThreshold.toLocaleString()} diamants pour une récompense.
          </p>
        </div>
      </div>
    </div>
  );
};
