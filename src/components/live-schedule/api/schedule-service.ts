
import { supabase } from "@/lib/supabase";
import { Schedule } from "../types";
import { toast } from "sonner";

export async function fetchProfileByUsername(username: string) {
  try {
    console.log("Fetching profile for username:", username);

    const { data: userAccount, error: userError } = await supabase
      .from("user_accounts")
      .select("id, username")
      .eq("username", username)
      .eq("role", "creator")
      .single();

    if (userError) {
      console.error("Database error:", userError);
      throw userError;
    }

    if (!userAccount) {
      console.log("No user account found for username:", username);
      toast.error(`Aucun profil trouvé pour ${username}`);
      return null;
    }

    console.log("User account found:", userAccount);
    return userAccount;
  } catch (error) {
    console.error("Erreur lors de la récupération du profil:", error);
    toast.error("Erreur lors de la récupération du profil");
    return null;
  }
}

export async function fetchScheduleByCreatorId(id: string) {
  try {
    console.log("Fetching schedules for id:", id);

    const { data, error } = await supabase
      .from("live_schedules")
      .select("*")
      .eq("creator_id", id)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 est le code pour "aucun résultat"
      throw error;
    }

    console.log("Schedule found:", data);
    return data;
  } catch (error) {
    console.error("Erreur lors du chargement des horaires:", error);
    toast.error("Erreur lors du chargement des horaires");
    return null;
  }
}

export async function fetchAllCreatorSchedules() {
  try {
    const { data: schedulesData, error: schedulesError } = await supabase
      .from("live_schedules")
      .select(`
        id, 
        hours, 
        days, 
        is_active, 
        creator_id,
        user_accounts(username)
      `)
      .order('days', { ascending: false });

    if (schedulesError) throw schedulesError;

    const formattedSchedules: Schedule[] = schedulesData.map(schedule => ({
      id: schedule.id,
      hours: schedule.hours,
      days: schedule.days,
      is_active: schedule.is_active,
      creator_name: schedule.user_accounts?.username || 'Inconnu',
      creator_id: schedule.creator_id
    }));

    return formattedSchedules;
  } catch (error) {
    console.error("Erreur lors du chargement de tous les horaires:", error);
    return [];
  }
}

export async function saveSchedule(schedule: Schedule, profileId: string) {
  try {
    const data = {
      creator_id: profileId,
      hours: schedule.hours,
      days: schedule.days,
      is_active: true,
    };

    if (schedule.id.startsWith('new-')) {
      const { error } = await supabase
        .from("live_schedules")
        .insert(data);
      
      if (error) throw error;
    } else {
      const { error } = await supabase
        .from("live_schedules")
        .update({
          hours: schedule.hours,
          days: schedule.days,
        })
        .eq("id", schedule.id);
        
      if (error) throw error;
    }

    return true;
  } catch (error) {
    console.error("Erreur lors de la sauvegarde des horaires:", error);
    toast.error("Erreur lors de la sauvegarde des horaires");
    return false;
  }
}
