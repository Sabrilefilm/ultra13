
import { RewardSettingsModal } from "@/components/RewardSettingsModal";
import { CreateAccountModal } from "@/components/CreateAccountModal";
import { LiveScheduleModal } from "@/components/live-schedule";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { SponsorshipForm } from "@/components/SponsorshipForm";
import { SponsorshipList } from "@/components/SponsorshipList";
import { ScheduleMatchDialog } from "@/components/matches/ScheduleMatchDialog";

interface ModalManagerProps {
  isCreateAccountModalOpen: boolean;
  setIsCreateAccountModalOpen: (value: boolean) => void;
  isRewardSettingsModalOpen: boolean;
  setIsRewardSettingsModalOpen: (value: boolean) => void;
  isLiveScheduleModalOpen: boolean;
  setIsLiveScheduleModalOpen: (value: boolean) => void;
  isSponsorshipModalOpen: boolean;
  setIsSponsorshipModalOpen: (value: boolean) => void;
  showSponsorshipList: boolean;
  setShowSponsorshipList: (value: boolean) => void;
  selectedCreatorId: string;
  platformSettings: { diamondValue: number; minimumPayout: number; } | null;
  handleCreateAccount: (role: 'creator' | 'manager', username: string, password: string) => Promise<void>;
  handleUpdateSettings: (diamondValue: number, minimumPayout: number) => Promise<void>;
  username: string;
  role: string;
  isScheduleMatchModalOpen: boolean;
  setIsScheduleMatchModalOpen: (value: boolean) => void;
}

export const ModalManager = ({
  isCreateAccountModalOpen,
  setIsCreateAccountModalOpen,
  isRewardSettingsModalOpen,
  setIsRewardSettingsModalOpen,
  isLiveScheduleModalOpen,
  setIsLiveScheduleModalOpen,
  isSponsorshipModalOpen,
  setIsSponsorshipModalOpen,
  showSponsorshipList,
  setShowSponsorshipList,
  selectedCreatorId,
  platformSettings,
  handleCreateAccount,
  handleUpdateSettings,
  username,
  role,
  isScheduleMatchModalOpen,
  setIsScheduleMatchModalOpen,
}: ModalManagerProps) => {
  return (
    <>
      <Dialog open={isSponsorshipModalOpen} onOpenChange={setIsSponsorshipModalOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Demande de parrainage</DialogTitle>
          </DialogHeader>
          <SponsorshipForm
            creatorId={username}
            onSubmit={() => setIsSponsorshipModalOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={showSponsorshipList} onOpenChange={setShowSponsorshipList}>
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              {role === 'founder' ? "Gestion des parrainages" : "Mes parrainages"}
            </DialogTitle>
          </DialogHeader>
          <SponsorshipList isFounder={role === 'founder'} />
        </DialogContent>
      </Dialog>

      <CreateAccountModal
        isOpen={isCreateAccountModalOpen}
        onClose={() => setIsCreateAccountModalOpen(false)}
        onSubmit={handleCreateAccount}
      />

      <RewardSettingsModal
        isOpen={isRewardSettingsModalOpen}
        onClose={() => setIsRewardSettingsModalOpen(false)}
        onSubmit={handleUpdateSettings}
        currentSettings={platformSettings ?? undefined}
      />

      <LiveScheduleModal
        isOpen={isLiveScheduleModalOpen}
        onClose={() => setIsLiveScheduleModalOpen(false)}
        creatorId={selectedCreatorId}
      />

      <ScheduleMatchDialog
        isOpen={isScheduleMatchModalOpen}
        onClose={() => setIsScheduleMatchModalOpen(false)}
      />
    </>
  );
};
