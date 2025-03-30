
import React from "react";
import { CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Diamond, Settings, Plus, Minus, TrendingUp } from "lucide-react";

interface RewardsPanelHeaderProps {
  role: string;
  onOpenSettings: () => void;
  onOpenAddReward: () => void;
  onOpenDiamondModal: (type: 'add' | 'subtract') => void;
  onOpenCreatorRewards: () => void;
  onOpenDiamondsPage: () => void;
}

export function RewardsPanelHeader({
  role,
  onOpenSettings,
  onOpenAddReward,
  onOpenDiamondModal,
  onOpenCreatorRewards,
  onOpenDiamondsPage
}: RewardsPanelHeaderProps) {
  // Only founder can manage rewards
  const canManageRewards = role === 'founder';
  const canManageDiamonds = ['founder', 'manager'].includes(role);

  return (
    <div className="flex flex-row items-center justify-between">
      <CardTitle className="flex items-center gap-2">
        <Diamond className="w-5 h-5 text-purple-500" />
        Programme de Récompenses 💎
      </CardTitle>
      {canManageRewards && (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={onOpenSettings}
            className="border-purple-200 dark:border-purple-800"
          >
            <Settings className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline"
            className="flex items-center gap-2 border-purple-200 dark:border-purple-800"
            onClick={onOpenAddReward}
          >
            <Diamond className="h-4 w-4 text-purple-500" />
            Ajouter des diamants
          </Button>
          <Button 
            variant="outline"
            className="flex items-center gap-2 border-purple-200 dark:border-purple-800"
            onClick={() => onOpenDiamondModal('add')}
          >
            <Plus className="h-4 w-4 text-green-500" />
            Ajouter
          </Button>
          <Button 
            variant="outline"
            className="flex items-center gap-2 border-purple-200 dark:border-purple-800"
            onClick={() => onOpenDiamondModal('subtract')}
          >
            <Minus className="h-4 w-4 text-red-500" />
            Déduire
          </Button>
          <Button
            className="bg-purple-600 hover:bg-purple-700"
            onClick={onOpenCreatorRewards}
          >
            Programme de récompenses
          </Button>
          {canManageDiamonds && (
            <Button
              variant="default"
              className="bg-indigo-600 hover:bg-indigo-700 flex items-center gap-2"
              onClick={onOpenDiamondsPage}
            >
              <TrendingUp className="h-4 w-4" />
              Gestion des Diamants
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
