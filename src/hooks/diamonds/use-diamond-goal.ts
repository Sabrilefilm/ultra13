
import { useState } from 'react';
import { Creator } from './use-diamond-fetch';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export function useDiamondGoal(fetchUsers: () => Promise<void>) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCreator, setSelectedCreator] = useState<Creator | null>(null);
  const [newDiamondGoal, setNewDiamondGoal] = useState<number>(0);
  const [isEditing, setIsEditing] = useState(false);

  const openEditDialog = (user: Creator) => {
    setSelectedCreator(user);
    setNewDiamondGoal(user.diamonds_goal || 0);
    setIsDialogOpen(true);
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
            total_diamonds: selectedCreator.total_diamonds,
            diamonds_goal: newDiamondGoal,
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
            diamonds_goal: newDiamondGoal,
            created_at: new Date(),
            updated_at: new Date()
          }]);
          
        if (error) {
          console.error("Error creating profile:", error);
          throw error;
        }
      }
      
      toast.success(`Objectif de diamants mis à jour pour ${selectedCreator.username}`);
      await fetchUsers();
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      toast.error('Erreur lors de la mise à jour des paramètres');
    } finally {
      setIsEditing(false);
    }
  };

  return {
    isDialogOpen,
    setIsDialogOpen,
    selectedCreator,
    setSelectedCreator,
    newDiamondGoal,
    setNewDiamondGoal,
    isEditing,
    openEditDialog,
    handleUpdateDiamondGoal
  };
}
