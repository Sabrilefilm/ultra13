
import { useState, useEffect } from "react";
import { useCreatorsData } from "./use-creators-data";
import { usePlatformData } from "./use-platform-data";
import { useScheduleEditing } from "./use-schedule-editing";
import { useDiamondsEditing } from "./use-diamonds-editing";
import { useCreatorRemoval } from "./use-creator-removal";
import { useStatistics } from "./use-statistics";
import { Creator } from "./types";

export const useCreatorStats = (role: string | null, username: string | null) => {
  const { creators, setCreators, loading, fetchCreators } = useCreatorsData(role, username);
  const { platformSettings, rewardThreshold } = usePlatformData();
  
  const [selectedCreator, setSelectedCreator] = useState<Creator | null>(null);
  
  const { 
    isEditingSchedule, 
    setIsEditingSchedule, 
    hours, 
    setHours, 
    days, 
    setDays, 
    handleEditSchedule, 
    handleSaveSchedule 
  } = useScheduleEditing(creators, setCreators, selectedCreator, setSelectedCreator, fetchCreators);
  
  const { 
    isEditingDiamonds, 
    setIsEditingDiamonds, 
    diamondAmount, 
    setDiamondAmount, 
    operationType, 
    setOperationType,
    isSaving,
    handleEditDiamonds, 
    handleSaveDiamonds 
  } = useDiamondsEditing(creators, setCreators, selectedCreator, setSelectedCreator, fetchCreators);
  
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
    selectedCreator,
    setSelectedCreator,
    isEditingSchedule,
    setIsEditingSchedule,
    hours,
    setHours,
    days,
    setDays,
    isEditingDiamonds,
    setIsEditingDiamonds,
    diamondAmount,
    setDiamondAmount,
    operationType,
    setOperationType,
    isSaving,
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
    handleEditDiamonds,
    handleSaveDiamonds,
    handleRemoveCreator,
    confirmRemoveCreator
  };
};
