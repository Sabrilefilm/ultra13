
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

interface Reward {
  id: string;
  diamonds_count: number;
  creator_id: string;
  created_at: string;
  creator_username?: string;
}

export function useRewards(role: string, userId: string) {
  return useQuery({
    queryKey: ["rewards", userId, role],
    queryFn: async () => {
      // Pour les fondateurs et managers, récupérer toutes les récompenses
      // Pour les créateurs, filtrer par leur username
      const query = supabase
        .from("creator_rewards")
        .select(`
          *,
          creator:creator_id (
            username
          )
        `)
        .order("created_at", { ascending: false });

      const { data, error } = await query;
      
      if (error) {
        console.error("Error fetching rewards:", error);
        throw error;
      }

      return (data || []).map(reward => ({
        ...reward,
        creator_username: reward.creator?.username || reward.creator_id
      }));
    },
    // Rafraîchir les données toutes les 30 secondes
    refetchInterval: 30000,
  });
}
