
import { useState, useEffect } from "react";
import { Schedule } from "./types";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export const useLiveSchedule = (isOpen: boolean, creatorId: string) => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [allCreatorSchedules, setAllCreatorSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [profileId, setProfileId] = useState<string | null>(null);
  const [creatorName, setCreatorName] = useState("");

  const fetchProfileId = async (username: string) => {
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
      setProfileId(userAccount.id);
      setCreatorName(userAccount.username);
      return userAccount.id;

    } catch (error) {
      console.error("Erreur lors de la récupération du profil:", error);
      toast.error("Erreur lors de la récupération du profil");
      return null;
    }
  };

  const fetchSchedules = async (id: string) => {
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

      // Initialiser avec un seul horaire par créateur
      const schedule: Schedule = {
        id: data?.id || 'new-schedule',
        hours: data?.hours || 0,
        days: data?.days || 0,
        is_active: true,
        creator_name: creatorName
      };

      setSchedules([schedule]);
    } catch (error) {
      console.error("Erreur lors du chargement des horaires:", error);
      toast.error("Erreur lors du chargement des horaires");
    } finally {
      setLoading(false);
    }
  };

  const fetchAllCreatorSchedules = async () => {
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

      setAllCreatorSchedules(formattedSchedules);
    } catch (error) {
      console.error("Erreur lors du chargement de tous les horaires:", error);
    }
  };

  const handleSave = async () => {
    if (!profileId) return;

    try {
      setLoading(true);
      const schedule = schedules[0]; // On ne garde qu'un seul horaire

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

      // Mettre à jour la liste complète
      await fetchAllCreatorSchedules();

      toast.success("Horaires mis à jour avec succès");
      return true;
    } catch (error) {
      console.error("Erreur lors de la sauvegarde des horaires:", error);
      toast.error("Erreur lors de la sauvegarde des horaires");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateSchedule = (
    scheduleId: string,
    field: "hours" | "days" | "is_active",
    value: string | boolean
  ) => {
    setSchedules((prev) => {
      const newSchedules = prev.map((schedule) =>
        schedule.id === scheduleId
          ? { 
              ...schedule, 
              [field]: field === "is_active" ? value : Number(value)
            }
          : schedule
      );
      return newSchedules;
    });
  };

  useEffect(() => {
    if (isOpen) {
      fetchAllCreatorSchedules();
      
      if (creatorId) {
        console.log("Modal opened for creator:", creatorId);
        setLoading(true);
        const initializeData = async () => {
          const id = await fetchProfileId(creatorId);
          if (id) {
            await fetchSchedules(id);
          } else {
            setLoading(false);
          }
        };
        initializeData();
      }
    }
  }, [isOpen, creatorId]);

  return {
    schedules,
    allCreatorSchedules,
    loading,
    updateSchedule,
    handleSave,
    creatorName,
  };
};
