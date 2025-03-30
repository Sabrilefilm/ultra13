
import React from "react";
import { CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Diamond, Settings, Plus, Minus } from "lucide-react";

interface RewardsPanelHeaderProps {
  role: string;
  onOpenSettings: () => void;
  onOpenAddReward: () => void;
  onOpenDiamondModal: (type: 'add' | 'subtract') => void;
  onOpenCreatorRewards: () => void;
}

export function RewardsPanelHeader({
  role,
  onOpenSettings,
  onOpenAddReward,
  onOpenDiamondModal,
  onOpenCreatorRewards
}: RewardsPanelHeaderProps) {
  // Only founder can manage rewards
  const canManageRewards = role === 'founder';

  return (
    <div className="flex flex-row items-center justify-between">
      <CardTitle className="flex items-center gap-2 text-white">
        <Diamond className="w-5 h-5 text-purple-500" />
        Programme de Récompenses 💎
      </CardTitle>
      {canManageRewards && (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={onOpenSettings}
            className="border-purple-700/30 bg-purple-900/20 hover:bg-purple-800/30 text-white"
          >
            <Settings className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline"
            className="flex items-center gap-2 border-purple-700/30 bg-purple-900/20 hover:bg-purple-800/30 text-white"
            onClick={onOpenAddReward}
          >
            <Diamond className="h-4 w-4 text-purple-500" />
            Ajouter des diamants
          </Button>
          <Button 
            variant="outline"
            className="flex items-center gap-2 border-purple-700/30 bg-purple-900/20 hover:bg-purple-800/30 text-white"
            onClick={() => onOpenDiamondModal('add')}
          >
            <Plus className="h-4 w-4 text-green-500" />
            Ajouter
          </Button>
          <Button 
            variant="outline"
            className="flex items-center gap-2 border-purple-700/30 bg-purple-900/20 hover:bg-purple-800/30 text-white"
            onClick={() => onOpenDiamondModal('subtract')}
          >
            <Minus className="h-4 w-4 text-red-500" />
            Déduire
          </Button>
          <Button
            className="bg-purple-600 hover:bg-purple-700 text-white"
            onClick={onOpenCreatorRewards}
          >
            Programme de récompenses
          </Button>
        </div>
      )}
    </div>
  );
}
