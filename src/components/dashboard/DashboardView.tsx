
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ProfileHeader } from "@/components/ProfileHeader";
import { FounderDashboard } from "@/components/dashboard/FounderDashboard";
import { RoleStats } from "@/components/dashboard/RoleStats";
import { CreatorDashboard } from "@/components/creator/CreatorDashboard";
import { ModalManager } from "@/components/layout/ModalManager";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { UpcomingMatches } from "@/components/dashboard/UpcomingMatches";
import { CreateMatchPosterDialog } from "@/components/matches/CreateMatchPosterDialog";
import { InactivityWarning } from "@/components/InactivityWarning";

interface DashboardViewProps {
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

export const DashboardView = ({
  username,
  role,
  onLogout,
  platformSettings,
  handleCreateAccount,
  handleUpdateSettings,
  showWarning,
  dismissWarning,
  formattedTime
}: DashboardViewProps) => {
  const navigate = useNavigate();
  
  // Modal states
  const [isCreateAccountModalOpen, setIsCreateAccountModalOpen] = useState(false);
  const [isRewardSettingsModalOpen, setIsRewardSettingsModalOpen] = useState(false);
  const [isLiveScheduleModalOpen, setIsLiveScheduleModalOpen] = useState(false);
  const [isScheduleMatchModalOpen, setIsScheduleMatchModalOpen] = useState(false);
  const [selectedCreatorId, setSelectedCreatorId] = useState<string>("");
  const [isSponsorshipModalOpen, setIsSponsorshipModalOpen] = useState(false);
  const [showSponsorshipList, setShowSponsorshipList] = useState(false);
  const [isCreatePosterModalOpen, setIsCreatePosterModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#111827] text-white">
      <Header role={role} username={username} />
      
      <div className="flex-1 p-4">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex justify-between items-center">
            <ProfileHeader
              username={username}
              handle={`@${role === 'founder' ? 'Fondateur' : role}`}
            />
            <div className="flex items-center gap-4">
              <div className="text-sm text-white/60 text-right">
                <p className="lowercase">vous devez obligatoirement faire</p>
                <p className="lowercase">7J 15H de lives</p>
              </div>
              <Button
                variant="outline"
                onClick={onLogout}
                className="border-white/10 bg-white/5 hover:bg-white/10 text-white"
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

            {(['founder', 'manager', 'agent'].includes(role || '')) && (
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
      </div>
      <Footer role={role || ''} />
    </div>
  );
};
