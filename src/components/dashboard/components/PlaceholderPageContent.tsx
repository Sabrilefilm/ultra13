
import React, { useState } from 'react';
import { UserGuide } from "@/components/help/UserGuide";
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";

interface PlaceholderPageContentProps {
  currentPage: string;
}

export const PlaceholderPageContent: React.FC<PlaceholderPageContentProps> = ({ currentPage }) => {
  const [showGuide, setShowGuide] = useState(false);

  return (
    <div className="p-6 bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm border border-purple-900/20 rounded-xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-medium text-white">
          {currentPage === 'dashboard' ? 'Tableau de bord' : 
           currentPage === 'penalties' ? 'Gestion des pénalités' : 
           currentPage === 'team' ? 'Gestion d\'équipe' : 
           currentPage === 'schedule' ? 'Planning' : 
           currentPage === 'internal-rules' ? 'Règlement intérieur' :
           currentPage === 'creator-rules' ? 'Règles des créateurs' :
           'Ultra by Phocéen Agency'}
        </h2>
        
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setShowGuide(!showGuide)}
          className="text-purple-400 hover:text-purple-300 hover:bg-purple-900/30"
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
