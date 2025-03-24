
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface Creator {
  id: string;
  username: string;
  role: string;
  total_diamonds: number;
  diamonds_goal: number;
}

export function useDiamondManagement() {
  const [loading, setLoading] = useState(true);
  const [creators, setCreators] = useState<Creator[]>([]);
  const [filteredCreators, setFilteredCreators] = useState<Creator[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [userId, setUserId] = useState<string>('');
  const [role, setRole] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCreator, setSelectedCreator] = useState<Creator | null>(null);
  const [newDiamondGoal, setNewDiamondGoal] = useState<number>(0);
  const [agencyGoal, setAgencyGoal] = useState<number>(0);
  const [diamondValue, setDiamondValue] = useState<number>(0);
  const [isEditing, setIsEditing] = useState(false);
  const [isDiamondModalOpen, setIsDiamondModalOpen] = useState(false);
  const [diamondAmount, setDiamondAmount] = useState<number>(0);
  const [operationType, setOperationType] = useState<'add' | 'subtract'>('add');
  const [activeTab, setActiveTab] = useState<string>('creators');
  const [managers, setManagers] = useState<Creator[]>([]);
  const [agents, setAgents] = useState<Creator[]>([]);
  
  useEffect(() => {
    const checkAuth = async () => {
      const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
      const storedUsername = localStorage.getItem('username');
      const storedRole = localStorage.getItem('userRole');
      const storedUserId = localStorage.getItem('userId');
      
      if (!isAuthenticated || !storedUsername || !storedRole) {
        toast.error("Session expirée, veuillez vous reconnecter");
        return false;
      }
      
      setUserId(storedUserId || '');
      setUsername(storedUsername);
      setRole(storedRole);
      
      // Fetch platform settings for diamond value
      const { data: settingsData } = await supabase
        .from('platform_settings')
        .select('diamond_value')
        .single();
        
      if (settingsData?.diamond_value) {
        setDiamondValue(settingsData.diamond_value);
      }
      
      // Fetch agency goal
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('diamonds_goal')
        .eq('role', 'agency')
        .single();
        
      if (profilesData?.diamonds_goal) {
        setAgencyGoal(profilesData.diamonds_goal);
      }
      
      return true;
    };
    
    checkAuth().then(authenticated => {
      if (authenticated) {
        fetchAllUsers();
      }
    });
  }, []);
  
  const fetchAllUsers = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.from('user_accounts')
        .select(`
          id,
          username,
          role,
          profiles(total_diamonds, diamonds_goal)
        `);
        
      if (error) {
        throw error;
      }
      
      const formattedUsers = data.map(user => ({
        id: user.id,
        username: user.username,
        role: user.role,
        total_diamonds: user.profiles?.[0]?.total_diamonds || 0,
        diamonds_goal: user.profiles?.[0]?.diamonds_goal || 0
      }));
      
      const creatorUsers = formattedUsers.filter(user => user.role === 'creator');
      const managerUsers = formattedUsers.filter(user => user.role === 'manager');
      const agentUsers = formattedUsers.filter(user => user.role === 'agent');
      
      setCreators(creatorUsers);
      setFilteredCreators(creatorUsers);
      setManagers(managerUsers);
      setAgents(agentUsers);
    } catch (error) {
      console.error('Erreur lors du chargement des utilisateurs:', error);
      toast.error('Erreur lors du chargement des utilisateurs');
    } finally {
      setLoading(false);
    }
  };
  
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    if (query.trim() === '') {
      setFilteredCreators(creators);
    } else {
      let filtered;
      
      if (activeTab === 'creators') {
        filtered = creators.filter(creator => 
          creator.username.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredCreators(filtered);
      }
    }
  };
  
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
      await fetchAllUsers();
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
      
      // Get current diamond count
      const { data: profileData, error: fetchError } = await supabase
        .from('profiles')
        .select('total_diamonds')
        .eq('id', selectedCreator.id)
        .single();
      
      if (fetchError) throw fetchError;
      
      const currentDiamonds = profileData?.total_diamonds || 0;
      const newDiamondValue = operationType === 'add' 
        ? currentDiamonds + diamondAmount 
        : Math.max(0, currentDiamonds - diamondAmount);
      
      // Update diamonds count
      const { error } = await supabase
        .from('profiles')
        .update({ total_diamonds: newDiamondValue })
        .eq('id', selectedCreator.id);
        
      if (error) throw error;
      
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
  
  const handleUpdateAgencyGoal = async () => {
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

  // Calculate total agency diamonds
  const totalAgencyDiamonds = creators.reduce((sum, creator) => sum + creator.total_diamonds, 0);
  
  // Calculate agency progress percentage
  const agencyProgressPercentage = agencyGoal > 0 
    ? Math.min(Math.round((totalAgencyDiamonds / agencyGoal) * 100), 100) 
    : 0;

  // Get active users based on selected tab
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
    loading,
    creators,
    filteredCreators,
    searchQuery,
    userId,
    role,
    username,
    isDialogOpen,
    setIsDialogOpen,
    selectedCreator,
    setSelectedCreator,
    newDiamondGoal,
    setNewDiamondGoal,
    agencyGoal,
    setAgencyGoal,
    diamondValue,
    isEditing,
    isDiamondModalOpen,
    setIsDiamondModalOpen,
    diamondAmount,
    setDiamondAmount,
    operationType,
    setOperationType,
    activeTab,
    setActiveTab,
    managers,
    agents,
    totalAgencyDiamonds,
    agencyProgressPercentage,
    handleSearch,
    openEditDialog,
    openDiamondModal,
    handleUpdateDiamondGoal,
    handleUpdateDiamonds,
    handleUpdateAgencyGoal,
    fetchAllUsers,
    getActiveUsers
  };
}
