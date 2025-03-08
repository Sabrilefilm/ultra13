
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

export const useDeleteMatch = (creatorId: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

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
        className: "bg-background border border-border"
      });

      queryClient.invalidateQueries({ queryKey: ['upcoming-matches', creatorId] });
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression du match",
        variant: "destructive",
        className: "bg-background border border-border"
      });
    }
  };

  return { handleDelete };
};
