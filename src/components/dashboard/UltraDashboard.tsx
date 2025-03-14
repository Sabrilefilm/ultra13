
import { useState } from "react";
import { InactivityWarning } from "@/components/InactivityWarning";
import { UltraSidebar } from "@/components/layout/UltraSidebar";
import { DashContent } from "@/components/dashboard/DashContent";
import { CreateMatchPosterDialog } from "@/components/matches/CreateMatchPosterDialog";
import { ModalManager } from "@/components/layout/ModalManager";

interface UltraDashboardProps {
  username: string;
  role: string;
  onLogout: () => void;
  platformSettings: { diamondValue: number; minimumPayout: number; } | null;
  handleCreateAccount: (role: 'creator' | 'manager' | 'agent', username: string, password: string) => Promise<void>;
  handleUpdateSettings: (diamondValue: number, minimumPayout: number) => Promise<void>;
  showWarning: boolean;
  dismissWarning: () => void;
  formattedTime: string;
}

export const UltraDashboard = ({
  username,
  role,
  onLogout,
  platformSettings,
  handleCreateAccount,
  handleUpdateSettings,
  showWarning,
  dismissWarning,
  formattedTime
}: UltraDashboardProps) => {
  // Modal states
  const [isCreateAccountModalOpen, setIsCreateAccountModalOpen] = useState(false);
  const [isRewardSettingsModalOpen, setIsRewardSettingsModalOpen] = useState(false);
  const [isLiveScheduleModalOpen, setIsLiveScheduleModalOpen] = useState(false);
  const [isScheduleMatchModalOpen, setIsScheduleMatchModalOpen] = useState(false);
  const [selectedCreatorId, setSelectedCreatorId] = useState<string>("");
  const [isSponsorshipModalOpen, setIsSponsorshipModalOpen] = useState(false);
  const [showSponsorshipList, setShowSponsorshipList] = useState(false);
  const [isCreatePosterModalOpen, setIsCreatePosterModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');

  const onAction = (action: string, data?: any) => {
    switch (action) {
      case 'openCreateAccount':
        setIsCreateAccountModalOpen(true);
        break;
      case 'openRewardSettings':
        setIsRewardSettingsModalOpen(true);
        break;
      case 'openLiveSchedule':
        setSelectedCreatorId(data);
        setIsLiveScheduleModalOpen(true);
        break;
      case 'openScheduleMatch':
        setIsScheduleMatchModalOpen(true);
        break;
      case 'openSponsorshipForm':
        setIsSponsorshipModalOpen(true);
        break;
      case 'openSponsorshipList':
        setShowSponsorshipList(true);
        break;
      case 'openCreatePoster':
        setIsCreatePosterModalOpen(true);
        break;
      case 'navigateTo':
        setCurrentPage(data);
        break;
      default:
        break;
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#111827] text-white">
      <UltraSidebar 
        username={username}
        role={role}
        onLogout={onLogout}
        onAction={onAction}
        currentPage={currentPage}
      />
      
      <div className="flex-1 overflow-auto pb-20">
        <DashContent
          username={username}
          role={role}
          currentPage={currentPage}
          onAction={onAction}
        />
        
        <ModalManager
          isCreateAccountModalOpen={isCreateAccountModalOpen}
          setIsCreateAccountModalOpen={setIsCreateAccountModalOpen}
          isRewardSettingsModalOpen={isRewardSettingsModalOpen}
          setIsRewardSettingsModalOpen={setIsRewardSettingsModalOpen}
          isLiveScheduleModalOpen={isLiveScheduleModalOpen}
          setIsLiveScheduleModalOpen={setIsLiveScheduleModalOpen}
          isSponsorshipModalOpen={isSponsorshipModalOpen}
          setIsSponsorshipModalOpen={setIsSponsorshipModalOpen}
          showSponsorshipList={showSponsorshipList}
          setShowSponsorshipList={setShowSponsorshipList}
          selectedCreatorId={selectedCreatorId}
          platformSettings={platformSettings}
          handleCreateAccount={handleCreateAccount}
          handleUpdateSettings={handleUpdateSettings}
          username={username}
          role={role}
          isScheduleMatchModalOpen={isScheduleMatchModalOpen}
          setIsScheduleMatchModalOpen={setIsScheduleMatchModalOpen}
        />

        {(['founder', 'manager', 'agent'].includes(role)) && (
          <CreateMatchPosterDialog
            isOpen={isCreatePosterModalOpen}
            onClose={() => setIsCreatePosterModalOpen(false)}
          />
        )}
        
        <InactivityWarning
          open={showWarning}
          onStay={dismissWarning}
          onLogout={onLogout}
          remainingTime={formattedTime}
        />
      </div>
    </div>
  );
};
