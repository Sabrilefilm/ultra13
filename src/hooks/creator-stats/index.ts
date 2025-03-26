
import { useState, useEffect } from "react";
import { useCreatorsData } from "./use-creators-data";
import { usePlatformData } from "./use-platform-data";
import { useScheduleEditing, ScheduleCreator } from "./use-schedule-editing";
import { useCreatorRemoval } from "./use-creator-removal";
import { useStatistics } from "./use-statistics";
import { Creator } from "@/hooks/diamonds/use-diamond-fetch";
import { useState as useStateEffect } from "react";
import { useDiamondsEditing as importedDiamondsEditing } from "./use-diamonds-editing";

// Diamond editing state interface
export interface DiamondEditingState {
  isEditingDiamonds: boolean;
  setIsEditingDiamonds: (value: boolean) => void;
  diamondAmount: number;
  setDiamondAmount: (value: number) => void;
  operationType: 'set' | 'add' | 'subtract';
  setOperationType: (value: 'set' | 'add' | 'subtract') => void;
  isSaving: boolean;
  selectedCreator: ScheduleCreator | null;
  setSelectedCreator: (creator: ScheduleCreator | null) => void;
  handleEditDiamonds: (creator: ScheduleCreator) => void;
  handleSaveDiamonds: () => Promise<void>;
}

// Diamond editing hook
export function useDiamondsEditing(onSuccess: () => Promise<void>): DiamondEditingState {
  const [isEditingDiamonds, setIsEditingDiamonds] = useState(false);
  const [selectedCreator, setSelectedCreator] = useState<ScheduleCreator | null>(null);
  const [diamondAmount, setDiamondAmount] = useState(0);
  const [operationType, setOperationType] = useState<'set' | 'add' | 'subtract'>('add');
  const [isSaving, setIsSaving] = useState(false);

  const handleEditDiamonds = (creator: ScheduleCreator) => {
    setSelectedCreator(creator);
    setDiamondAmount(0);
    setOperationType('add');
    setIsEditingDiamonds(true);
  };

  const handleSaveDiamonds = async () => {
    if (!selectedCreator) return;
    
    try {
      setIsSaving(true);
      
      // Implementation would go here
      console.log(`Updating diamonds for ${selectedCreator.username}, amount: ${diamondAmount}, operation: ${operationType}`);
      
      // Refresh data
      await onSuccess();
      setIsEditingDiamonds(false);
    } catch (error) {
      console.error("Error updating diamonds:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return {
    isEditingDiamonds,
    setIsEditingDiamonds,
    diamondAmount,
    setDiamondAmount,
    operationType,
    setOperationType,
    isSaving,
    selectedCreator,
    setSelectedCreator,
    handleEditDiamonds,
    handleSaveDiamonds
  };
}

export const useCreatorStats = (role: string | null, username: string | null) => {
  const { creators, setCreators, loading, fetchCreators } = useCreatorsData(role, username);
  const { platformSettings, rewardThreshold } = usePlatformData();
  
  const [selectedCreator, setSelectedCreator] = useState<ScheduleCreator | null>(null);
  
  const { 
    isEditingSchedule, 
    setIsEditingSchedule, 
    hours, 
    setHours, 
    days, 
    setDays, 
    handleEditSchedule, 
    handleSaveSchedule 
  } = useScheduleEditing(fetchCreators);
  
  // Using the locally defined hook, not the imported one
  const diamondEditingState = useDiamondsEditing(fetchCreators);
  
  // Fix: Adding all required arguments to the useCreatorRemoval hook
  const { 
    removeDialogOpen, 
    setRemoveDialogOpen, 
    handleRemoveCreator, 
    confirmRemoveCreator 
  } = useCreatorRemoval(creators, setCreators, selectedCreator, setSelectedCreator, fetchCreators);
  
  const { 
    getTotalHours, 
    getTotalDays, 
    getTotalDiamonds, 
    getCreatorsWithRewards 
  } = useStatistics(creators, rewardThreshold);
  
  return {
    creators,
    loading,
    fetchCreators,
    selectedCreator,
    setSelectedCreator,
    isEditingSchedule,
    setIsEditingSchedule,
    hours,
    setHours,
    days,
    setDays,
    isEditingDiamonds: diamondEditingState.isEditingDiamonds,
    setIsEditingDiamonds: diamondEditingState.setIsEditingDiamonds,
    diamondAmount: diamondEditingState.diamondAmount,
    setDiamondAmount: diamondEditingState.setDiamondAmount,
    operationType: diamondEditingState.operationType,
    setOperationType: diamondEditingState.setOperationType,
    isSaving: diamondEditingState.isSaving,
    removeDialogOpen,
    setRemoveDialogOpen,
    rewardThreshold,
    platformSettings,
    getTotalHours,
    getTotalDays,
    getTotalDiamonds,
    getCreatorsWithRewards,
    handleEditSchedule,
    handleSaveSchedule,
    handleEditDiamonds: diamondEditingState.handleEditDiamonds,
    handleSaveDiamonds: diamondEditingState.handleSaveDiamonds,
    handleRemoveCreator,
    confirmRemoveCreator
  };
};
