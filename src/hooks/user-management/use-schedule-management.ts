
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

  return {
    resetAllSchedules
  };
};
