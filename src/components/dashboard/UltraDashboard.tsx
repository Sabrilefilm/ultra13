
import { useState } from "react";
import { InactivityWarning } from "@/components/InactivityWarning";
import { UltraSidebar } from "@/components/layout/UltraSidebar";
import { CreateMatchPosterDialog } from "@/components/matches/CreateMatchPosterDialog";
import { ModalManager } from "@/components/layout/ModalManager";
import { RedesignedDashContent } from "@/components/dashboard/RedesignedDashContent";

interface UltraDashboardProps {
  username: string;
  role: string;
  userId: string;
  onLogout: () => void;
  platformSettings: { diamondValue: number; minimumPayout: number; } | null;
  handleCreateAccount: (role: 'creator' | 'manager' | 'agent', username: string, password: string) => Promise<void>;
  handleUpdateSettings: (diamondValue: number, minimumPayout: number) => Promise<void>;
  showWarning: boolean;
  dismissWarning: () => void;
  formattedTime: string;
  currentPage?: string;
}

export const UltraDashboard = ({
  username,
  role,
  userId,
  onLogout,
  platformSettings,
  handleCreateAccount,
  handleUpdateSettings,
  showWarning,
  dismissWarning,
  formattedTime,
  currentPage = 'dashboard'
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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

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
        window.location.href = data === 'dashboard' ? '/' : `/${data}`;
        break;
      case 'toggleSidebar':
        setSidebarCollapsed(!sidebarCollapsed);
        break;
      default:
        break;
    }
  };

  return (
    <div className="flex h-screen w-full bg-gradient-to-br from-slate-900 to-slate-950 text-white overflow-hidden">
      <UltraSidebar 
        username={username}
        role={role}
        userId={userId}
        onLogout={onLogout}
        onAction={onAction}
        currentPage={currentPage}
        collapsed={sidebarCollapsed}
      />
      
      <div className="flex-1 overflow-auto pb-20 transition-all duration-300">
        <RedesignedDashContent
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
