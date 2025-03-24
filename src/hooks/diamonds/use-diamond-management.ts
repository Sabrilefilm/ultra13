
import { useState } from 'react';
import { Creator } from './use-diamond-fetch';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export function useDiamondManagement(fetchUsers: () => Promise<void>) {
  const [isDiamondModalOpen, setIsDiamondModalOpen] = useState(false);
  const [selectedCreator, setSelectedCreator] = useState<Creator | null>(null);
  const [diamondAmount, setDiamondAmount] = useState<number>(0);
  const [operationType, setOperationType] = useState<'add' | 'subtract'>('add');
  const [isEditing, setIsEditing] = useState(false);

  const openDiamondModal = (user: Creator, type: 'add' | 'subtract') => {
    setSelectedCreator(user);
    setDiamondAmount(0);
    setOperationType(type);
    setIsDiamondModalOpen(true);
  };

  const handleUpdateDiamonds = async () => {
    if (!selectedCreator || diamondAmount <= 0) return;
    
    try {
      setIsEditing(true);
      
      // Vérifier d'abord si le profil existe
      const { data: profileExists, error: checkError } = await supabase
        .from('profiles')
        .select('id, total_diamonds, username')
        .eq('id', selectedCreator.id)
        .maybeSingle();
        
      if (checkError) {
        console.error("Error checking profile:", checkError);
        if (checkError.code !== 'PGRST204') {
          throw checkError;
        }
      }
      
      let newDiamondValue;
      
      if (profileExists) {
        // Si le profil existe, calculer la nouvelle valeur
        const currentDiamonds = profileExists.total_diamonds || 0;
        newDiamondValue = operationType === 'add' 
          ? currentDiamonds + diamondAmount 
          : Math.max(0, currentDiamonds - diamondAmount);
        
        // Mise à jour
        const { error } = await supabase
          .from('profiles')
          .update({ 
            total_diamonds: newDiamondValue,
            updated_at: new Date()
          })
          .eq('id', selectedCreator.id);
          
        if (error) {
          console.error("Error updating profile diamonds:", error);
          throw error;
        }
      } else {
        // Si le profil n'existe pas, création avec la valeur initiale
        newDiamondValue = operationType === 'add' ? diamondAmount : 0;
        
        const { error } = await supabase
          .from('profiles')
          .insert([{ 
            id: selectedCreator.id,
            username: selectedCreator.username,
            role: selectedCreator.role,
            total_diamonds: newDiamondValue,
            created_at: new Date(),
            updated_at: new Date()
          }]);
          
        if (error) {
          console.error("Error creating profile with diamonds:", error);
          throw error;
        }
      }
      
      const actionText = operationType === 'add' ? 'ajoutés à' : 'retirés de';
      toast.success(`${diamondAmount} diamants ${actionText} ${selectedCreator.username}`);
      
      // Update the selectedCreator with new diamond value for immediate UI update
      selectedCreator.total_diamonds = newDiamondValue;
      
      await fetchUsers();
      setIsDiamondModalOpen(false);
    } catch (error) {
      console.error('Erreur lors de la mise à jour des diamants:', error);
      toast.error('Erreur lors de la mise à jour des diamants');
    } finally {
      setIsEditing(false);
    }
  };

  return {
    isDiamondModalOpen,
    setIsDiamondModalOpen,
    selectedCreator,
    setSelectedCreator,
    diamondAmount,
    setDiamondAmount,
    operationType,
    setOperationType,
    isEditing,
    openDiamondModal,
    handleUpdateDiamonds
  };
}
