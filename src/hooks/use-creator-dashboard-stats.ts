
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

interface LiveSchedule {
  hours: number;
  days: number;
}

interface CreatorData {
  schedule?: LiveSchedule;
  nextMatch?: {
    match_date: string;
    opponent_id: string;
  };
}

export const useCreatorDashboardStats = (userId?: string) => {
  const navigate = useNavigate();
  const [liveSchedule, setLiveSchedule] = useState<LiveSchedule | null>(null);
  const [monthlyHours, setMonthlyHours] = useState(0);
  const [creatorData, setCreatorData] = useState<CreatorData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [totalDiamonds, setTotalDiamonds] = useState(0);
  const [diamondsText, setDiamondsText] = useState("Chargement...");
  const [username, setUsername] = useState("");

  // Target values for creator
  const requiredHours = 30;
  const requiredDays = 10;
  
  // Calculated values
  const hoursColor = monthlyHours >= requiredHours ? "text-green-500" : "text-red-500";
  const daysColor = (liveSchedule?.days || 0) >= requiredDays ? "text-green-500" : "text-red-500";
  const showWarning = (liveSchedule?.hours || 0) < requiredHours || (liveSchedule?.days || 0) < requiredDays;

  useEffect(() => {
    const fetchCreatorData = async () => {
      setIsLoading(true);
      try {
        const storedUserId = userId || localStorage.getItem('userId');
        if (!storedUserId) return;

        // Fetch schedule data
        const { data: scheduleData } = await supabase
          .from("live_schedules")
          .select("hours, days")
          .eq("creator_id", storedUserId)
          .maybeSingle();

        // Fetch profile data
        const { data: profileData } = await supabase
          .from("profiles")
          .select("username, total_diamonds")
          .eq("id", storedUserId)
          .maybeSingle();

        // Fetch upcoming match
        const { data: matchData } = await supabase
          .from("upcoming_matches")
          .select("*")
          .eq("creator_id", storedUserId)
          .eq("status", "scheduled")
          .order("match_date", { ascending: true })
          .limit(1)
          .maybeSingle();

        setLiveSchedule(scheduleData || { hours: 0, days: 0 });
        setMonthlyHours(scheduleData?.hours || 0);
        setTotalDiamonds(profileData?.total_diamonds || 0);
        setUsername(profileData?.username || "");
        
        setCreatorData({
          schedule: scheduleData || { hours: 0, days: 0 },
          nextMatch: matchData || undefined
        });

        setDiamondsText(`${totalDiamonds.toLocaleString()} 💎`);
      } catch (error) {
        console.error("Error fetching creator stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCreatorData();
  }, [userId]);

  const formatMatchDate = (dateString?: string) => {
    if (!dateString) return "";
    
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("fr-FR", {
      day: "numeric",
      month: "long",
      hour: "2-digit",
      minute: "2-digit"
    }).format(date);
  };

  return {
    liveSchedule,
    monthlyHours,
    requiredHours,
    requiredDays,
    hoursColor,
    daysColor,
    diamondsText,
    showWarning,
    navigate,
    creatorData,
    isLoading,
    totalDiamonds,
    username,
    formatMatchDate
  };
};
