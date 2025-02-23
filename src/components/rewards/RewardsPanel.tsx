
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Diamond, Settings } from "lucide-react";
import { AddRewardDialog } from "./rewards/AddRewardDialog";
import { RewardsTable } from "./rewards/RewardsTable";
import { useRewards } from "./rewards/useRewards";
import { Button } from "@/components/ui/button";
import { RewardSettingsModal } from "./rewards/RewardSettingsModal";
import { usePlatformSettings } from "@/hooks/use-platform-settings";

interface RewardsPanelProps {
  role: string;
  userId: string;
}

export function RewardsPanel({ role, userId }: RewardsPanelProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { data: rewards, isLoading, refetch } = useRewards(role, userId);
  const { platformSettings, handleUpdateSettings } = usePlatformSettings(role);

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
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsSettingsOpen(true)}
            >
              <Settings className="h-4 w-4" />
            </Button>
            <AddRewardDialog
              isOpen={isDialogOpen}
              onOpenChange={setIsDialogOpen}
              onSuccess={refetch}
            />
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
        <RewardSettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          onSubmit={handleUpdateSettings}
          currentSettings={platformSettings || undefined}
        />
      )}
    </Card>
  );
}
