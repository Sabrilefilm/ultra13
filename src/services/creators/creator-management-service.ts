
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

export const creatorManagementService = {
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

  async assignUserToManager(userId: string, managerId: string) {
    try {
      const { error } = await supabase
        .from("user_accounts")
        .update({ manager_id: managerId })
        .eq("id", userId);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Error assigning user to manager:", error);
      throw error;
    }
  },

  async assignAgentToManager(agentId: string, managerId: string) {
    try {
      const { error } = await supabase
        .from("user_accounts")
        .update({ manager_id: managerId })
        .eq("id", agentId)
        .eq("role", "agent");
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Error assigning agent to manager:", error);
      throw error;
    }
  }
};
