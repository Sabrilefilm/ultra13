
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Gift } from "lucide-react";

interface RewardsNotificationProps {
  creatorsWithRewards: number;
  rewardThreshold: number;
}

export const RewardsNotification: React.FC<RewardsNotificationProps> = ({
  creatorsWithRewards,
  rewardThreshold
}) => {
  if (creatorsWithRewards === 0) {
    return null;
  }

  return (
    <Alert className="bg-green-50 border-green-200">
      <Gift className="h-5 w-5 text-green-500" />
      <AlertTitle className="text-green-700">Récompenses disponibles!</AlertTitle>
      <AlertDescription className="text-green-600">
        {creatorsWithRewards === 1 ? 'Un créateur a' : `${creatorsWithRewards} créateurs ont`} atteint le seuil de {rewardThreshold.toLocaleString()} diamants et {creatorsWithRewards === 1 ? 'peut' : 'peuvent'} recevoir une récompense.
      </AlertDescription>
    </Alert>
  );
};
