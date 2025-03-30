
import { useState, useEffect, useCallback } from "react";
import { creatorStatsService } from "@/services/creator-stats-service";
import { Creator } from "./types";
import { toast } from "sonner";

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

  const fetchCreators = useCallback(async () => {
    try {
      setLoading(true);
      // Get user data from the auth context
      const userRole = localStorage.getItem('role') || '';
      const username = localStorage.getItem('username') || '';
      
      const data = await creatorStatsService.fetchCreators(userRole, username);
      
      setCreators(data);
      setTotalCreators(data.length);
      setTotalActiveCreators(data.filter(creator => creator.live_schedules?.[0]?.hours > 0).length);
    } catch (error) {
      console.error("Error fetching creators:", error);
      toast.error("Erreur lors du chargement des créateurs");
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, searchQuery, viewType]);

  useEffect(() => {
    fetchCreators();
  }, [fetchCreators]);

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
    fetchCreators
  };
};
