
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import confetti from 'canvas-confetti';

export const useUpcomingMatches = (role: string, creatorId: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: matches, isLoading } = useQuery({
    queryKey: ['upcoming-matches', creatorId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('upcoming_matches')
        .select('*')
        .order('match_date', { ascending: true });
      
      if (error) throw error;
      return data;
    }
  });

  const handleDelete = async (matchId: string) => {
    try {
      const { error } = await supabase
        .from('upcoming_matches')
        .delete()
        .eq('id', matchId);

      if (error) throw error;

      toast({
        title: "Match supprimé",
        description: "Le match a été supprimé avec succès",
      });

      queryClient.invalidateQueries({ queryKey: ['upcoming-matches', creatorId] });
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression du match",
        variant: "destructive",
      });
    }
  };

  const setWinner = async (matchId: string, winnerId: string) => {
    try {
      // Récupérer le statut actuel du match avant de le modifier
      const { data: matchData, error: fetchError } = await supabase
        .from('upcoming_matches')
        .select('status')
        .eq('id', matchId)
        .single();
      
      if (fetchError) throw fetchError;
      
      // Utiliser des valeurs de statut qui sont autorisées dans la contrainte
      // Vérifier si le match a un boost ou non
      const newStatus = matchData.status === 'off' ? 'completed' : 'completed';
      
      console.log("Setting winner with status:", newStatus);  // Debugging log
      
      const { error } = await supabase
        .from('upcoming_matches')
        .update({
          winner_id: winnerId,
          status: newStatus
        })
        .eq('id', matchId);

      if (error) {
        console.error("Update error details:", error);  // Detailed error logging
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
      // Récupérer le statut actuel du match
      const { data, error: fetchError } = await supabase
        .from('upcoming_matches')
        .select('status')
        .eq('id', matchId)
        .single();
      
      if (fetchError) throw fetchError;
      
      // Déterminer si le match était "off" (sans boost) ou "scheduled" (avec boost)
      const newStatus = data.status === 'completed_off' ? 'off' : 'scheduled';
      
      const { error } = await supabase
        .from('upcoming_matches')
        .update({
          winner_id: null,
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

  const updateMatchDetails = async (matchId: string, updatedData: any) => {
    try {
      const { error } = await supabase
        .from('upcoming_matches')
        .update(updatedData)
        .eq('id', matchId);

      if (error) throw error;

      toast({
        title: "Match mis à jour",
        description: "Les détails du match ont été mis à jour avec succès",
        className: "bg-background border border-border"
      });

      queryClient.invalidateQueries({ queryKey: ['upcoming-matches', creatorId] });
    } catch (error) {
      console.error("Erreur lors de la mise à jour du match:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour du match",
        variant: "destructive",
        className: "bg-background border border-border"
      });
    }
  };

  return {
    matches,
    isLoading,
    handleDelete,
    setWinner,
    clearWinner,
    updateMatchDetails
  };
};
