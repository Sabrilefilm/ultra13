
import { useState } from "react";
import { toast } from "sonner";
import { diamondsService } from "@/services/diamonds/diamonds-service";
import { Creator } from "./types";

export const useDiamondsEditing = (
  creators: Creator[], 
  setCreators: (creators: Creator[]) => void,
  selectedCreator: Creator | null,
  setSelectedCreator: (creator: Creator | null) => void,
  fetchCreators: () => Promise<void>
) => {
  const [isEditingDiamonds, setIsEditingDiamonds] = useState(false);
  const [diamondAmount, setDiamondAmount] = useState<number>(0);
  const [operationType, setOperationType] = useState<'set' | 'add' | 'subtract'>('add');
  const [isSaving, setIsSaving] = useState(false);

  const handleEditDiamonds = (creator: Creator) => {
    setSelectedCreator(creator);
    setDiamondAmount(0); // Reset to 0 when opening the dialog
    setOperationType('add');
    setIsEditingDiamonds(true);
  };

  const handleSaveDiamonds = async () => {
    if (!selectedCreator) return;
    
    try {
      setIsSaving(true);
      
      // Use the diamondsService to update the diamonds
      await diamondsService.updateDiamonds(
        selectedCreator, 
        diamondAmount,
        operationType
      );
      
      // Determine the action text based on operation type
      const actionText = operationType === 'set' ? 'définis à' : 
                         operationType === 'add' ? 'augmentés de' : 
                         'réduits de';
      
      toast.success(`Diamants ${actionText} ${diamondAmount} pour ${selectedCreator.username}`);
      
      // Refresh the data
      await fetchCreators();
      
      setIsEditingDiamonds(false);
    } catch (error) {
      console.error("Error updating diamonds:", error);
      toast.error("Une erreur est survenue lors de la mise à jour des diamants");
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
    handleEditDiamonds,
    handleSaveDiamonds
  };
};
