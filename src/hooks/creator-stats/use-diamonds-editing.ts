
import { useState } from "react";
import { toast } from "sonner";
import { creatorStatsService } from "@/services/creator-stats-service";
import { Creator } from "./types";
import { supabase } from "@/lib/supabase";

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
      
      const currentDiamonds = selectedCreator.profiles?.[0]?.total_diamonds || 0;
      let finalAmount = diamondAmount;
      
      if (operationType === 'add') {
        finalAmount = currentDiamonds + diamondAmount;
      } else if (operationType === 'subtract') {
        finalAmount = Math.max(0, currentDiamonds - diamondAmount);
      }
      
      // Use the manage_diamonds RPC function through the service
      const { data, error } = await supabase.rpc('manage_diamonds', {
        target_user_id: selectedCreator.id,
        diamonds_value: diamondAmount,
        operation: operationType
      });
      
      if (error) {
        console.error("Error updating diamonds:", error);
        toast.error("Une erreur est survenue lors de la mise à jour des diamants");
        return;
      }
      
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
