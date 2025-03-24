
import { useState } from 'react';
import { Creator } from './use-diamond-fetch';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export function useDiamondDialogs(fetchUsers: () => Promise<void>) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDiamondModalOpen, setIsDiamondModalOpen] = useState(false);
  const [selectedCreator, setSelectedCreator] = useState<Creator | null>(null);
  const [newDiamondGoal, setNewDiamondGoal] = useState<number>(0);
  const [diamondAmount, setDiamondAmount] = useState<number>(0);
  const [operationType, setOperationType] = useState<'add' | 'subtract'>('add');
  const [isEditing, setIsEditing] = useState(false);

  const openEditDialog = (user: Creator) => {
    setSelectedCreator(user);
    setNewDiamondGoal(user.diamonds_goal);
    setIsDialogOpen(true);
  };
  
  const openDiamondModal = (user: Creator, type: 'add' | 'subtract') => {
    setSelectedCreator(user);
    setDiamondAmount(0);
    setOperationType(type);
    setIsDiamondModalOpen(true);
  };
  
  const handleUpdateDiamondGoal = async () => {
    if (!selectedCreator) return;
    
    try {
      setIsEditing(true);
      
      const { error } = await supabase
        .from('profiles')
        .update({ diamonds_goal: newDiamondGoal })
        .eq('id', selectedCreator.id);
        
      if (error) throw error;
      
      toast.success(`Objectif diamants mis à jour pour ${selectedCreator.username}`);
      await fetchUsers();
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      toast.error('Erreur lors de la mise à jour de l\'objectif');
    } finally {
      setIsEditing(false);
    }
  };
  
  const handleUpdateDiamonds = async () => {
    if (!selectedCreator || diamondAmount <= 0) return;
    
    try {
      setIsEditing(true);
      
      console.log("Calling manage_diamonds RPC with:", {
        target_user_id: selectedCreator.id,
        diamonds_value: diamondAmount,
        operation: operationType
      });
      
      // Use the RPC function to update diamonds
      const { data, error } = await supabase.rpc('manage_diamonds', {
        target_user_id: selectedCreator.id,
        diamonds_value: diamondAmount,
        operation: operationType
      });
      
      if (error) throw error;
      
      const actionText = operationType === 'add' ? 'ajoutés à' : 'retirés de';
      toast.success(`${diamondAmount} diamants ${actionText} ${selectedCreator.username}`);
      await fetchUsers();
      setIsDiamondModalOpen(false);
    } catch (error) {
      console.error('Erreur lors de la mise à jour des diamants:', error);
      toast.error('Erreur lors de la mise à jour des diamants');
    } finally {
      setIsEditing(false);
    }
  };
  
  const handleUpdateAgencyGoal = async (agencyGoal: number) => {
    try {
      setIsEditing(true);
      
      const { error } = await supabase
        .from('profiles')
        .update({ diamonds_goal: agencyGoal })
        .eq('role', 'agency');
        
      if (error) {
        // Si le profil n'existe pas, le créer
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({ role: 'agency', diamonds_goal: agencyGoal });
          
        if (insertError) throw insertError;
      }
      
      toast.success('Objectif diamants de l\'agence mis à jour');
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      toast.error('Erreur lors de la mise à jour de l\'objectif de l\'agence');
    } finally {
      setIsEditing(false);
    }
  };

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
