
import { supabase } from "@/lib/supabase";

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
  }
};
