
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
        newStatus = 'completed';  
      } else {
        newStatus = 'completed';
      }
      
      console.log("Setting winner with status:", newStatus);  // Log de débogage
      
      const { error } = await supabase
        .from('upcoming_matches')
        .update({
          winner_id: winnerId,
          status: newStatus
        })
        .eq('id', matchId);

      if (error) {
        console.error("Update error details:", error);  // Log détaillé de l'erreur
        throw error;
      }

      // Animation de confettis pendant 2 minutes
      const duration = 2 * 60 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { 
        startVelocity: 30, 
        spread: 360, 
        ticks: 60, 
        zIndex: -1,
        gravity: 0.5,
        drift: 0
      };

      function randomInRange(min: number, max: number) {
        return Math.random() * (max - min) + min;
      }

      const interval = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 100;

        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: 0 }
        });
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.4, 0.6), y: 0 }
        });
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: 0 }
        });
      }, 100);

      toast({
        title: "🎉 Gagnant défini !",
        description: "Le gagnant du match a été enregistré avec succès",
        className: "bg-background border border-border"
      });

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

  const clearWinner = async (matchId: string) => {
    try {
      // Récupérer les détails du match y compris la plateforme
      const { data, error: fetchError } = await supabase
        .from('upcoming_matches')
        .select('*') 
        .eq('id', matchId)
        .single();
      
      if (fetchError) throw fetchError;
      
      // Déterminer le statut approprié
      const newStatus = data.status === 'completed' ? 
        (data.platform === 'TikTok' ? 'off' : 'scheduled') : 'scheduled';
      
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
        className: "bg-background border border-border"
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
    clearWinner
  };
};
