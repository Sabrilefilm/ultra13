
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
      
      // Get current diamonds amount
      const { data, error: fetchError } = await diamondsService.getCurrentDiamonds(state.selectedCreator.id);
      
      if (fetchError) {
        throw fetchError;
      }
      
      const currentAmount = data?.monthly_diamonds || 0;
      let newAmount = state.diamondAmount;
      
      // Calculate the new amount based on operation type
      if (state.operationType === 'add') {
        newAmount = currentAmount + state.diamondAmount;
      } else if (state.operationType === 'subtract') {
        newAmount = Math.max(0, currentAmount - state.diamondAmount);
      }
      
      // Update diamonds with the calculated amount
      const success = await diamondsService.updateDiamonds(
        state.selectedCreator.id, 
        newAmount
      );
      
      if (!success) {
        throw new Error("Failed to update diamonds");
      }
      
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
