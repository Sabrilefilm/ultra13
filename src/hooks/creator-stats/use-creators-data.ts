
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { creatorStatsService } from "@/services/creator-stats-service";
import { Creator } from "./types";

export const useCreatorsData = (role: string | null, username: string | null) => {
  const navigate = useNavigate();
  const [creators, setCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!['agent', 'manager', 'founder', 'ambassadeur'].includes(role || '')) {
      navigate('/');
      return;
    }

    fetchCreators();
  }, [navigate, role, username]);

  const fetchCreators = async () => {
    if (!role || !username) return;
    
    setLoading(true);
    try {
      const creatorsData = await creatorStatsService.fetchCreators(role, username);
      setCreators(creatorsData);
    } catch (error) {
      console.error("Error:", error);
      toast.error(error instanceof Error ? error.message : "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  return {
    creators,
    setCreators,
    loading,
    fetchCreators
  };
};
