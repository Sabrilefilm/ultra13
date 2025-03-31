
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Match } from "@/types/matches";

export const useFetchMatches = (creatorId: string) => {
  const { data: matches, isLoading, error } = useQuery({
    queryKey: ['upcoming-matches', creatorId],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('upcoming_matches')
          .select('*')
          .order('match_date', { ascending: true });
        
        if (error) throw error;
        return data || [];
      } catch (err) {
        console.error("Erreur lors du chargement des matchs:", err);
        return [];
      }
    }
  });

  return {
    matches: matches as Match[] || [],
    isLoading,
    error
  };
};
