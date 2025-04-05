
import { useState } from 'react';
import { Creator } from '../diamonds/use-diamond-fetch';
import { diamondsService } from '@/services/diamonds/diamonds-service';
import { toast } from 'sonner';

export interface EditDiamondsState {
  isOpen: boolean;
  diamondAmount: number;
  operationType: 'set' | 'add' | 'subtract';
  isSaving: boolean;
  selectedCreator: Creator | null;
}

export function useDiamondsEditing(onSuccess: () => Promise<void>) {
  const [state, setState] = useState<EditDiamondsState>({
    isOpen: false,
    diamondAmount: 0,
    operationType: 'add',
    isSaving: false,
    selectedCreator: null
  });

  // Additional flags for external state mapping
  const isEditingDiamonds = state.isOpen;
  const diamondAmount = state.diamondAmount;
  const operationType = state.operationType;
  const isSaving = state.isSaving;

  const openDiamondsModal = (creator: Creator) => {
    setState(prev => ({
      ...prev,
      isOpen: true,
      selectedCreator: {
        id: creator.id,
        username: creator.username,
        role: creator.role,
        total_diamonds: creator.total_diamonds,
        diamonds_goal: creator.diamonds_goal
      },
      diamondAmount: 0
    }));
  };

  const closeDiamondsModal = () => {
    setState(prev => ({ ...prev, isOpen: false, selectedCreator: null }));
  };

  const setDiamondAmount = (amount: number) => {
    setState(prev => ({ ...prev, diamondAmount: amount }));
  };

  const setOperationType = (type: 'set' | 'add' | 'subtract') => {
    setState(prev => ({ ...prev, operationType: type }));
  };

  const setIsEditingDiamonds = (value: boolean) => {
    setState(prev => ({ ...prev, isOpen: value }));
  };

  const handleEditDiamonds = (creator: Creator) => {
    openDiamondsModal(creator);
  };

  const handleSaveDiamonds = async () => {
    if (!state.selectedCreator || state.diamondAmount < 0) {
      toast.error("Valeur de diamants invalide");
      return;
    }

    try {
      setState(prev => ({ ...prev, isSaving: true }));
      
      // Update to match new function signature with the correct parameters
      await diamondsService.updateDiamonds(
        state.selectedCreator, 
        state.diamondAmount, 
        state.operationType
      );
      
      // Message de confirmation en fonction de l'opération
      const actionText = state.operationType === 'set' 
        ? 'définis à' 
        : state.operationType === 'add' 
          ? 'augmentés de' 
          : 'réduits de';
          
      toast.success(`Diamants ${actionText} ${state.diamondAmount} pour ${state.selectedCreator.username}`);
      
      await onSuccess();
      closeDiamondsModal();
    } catch (error) {
      console.error("Erreur lors de la mise à jour des diamants:", error);
      toast.error("Une erreur est survenue lors de la mise à jour des diamants");
    } finally {
      setState(prev => ({ ...prev, isSaving: false }));
    }
  };

  return {
    state,
    isEditingDiamonds,
    setIsEditingDiamonds,
    diamondAmount,
    setDiamondAmount,
    operationType,
    setOperationType,
    isSaving,
    handleEditDiamonds,
    handleSaveDiamonds,
    openDiamondsModal,
    closeDiamondsModal,
    handleSave: handleSaveDiamonds
  };
}
