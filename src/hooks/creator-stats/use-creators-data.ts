
import { useState, useEffect, useCallback } from "react";
import { creatorStatsService } from "@/services/creator-stats-service";
import { Creator } from "./types";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

export const useCreatorsData = (
  currentPage: number = 1, 
  pageSize: number = 10, 
  searchQuery: string = "",
  viewType: "all" | "week" | "month" = "all"
) => {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [totalCreators, setTotalCreators] = useState<number>(0);
  const [totalActiveCreators, setTotalActiveCreators] = useState<number>(0);
  const [lastFetched, setLastFetched] = useState<Date>(new Date());

  const fetchCreators = useCallback(async () => {
    try {
      setLoading(true);
      // Get user data from the auth context
      const userRole = localStorage.getItem('userRole') || '';
      const username = localStorage.getItem('username') || '';
      const userId = localStorage.getItem('userId') || '';
      
      console.log("Fetching creators with:", { userRole, username, userId, currentPage, pageSize, searchQuery, viewType });
      
      let data;
      if (userRole === 'founder' || userRole === 'manager') {
        const { data: creatorData, error } = await supabase
          .from("user_accounts")
          .select(`
            id,
            username,
            role,
            agent_id,
            live_schedules (
              hours, days
            ),
            profiles (
              total_diamonds
            )
          `)
          .eq("role", "creator")
          .order('username');
        
        if (error) {
          console.error("Supabase error:", error);
          throw error;
        }
        data = creatorData;
      } else if (userRole === 'agent') {
        const { data: creatorData, error } = await supabase
          .from("user_accounts")
          .select(`
            id,
            username,
            role,
            agent_id,
            live_schedules (
              hours, days
            ),
            profiles (
              total_diamonds
            )
          `)
          .eq("role", "creator")
          .eq("agent_id", userId)
          .order('username');
        
        if (error) {
          console.error("Supabase error:", error);
          throw error;
        }
        data = creatorData;
      }
      
      console.log("Creators fetched:", data?.length || 0, data);
      
      if (data && data.length > 0) {
        // Filter by search query if provided
        if (searchQuery && searchQuery.trim() !== '') {
          data = data.filter(creator => 
            creator.username.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }
        
        setCreators(data as Creator[]);
        setTotalCreators(data.length);
        setTotalActiveCreators(data.filter(creator => creator.live_schedules?.[0]?.hours > 0).length);
      } else {
        console.log("No creators found for this user");
        setCreators([]);
        setTotalCreators(0);
        setTotalActiveCreators(0);
      }
      
      setLastFetched(new Date());
    } catch (error) {
      console.error("Error fetching creators:", error);
      toast.error("Erreur lors du chargement des créateurs");
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, searchQuery, viewType]);

  useEffect(() => {
    console.log("useEffect triggered in useCreatorsData");
    fetchCreators();
  }, [fetchCreators, currentPage, pageSize, searchQuery, viewType]);

  const handleEditSchedule = useCallback((creator: Creator) => {
    // Implementation would go here
    console.log("Edit schedule for creator:", creator.username);
  }, []);

  const handleEditDiamonds = useCallback((creator: Creator) => {
    // Implementation would go here
    console.log("Edit diamonds for creator:", creator.username);
  }, []);

  const handleRemoveCreator = useCallback((creator: Creator) => {
    // Implementation would go here
    console.log("Remove creator:", creator.username);
  }, []);

  const resetAllSchedules = useCallback(async () => {
    try {
      await creatorStatsService.resetAllSchedules();
      toast.success("Tous les horaires ont été réinitialisés");
      fetchCreators();
    } catch (error) {
      console.error("Error resetting schedules:", error);
      toast.error("Erreur lors de la réinitialisation des horaires");
    }
  }, [fetchCreators]);

  const resetAllDiamonds = useCallback(async () => {
    try {
      await creatorStatsService.resetAllDiamonds();
      toast.success("Tous les diamants ont été réinitialisés");
      fetchCreators();
    } catch (error) {
      console.error("Error resetting diamonds:", error);
      toast.error("Erreur lors de la réinitialisation des diamants");
    }
  }, [fetchCreators]);

  return {
    creators,
    isLoading: loading,
    totalCreators,
    totalActiveCreators,
    handleEditSchedule,
    handleEditDiamonds,
    handleRemoveCreator,
    resetAllSchedules,
    resetAllDiamonds,
    fetchCreators,
    lastFetched
  };
};
