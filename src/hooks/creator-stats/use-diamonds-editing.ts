
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { Creator } from "./types";

export const useDiamondsEditing = (
  creators: Creator[], 
  setCreators: (creators: Creator[]) => void,
  selectedCreator: Creator | null,
  setSelectedCreator: (creator: Creator | null) => void,
  fetchCreators: () => Promise<void>
) => {
  const [isEditingDiamonds, setIsEditingDiamonds] = useState(false);
  const [diamondAmount, setDiamondAmount] = useState(0);
  const [operationType, setOperationType] = useState<'set' | 'add' | 'subtract'>('set');
  const [isSaving, setIsSaving] = useState(false);

  const handleEditDiamonds = (creator: Creator) => {
    setSelectedCreator(creator);
    setDiamondAmount(creator.profiles?.[0]?.total_diamonds || 0);
    setOperationType('set');
    setIsEditingDiamonds(true);
  };

  const handleSaveDiamonds = async () => {
    if (!selectedCreator) return;
    
    try {
      setIsSaving(true);
      
      // Use the manage_diamonds RPC function
      const { data, error } = await supabase.rpc('manage_diamonds', {
        target_user_id: selectedCreator.id,
        diamonds_value: diamondAmount,
        operation: operationType
      });
      
      if (error) {
        console.error("Error updating diamonds:", error);
        toast.error("Erreur lors de la mise à jour des diamants. Veuillez réessayer.");
        return;
      }
      
      // Mise à jour de l'état local pour refléter le changement immédiatement
      const currentDiamonds = selectedCreator.profiles?.[0]?.total_diamonds || 0;
      let newDiamondValue = 0;
      
      // Calculate new value for UI update
      switch (operationType) {
        case 'set':
          newDiamondValue = diamondAmount;
          break;
        case 'add':
          newDiamondValue = currentDiamonds + diamondAmount;
          break;
        case 'subtract':
          newDiamondValue = Math.max(0, currentDiamonds - diamondAmount);
          break;
      }
      
      setCreators(creators.map(c => {
        if (c.id === selectedCreator.id) {
          return {
            ...c,
            profiles: [{ 
              ...c.profiles?.[0],
              total_diamonds: newDiamondValue 
            }]
          };
        }
        return c;
      }));
      
      const actionText = operationType === 'set' ? 'définis à' : operationType === 'add' ? 'augmentés de' : 'réduits de';
      toast.success(`Diamants ${actionText} ${diamondAmount} pour ${selectedCreator.username}`);
      setIsEditingDiamonds(false);
      
      // Refresh data to ensure everything is up to date
      await fetchCreators();
      
    } catch (error) {
      console.error("Erreur lors de la mise à jour des diamants:", error);
      toast.error("Erreur lors de la mise à jour des diamants. Veuillez réessayer.");
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
