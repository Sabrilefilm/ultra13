
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Diamond } from "lucide-react";
import { AddRewardDialog } from "./rewards/AddRewardDialog";
import { RewardsTable } from "./rewards/RewardsTable";
import { useRewards } from "./rewards/useRewards";

interface RewardsPanelProps {
  role: string;
  userId: string;
}

export function RewardsPanel({ role, userId }: RewardsPanelProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { data: rewards, isLoading, refetch } = useRewards(role, userId);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Chargement des récompenses...</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Diamond className="w-5 h-5" />
          Récompenses
        </CardTitle>
        {role === 'founder' && (
          <AddRewardDialog
            isOpen={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            onSuccess={refetch}
          />
        )}
      </CardHeader>
      <CardContent>
        <RewardsTable rewards={rewards || []} />
      </CardContent>
    </Card>
  );
}
