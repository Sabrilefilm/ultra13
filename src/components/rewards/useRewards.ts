
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
      let query = supabase
        .from("creator_rewards")
        .select("*")
        .order("created_at", { ascending: false });

      if (role === "creator") {
        query = query.eq("creator_id", userId);
      }

      const { data, error } = await query;
      
      if (error) {
        console.error("Error fetching rewards:", error);
        throw error;
      }

      return (data || []).map(reward => ({
        ...reward,
        creator_username: reward.creator_id
      }));
    },
  });
}
