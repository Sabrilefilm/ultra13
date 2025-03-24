
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
    setNewDiamondGoal(user.diamonds_goal || 0);
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
      
      // Vérifier d'abord si le profil existe
      const { data: profileExists, error: checkError } = await supabase
        .from('profiles')
        .select('id, username')
        .eq('id', selectedCreator.id)
        .maybeSingle();
        
      if (checkError) {
        console.error("Error checking profile:", checkError);
        if (checkError.code !== 'PGRST204') {
          throw checkError;
        }
      }
      
      if (profileExists) {
        // Si le profil existe, mise à jour
        const { error } = await supabase
          .from('profiles')
          .update({ 
            total_diamonds: selectedCreator.profiles?.[0]?.total_diamonds || 0, // Preserve current total_diamonds
            updated_at: new Date()
          })
          .eq('id', selectedCreator.id);
          
        if (error) {
          console.error("Error updating profile:", error);
          throw error;
        }
      } else {
        // Si le profil n'existe pas, création
        const { error } = await supabase
          .from('profiles')
          .insert([{ 
            id: selectedCreator.id,
            username: selectedCreator.username,
            role: selectedCreator.role,
            total_diamonds: 0,
            created_at: new Date(),
            updated_at: new Date()
          }]);
          
        if (error) {
          console.error("Error creating profile:", error);
          throw error;
        }
      }
      
      toast.success(`Paramètres mis à jour pour ${selectedCreator.username}`);
      await fetchUsers();
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      toast.error('Erreur lors de la mise à jour des paramètres');
    } finally {
      setIsEditing(false);
    }
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
      
      // Forcer la mise à jour immédiate de l'état local pour l'utilisateur sélectionné
      if (selectedCreator && selectedCreator.profiles && selectedCreator.profiles.length > 0) {
        selectedCreator.profiles[0].total_diamonds = newDiamondValue;
      } else if (selectedCreator) {
        selectedCreator.profiles = [{ total_diamonds: newDiamondValue }];
      }
      
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
      
      const { data: agencyProfile, error: checkError } = await supabase
        .from('profiles')
        .select('id')
        .eq('role', 'agency')
        .maybeSingle();
        
      if (checkError && checkError.code !== 'PGRST204') {
        console.error("Error checking agency profile:", checkError);
        throw checkError;
      }
      
      if (agencyProfile) {
        // Si le profil d'agence existe, mise à jour
        const { error } = await supabase
          .from('profiles')
          .update({ 
            updated_at: new Date()
          })
          .eq('id', agencyProfile.id);
          
        if (error) {
          console.error("Error updating agency profile:", error);
          throw error;
        }
      } else {
        // Si le profil n'existe pas, le créer
        const { error } = await supabase
          .from('profiles')
          .insert({ 
            id: crypto.randomUUID(),
            role: 'agency', 
            username: 'Agency', // Ajout du username obligatoire
            total_diamonds: 0,
            created_at: new Date(),
            updated_at: new Date()
          });
          
        if (error) {
          console.error("Error creating agency profile:", error);
          throw error;
        }
      }
      
      toast.success('Paramètres de l\'agence mis à jour');
      await fetchUsers();
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      toast.error('Erreur lors de la mise à jour des paramètres de l\'agence');
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
