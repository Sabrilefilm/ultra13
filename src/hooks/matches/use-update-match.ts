
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

export const useUpdateMatch = (creatorId: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

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

  return { updateMatchDetails };
};
