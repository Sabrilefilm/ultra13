
import { useState } from "react";
import { RoleStats } from "@/components/dashboard/RoleStats";
import { UpcomingMatches } from "@/components/dashboard/UpcomingMatches";
import { ProfileHeader } from "@/components/ProfileHeader";
import { PenaltyManager } from "@/components/penalties/PenaltyManager";
import { StatCards } from "@/components/dashboard/StatCards";

interface DashContentProps {
  username: string;
  role: string;
  currentPage: string;
  onAction: (action: string, data?: any) => void;
}

export const DashContent = ({
  username,
  role,
  currentPage,
  onAction
}: DashContentProps) => {
  const renderPageContent = () => {
    switch (currentPage) {
      case 'dashboard':
        return (
          <>
            <ProfileHeader 
              username={username}
              handle={`@${role === 'founder' ? 'Fondateur' : role}`}
            />
            <StatCards role={role} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              <RoleStats role={role} userId={username} />
              <UpcomingMatches role={role} creatorId={username} />
            </div>
          </>
        );
      case 'penalties':
        return <PenaltyManager username={username} role={role} />;
      default:
        return (
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-400">Page en construction</p>
          </div>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">
          {currentPage === 'dashboard' ? 'Tableau de bord' : 
           currentPage === 'penalties' ? 'Gestion des pénalités' : 
           'Ultra by Phocéen Agency'}
        </h1>
        <div className="text-sm text-white/60">
          {role === 'creator' && (
            <p>Vous devez faire 7J 15H de lives</p>
          )}
        </div>
      </div>
      
      {renderPageContent()}
    </div>
  );
};
