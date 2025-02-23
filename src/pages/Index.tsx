
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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CreatorDetailsDialog } from "@/components/creator/CreatorDetailsDialog";

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
  const [showPersonalInfo, setShowPersonalInfo] = useState(false);

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

  const roleDisplay = role === 'founder' ? 'Fondateur' : role;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/10 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <ProfileHeader
            username={username}
            handle={`@${roleDisplay}`}
          />
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              onClick={() => setShowPersonalInfo(true)}
              className="text-muted-foreground hover:text-foreground"
            >
              Informations personnelles
            </Button>
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

          <Dialog open={showPersonalInfo} onOpenChange={setShowPersonalInfo}>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold">Informations Personnelles</DialogTitle>
              </DialogHeader>
              <CreatorDetailsDialog 
                isOpen={showPersonalInfo} 
                onClose={() => setShowPersonalInfo(false)}
                creatorDetails={null}
                isFounder={role === 'founder'}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}

export default Index;
