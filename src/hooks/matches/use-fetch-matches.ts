
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export const useFetchMatches = (creatorId: string) => {
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

  return {
    matches,
    isLoading
  };
};
