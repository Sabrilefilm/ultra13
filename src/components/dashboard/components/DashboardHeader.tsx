
import React from 'react';

interface DashboardHeaderProps {
  currentPage: string;
  role: string;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ 
  currentPage, 
  role 
}) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">
        {currentPage === 'dashboard' ? 'Tableau de bord' : 
         currentPage === 'penalties' ? 'Gestion des pénalités' : 
         currentPage === 'team' ? 'Gestion d\'équipe' : 
         currentPage === 'schedule' ? 'Planning' : 
         currentPage === 'internal-rules' ? 'Règlement intérieur' :
         currentPage === 'creator-rules' ? 'Règles des créateurs' :
         'Ultra by Phocéen Agency'}
      </h1>
      <div className="text-sm bg-purple-800/30 px-3 py-1 rounded-full border border-purple-700/30 text-purple-300">
        {role === 'creator' && (
          <span>Objectif: 7J 15H de lives</span>
        )}
        {role !== 'creator' && (
          <span>Connecté en tant que {role}</span>
        )}
      </div>
    </div>
  );
};
