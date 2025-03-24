
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export function useAgencyGoal(fetchUsers: () => Promise<void>) {
  const [isEditing, setIsEditing] = useState(false);

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
            diamonds_goal: agencyGoal,
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
            username: 'Agency',
            total_diamonds: 0,
            diamonds_goal: agencyGoal,
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
    isEditing,
    handleUpdateAgencyGoal
  };
}
