
import React from "react";
import { ModalManager } from "@/components/layout/ModalManager";
import { CreateMatchPosterDialog } from "@/components/matches/CreateMatchPosterDialog";
import { InactivityWarning } from "@/components/InactivityWarning";

interface DashboardModalsProps {
  username: string;
  role: string;
  modalStates: {
    isCreateAccountModalOpen: boolean;
    setIsCreateAccountModalOpen: (open: boolean) => void;
    isRewardSettingsModalOpen: boolean;
    setIsRewardSettingsModalOpen: (open: boolean) => void;
    isLiveScheduleModalOpen: boolean;
    setIsLiveScheduleModalOpen: (open: boolean) => void;
    isScheduleMatchModalOpen: boolean;
    setIsScheduleMatchModalOpen: (open: boolean) => void;
    isSponsorshipModalOpen: boolean;
    setIsSponsorshipModalOpen: (open: boolean) => void;
    showSponsorshipList: boolean;
    setShowSponsorshipList: (show: boolean) => void;
    isCreatePosterModalOpen: boolean;
    setIsCreatePosterModalOpen: (open: boolean) => void;
  };
  selectedCreatorId: string;
  platformSettings: { diamondValue: number; minimumPayout: number; } | null;
  handleCreateAccount: (role: 'creator' | 'manager' | 'agent', username: string, password: string) => Promise<void>;
  handleUpdateSettings: (diamondValue: number, minimumPayout: number) => Promise<void>;
  showWarning: boolean;
  dismissWarning: () => void;
  onLogout: () => void;
  formattedTime: string;
}

export const DashboardModals: React.FC<DashboardModalsProps> = ({
  username,
  role,
  modalStates,
  selectedCreatorId,
  platformSettings,
  handleCreateAccount,
  handleUpdateSettings,
  showWarning,
  dismissWarning,
  onLogout,
  formattedTime
}) => {
  return (
    <>
      <ModalManager
        isCreateAccountModalOpen={modalStates.isCreateAccountModalOpen}
        setIsCreateAccountModalOpen={modalStates.setIsCreateAccountModalOpen}
        isRewardSettingsModalOpen={modalStates.isRewardSettingsModalOpen}
        setIsRewardSettingsModalOpen={modalStates.setIsRewardSettingsModalOpen}
        isLiveScheduleModalOpen={modalStates.isLiveScheduleModalOpen}
        setIsLiveScheduleModalOpen={modalStates.setIsLiveScheduleModalOpen}
        isSponsorshipModalOpen={modalStates.isSponsorshipModalOpen}
        setIsSponsorshipModalOpen={modalStates.setIsSponsorshipModalOpen}
        showSponsorshipList={modalStates.showSponsorshipList}
        setShowSponsorshipList={modalStates.setShowSponsorshipList}
        selectedCreatorId={selectedCreatorId}
        platformSettings={platformSettings}
        handleCreateAccount={handleCreateAccount}
        handleUpdateSettings={handleUpdateSettings}
        username={username}
        role={role}
        isScheduleMatchModalOpen={modalStates.isScheduleMatchModalOpen}
        setIsScheduleMatchModalOpen={modalStates.setIsScheduleMatchModalOpen}
      />

      {(['founder', 'manager', 'agent'].includes(role)) && (
        <CreateMatchPosterDialog
          isOpen={modalStates.isCreatePosterModalOpen}
          onClose={() => modalStates.setIsCreatePosterModalOpen(false)}
        />
      )}
      
      <InactivityWarning
        open={showWarning}
        onStay={dismissWarning}
        onLogout={onLogout}
        remainingTime={formattedTime}
      />
    </>
  );
};
