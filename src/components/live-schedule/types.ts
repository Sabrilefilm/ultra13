
export interface LiveScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  creatorId: string;
}

export interface Schedule {
  id: string;
  day_of_week: string;
  start_time: string;
  end_time: string;
  is_active: boolean;
  creator_name?: string;
}

export interface ScheduleDayProps {
  day: { id: string; label: string };
  schedule: Schedule;
  onUpdate: (
    dayId: string,
    field: "start_time" | "end_time" | "is_active",
    value: string | boolean
  ) => void;
  totalDays: number;
  totalHours: number;
  creatorName: string;
}
