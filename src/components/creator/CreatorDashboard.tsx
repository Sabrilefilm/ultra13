import React from "react";
import { StatCards } from "@/components/dashboard/StatCards";
import { LeaveAgencyDialog } from "@/components/agency/LeaveAgencyDialog";
import { DailyQuote } from "@/components/dashboard/DailyQuote";

interface CreatorDashboardProps {
  onOpenSponsorshipForm: () => void;
  onOpenSponsorshipList: () => void;
  onCreatePoster: () => void;
  role: string;
}

export const CreatorDashboard = ({ 
  onOpenSponsorshipForm, 
  onOpenSponsorshipList,
  onCreatePoster,
  role
}: CreatorDashboardProps) => {
  return (
    <div className="space-y-6">
      {/* Quote du jour - ajouté ici */}
      <DailyQuote />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCards 
          role={role} 
          onOpenSponsorshipForm={onOpenSponsorshipForm}
          onOpenSponsorshipList={onOpenSponsorshipList}
          onCreatePoster={onCreatePoster}
        />
      </div>
      
      {/* Bouton pour quitter l'agence - pour les créateurs uniquement */}
      {role === 'creator' && (
        <LeaveAgencyDialog />
      )}
    </div>
  );
};
