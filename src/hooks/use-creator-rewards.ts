
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export const useCreatorRewards = (userId?: string, role?: string) => {
  return useQuery({
    queryKey: ["creator-rewards", userId],
    queryFn: async () => {
      if (role !== "creator" || !userId) return null;

      try {
        const { data: rewards, error } = await supabase
          .from("creator_rewards")
          .select("diamonds_count")
          .eq("creator_id", userId);

        if (error) {
          console.error("Error fetching rewards:", error);
          throw new Error("Erreur lors de la récupération des récompenses");
        }

        console.log("Rewards found:", rewards);
        
        const totalDiamonds = rewards?.reduce((sum, reward) => sum + reward.diamonds_count, 0) || 0;
        return totalDiamonds;
      } catch (error) {
        console.error("Error in rewards query:", error);
        toast.error(error instanceof Error ? error.message : "Une erreur est survenue");
        return 0;
      }
    },
    enabled: role === "creator" && !!userId
  });
};
