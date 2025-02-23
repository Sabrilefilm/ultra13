
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ProfileHeader } from "@/components/ProfileHeader";
import { ForgotPasswordModal } from "@/components/ForgotPasswordModal";
import { RewardsPanel } from "@/components/RewardsPanel";
import { LoginForm } from "@/components/auth/LoginForm";
import { FounderDashboard } from "@/components/dashboard/FounderDashboard";
import { RoleStats } from "@/components/dashboard/RoleStats";
import { CreatorDashboard } from "@/components/creator/CreatorDashboard";
import { ModalManager } from "@/components/layout/ModalManager";
import { useIndexAuth } from "@/hooks/use-index-auth";
import { usePlatformSettings } from "@/hooks/use-platform-settings";
import { useAccountManagement } from "@/hooks/use-account-management";

const Index = () => {
  const { isAuthenticated, username, role, handleLogout, handleLogin } = useIndexAuth();
  const { platformSettings, handleUpdateSettings } = usePlatformSettings(role);
  const { handleCreateAccount } = useAccountManagement();

  const [isCreateAccountModalOpen, setIsCreateAccountModalOpen] = useState(false);
  const [isRewardSettingsModalOpen, setIsRewardSettingsModalOpen] = useState(false);
  const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] = useState(false);
  const [isLiveScheduleModalOpen, setIsLiveScheduleModalOpen] = useState(false);
  const [selectedCreatorId, setSelectedCreatorId] = useState<string>("");
  const [isSponsorshipModalOpen, setIsSponsorshipModalOpen] = useState(false);
  const [showSponsorshipList, setShowSponsorshipList] = useState(false);

  if (!isAuthenticated) {
    return (
      <>
        <LoginForm
          onLogin={handleLogin}
          onForgotPassword={() => setIsForgotPasswordModalOpen(true)}
        />
        <ForgotPasswordModal
          isOpen={isForgotPasswordModalOpen}
          onClose={() => setIsForgotPasswordModalOpen(false)}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/10 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <ProfileHeader
            username={username}
            handle={`@${role}`}
          />
          <Button
            variant="outline"
            onClick={handleLogout}
            className="ml-4"
          >
            Déconnexion
          </Button>
        </div>

        <div className="space-y-6">
          {role === 'founder' && (
            <FounderDashboard
              onCreateAccount={() => setIsCreateAccountModalOpen(true)}
              onConfigureRewards={() => setIsRewardSettingsModalOpen(true)}
              onOpenLiveSchedule={(creatorId) => {
                setSelectedCreatorId(creatorId);
                setIsLiveScheduleModalOpen(true);
              }}
              onOpenSponsorships={() => setShowSponsorshipList(true)}
              username={username}
            />
          )}

          {role === 'creator' && (
            <CreatorDashboard
              onOpenSponsorshipForm={() => setIsSponsorshipModalOpen(true)}
              onOpenSponsorshipList={() => setShowSponsorshipList(true)}
            />
          )}

          <RoleStats role={role || ''} userId={username} />
          <RewardsPanel role={role || ''} userId={username} />

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
            role={role || ''}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
