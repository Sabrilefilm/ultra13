
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface Creator {
  id: string;
  username: string;
  live_schedules?: Array<{ hours: number; days: number }>;
  profiles?: Array<{ total_diamonds: number }>;
}

export const creatorStatsService = {
  async fetchCreators(role: string, username: string) {
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
            ),
            diamonds!inner (
              total_diamonds
            )
          `)
          .eq("role", "creator");

        if (error) throw error;
        
        // Reformatting data to match expected structure
        const formattedData = data?.map(creator => ({
          ...creator,
          profiles: creator.diamonds ? [{ total_diamonds: creator.diamonds[0]?.total_diamonds || 0 }] : [{ total_diamonds: 0 }]
        })) || [];
        
        return formattedData;
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
            ),
            diamonds!inner (
              total_diamonds
            )
          `)
          .eq("role", "creator")
          .eq("agent_id", agentData.id);

        if (error) throw error;
        
        // Reformatting data to match expected structure
        const formattedData = data?.map(creator => ({
          ...creator,
          profiles: creator.diamonds ? [{ total_diamonds: creator.diamonds[0]?.total_diamonds || 0 }] : [{ total_diamonds: 0 }]
        })) || [];
        
        return formattedData;
      }
    } catch (error) {
      console.error("Error fetching creators:", error);
      throw error;
    }
  },

  async updateSchedule(creator: Creator, hours: number, days: number) {
    try {
      if (creator.live_schedules && creator.live_schedules.length > 0) {
        const { error } = await supabase
          .from("live_schedules")
          .update({ hours, days })
          .eq("creator_id", creator.id);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("live_schedules")
          .insert([
            { creator_id: creator.id, hours, days }
          ]);
        
        if (error) throw error;
      }
      return true;
    } catch (error) {
      console.error("Error updating schedule:", error);
      throw error;
    }
  },

  async updateDiamonds(creator: Creator, newValue: number) {
    try {
      console.log(`Updating diamonds for creator ${creator.id} to ${newValue}`);
      
      // Utiliser la nouvelle fonction manage_diamonds
      const { data, error } = await supabase
        .rpc('manage_diamonds', {
          target_user_id: creator.id,
          diamonds_value: newValue,
          operation: 'set'
        });
      
      if (error) {
        console.error("Error updating profile:", error);
        throw error;
      }
      
      console.log("Profile update response:", data);
      return true;
    } catch (error) {
      console.error("Error updating diamonds:", error);
      throw error;
    }
  },

  async removeCreator(creatorId: string) {
    try {
      const { error } = await supabase
        .from("user_accounts")
        .update({ agent_id: null })
        .eq("id", creatorId);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Error removing creator:", error);
      throw error;
    }
  },

  async resetAllSchedules() {
    try {
      const { error } = await supabase
        .from("live_schedules")
        .update({ hours: 0, days: 0 })
        .not("creator_id", "is", null);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Error resetting schedules:", error);
      throw error;
    }
  },

  async resetAllDiamonds() {
    try {
      const { error } = await supabase
        .from("diamonds")
        .update({ total_diamonds: 0 })
        .eq("total_diamonds", ">");
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Error resetting diamonds:", error);
      throw error;
    }
  }
};
