
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
