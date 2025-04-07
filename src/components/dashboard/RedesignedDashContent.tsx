
import React from "react";
import { FounderDashboard } from "@/components/dashboard/FounderDashboard"; 
import { CreatorDashboard } from "@/components/creator/CreatorDashboard";
import { DashboardHeader } from "@/components/dashboard/components/DashboardHeader";
import { StandardDashboardContent } from "@/components/dashboard/components/StandardDashboardContent";
import { PlaceholderPageContent } from "@/components/dashboard/components/PlaceholderPageContent";
import { SocialCommunityLinks } from "@/components/layout/SocialCommunityLinks";

interface RedesignedDashContentProps {
  username: string;
  role: string;
  currentPage: string;
  onAction: (action: string, data?: any) => void;
}

export const RedesignedDashContent: React.FC<RedesignedDashContentProps> = ({
  username,
  role,
  currentPage,
  onAction
}) => {
  const renderContent = () => {
    if (currentPage === 'dashboard') {
      if (role === 'founder') {
        return (
          <div className="w-full max-w-5xl mx-auto space-y-6">
            <FounderDashboard
              onCreateAccount={() => onAction('openCreateAccount')}
              onConfigureRewards={() => onAction('openRewardSettings')}
              onOpenLiveSchedule={(creatorId) => onAction('openLiveSchedule', creatorId)}
              onScheduleMatch={() => onAction('openScheduleMatch')}
              onOpenSponsorships={() => onAction('openSponsorshipForm')}
              onCreatePoster={() => onAction('openCreatePoster')}
              username={username}
            />
            <div className="mt-6">
              <SocialCommunityLinks />
            </div>
          </div>
        );
      } else if (role === 'creator') {
        return (
          <div className="w-full max-w-5xl mx-auto space-y-6">
            <CreatorDashboard 
              onOpenSponsorshipForm={() => onAction('openSponsorshipForm')}
              onOpenSponsorshipList={() => onAction('openSponsorshipList')}
              onCreatePoster={() => onAction('openCreatePoster')}
              role={role}
            />
            <div className="mt-6">
              <SocialCommunityLinks compact={true} />
            </div>
          </div>
        );
      } else {
        return (
          <div className="w-full max-w-5xl mx-auto space-y-6">
            <StandardDashboardContent
              username={username}
              role={role}
              onAction={onAction}
            />
          </div>
        );
      }
    } else {
      return (
        <div className="w-full max-w-5xl mx-auto space-y-6">
          <PlaceholderPageContent currentPage={currentPage} />
        </div>
      );
    }
  };

  return (
    <div className="max-w-full w-full mx-auto p-4 md:p-6 space-y-6 overflow-x-hidden">
      <DashboardHeader currentPage={currentPage} role={role} />
      {renderContent()}
    </div>
  );
};
