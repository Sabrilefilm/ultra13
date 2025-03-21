
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Diamond, Settings, RotateCcw, Plus } from "lucide-react";
import { AddRewardDialog } from "./rewards/AddRewardDialog";
import { RewardsTable } from "./rewards/RewardsTable";
import { useRewards } from "./rewards/useRewards";
import { RewardSettingsModal } from "./RewardSettingsModal";
import { usePlatformSettings } from "@/hooks/use-platform-settings";
import { useScheduleManagement } from "@/hooks/user-management/use-schedule-management";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

interface RewardsPanelProps {
  role: string;
  userId: string;
}

export function RewardsPanel({ role, userId }: RewardsPanelProps) {
  const navigate = useNavigate();
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

  const handleOpenCreatorRewards = () => {
    navigate('/creator-rewards');
  };

  return (
    <Card className="bg-white dark:bg-slate-800 shadow-md border-purple-100 dark:border-purple-900/30">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Diamond className="w-5 h-5 text-purple-500" />
          Récompenses
        </CardTitle>
        {role === 'founder' && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsSettingsOpen(true)}
              className="border-purple-200 dark:border-purple-800"
            >
              <Settings className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline"
              className="flex items-center gap-2 border-purple-200 dark:border-purple-800"
              onClick={() => setIsDialogOpen(true)}
            >
              <Diamond className="h-4 w-4 text-purple-500" />
              Ajouter des diamants
            </Button>
            <Button
              className="bg-purple-600 hover:bg-purple-700"
              onClick={handleOpenCreatorRewards}
            >
              Programme de récompenses
            </Button>
          </div>
        )}
        {role === 'creator' && (
          <Button
            variant="outline"
            onClick={handleOpenCreatorRewards}
            className="border-purple-200 dark:border-purple-800"
          >
            Voir le programme de récompenses
          </Button>
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
