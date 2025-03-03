
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

export const useScheduleManagement = (refetch: () => void) => {
  const { toast } = useToast();
  
  const resetAllSchedules = async () => {
    try {
      const { error } = await supabase
        .from("live_schedules")
        .update({ hours: 0, days: 0 })
        .eq('is_active', true);

      if (error) {
        toast({
          variant: "destructive",
          title: "Erreur!",
          description: "Impossible de réinitialiser les horaires.",
        });
        return;
      }

      toast({
        title: "Succès!",
        description: "Tous les horaires ont été réinitialisés.",
      });
      refetch();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur!",
        description: "Une erreur s'est produite lors de la réinitialisation des horaires.",
      });
    }
  };

  const addMatch = async (creator1: string, creator2: string, matchDate: Date, isBoost: boolean = true) => {
    try {
      const { error } = await supabase.from("upcoming_matches").insert({
        creator_id: creator1,
        opponent_id: creator2,
        match_date: matchDate.toISOString(),
        status: isBoost ? 'scheduled' : 'off',
        source: 'TikTok'
      });

      if (error) {
        toast({
          variant: "destructive",
          title: "Erreur!",
          description: "Impossible d'ajouter le match.",
        });
        return false;
      }

      toast({
        title: "Succès!",
        description: "Le match a été ajouté avec succès.",
      });
      return true;
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur!",
        description: "Une erreur s'est produite lors de l'ajout du match.",
      });
      return false;
    }
  };

  return {
    resetAllSchedules,
    addMatch
  };
};
