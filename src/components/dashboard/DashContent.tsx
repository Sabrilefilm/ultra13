
import { useState } from "react";
import { RoleStats } from "@/components/dashboard/RoleStats";
import { UpcomingMatches } from "@/components/dashboard/UpcomingMatches";
import { ProfileHeader } from "@/components/ProfileHeader";
import { PenaltyManager } from "@/components/penalties/PenaltyManager";
import { StatCards } from "@/components/dashboard/StatCards";
import { FounderDashboard } from "@/components/dashboard/FounderDashboard";
import { Card } from "@/components/ui/card";
import { InternalRulesContent } from "@/components/rules/InternalRulesContent";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  const renderPageContent = () => {
    switch (currentPage) {
      case 'dashboard':
        return role === 'founder' ? (
          <FounderDashboard
            onCreateAccount={() => onAction('openCreateAccount')}
            onConfigureRewards={() => onAction('openRewardSettings')}
            onOpenLiveSchedule={(creatorId) => onAction('openLiveSchedule', creatorId)}
            onScheduleMatch={() => onAction('openScheduleMatch')}
            onOpenSponsorships={() => onAction('openSponsorshipForm')}
            onCreatePoster={() => onAction('openCreatePoster')}
            username={username}
          />
        ) : (
          <>
            <ProfileHeader 
              username={username}
              handle={`@${role === 'founder' ? 'Fondateur' : role}`}
            />
            <div className="mb-6">
              <StatCards role={role} />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <Card className="bg-[#1e1f2e]/90 backdrop-blur-sm border border-gray-800/50 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
                <h3 className="text-xl font-semibold mb-4 text-white/90">Statistiques</h3>
                <RoleStats role={role} userId={username} />
              </Card>
              <Card className="bg-[#1e1f2e]/90 backdrop-blur-sm border border-gray-800/50 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
                <h3 className="text-xl font-semibold mb-4 text-white/90">Matchs à venir</h3>
                <UpcomingMatches role={role} creatorId={username} />
              </Card>
            </div>
          </>
        );
      case 'penalties':
        return (
          <Card className="bg-[#1e1f2e]/90 backdrop-blur-sm border border-gray-800/50 rounded-xl p-6 shadow-sm">
            <h3 className="text-xl font-semibold mb-4 text-white/90">Gestion des pénalités</h3>
            <PenaltyManager username={username} role={role} />
          </Card>
        );
      case 'team':
        return (
          <Card className="bg-[#1e1f2e]/90 backdrop-blur-sm border border-gray-800/50 rounded-xl p-6 shadow-sm">
            <h3 className="text-xl font-semibold mb-4 text-white/90">Gestion d'équipe</h3>
            {['agent', 'manager', 'founder'].includes(role) ? (
              <p className="text-gray-400">Accédez à la gestion des membres de votre équipe.</p>
            ) : (
              <p className="text-gray-400">Fonctionnalité disponible pour les agents, managers et fondateurs.</p>
            )}
          </Card>
        );
      case 'schedule':
        return (
          <Card className="bg-[#1e1f2e]/90 backdrop-blur-sm border border-gray-800/50 rounded-xl p-6 shadow-sm">
            <h3 className="text-xl font-semibold mb-4 text-white/90">Planning</h3>
            {['agent', 'manager', 'founder'].includes(role) ? (
              <p className="text-gray-400">Gérez le planning des créateurs et des événements.</p>
            ) : (
              <p className="text-gray-400">Fonctionnalité disponible pour les agents, managers et fondateurs.</p>
            )}
          </Card>
        );
      case 'internal-rules':
        return <InternalRulesContent />;
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
        <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
          {currentPage === 'dashboard' ? 'Tableau de bord' : 
           currentPage === 'penalties' ? 'Gestion des pénalités' : 
           currentPage === 'team' ? 'Gestion d\'équipe' : 
           currentPage === 'schedule' ? 'Planning' : 
           currentPage === 'internal-rules' ? 'Règlement intérieur' :
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
