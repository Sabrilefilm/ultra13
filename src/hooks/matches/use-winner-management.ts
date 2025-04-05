
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import confetti from 'canvas-confetti';

export const useWinnerManagement = (creatorId: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const setWinner = async (matchId: string, winnerId: string) => {
    try {
      // Récupérer les détails du match avant modification
      const { data: matchData, error: fetchError } = await supabase
        .from('upcoming_matches')
        .select('*')
        .eq('id', matchId)
        .single();
      
      if (fetchError) throw fetchError;
      
      // Vérifier si le match est en mode "off" (sans boost)
      let newStatus;
      if (matchData.status === 'off') {
        newStatus = 'completed_off';  // Maintenir l'indication que c'était sans boost
      } else {
        newStatus = 'completed';
      }
      
      console.log("Setting winner with status:", newStatus);
      
      const { error } = await supabase
        .from('upcoming_matches')
        .update({
          winner_id: winnerId,
          status: newStatus
        })
        .eq('id', matchId);

      if (error) {
        console.error("Update error details:", error);
        throw error;
      }

      // Déterminer le type d'animation basé sur si le premier créateur a gagné
      if (winnerId === matchData.creator_id) {
        // Animation spéciale pour le gagnant qui est le créateur principal
        celebrateMainCreatorWin();
      } else {
        // Animation pour les autres gagnants
        showOtherCreatorWin();
      }

      // Supprimer les matchs anciens (plus de 3 mois)
      cleanupOldMatches();

      queryClient.invalidateQueries({ queryKey: ['upcoming-matches', creatorId] });
    } catch (error) {
      console.error("Erreur lors de la définition du gagnant:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la définition du gagnant",
        variant: "destructive",
        className: "bg-background border border-border"
      });
    }
  };

  // Célébration pour quand notre créateur principal gagne
  const celebrateMainCreatorWin = () => {
    try {
      // Animation de confettis pendant 2 secondes (au lieu de 2 minutes)
      const duration = 2 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { 
        startVelocity: 30, 
        spread: 360, 
        ticks: 60, 
        zIndex: 100,
        gravity: 0.5,
        drift: 0,
        colors: ['#9b87f5', '#7E69AB', '#D6BCFA', '#F1F0FB'], // Couleurs dans la palette demandée
      };

      function randomInRange(min: number, max: number) {
        return Math.random() * (max - min) + min;
      }

      // Lancer les confettis une seule fois au lieu d'un intervalle
      confetti({
        ...defaults,
        particleCount: 100,
        origin: { x: randomInRange(0.2, 0.4), y: 0.1 }
      });
      confetti({
        ...defaults,
        particleCount: 100,
        origin: { x: randomInRange(0.6, 0.8), y: 0.1 }
      });

      toast({
        title: "🎉 VICTOIRE! 🏆",
        description: "Notre créateur a remporté le match!",
        className: "bg-gradient-to-r from-purple-100 to-indigo-100 border border-purple-300 text-purple-800"
      });
    } catch (error) {
      console.error("Erreur d'animation:", error);
    }
  };

  // Animation pour quand un autre créateur gagne
  const showOtherCreatorWin = () => {
    toast({
      title: "😔 Match terminé",
      description: "Le match est terminé, notre créateur n'a pas gagné cette fois-ci",
      className: "bg-gradient-to-r from-slate-100 to-slate-200 border border-slate-300 text-slate-800"
    });
  };

  // Nettoyage automatique des matchs anciens (plus de 3 mois)
  const cleanupOldMatches = async () => {
    try {
      // Calculer la date limite (3 mois dans le passé)
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
      
      // Supprimer les matchs plus anciens que 3 mois
      const { error } = await supabase
        .from('upcoming_matches')
        .delete()
        .lt('match_date', threeMonthsAgo.toISOString());
      
      if (error) {
        console.error("Erreur lors du nettoyage des anciens matchs:", error);
      } else {
        console.log("Nettoyage automatique: matchs de plus de 3 mois supprimés");
      }
    } catch (error) {
      console.error("Erreur lors du nettoyage des anciens matchs:", error);
    }
  };

  const clearWinner = async (matchId: string) => {
    try {
      // Récupérer les détails du match y compris la plateforme
      const { data, error: fetchError } = await supabase
        .from('upcoming_matches')
        .select('*') 
        .eq('id', matchId)
        .single();
      
      if (fetchError) throw fetchError;
      
      // Déterminer le statut approprié en conservant l'information si le match était avec ou sans boost
      const newStatus = (data.status === 'completed_off' || data.status === 'off') ? 'off' : 'scheduled';
      
      const { error } = await supabase
        .from('upcoming_matches')
        .update({
          winner_id: null,
          points: null,
          status: newStatus
        })
        .eq('id', matchId);

      if (error) throw error;

      toast({
        title: "Gagnant effacé",
        description: "Le gagnant du match a été effacé avec succès",
        className: "bg-gradient-to-r from-slate-100 to-slate-200 border border-slate-300 text-slate-800"
      });

      queryClient.invalidateQueries({ queryKey: ['upcoming-matches', creatorId] });
    } catch (error) {
      console.error("Erreur lors de l'effacement du gagnant:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'effacement du gagnant",
        variant: "destructive",
        className: "bg-background border border-border"
      });
    }
  };

  return {
    setWinner,
    clearWinner,
    cleanupOldMatches
  };
};
