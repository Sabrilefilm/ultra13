
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
            profiles (
              total_diamonds
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
            ),
            profiles (
              total_diamonds
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
      
      // On vérifie d'abord si le profil existe déjà en utilisant user_accounts comme point de vérification
      const { data: userData, error: userError } = await supabase
        .from('user_accounts')
        .select('id, username')
        .eq('id', creator.id)
        .single();
      
      if (userError) {
        console.error("Error fetching user:", userError);
        throw userError;
      }
      
      // Ensuite, vérifiez si un profil existe déjà
      const { data: existingProfile, error: checkError } = await supabase
        .from('profiles')
        .select('id, total_diamonds')
        .eq('id', creator.id)
        .maybeSingle();
      
      if (checkError) {
        console.error("Error checking profile:", checkError);
        throw checkError;
      }
      
      if (existingProfile) {
        // Mettre à jour le profil existant
        console.log("Updating existing profile");
        const { error } = await supabase
          .from('profiles')
          .update({ total_diamonds: newValue })
          .eq('id', creator.id);
          
        if (error) {
          console.error("Error updating profile:", error);
          throw error;
        }
      } else {
        // Créer un nouveau profil avec RPC pour éviter les problèmes de RLS
        console.log("Creating new profile");
        const { error } = await supabase.rpc('create_or_update_profile', { 
          user_id: creator.id,
          user_username: userData.username,
          diamonds_value: newValue
        });
        
        if (error) {
          console.error("Error creating profile with RPC:", error);
          throw error;
        }
      }
      
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
  }
};
