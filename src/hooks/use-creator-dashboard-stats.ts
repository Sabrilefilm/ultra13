
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
  const [performanceMetrics, setPerformanceMetrics] = useState({
    hoursCompletion: 0,
    daysCompletion: 0,
    diamondsRating: "Bon",
    overallScore: 0
  });

  // Target values for creator
  const requiredHours = 30;
  const requiredDays = 10;
  
  // Calculated values
  const hoursColor = monthlyHours >= requiredHours ? "text-green-500" : "text-red-500";
  const daysColor = (liveSchedule?.days || 0) >= requiredDays ? "text-green-500" : "text-red-500";
  const showWarning = (liveSchedule?.hours || 0) < requiredHours || (liveSchedule?.days || 0) < requiredDays;

  // Format number to one decimal place
  const formatNumber = (value: number): string => {
    return Number(value.toFixed(1)).toString();
  };

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

        // Format schedule data with one decimal place
        const formattedSchedule = scheduleData ? {
          hours: Number(Number(scheduleData.hours).toFixed(1)),
          days: Number(Number(scheduleData.days).toFixed(1))
        } : { hours: 0, days: 0 };

        setLiveSchedule(formattedSchedule);
        setMonthlyHours(formattedSchedule.hours);
        setTotalDiamonds(profileData?.total_diamonds || 0);
        setUsername(profileData?.username || "");
        
        setCreatorData({
          schedule: formattedSchedule,
          nextMatch: matchData || undefined
        });

        // Calculate performance metrics
        const hoursCompletion = Math.min(100, Math.round(((formattedSchedule.hours) / requiredHours) * 100));
        const daysCompletion = Math.min(100, Math.round(((formattedSchedule.days) / requiredDays) * 100));
        
        // Determine diamonds rating
        let diamondsRating = "Insuffisant";
        if (profileData?.total_diamonds >= 5000) diamondsRating = "Excellent";
        else if (profileData?.total_diamonds >= 2000) diamondsRating = "Très Bon";
        else if (profileData?.total_diamonds >= 1000) diamondsRating = "Bon";
        else if (profileData?.total_diamonds >= 500) diamondsRating = "Moyen";
        
        // Calculate overall score (0-100)
        const overallScore = Math.round((hoursCompletion + daysCompletion + (profileData?.total_diamonds / 50 || 0)) / 3);
        
        setPerformanceMetrics({
          hoursCompletion,
          daysCompletion,
          diamondsRating,
          overallScore: Math.min(100, overallScore)
        });

        // Format diamonds with thousands separator
        setDiamondsText(`${Math.floor(profileData?.total_diamonds || 0).toLocaleString('fr-FR')} 💎`);
      } catch (error) {
        console.error("Error fetching creator stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCreatorData();
  }, [userId, requiredHours, requiredDays]);

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
    formatMatchDate,
    performanceMetrics
  };
};
