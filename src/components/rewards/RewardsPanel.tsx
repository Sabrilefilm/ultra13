
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { useRewards } from "./useRewards";
import { usePlatformSettings } from "@/hooks/use-platform-settings";
import { useScheduleManagement } from "@/hooks/user-management/use-schedule-management";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { AddRewardDialog } from "./AddRewardDialog";
import { RewardSettingsModal } from "../RewardSettingsModal";
import { useDiamondUsers } from "./hooks/useDiamondUsers";
import { DiamondManagementModal } from "./components/DiamondManagementModal";
import { RewardsPanelHeader } from "./components/RewardsPanelHeader";
import { RewardsPanelContent } from "./components/RewardsPanelContent";
import { RewardsPanelFooter } from "./components/RewardsPanelFooter";

interface RewardsPanelProps {
  role: string;
  userId: string;
}

export function RewardsPanel({ role, userId }: RewardsPanelProps) {
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDiamondModalOpen, setIsDiamondModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [operationType, setOperationType] = useState<'add' | 'subtract'>('add');
  
  const { data: rewards, isLoading, refetch } = useRewards(role, userId);
  const { platformSettings, handleUpdateSettings } = usePlatformSettings(role);
  const queryClient = useQueryClient();
  const { resetRewards } = useScheduleManagement(() => {
    queryClient.invalidateQueries({ queryKey: ["rewards"] });
    refetch();
  });
  const { users, fetchUsers } = useDiamondUsers();

  const handleResetRewards = async () => {
    await resetRewards();
  };

  const handleOpenCreatorRewards = () => {
    navigate('/creator-rewards');
  };

  const handleOpenDiamondsPage = () => {
    navigate('/creator-diamonds');
  };

  const openDiamondModal = async (type: 'add' | 'subtract') => {
    setOperationType(type);
    setSelectedUser(null);
    setIsDiamondModalOpen(true);
  };

  const refreshData = async () => {
    await refetch();
    await fetchUsers();
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="text-xl font-bold">Chargement des récompenses...</div>
        </CardHeader>
      </Card>
    );
  }

  const pendingRewards = rewards?.filter(reward => reward.payment_status === 'pending') || [];
  const hasPendingRewards = pendingRewards.length > 0;

  // Seul le fondateur peut gérer les récompenses
  const canManageRewards = role === 'founder';
  const canViewRewards = ['founder', 'manager'].includes(role);

  return (
    <Card className="bg-white dark:bg-slate-800 shadow-md border-purple-100 dark:border-purple-900/30">
      <CardHeader>
        <RewardsPanelHeader 
          role={role}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenAddReward={() => setIsDialogOpen(true)}
          onOpenDiamondModal={openDiamondModal}
          onOpenCreatorRewards={handleOpenCreatorRewards}
          onOpenDiamondsPage={handleOpenDiamondsPage}
        />
      </CardHeader>
      <CardContent>
        <RewardsPanelContent 
          canViewRewards={canViewRewards}
          platformSettings={platformSettings}
          rewards={rewards || []}
        />
      </CardContent>
      {canManageRewards && (
        <>
          <CardFooter>
            <RewardsPanelFooter 
              hasPendingRewards={hasPendingRewards}
              onResetRewards={handleResetRewards}
            />
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
          
          <DiamondManagementModal
            isOpen={isDiamondModalOpen}
            onOpenChange={setIsDiamondModalOpen}
            selectedUser={selectedUser}
            operationType={operationType}
            users={users}
            onSuccess={refreshData}
          />
        </>
      )}
    </Card>
  );
}
