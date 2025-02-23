
export interface LiveScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  creatorId: string;
}

export interface Schedule {
  id: string;
  hours?: number;
  days?: number;
  is_active: boolean;
  creator_name?: string;
}
