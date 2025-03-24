
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export const useCreatorData = () => {
  const [totalDiamonds, setTotalDiamonds] = useState(0);
  const username = localStorage.getItem('username') || 'Créateur';
  
  const {
    data: creatorData,
    isLoading
  } = useQuery({
    queryKey: ["creator-data"],
    queryFn: async () => {
      try {
        const username = localStorage.getItem('username');
        const userId = localStorage.getItem('userId');
        
        if (!username || !userId) {
          return {
            schedule: {
              hours: 0,
              days: 0
            },
            diamonds: 0
          };
        }
        
        const {
          data: scheduleData,
          error: scheduleError
        } = await supabase.from('live_schedules').select('hours, days').eq('creator_id', userId).maybeSingle();
        
        if (scheduleError) {
          console.error("Error fetching schedule:", scheduleError);
        }
        
        const {
          data: profileData,
          error: profileError
        } = await supabase.from('profiles').select('total_diamonds').eq('id', userId).maybeSingle();
        
        if (profileError) {
          console.error("Error fetching profile:", profileError);
        }
        
        const now = new Date();
        const {
          data: matchData,
          error: matchError
        } = await supabase.from('matches').select('*').eq('creator_id', username).gt('match_date', now.toISOString()).order('match_date', {
          ascending: true
        }).limit(1).maybeSingle();
        
        if (matchError) {
          console.error("Error fetching match:", matchError);
        }
        
        return {
          schedule: scheduleData || {
            hours: 0,
            days: 0
          },
          diamonds: profileData?.total_diamonds || 0,
          nextMatch: matchData || null
        };
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
        toast.error("Impossible de récupérer vos données");
        return {
          schedule: {
            hours: 0,
            days: 0
          },
          diamonds: 0,
          nextMatch: null
        };
      }
    }
  });
  
  useEffect(() => {
    if (creatorData?.diamonds) {
      setTotalDiamonds(creatorData.diamonds);
    }
  }, [creatorData]);
  
  const formatMatchDate = (dateString: string) => {
    if (!dateString) return "Non planifié";
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const weeklyHours = creatorData?.schedule ? creatorData.schedule.hours * creatorData.schedule.days : 0;
  const targetHours = 15;
  const targetDays = 7;

  return {
    creatorData,
    isLoading,
    totalDiamonds,
    username,
    weeklyHours,
    targetHours,
    targetDays,
    formatMatchDate
  };
};

export default useCreatorData;
