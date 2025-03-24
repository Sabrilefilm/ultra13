
import { useState } from "react";
import { toast } from "sonner";
import { creatorStatsService } from "@/services/creator-stats-service";
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

  const handleEditDiamonds = (creator: Creator) => {
    setSelectedCreator(creator);
    setDiamondAmount(creator.profiles?.[0]?.total_diamonds || 0);
    setOperationType('set');
    setIsEditingDiamonds(true);
  };

  const handleSaveDiamonds = async () => {
    if (!selectedCreator) return;
    
    try {
      let newDiamondValue = 0;
      const currentDiamonds = selectedCreator.profiles?.[0]?.total_diamonds || 0;
      
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
      
      await creatorStatsService.updateDiamonds(selectedCreator, newDiamondValue);
      
      // Mise à jour de l'état local pour refléter le changement
      setCreators(creators.map(c => {
        if (c.id === selectedCreator.id) {
          return {
            ...c,
            profiles: [{ total_diamonds: newDiamondValue }]
          };
        }
        return c;
      }));
      
      const actionText = operationType === 'set' ? 'définis à' : operationType === 'add' ? 'augmentés de' : 'réduits de';
      toast.success(`Diamants ${actionText} ${diamondAmount} pour ${selectedCreator.username}`);
      setIsEditingDiamonds(false);
      
      // Actualisation des données pour s'assurer que tout est à jour
      await fetchCreators();
      
    } catch (error) {
      console.error("Erreur lors de la mise à jour des diamants:", error);
      toast.error("Erreur lors de la mise à jour des diamants. Veuillez réessayer.");
    }
  };

  return {
    isEditingDiamonds,
    setIsEditingDiamonds,
    diamondAmount,
    setDiamondAmount,
    operationType,
    setOperationType,
    handleEditDiamonds,
    handleSaveDiamonds
  };
};
