
import { supabase } from "@/lib/supabase";
import { Creator } from "@/hooks/diamonds/use-diamond-fetch"; // Use consistent Creator type
import { toast } from "sonner";

export const diamondsService = {
  async updateDiamonds(creator: Creator, newValue: number, operation: 'set' | 'add' | 'subtract' = 'set') {
    try {
      console.log(`Updating diamonds for creator ${creator.id} with ${newValue} diamonds using operation: ${operation}`);
      
      // First check if profile exists
      const { data: profileData, error: checkError } = await supabase
        .from('profiles')
        .select('id, total_diamonds, username')
        .eq('id', creator.id)
        .maybeSingle();

      if (checkError && checkError.code !== 'PGRST204') {
        console.error("Error checking profile:", checkError);
        throw checkError;
      }

      let newDiamondValue: number;
      
      // Calculate new diamond value based on operation type
      if (operation === 'set') {
        newDiamondValue = newValue;
      } else if (operation === 'add') {
        const currentDiamonds = profileData?.total_diamonds || 0;
        newDiamondValue = currentDiamonds + newValue;
      } else {
        // 'subtract'
        const currentDiamonds = profileData?.total_diamonds || 0;
        newDiamondValue = Math.max(0, currentDiamonds - newValue);
      }

      // Track monthly diamonds separately (create or update the monthly record)
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth() + 1;
      const currentYear = currentDate.getFullYear();
      const monthKey = `${currentYear}-${currentMonth.toString().padStart(2, '0')}`;
      
      // Update or create monthly diamond record
      try {
        const { data: monthlyData } = await supabase
          .from('monthly_diamonds')
          .select('*')
          .eq('creator_id', creator.id)
          .eq('month_key', monthKey)
          .maybeSingle();
          
        let monthlyDiamonds = 0;
        
        if (monthlyData) {
          // Update existing monthly record
          if (operation === 'set') {
            monthlyDiamonds = newValue;
          } else if (operation === 'add') {
            monthlyDiamonds = (monthlyData.diamonds || 0) + newValue;
          } else {
            // subtract
            monthlyDiamonds = Math.max(0, (monthlyData.diamonds || 0) - newValue);
          }
          
          await supabase
            .from('monthly_diamonds')
            .update({ diamonds: monthlyDiamonds, updated_at: new Date() })
            .eq('id', monthlyData.id);
        } else {
          // Create new monthly record
          monthlyDiamonds = operation === 'set' ? newValue : 
                           (operation === 'add' ? newValue : 0);
                           
          await supabase
            .from('monthly_diamonds')
            .insert({
              creator_id: creator.id,
              month_key: monthKey,
              diamonds: monthlyDiamonds,
              created_at: new Date(),
              updated_at: new Date()
            });
        }
        
        console.log(`Updated monthly diamonds for ${monthKey}: ${monthlyDiamonds}`);
      } catch (monthlyError) {
        // If monthly tracking fails, log error but continue with total diamonds update
        console.error("Error updating monthly diamonds:", monthlyError);
      }

      if (!profileData) {
        // If profile doesn't exist, create it
        console.log("Profile doesn't exist, creating new one");

        // First get username from user_accounts
        const { data: userData, error: userError } = await supabase
          .from('user_accounts')
          .select('username, role')
          .eq('id', creator.id)
          .single();
          
        if (userError) {
          console.error("Error fetching user data:", userError);
          throw userError;
        }
          
        const { error: insertError } = await supabase
          .from('profiles')
          .insert([{ 
            id: creator.id,
            username: userData.username || creator.username,
            role: userData.role || creator.role,
            total_diamonds: newDiamondValue,
            created_at: new Date(),
            updated_at: new Date()
          }]);
            
        if (insertError) {
          console.error("Error creating profile:", insertError);
          throw insertError;
        }
      } else {
        // If profile exists, update it
        console.log(`Updating profile with new diamond value: ${newDiamondValue}`);
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ 
            total_diamonds: newDiamondValue,
            updated_at: new Date()
          })
          .eq('id', creator.id);
            
        if (updateError) {
          console.error("Error updating profile:", updateError);
          throw updateError;
        }
      }
      
      console.log("Diamond update successful");
      return true;
    } catch (error) {
      console.error("Error updating diamonds:", error);
      throw error;
    }
  },

  async resetAllDiamonds() {
    try {
      console.log("Starting monthly diamonds reset...");
      
      // Get all creators
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
        console.log(`Resetting diamonds for ${creators.length} creators`);
        
        for (const creator of creators) {
          try {
            const { error } = await supabase
              .from('profiles')
              .update({ 
                total_diamonds: 0,
                updated_at: new Date()
              })
              .eq('id', creator.id);
              
            if (error) {
              console.error(`Error resetting diamonds for creator ${creator.id}:`, error);
            }
          } catch (err) {
            console.error(`Error in diamond reset for creator ${creator.id}:`, err);
          }
        }
      } else {
        console.log("No creators found to reset diamonds");
      }
      
      toast.success("Réinitialisation des diamants effectuée");
      console.log("Monthly diamonds reset complete!");
      return true;
    } catch (error) {
      console.error("Error resetting all diamonds:", error);
      throw error;
    }
  },
  
  async checkAndResetMonthlyDiamonds() {
    try {
      const today = new Date();
      // Si nous sommes le premier jour du mois
      if (today.getDate() === 1) {
        console.log("Today is the first day of the month, checking if diamonds reset is needed...");
        const lastResetKey = "last_diamonds_reset";
        // Récupérer la dernière date de réinitialisation
        const lastResetStr = localStorage.getItem(lastResetKey);
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();
        
        // Format de la date de dernière réinitialisation: YYYY-MM
        const thisMonthStr = `${currentYear}-${currentMonth + 1}`;
        
        // Si nous n'avons pas encore réinitialisé ce mois-ci
        if (lastResetStr !== thisMonthStr) {
          console.log("Réinitialisation mensuelle des diamants...");
          await this.resetAllDiamonds();
          // Enregistrer que nous avons fait la réinitialisation ce mois-ci
          localStorage.setItem(lastResetKey, thisMonthStr);
          console.log("Réinitialisation mensuelle des diamants terminée");
          return true;
        } else {
          console.log("Monthly diamonds reset already performed this month");
        }
      } else {
        console.log(`Today is day ${today.getDate()}, not performing monthly diamonds reset`);
      }
      return false;
    } catch (error) {
      console.error("Error in monthly diamonds check:", error);
      return false;
    }
  },
  
  async getMonthlyDiamonds(creatorId: string) {
    try {
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth() + 1;
      const currentYear = currentDate.getFullYear();
      const monthKey = `${currentYear}-${currentMonth.toString().padStart(2, '0')}`;
      
      const { data, error } = await supabase
        .from('monthly_diamonds')
        .select('diamonds')
        .eq('creator_id', creatorId)
        .eq('month_key', monthKey)
        .maybeSingle();
        
      if (error) {
        console.error("Error fetching monthly diamonds:", error);
        return 0;
      }
      
      return data?.diamonds || 0;
    } catch (error) {
      console.error("Error in getMonthlyDiamonds:", error);
      return 0;
    }
  }
};
