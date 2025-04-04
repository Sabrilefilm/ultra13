
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { diamondsService } from "@/services/diamonds/diamonds-service";

export const useCreatorRewards = (userId?: string, role?: string) => {
  return useQuery({
    queryKey: ["creator-rewards", userId],
    queryFn: async () => {
      if (role !== "creator" || !userId) return { total: 0, monthly: 0 };

      try {
        // Get total diamonds from rewards
        const { data: rewards, error } = await supabase
          .from("creator_rewards")
          .select("diamonds_count")
          .eq("creator_id", userId);

        if (error) {
          console.error("Error fetching rewards:", error);
          throw new Error("Erreur lors de la récupération des récompenses");
        }
        
        const totalDiamonds = rewards?.reduce((sum, reward) => sum + reward.diamonds_count, 0) || 0;
        
        // Get monthly diamonds
        const monthlyDiamonds = await diamondsService.getMonthlyDiamonds(userId);
        
        return { 
          total: totalDiamonds,
          monthly: monthlyDiamonds
        };
      } catch (error) {
        console.error("Error in rewards query:", error);
        toast.error(error instanceof Error ? error.message : "Une erreur est survenue");
        return { total: 0, monthly: 0 };
      }
    },
    enabled: role === "creator" && !!userId,
    refetchInterval: 5 * 60 * 1000 // Refresh every 5 minutes
  });
};
