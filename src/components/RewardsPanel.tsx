
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Diamond, Plus } from "lucide-react";
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

  const canAddRewards = role === 'founder' || role === 'manager';

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
        {canAddRewards && (
          <Button onClick={() => setIsDialogOpen(true)} variant="outline" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Ajouter des diamants
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <RewardsTable rewards={rewards || []} />
        {canAddRewards && (
          <AddRewardDialog
            isOpen={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            onSuccess={refetch}
          />
        )}
      </CardContent>
    </Card>
  );
}
