
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
        .select(`
          *,
          user_accounts!creator_id(username)
        `)
        .order("created_at", { ascending: false });

      if (role === "creator") {
        const { data: userAccount, error: userError } = await supabase
          .from("user_accounts")
          .select("id")
          .eq("username", userId)
          .single();

        if (userError) {
          console.error("Error fetching user account:", userError);
          return [];
        }

        if (userAccount) {
          query = query.eq("creator_id", userAccount.id);
        }
      }

      const { data, error } = await query;
      
      if (error) {
        console.error("Error fetching rewards:", error);
        throw error;
      }

      return (data || []).map(reward => ({
        ...reward,
        creator_username: reward.user_accounts?.username
      }));
    },
  });
}
