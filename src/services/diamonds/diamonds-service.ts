
import { supabase } from "@/lib/supabase";
import { Creator } from "@/hooks/diamonds/use-diamond-fetch"; // Use consistent Creator type

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
      console.log("Resetting all diamonds to 0");
      
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
      
      return true;
    } catch (error) {
      console.error("Error resetting all diamonds:", error);
      throw error;
    }
  }
};
