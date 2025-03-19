
import React from "react";
import { StatCards } from "@/components/dashboard/StatCards";
import { LeaveAgencyDialog } from "@/components/agency/LeaveAgencyDialog";
import { DailyQuote } from "@/components/dashboard/DailyQuote";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Quote du jour */}
      <DailyQuote />
      
      {/* Résumé */}
      <Card className="bg-[#1e1f2e]/90 backdrop-blur-sm border border-gray-800/50 rounded-xl shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl text-white/90">Résumé du jour</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-gray-300 space-y-2">
            <p>Bienvenue sur votre tableau de bord!</p>
            <p>Vos objectifs de streaming: 7 jours et 15 heures par semaine.</p>
            <p>Prochain match prévu: Demain à 20h00.</p>
          </div>
        </CardContent>
      </Card>
      
      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCards 
          role={role} 
          onOpenSponsorshipForm={onOpenSponsorshipForm}
          onOpenSponsorshipList={onOpenSponsorshipList}
          onCreatePoster={onCreatePoster}
        />
      </div>
      
      {/* Actions rapides */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Button 
          className="bg-purple-600 hover:bg-purple-700 text-white h-14"
          onClick={() => navigate("/messages")}
        >
          <MessageSquare className="h-5 w-5 mr-2" />
          Accéder à la messagerie
        </Button>
        
        <LeaveAgencyDialog />
      </div>
    </div>
  );
};
