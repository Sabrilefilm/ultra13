
import { useState } from 'react';
import { Creator, useDiamondFetch } from './use-diamond-fetch';
import { useDiamondGoal } from './use-diamond-goal';
import { useAgencyGoal } from './use-agency-goal';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export function useDiamondManagement() {
  // Use the base diamond fetching hook
  const {
    loading,
    creators,
    managers,
    agents,
    diamondValue,
    agencyGoal,
    setAgencyGoal,
    userId,
    role,
    username,
    totalAgencyDiamonds,
    agencyProgressPercentage,
    fetchAllUsers
  } = useDiamondFetch();

  // Local state for this hook
  const [activeTab, setActiveTab] = useState<string>('creators');
  const [isDiamondModalOpen, setIsDiamondModalOpen] = useState(false);
  const [selectedCreator, setSelectedCreator] = useState<Creator | null>(null);
  const [diamondAmount, setDiamondAmount] = useState<number>(0);
  const [operationType, setOperationType] = useState<'add' | 'subtract'>('add');
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCreators, setFilteredCreators] = useState<Creator[]>(creators);

  // Use the goal management hooks
  const diamondGoalHook = useDiamondGoal();
  const agencyGoalHook = useAgencyGoal();

  // Update filtered creators when creators list or search query changes
  useState(() => {
    if (searchQuery.trim() === '') {
      setFilteredCreators(creators);
    } else {
      const filtered = creators.filter(creator => 
        creator.username.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCreators(filtered);
    }
  });

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    if (value.trim() === '') {
      setFilteredCreators(creators);
    } else {
      const filtered = creators.filter(creator => 
        creator.username.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredCreators(filtered);
    }
  };

  const openDiamondModal = (user: Creator, type: 'add' | 'subtract') => {
    setSelectedCreator(user);
    setDiamondAmount(0);
    setOperationType(type);
    setIsDiamondModalOpen(true);
  };

  const openEditDialog = (user: Creator) => {
    diamondGoalHook.openEditDialog(user);
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
      
      await fetchAllUsers();
      setIsDiamondModalOpen(false);
    } catch (error) {
      console.error('Erreur lors de la mise à jour des diamants:', error);
      toast.error('Erreur lors de la mise à jour des diamants');
    } finally {
      setIsEditing(false);
    }
  };

  const getActiveUsers = () => {
    switch (activeTab) {
      case 'creators':
        return filteredCreators;
      case 'managers':
        return managers;
      case 'agents':
        return agents;
      default:
        return filteredCreators;
    }
  };

  return {
    // Basic user data
    loading,
    role,
    username,
    userId,
    
    // Search functionality
    searchQuery,
    handleSearch,
    
    // User data
    creators: filteredCreators,
    managers,
    agents,
    
    // Diamond goal dialog
    isDialogOpen: diamondGoalHook.isDialogOpen,
    setIsDialogOpen: diamondGoalHook.setIsDialogOpen,
    selectedCreator,
    setSelectedCreator,
    newDiamondGoal: diamondGoalHook.newDiamondGoal,
    setNewDiamondGoal: diamondGoalHook.setNewDiamondGoal,
    openEditDialog,
    handleUpdateDiamondGoal: diamondGoalHook.handleUpdateDiamondGoal,
    
    // Agency goal management
    agencyGoal,
    setAgencyGoal,
    handleUpdateAgencyGoal: agencyGoalHook.handleUpdateAgencyGoal,
    
    // Diamond management dialog
    isDiamondModalOpen,
    setIsDiamondModalOpen,
    diamondAmount,
    setDiamondAmount,
    operationType,
    setOperationType,
    openDiamondModal,
    handleUpdateDiamonds,
    
    // UI state
    isEditing: diamondGoalHook.isEditing || agencyGoalHook.isEditing || isEditing,
    diamondValue,
    totalAgencyDiamonds,
    agencyProgressPercentage,
    
    // Tab navigation
    activeTab,
    setActiveTab,
    
    // Data operations
    fetchAllUsers,
    getActiveUsers
  };
}
