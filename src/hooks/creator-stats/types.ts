
import { PlatformSettings } from "@/types/settings";

export interface Creator {
  id: string;
  username: string;
  live_schedules?: Array<{ hours: number; days: number }>;
  profiles?: Array<{ total_diamonds: number }>;
  diamonds?: number; // Add this field for backward compatibility
}

export interface UseCreatorStatsReturn {
  creators: Creator[];
  loading: boolean;
  selectedCreator: Creator | null;
  isEditingSchedule: boolean;
  setIsEditingSchedule: (value: boolean) => void;
  hours: number;
  setHours: (value: number) => void;
  days: number;
  setDays: (value: number) => void;
  isEditingDiamonds: boolean;
  setIsEditingDiamonds: (value: boolean) => void;
  diamondAmount: number;
  setDiamondAmount: (value: number) => void;
  operationType: 'set' | 'add' | 'subtract';
  setOperationType: (value: 'set' | 'add' | 'subtract') => void;
  removeDialogOpen: boolean;
  setRemoveDialogOpen: (value: boolean) => void;
  rewardThreshold: number;
  platformSettings: PlatformSettings | null;
  getTotalHours: () => number;
  getTotalDays: () => number;
  getTotalDiamonds: () => number;
  getCreatorsWithRewards: () => number;
  handleEditSchedule: (creator: Creator) => void;
  handleSaveSchedule: () => Promise<void>;
  handleEditDiamonds: (creator: Creator) => void;
  handleSaveDiamonds: () => Promise<void>;
  handleRemoveCreator: (creator: Creator) => void;
  confirmRemoveCreator: () => Promise<void>;
}
