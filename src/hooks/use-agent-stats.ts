
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export const useAgentStats = (role: string) => {
  const [creatorCount, setCreatorCount] = useState(0);
  const [diamondCount, setDiamondCount] = useState(0);
  const [totalEvents, setTotalEvents] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const userId = localStorage.getItem('userId');
        
        if (!userId) {
          console.error("No user ID found");
          return;
        }
        
        // Fetch creator count
        const creatorQuery = {
          ...(role === 'agent' && { agent_id: userId }),
          role: 'creator'
        };
        
        const { data: creators, error: creatorsError } = await supabase
          .from('user_accounts')
          .select('*')
          .match(creatorQuery);
        
        if (creatorsError) {
          throw creatorsError;
        }
        
        setCreatorCount(creators?.length || 0);
        
        // Fetch total diamonds
        const creatorIds = creators?.map(creator => creator.id) || [];
        
        if (creatorIds.length > 0) {
          const { data: profiles, error: profilesError } = await supabase
            .from('profiles')
            .select('total_diamonds')
            .in('id', creatorIds);
            
          if (profilesError) {
            throw profilesError;
          }
          
          const totalDiamonds = profiles?.reduce((sum, profile) => sum + (profile.total_diamonds || 0), 0) || 0;
          setDiamondCount(totalDiamonds);
        }
        
        // Fetch sponsorship events
        const agentName = localStorage.getItem('username') || '';
        
        const { data: sponsorships, error: sponsorshipsError } = await supabase
          .from('sponsorships')
          .select('*')
          .eq('agent_name', agentName);
          
        if (sponsorshipsError) {
          throw sponsorshipsError;
        }
        
        setTotalEvents(sponsorships?.length || 0);
        
      } catch (error) {
        console.error('Error fetching agent stats:', error);
      } finally {
        setLoading(false);
      }
    };

    if (role) {
      fetchStats();
    }
  }, [role]);

  return {
    creatorCount,
    diamondCount,
    totalEvents,
    loading
  };
};
