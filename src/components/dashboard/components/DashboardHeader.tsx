
import React from 'react';

interface DashboardHeaderProps {
  currentPage: string;
  role: string;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ 
  currentPage, 
  role 
}) => {
  const getPageTitle = () => {
    switch(currentPage) {
      case 'dashboard': return 'Tableau de bord';
      case 'penalties': return 'Gestion des pénalités';
      case 'team': return 'Gestion d\'équipe';
      case 'schedule': return 'Planning';
      case 'internal-rules': return 'Règlement intérieur';
      case 'creator-rules': return 'Règles des créateurs';
      case 'training': return 'Formations';
      default: return 'Ultra by Phocéen Agency';
    }
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
      <h1 className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">
        {getPageTitle()}
      </h1>
      <div className="text-sm bg-purple-800/30 px-3 py-1 rounded-full border border-purple-700/30 text-purple-300 whitespace-nowrap">
        {role === 'creator' ? (
          <span>Objectif: 7J 15H de lives</span>
        ) : (
          <span>Connecté en tant que {role}</span>
        )}
      </div>
    </div>
  );
};
