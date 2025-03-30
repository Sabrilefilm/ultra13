
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export const useAgentStats = (role: string | null) => {
  const [creatorCount, setCreatorCount] = useState<number>(0);
  const [diamondCount, setDiamondCount] = useState<number>(0);
  const [totalEvents, setTotalEvents] = useState<number>(0);
  
  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch creator count depending on role
        const creatorCountQuery = await supabase
          .from('user_accounts')
          .select('id')
          .eq('role', 'creator');
        
        if (creatorCountQuery.data) {
          setCreatorCount(creatorCountQuery.data.length);
        }
        
        // Fetch diamond count (simulated data for now)
        // In a real app, this would fetch from profiles table
        setDiamondCount(Math.floor(Math.random() * 100) * 10);
        
        // Fetch sponsorship events (simulated data for now)
        // In a real app, this would fetch from sponsorships table  
        setTotalEvents(Math.floor(Math.random() * 10) + 1);
        
      } catch (error) {
        console.error('Error fetching agent stats:', error);
      }
    };
    
    fetchStats();
  }, [role]);
  
  return { creatorCount, diamondCount, totalEvents };
};
