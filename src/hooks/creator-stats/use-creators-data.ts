
import { useState, useEffect, useCallback } from "react";
import { creatorStatsService } from "@/services/creator-stats-service";
import { Creator } from "./types";
import { toast } from "sonner";

export const useCreatorsData = (role: string | null, username: string | null) => {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchCreators = useCallback(async () => {
    if (!role || !username) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await creatorStatsService.fetchCreators(role, username);
      setCreators(data);
    } catch (error) {
      console.error("Error fetching creators:", error);
      toast.error("Erreur lors du chargement des créateurs");
    } finally {
      setLoading(false);
    }
  }, [role, username]);

  useEffect(() => {
    fetchCreators();
  }, [fetchCreators]);

  return {
    creators,
    setCreators,
    loading,
    fetchCreators
  };
};
