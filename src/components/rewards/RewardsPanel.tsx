
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Diamond, Settings, RotateCcw } from "lucide-react";
import { AddRewardDialog } from "./AddRewardDialog";
import { RewardsTable } from "./RewardsTable";
import { useRewards } from "./useRewards";
import { Button } from "@/components/ui/button";
import { RewardSettingsModal } from "../RewardSettingsModal";
import { usePlatformSettings } from "@/hooks/use-platform-settings";
import { useScheduleManagement } from "@/hooks/user-management/use-schedule-management";
import { useQueryClient } from "@tanstack/react-query";

interface RewardsPanelProps {
  role: string;
  userId: string;
}

export function RewardsPanel({ role, userId }: RewardsPanelProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { data: rewards, isLoading, refetch } = useRewards(role, userId);
  const { platformSettings, handleUpdateSettings } = usePlatformSettings(role);
  const queryClient = useQueryClient();
  const { resetRewards } = useScheduleManagement(() => {
    queryClient.invalidateQueries({ queryKey: ["rewards"] });
    refetch();
  });

  const handleResetRewards = async () => {
    await resetRewards();
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Chargement des récompenses...</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  const pendingRewards = rewards?.filter(reward => reward.payment_status === 'pending') || [];
  const hasPendingRewards = pendingRewards.length > 0;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Diamond className="w-5 h-5" />
          Récompenses
        </CardTitle>
        {role === 'founder' && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsSettingsOpen(true)}
            >
              <Settings className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => setIsDialogOpen(true)}
            >
              <Diamond className="h-4 w-4" />
              Ajouter des diamants
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent>
        {role === 'founder' && platformSettings && (
          <div className="mb-4 p-4 bg-muted/50 rounded-lg">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Valeur d'un diamant</p>
                <p className="text-2xl font-bold">{platformSettings.diamondValue}€</p>
              </div>
              <div>
                <p className="text-sm font-medium">Paiement minimum</p>
                <p className="text-2xl font-bold">{platformSettings.minimumPayout}€</p>
              </div>
            </div>
          </div>
        )}
        <RewardsTable rewards={rewards || []} />
      </CardContent>
      {role === 'founder' && (
        <>
          <CardFooter className="flex justify-end">
            {hasPendingRewards && (
              <Button 
                onClick={handleResetRewards}
                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700"
              >
                <RotateCcw className="h-4 w-4" />
                Marquer toutes les récompenses comme payées
              </Button>
            )}
          </CardFooter>
          <AddRewardDialog
            isOpen={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            onSuccess={refetch}
          />
          <RewardSettingsModal
            isOpen={isSettingsOpen}
            onClose={() => setIsSettingsOpen(false)}
            onSubmit={handleUpdateSettings}
            currentSettings={platformSettings || undefined}
          />
        </>
      )}
    </Card>
  );
}
