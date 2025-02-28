
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
import { CreateMatchPosterDialog } from "@/components/matches/CreateMatchPosterDialog";
import { ImageIcon } from "lucide-react";
import { NotificationsListener } from "@/components/NotificationListener";
import { useSessionTimeout } from "@/hooks/use-session-timeout";

const Index = () => {
  const { isAuthenticated, username, role, handleLogout, handleLogin } = useIndexAuth();
  const { platformSettings, handleUpdateSettings } = usePlatformSettings(role);
  const { handleCreateAccount } = useAccountManagement();
  const { timeRemaining, resetTimeout, showWarning, handleStayLoggedIn, handleLogoutTimeout } = useSessionTimeout(isAuthenticated);

  const [isCreateAccountModalOpen, setIsCreateAccountModalOpen] = useState(false);
  const [isRewardSettingsModalOpen, setIsRewardSettingsModalOpen] = useState(false);
  const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] = useState(false);
  const [isLiveScheduleModalOpen, setIsLiveScheduleModalOpen] = useState(false);
  const [isScheduleMatchModalOpen, setIsScheduleMatchModalOpen] = useState(false);
  const [selectedCreatorId, setSelectedCreatorId] = useState<string>("");
  const [isSponsorshipModalOpen, setIsSponsorshipModalOpen] = useState(false);
  const [showSponsorshipList, setShowSponsorshipList] = useState(false);
  const [isCreatePosterModalOpen, setIsCreatePosterModalOpen] = useState(false);

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

  // Vérifier si les informations personnelles sont complètes avant de continuer
  const shouldShowProfileCompletion = isAuthenticated && role === 'creator' && !localStorage.getItem('profileCompleted');
  
  if (shouldShowProfileCompletion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-accent/10 flex flex-col">
        <div className="flex-1 p-4">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Complétez votre profil</h1>
            <p className="mb-4">Pour accéder à votre compte, veuillez d'abord compléter vos informations personnelles.</p>
            <Button onClick={() => window.location.href = '/personal-info'}>
              Compléter mon profil
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const roleDisplay = role === 'founder' ? 'Fondateur' : role;

  return (
    <div className="min-h-screen animate-background-shift bg-gradient-to-br from-background via-accent/5 to-primary/10 flex flex-col">
      {/* Session timeout warning */}
      {showWarning && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={handleLogoutTimeout}>
          <div className="bg-card p-6 rounded-lg shadow-lg max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold mb-4">Session expirée</h3>
            <p className="mb-4">Votre session va expirer dans {Math.ceil(timeRemaining / 1000)} secondes pour des raisons de sécurité.</p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={handleLogoutTimeout}>
                Se déconnecter
              </Button>
              <Button onClick={handleStayLoggedIn}>
                Rester connecté
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 p-4" onClick={resetTimeout}>
        <NotificationsListener userId={username} role={role} />
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
                onCreatePoster={() => setIsCreatePosterModalOpen(true)}
                username={username}
              />
            )}

            {['creator', 'manager', 'agent'].includes(role || '') && (
              <CreatorDashboard
                onOpenSponsorshipForm={() => setIsSponsorshipModalOpen(true)}
                onOpenSponsorshipList={() => setShowSponsorshipList(true)}
                onCreatePoster={() => setIsCreatePosterModalOpen(true)}
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

            <CreateMatchPosterDialog
              isOpen={isCreatePosterModalOpen}
              onClose={() => setIsCreatePosterModalOpen(false)}
            />
          </div>
        </div>
      </div>
      <Footer role={role || ''} />
    </div>
  );
}

export default Index;
