
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
          <>
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
          </>
        );
      } else if (role === 'creator') {
        return (
          <>
            <CreatorDashboard 
              onOpenSponsorshipForm={() => onAction('openSponsorshipForm')}
              onOpenSponsorshipList={() => onAction('openSponsorshipList')}
              onCreatePoster={() => onAction('openCreatePoster')}
              role={role}
            />
            <div className="mt-6">
              <SocialCommunityLinks />
            </div>
          </>
        );
      } else {
        return (
          <StandardDashboardContent
            username={username}
            role={role}
            onAction={onAction}
          />
        );
      }
    } else {
      return <PlaceholderPageContent currentPage={currentPage} />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <DashboardHeader currentPage={currentPage} role={role} />
      {renderContent()}
    </div>
  );
};
