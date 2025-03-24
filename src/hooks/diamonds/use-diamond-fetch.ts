
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export interface Creator {
  id: string;
  username: string;
  role: string;
  total_diamonds: number;
  diamonds_goal: number;
}

export function useDiamondFetch() {
  const [loading, setLoading] = useState(true);
  const [creators, setCreators] = useState<Creator[]>([]);
  const [managers, setManagers] = useState<Creator[]>([]);
  const [agents, setAgents] = useState<Creator[]>([]);
  const [diamondValue, setDiamondValue] = useState<number>(0);
  const [agencyGoal, setAgencyGoal] = useState<number>(0);
  const [userId, setUserId] = useState<string>('');
  const [role, setRole] = useState<string>('');
  const [username, setUsername] = useState<string>('');

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
      setManagers(managerUsers);
      setAgents(agentUsers);
    } catch (error) {
      console.error('Erreur lors du chargement des utilisateurs:', error);
      toast.error('Erreur lors du chargement des utilisateurs');
    } finally {
      setLoading(false);
    }
  };

  // Calculate total agency diamonds
  const totalAgencyDiamonds = creators.reduce((sum, creator) => sum + creator.total_diamonds, 0);
  
  // Calculate agency progress percentage
  const agencyProgressPercentage = agencyGoal > 0 
    ? Math.min(Math.round((totalAgencyDiamonds / agencyGoal) * 100), 100) 
    : 0;

  return {
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
  };
}
