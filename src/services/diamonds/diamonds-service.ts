
import { supabase } from "@/lib/supabase";
import { Creator } from "../api/creators-api";

export const diamondsService = {
  async updateDiamonds(creator: Creator, newValue: number) {
    try {
      console.log(`Updating diamonds for creator ${creator.id} to ${newValue}`);
      
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

  async resetAllDiamonds() {
    try {
      // Use manage_diamonds RPC to set all diamonds to 0
      const { data: creators, error: creatorsError } = await supabase
        .from("user_accounts")
        .select("id")
        .eq("role", "creator");
      
      if (creatorsError) {
        console.error("Error getting creators:", creatorsError);
        throw creatorsError;
      }
      
      // Reset all creators' diamonds to 0
      if (creators && creators.length > 0) {
        for (const creator of creators) {
          await supabase.rpc('manage_diamonds', {
            target_user_id: creator.id,
            diamonds_value: 0,
            operation: 'set'
          });
        }
      }
      
      return true;
    } catch (error) {
      console.error("Error resetting diamonds:", error);
      throw error;
    }
  }
};
