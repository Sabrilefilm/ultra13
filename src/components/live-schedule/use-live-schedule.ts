
import { useState, useEffect } from "react";
import { Schedule } from "./types";
import { toast } from "sonner";
import { 
  fetchProfileByUsername, 
  fetchScheduleByCreatorId, 
  fetchAllCreatorSchedules,
  saveSchedule
} from "./api/schedule-service";
import { updateScheduleField, initializeSchedule } from "./utils/state-manager";

export const useLiveSchedule = (isOpen: boolean, creatorId: string) => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [allCreatorSchedules, setAllCreatorSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [profileId, setProfileId] = useState<string | null>(null);
  const [creatorName, setCreatorName] = useState("");

  const initializeData = async () => {
    try {
      setLoading(true);
      // Load all creator schedules
      const allSchedules = await fetchAllCreatorSchedules();
      setAllCreatorSchedules(allSchedules);
      
      if (creatorId) {
        console.log("Modal opened for creator:", creatorId);
        // Get creator profile
        const userAccount = await fetchProfileByUsername(creatorId);
        
        if (userAccount) {
          setProfileId(userAccount.id);
          setCreatorName(userAccount.username);
          
          // Get creator's schedule
          const scheduleData = await fetchScheduleByCreatorId(userAccount.id);
          
          // Initialize schedule object
          const schedule = initializeSchedule(userAccount.id, userAccount.username, scheduleData);
          setSchedules([schedule]);
        }
      }
    } catch (error) {
      console.error("Error initializing data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle saving schedules
  const handleSave = async () => {
    if (!profileId) return false;

    try {
      setLoading(true);
      const schedule = schedules[0]; // We only keep one schedule
      
      // Save the schedule
      const success = await saveSchedule(schedule, profileId);
      
      if (success) {
        // Refresh all schedules
        const allSchedules = await fetchAllCreatorSchedules();
        setAllCreatorSchedules(allSchedules);
        toast.success("Horaires mis à jour avec succès");
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("Error saving schedule:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Update a schedule field
  const updateSchedule = (
    scheduleId: string,
    field: "hours" | "days" | "is_active",
    value: string | boolean
  ) => {
    updateScheduleField(setSchedules, scheduleId, field, value);
  };

  // Initialize data when modal opens
  useEffect(() => {
    if (isOpen) {
      initializeData();
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
