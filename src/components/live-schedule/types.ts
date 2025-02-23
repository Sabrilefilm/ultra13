
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
}
