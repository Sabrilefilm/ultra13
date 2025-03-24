
import { useState } from 'react';
import { toast } from 'sonner';
import { scheduleService } from '@/services/schedule/schedule-service';

// Update the Creator type to include live_schedules
export interface ScheduleCreator {
  id: string;
  username: string;
  role?: string;
  live_schedules?: Array<{ hours: number; days: number }>;
  total_diamonds?: number;
  diamonds_goal?: number;
}

export function useScheduleEditing(onSuccess: () => Promise<void>) {
  const [isEditingSchedule, setIsEditingSchedule] = useState(false);
  const [selectedCreator, setSelectedCreator] = useState<ScheduleCreator | null>(null);
  const [hours, setHours] = useState<number>(0);
  const [days, setDays] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEditSchedule = (creator: ScheduleCreator) => {
    setSelectedCreator(creator);
    // Get current hours and days
    const creatorSchedule = creator.live_schedules?.[0];
    setHours(creatorSchedule?.hours || 0);
    setDays(creatorSchedule?.days || 0);
    setIsEditingSchedule(true);
  };

  const handleSaveSchedule = async () => {
    if (!selectedCreator) return;

    try {
      setIsSubmitting(true);
      
      await scheduleService.updateSchedule(selectedCreator, Number(hours), Number(days));
      
      toast.success(`Horaire mis à jour pour ${selectedCreator.username}`);
      setIsEditingSchedule(false);
      
      // Refresh data
      await onSuccess();
    } catch (error) {
      console.error("Erreur lors de la mise à jour des horaires:", error);
      toast.error("Une erreur est survenue lors de la mise à jour des horaires");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isEditingSchedule,
    setIsEditingSchedule,
    selectedCreator,
    setSelectedCreator,
    hours,
    setHours,
    days,
    setDays,
    isSubmitting,
    handleEditSchedule,
    handleSaveSchedule
  };
}
