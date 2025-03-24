
import { useCreatorsData } from "./use-creators-data";
import { useStatistics } from "./use-statistics";
import { useScheduleEditing } from "./use-schedule-editing";
import { useDiamondsEditing } from "./use-diamonds-editing";
import { useCreatorRemoval } from "./use-creator-removal";
import { usePlatformData } from "./use-platform-data";
import { UseCreatorStatsReturn } from "./types";

export const useCreatorStats = (role: string | null, username: string | null): UseCreatorStatsReturn => {
  const { creators, setCreators, loading, fetchCreators } = useCreatorsData(role, username);
  const { getTotalHours, getTotalDays, getTotalDiamonds, getCreatorsWithRewards } = useStatistics(creators);
  const { 
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
  } = useScheduleEditing(creators, setCreators);
  
  const {
    isEditingDiamonds,
    setIsEditingDiamonds,
    diamondAmount,
    setDiamondAmount,
    operationType,
    setOperationType,
    handleEditDiamonds,
    handleSaveDiamonds
  } = useDiamondsEditing(creators, setCreators, selectedCreator, setSelectedCreator, fetchCreators);
  
  const {
    removeDialogOpen,
    setRemoveDialogOpen,
    handleRemoveCreator,
    confirmRemoveCreator
  } = useCreatorRemoval(creators, setCreators, selectedCreator, setSelectedCreator);
  
  const { platformSettings, rewardThreshold } = usePlatformData(role);

  return {
    creators,
    loading,
    selectedCreator,
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
    removeDialogOpen,
    setRemoveDialogOpen,
    rewardThreshold,
    platformSettings,
    getTotalHours,
    getTotalDays,
    getTotalDiamonds,
    getCreatorsWithRewards: () => getCreatorsWithRewards(rewardThreshold),
    handleEditSchedule,
    handleSaveSchedule,
    handleEditDiamonds,
    handleSaveDiamonds,
    handleRemoveCreator,
    confirmRemoveCreator
  };
};
