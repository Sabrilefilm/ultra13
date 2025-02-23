
import { useState, useEffect } from "react";
import { Schedule } from "./types";
import { DAYS_OF_WEEK } from "./constants";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export const useLiveSchedule = (isOpen: boolean, creatorId: string) => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [profileId, setProfileId] = useState<string | null>(null);
  const [creatorName, setCreatorName] = useState("");
  const [totalDays, setTotalDays] = useState(0);
  const [totalHours, setTotalHours] = useState(0);

  const fetchProfileId = async (username: string) => {
    try {
      const { data: userAccounts, error: userError } = await supabase
        .from("user_accounts")
        .select("id, username")
        .eq("username", username)
        .single();

      if (userError) throw userError;
      if (userAccounts) {
        setProfileId(userAccounts.id);
        setCreatorName(userAccounts.username);
        return userAccounts.id;
      }
    } catch (error) {
      console.error("Erreur lors de la récupération du profil:", error);
      toast.error("Erreur lors de la récupération du profil");
    }
    return null;
  };

  const calculateStats = (schedules: Schedule[]) => {
    const activeDays = schedules.filter(s => s.is_active).length;
    setTotalDays(activeDays);

    let totalHours = 0;
    schedules.forEach(schedule => {
      if (schedule.is_active) {
        const start = new Date(`2000-01-01 ${schedule.start_time}`);
        const end = new Date(`2000-01-01 ${schedule.end_time}`);
        totalHours += (end.getTime() - start.getTime()) / (1000 * 60 * 60);
      }
    });
    setTotalHours(totalHours);
  };

  const fetchSchedules = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from("live_schedules")
        .select("*")
        .eq("creator_id", id);

      if (error) throw error;

      const initialSchedules = DAYS_OF_WEEK.map((day) => {
        const existingSchedule = data?.find((s) => s.day_of_week === day.id);
        return (
          existingSchedule || {
            id: `new-${day.id}`,
            day_of_week: day.id,
            start_time: "09:00",
            end_time: "18:00",
            is_active: false,
          }
        );
      });

      setSchedules(initialSchedules);
      calculateStats(initialSchedules);
    } catch (error) {
      console.error("Erreur lors du chargement des horaires:", error);
      toast.error("Erreur lors du chargement des horaires");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!profileId) return;

    try {
      setLoading(true);

      for (const schedule of schedules) {
        if (schedule.is_active) {
          if (schedule.id.startsWith("new-")) {
            const { error } = await supabase.from("live_schedules").insert({
              creator_id: profileId,
              day_of_week: schedule.day_of_week,
              start_time: schedule.start_time,
              end_time: schedule.end_time,
              is_active: true,
            });
            if (error) throw error;
          } else {
            const { error } = await supabase
              .from("live_schedules")
              .update({
                start_time: schedule.start_time,
                end_time: schedule.end_time,
              })
              .eq("id", schedule.id);
            if (error) throw error;
          }
        } else if (!schedule.id.startsWith("new-")) {
          const { error } = await supabase
            .from("live_schedules")
            .delete()
            .eq("id", schedule.id);
          if (error) throw error;
        }
      }

      calculateStats(schedules);
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
    dayId: string,
    field: "start_time" | "end_time" | "is_active",
    value: string | boolean
  ) => {
    setSchedules((prev) => {
      const newSchedules = prev.map((schedule) =>
        schedule.day_of_week === dayId
          ? { ...schedule, [field]: value }
          : schedule
      );
      calculateStats(newSchedules);
      return newSchedules;
    });
  };

  useEffect(() => {
    if (isOpen && creatorId) {
      setLoading(true);
      const initializeData = async () => {
        const id = await fetchProfileId(creatorId);
        if (id) {
          await fetchSchedules(id);
        }
      };
      initializeData();
    }
  }, [isOpen, creatorId]);

  return {
    schedules,
    loading,
    updateSchedule,
    handleSave,
    totalDays,
    totalHours,
    creatorName,
  };
};
