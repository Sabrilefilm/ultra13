
import { supabase } from "@/lib/supabase";
import { ScheduleCreator } from "@/hooks/creator-stats/use-schedule-editing";
import { toast } from "sonner";

export const scheduleService = {
  async updateSchedule(creator: ScheduleCreator, hours: number, days: number) {
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
      console.log("Starting monthly schedule reset...");
      const { error } = await supabase
        .from("live_schedules")
        .update({ hours: 0, days: 0 })
        .not("creator_id", "is", null);
      
      if (error) throw error;
      console.log("Monthly schedule reset complete!");
      toast.success("Réinitialisation des horaires effectuée");
      return true;
    } catch (error) {
      console.error("Error resetting schedules:", error);
      throw error;
    }
  },
  
  async checkAndResetMonthlySchedules() {
    try {
      const today = new Date();
      // Si nous sommes le premier jour du mois
      if (today.getDate() === 1) {
        console.log("Today is the first day of the month, checking if reset is needed...");
        const lastResetKey = "last_schedule_reset";
        // Récupérer la dernière date de réinitialisation
        const lastResetStr = localStorage.getItem(lastResetKey);
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();
        
        // Format de la date de dernière réinitialisation: YYYY-MM
        const thisMonthStr = `${currentYear}-${currentMonth + 1}`;
        
        // Si nous n'avons pas encore réinitialisé ce mois-ci
        if (lastResetStr !== thisMonthStr) {
          console.log("Réinitialisation mensuelle des horaires...");
          await this.resetAllSchedules();
          // Enregistrer que nous avons fait la réinitialisation ce mois-ci
          localStorage.setItem(lastResetKey, thisMonthStr);
          console.log("Réinitialisation mensuelle terminée");
          return true;
        } else {
          console.log("Monthly reset already performed this month");
        }
      } else {
        console.log(`Today is day ${today.getDate()}, not performing monthly reset`);
      }
      return false;
    } catch (error) {
      console.error("Error in monthly schedule check:", error);
      return false;
    }
  }
};
