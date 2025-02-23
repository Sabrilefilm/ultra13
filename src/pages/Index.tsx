
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
import { Footer } from "@/components/layout/Footer";
import { useIndexAuth } from "@/hooks/use-index-auth";
import { usePlatformSettings } from "@/hooks/use-platform-settings";
import { useAccountManagement } from "@/hooks/use-account-management";
import { UpcomingMatches } from "@/components/dashboard/UpcomingMatches";

const Index = () => {
  const { isAuthenticated, username, role, handleLogout, handleLogin } = useIndexAuth();
  const { platformSettings, handleUpdateSettings } = usePlatformSettings(role);
  const { handleCreateAccount } = useAccountManagement();

  const [isCreateAccountModalOpen, setIsCreateAccountModalOpen] = useState(false);
  const [isRewardSettingsModalOpen, setIsRewardSettingsModalOpen] = useState(false);
  const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] = useState(false);
  const [isLiveScheduleModalOpen, setIsLiveScheduleModalOpen] = useState(false);
  const [isScheduleMatchModalOpen, setIsScheduleMatchModalOpen] = useState(false);
  const [selectedCreatorId, setSelectedCreatorId] = useState<string>("");
  const [isSponsorshipModalOpen, setIsSponsorshipModalOpen] = useState(false);
  const [showSponsorshipList, setShowSponsorshipList] = useState(false);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col">
        <LoginForm
          onLogin={handleLogin}
          onForgotPassword={() => setIsForgotPasswordModalOpen(true)}
        />
        <ForgotPasswordModal
          isOpen={isForgotPasswordModalOpen}
          onClose={() => setIsForgotPasswordModalOpen(false)}
        />
        <Footer />
      </div>
    );
  }

  const roleDisplay = role === 'founder' ? 'Fondateur' : role;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/10 flex flex-col">
      <div className="flex-1 p-4">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex justify-between items-center">
            <ProfileHeader
              username={username}
              handle={`@${roleDisplay}`}
            />
            <div className="flex items-center gap-4">
              <div className="text-sm text-muted-foreground text-right">
                <p className="lowercase">vous devez obligatoirement faire</p>
                <p className="lowercase">7J 15H de lives</p>
              </div>
              <Button
                variant="outline"
                onClick={handleLogout}
              >
                Déconnexion
              </Button>
            </div>
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
                onScheduleMatch={() => setIsScheduleMatchModalOpen(true)}
                onOpenSponsorships={() => setShowSponsorshipList(true)}
                username={username}
              />
            )}

            {['creator', 'manager', 'agent'].includes(role || '') && (
              <CreatorDashboard
                onOpenSponsorshipForm={() => setIsSponsorshipModalOpen(true)}
                onOpenSponsorshipList={() => setShowSponsorshipList(true)}
                role={role}
              />
            )}

            <RoleStats role={role || ''} userId={username} />
            <RewardsPanel role={role || ''} userId={username} />
            <UpcomingMatches role={role || ''} creatorId={username} />

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
              isScheduleMatchModalOpen={isScheduleMatchModalOpen}
              setIsScheduleMatchModalOpen={setIsScheduleMatchModalOpen}
            />
          </div>
        </div>
      </div>
      <Footer role={role || ''} />
    </div>
  );
}

export default Index;
