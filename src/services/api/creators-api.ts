
import { supabase } from "@/lib/supabase";

export interface Creator {
  id: string;
  username: string;
  live_schedules?: Array<{ hours: number; days: number }>;
  profiles?: Array<{ total_diamonds: number }>;
}

export const creatorsApi = {
  async fetchCreatorsByRole(role: string, username: string) {
    try {
      if (role === 'founder' || role === 'manager') {
        const { data, error } = await supabase
          .from("user_accounts")
          .select(`
            id,
            username,
            live_schedules (
              hours,
              days
            )
          `)
          .eq("role", "creator");

        if (error) throw error;
        return data || [];
      } else {
        const { data: agentData, error: agentError } = await supabase
          .from("user_accounts")
          .select("id")
          .eq("username", username)
          .eq("role", role)
          .single();

        if (agentError) throw agentError;
        if (!agentData || !agentData.id) {
          throw new Error("Données de l'agent introuvables");
        }

        const { data, error } = await supabase
          .from("user_accounts")
          .select(`
            id,
            username,
            live_schedules (
              hours,
              days
            )
          `)
          .eq("role", "creator")
          .eq("agent_id", agentData.id);

        if (error) throw error;
        return data || [];
      }
    } catch (error) {
      console.error("Error fetching creators:", error);
      throw error;
    }
  },
  
  async fetchDiamondsByCreators(creatorIds: string[]) {
    try {
      if (creatorIds.length === 0) return {};
      
      console.log("Fetching diamond data for creators:", creatorIds);
      
      // Récupérer les données des diamants à partir des profils
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("id, total_diamonds")
        .in("id", creatorIds);
        
      if (profilesError) {
        console.error("Error fetching profiles:", profilesError);
        console.warn("Falling back to empty diamond data");
        return {};
      }
      
      console.log("Profiles data received:", profiles);
      
      const formattedData = (profiles || []).reduce((acc, item) => {
        acc[item.id] = item.total_diamonds || 0;
        return acc;
      }, {} as Record<string, number>);
      
      console.log("Formatted diamond data:", formattedData);
      return formattedData;
    } catch (error) {
      console.error("Error fetching diamonds data:", error);
      return {};
    }
  }
};
