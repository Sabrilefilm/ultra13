
import React from "react";
import { StatCards } from "@/components/dashboard/StatCards";
import { LeaveAgencyDialog } from "@/components/agency/LeaveAgencyDialog";
import { DailyQuote } from "@/components/dashboard/DailyQuote";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, AlertTriangle, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useMediaQuery } from "@/hooks/use-media-query";

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
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Récupérer les horaires du créateur connecté
  const { data: liveSchedule, isLoading } = useQuery({
    queryKey: ["creator-schedule"],
    queryFn: async () => {
      try {
        // Récupérer l'ID de l'utilisateur connecté via localStorage
        const username = localStorage.getItem('username');
        
        if (!username) {
          return { hours: 0, days: 0 };
        }
        
        // Récupérer l'ID utilisateur à partir du username
        const { data: userData, error: userError } = await supabase
          .from('user_accounts')
          .select('id')
          .eq('username', username)
          .maybeSingle();
          
        if (userError || !userData) {
          console.error('Erreur lors de la récupération de l\'ID utilisateur:', userError);
          return { hours: 0, days: 0 };
        }

        // Récupérer l'horaire de live
        const { data: scheduleData, error } = await supabase
          .from('live_schedules')
          .select('hours, days')
          .eq('creator_id', userData.id)
          .maybeSingle();

        if (error) {
          throw error;
        }

        return scheduleData || { hours: 0, days: 0 };
      } catch (error) {
        console.error("Erreur lors de la récupération des horaires:", error);
        toast.error("Impossible de récupérer vos horaires de live");
        return { hours: 0, days: 0 };
      }
    }
  });

  // Calculer le total d'heures hebdomadaires
  const weeklyHours = liveSchedule ? (liveSchedule.hours * liveSchedule.days) : 0;
  
  // Objectifs à atteindre
  const targetHours = 15;
  const targetDays = 7;

  return (
    <div className="space-y-6">
      {/* Quote du jour */}
      <DailyQuote />
      
      {/* Résumé */}
      <Card className="bg-[#1e1f2e]/90 backdrop-blur-sm border border-gray-800/50 rounded-xl shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl text-white/90">Tableau de bord</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-gray-300 space-y-2">
            <p className="text-lg font-medium mb-3">Bienvenue sur votre tableau de bord!</p>
            
            <div className="mt-3 p-4 bg-purple-900/20 border border-purple-700/30 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-purple-300">Vos horaires</h4>
                  <p className="text-sm text-purple-200/80 mt-1">
                    {isLoading ? (
                      <span className="h-4 w-24 bg-purple-800/40 animate-pulse rounded inline-block"></span>
                    ) : (
                      `${liveSchedule?.hours || 0} heures par jour × ${liveSchedule?.days || 0} jours par semaine`
                    )}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-purple-300">
                    {isLoading ? (
                      <span className="h-8 w-16 bg-purple-800/40 animate-pulse rounded inline-block"></span>
                    ) : (
                      `${weeklyHours}h`
                    )}
                  </span>
                  <p className="text-xs text-purple-200/80">total par semaine</p>
                </div>
              </div>
              <div className="mt-2 text-sm text-purple-200/70">
                <p>Objectifs: {targetDays} jours et {targetHours} heures par semaine.</p>
              </div>
            </div>
            
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
          {isMobile ? "Messages" : "Accéder à la messagerie"}
        </Button>
        
        {/* Bouton quitter l'agence avec avertissement */}
        <Button 
          variant="destructive" 
          className="h-14 group relative" 
        >
          <div className="flex items-center justify-center w-full">
            <AlertTriangle className="h-5 w-5 mr-2 group-hover:animate-pulse" />
            <LogOut className="h-5 w-5 mr-1" />
            Je souhaite quitter l'agence
          </div>
          <LeaveAgencyDialog />
        </Button>
      </div>
    </div>
  );
};
