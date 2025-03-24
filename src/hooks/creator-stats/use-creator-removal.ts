
import { useState } from "react";
import { toast } from "sonner";
import { creatorStatsService } from "@/services/creator-stats-service";
import { Creator } from "./types";

export const useCreatorRemoval = (
  creators: Creator[], 
  setCreators: (creators: Creator[]) => void,
  selectedCreator: Creator | null,
  setSelectedCreator: (creator: Creator | null) => void
) => {
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);

  const handleRemoveCreator = (creator: Creator) => {
    setSelectedCreator(creator);
    setRemoveDialogOpen(true);
  };

  const confirmRemoveCreator = async () => {
    if (!selectedCreator) return;
    
    try {
      await creatorStatsService.removeCreator(selectedCreator.id);
      
      toast.success("Créateur retiré avec succès");
      
      setCreators(creators.filter(c => c.id !== selectedCreator.id));
      setRemoveDialogOpen(false);
    } catch (error) {
      toast.error("Erreur lors du retrait du créateur");
    }
  };

  return {
    removeDialogOpen,
    setRemoveDialogOpen,
    handleRemoveCreator,
    confirmRemoveCreator
  };
};
