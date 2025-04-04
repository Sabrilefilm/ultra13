
import React from "react";
import { UltraSidebar } from "@/components/layout/UltraSidebar";
import { UsernameWatermark } from "@/components/layout/UsernameWatermark";
import { MobileMenuButton } from "@/components/layout/MobileMenuButton";
import { DashboardContent } from "@/components/layout/DashboardContent";
import { DashboardModals } from "@/components/layout/DashboardModals";
import { useDashboardActions } from "@/hooks/use-dashboard-actions";
import { LogoutButton } from "@/components/layout/LogoutButton";
import { useAppVersion } from "@/hooks/use-app-version";
import { MobileNavigation } from "@/components/mobile/MobileNavigation";

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
  children?: React.ReactNode;
}

export const UltraDashboard: React.FC<UltraDashboardProps> = ({
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
  currentPage = 'dashboard',
  children
}) => {
  const {
    modalStates,
    sidebarStates,
    selectedCreatorId,
    onAction
  } = useDashboardActions({ onLogout });
  
  const { version } = useAppVersion();

  return (
    <div className="flex flex-col h-screen w-full bg-gradient-to-br from-slate-900 to-slate-950 text-white overflow-hidden">
      <UsernameWatermark username={username} />
      
      <div className="fixed top-0 right-0 m-4 z-50 hidden md:block">
        <LogoutButton onLogout={onLogout} username={username} />
      </div>
      
      <MobileMenuButton onClick={() => onAction('toggleMobileMenu')} />
      
      <div className="flex h-full">
        <div className={`${sidebarStates.mobileMenuOpen ? 'fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden' : 'hidden md:block'}`}>
          <div className={`${sidebarStates.mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} 
                          transition-transform duration-300 h-full w-64 md:w-auto z-50`}>
            <UltraSidebar 
              username={username}
              role={role}
              userId={userId}
              onLogout={onLogout}
              currentPage={currentPage}
              isMobileOpen={sidebarStates.mobileMenuOpen}
              setMobileMenuOpen={sidebarStates.setMobileMenuOpen}
              version={version}
              onAction={onAction}
            />
          </div>
        </div>
        
        <DashboardContent
          username={username}
          role={role}
          currentPage={currentPage}
          onAction={onAction}
          onLogout={onLogout}
        >
          {children}
        </DashboardContent>
      </div>
      
      <MobileNavigation 
        role={role} 
        currentPage={currentPage || ''} 
        onOpenMenu={() => onAction('toggleMobileMenu')} 
      />
      
      <DashboardModals
        username={username}
        role={role}
        modalStates={{
          isCreateAccountModalOpen: modalStates.isCreateAccountModalOpen,
          setIsCreateAccountModalOpen: modalStates.setIsCreateAccountModalOpen,
          isRewardSettingsModalOpen: modalStates.isRewardSettingsModalOpen,
          setIsRewardSettingsModalOpen: modalStates.setIsRewardSettingsModalOpen,
          isLiveScheduleModalOpen: modalStates.isLiveScheduleModalOpen,
          setIsLiveScheduleModalOpen: modalStates.setIsLiveScheduleModalOpen,
          isScheduleMatchModalOpen: modalStates.isScheduleMatchModalOpen,
          setIsScheduleMatchModalOpen: modalStates.setIsScheduleMatchModalOpen,
          isSponsorshipModalOpen: modalStates.isSponsorshipModalOpen,
          setIsSponsorshipModalOpen: modalStates.setIsSponsorshipModalOpen,
          showSponsorshipList: modalStates.showSponsorshipList,
          setShowSponsorshipList: modalStates.setShowSponsorshipList,
          isCreatePosterModalOpen: modalStates.isCreatePosterModalOpen,
          setIsCreatePosterModalOpen: modalStates.setIsCreatePosterModalOpen
        }}
        selectedCreatorId={selectedCreatorId}
        platformSettings={platformSettings}
        handleCreateAccount={handleCreateAccount}
        handleUpdateSettings={handleUpdateSettings}
        showWarning={showWarning}
        dismissWarning={dismissWarning}
        onLogout={onLogout}
        formattedTime={formattedTime}
      />
    </div>
  );
};
