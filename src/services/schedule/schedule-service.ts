
import { supabase } from "@/lib/supabase";
import { Creator } from "../api/creators-api";

export const scheduleService = {
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
  }
};
