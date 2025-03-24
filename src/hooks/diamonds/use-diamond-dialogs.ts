
import { useDiamondGoal } from './use-diamond-goal';
import { useDiamondManagement } from './use-diamond-management';
import { useAgencyGoal } from './use-agency-goal';
import { Creator } from './use-diamond-fetch';

export function useDiamondDialogs(fetchUsers: () => Promise<void>) {
  const {
    isDialogOpen,
    setIsDialogOpen,
    selectedCreator: goalCreator,
    setSelectedCreator: setGoalCreator,
    newDiamondGoal,
    setNewDiamondGoal,
    isEditing: isGoalEditing,
    openEditDialog,
    handleUpdateDiamondGoal
  } = useDiamondGoal(fetchUsers);

  const {
    isDiamondModalOpen,
    setIsDiamondModalOpen,
    selectedCreator: diamondCreator,
    setSelectedCreator: setDiamondCreator,
    diamondAmount,
    setDiamondAmount,
    operationType,
    setOperationType,
    isEditing: isDiamondEditing,
    openDiamondModal,
    handleUpdateDiamonds
  } = useDiamondManagement(fetchUsers);

  const {
    isEditing: isAgencyEditing,
    handleUpdateAgencyGoal
  } = useAgencyGoal(fetchUsers);

  // Ensure we maintain a single source of truth for selectedCreator
  const selectedCreator = goalCreator || diamondCreator;
  const setSelectedCreator = (creator: Creator | null) => {
    setGoalCreator(creator);
    setDiamondCreator(creator);
  };

  // Determine overall editing state
  const isEditing = isGoalEditing || isDiamondEditing || isAgencyEditing;

  return {
    isDialogOpen,
    setIsDialogOpen,
    isDiamondModalOpen,
    setIsDiamondModalOpen,
    selectedCreator,
    setSelectedCreator,
    newDiamondGoal,
    setNewDiamondGoal,
    diamondAmount,
    setDiamondAmount,
    operationType, 
    setOperationType,
    isEditing,
    openEditDialog,
    openDiamondModal,
    handleUpdateDiamondGoal,
    handleUpdateDiamonds,
    handleUpdateAgencyGoal
  };
}
