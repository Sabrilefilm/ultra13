
import { useState } from "react";
import { toast } from "sonner";
import { creatorStatsService } from "@/services/creator-stats-service";
import { Creator } from "./types";

export const useScheduleEditing = (creators: Creator[], setCreators: (creators: Creator[]) => void) => {
  const [selectedCreator, setSelectedCreator] = useState<Creator | null>(null);
  const [isEditingSchedule, setIsEditingSchedule] = useState(false);
  const [hours, setHours] = useState(0);
  const [days, setDays] = useState(0);

  const handleEditSchedule = (creator: Creator) => {
    setSelectedCreator(creator);
    setHours(creator.live_schedules?.[0]?.hours || 0);
    setDays(creator.live_schedules?.[0]?.days || 0);
    setIsEditingSchedule(true);
  };

  const handleSaveSchedule = async () => {
    if (!selectedCreator) return;
    
    try {
      await creatorStatsService.updateSchedule(selectedCreator, hours, days);
      
      toast.success("Horaires mis à jour avec succès");
      
      setCreators(creators.map(c => {
        if (c.id === selectedCreator.id) {
          return {
            ...c,
            live_schedules: [{ hours, days }]
          };
        }
        return c;
      }));
      
      setIsEditingSchedule(false);
    } catch (error) {
      toast.error("Erreur lors de la mise à jour des horaires");
    }
  };

  return {
    selectedCreator,
    setSelectedCreator,
    isEditingSchedule,
    setIsEditingSchedule,
    hours,
    setHours,
    days,
    setDays,
    handleEditSchedule,
    handleSaveSchedule
  };
};
