
import { useDiamondGoal } from './use-diamond-goal';
import { useAgencyGoal } from './use-agency-goal';
import { Creator } from './use-diamond-fetch';
import { useState } from 'react';

export function useDiamondDialogs() {
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
  } = useDiamondGoal();

  const [isDiamondModalOpen, setIsDiamondModalOpen] = useState(false);
  const [diamondCreator, setDiamondCreator] = useState<Creator | null>(null);
  const [diamondAmount, setDiamondAmount] = useState(0);
  const [operationType, setOperationType] = useState<'add' | 'subtract'>('add');
  const [isDiamondEditing, setIsDiamondEditing] = useState(false);

  const openDiamondModal = (user: Creator, type: 'add' | 'subtract') => {
    setDiamondCreator(user);
    setOperationType(type);
    setIsDiamondModalOpen(true);
  };

  const handleUpdateDiamonds = async () => {
    // Implementation would go here
    console.log("Updating diamonds");
  };

  const {
    isEditing: isAgencyEditing,
    handleUpdateAgencyGoal
  } = useAgencyGoal();

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
