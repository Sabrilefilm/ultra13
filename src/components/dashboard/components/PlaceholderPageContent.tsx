
import React, { useState } from 'react';
import { UserGuide } from "@/components/help/UserGuide";
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";

interface PlaceholderPageContentProps {
  currentPage: string;
}

export const PlaceholderPageContent: React.FC<PlaceholderPageContentProps> = ({ currentPage }) => {
  const [showGuide, setShowGuide] = useState(false);

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
    <div className="p-4 sm:p-6 bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm border border-purple-900/20 rounded-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-lg sm:text-xl font-medium text-white">
          {getPageTitle()}
        </h2>
        
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setShowGuide(!showGuide)}
          className="text-purple-400 hover:text-purple-300 hover:bg-purple-900/30 w-fit"
        >
          <HelpCircle className="h-4 w-4 mr-2" />
          Aide
        </Button>
      </div>
      
      {showGuide && (
        <div className="mb-6">
          <UserGuide />
        </div>
      )}
    </div>
  );
};
