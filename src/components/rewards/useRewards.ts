
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

interface Reward {
  id: string;
  diamonds_count: number;
  creator_id: string;
  created_at: string;
  creator_username?: string;
  payment_status: string;
  amount_earned?: number;
}

export function useRewards(role: string, userId: string) {
  return useQuery({
    queryKey: ["rewards", userId, role],
    queryFn: async () => {
      try {
        // Récupération des paramètres de la plateforme pour le calcul des diamants
        const { data: settingsData, error: settingsError } = await supabase
          .from("platform_settings")
          .select("diamond_value")
          .single();
          
        if (settingsError) {
          console.error("Erreur lors de la récupération des paramètres:", settingsError);
        }
        
        // Requête principale pour les récompenses
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

        // Les politiques RLS s'occupent déjà de filtrer les données selon le rôle
        return (data || []).map(reward => ({
          ...reward,
          creator_username: reward.creator?.username || reward.creator_id,
          // On garde les diamants mais on n'utilise plus la conversion en euros
          amount_earned: reward.amount_earned || 0
        }));
      } catch (error) {
        console.error("Erreur dans la récupération des récompenses:", error);
        throw error;
      }
    },
    refetchInterval: 30000, // Rafraîchissement toutes les 30 secondes
  });
}
