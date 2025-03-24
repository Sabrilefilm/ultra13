
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useLiveSchedule } from "@/hooks/use-live-schedule";
import { useCreatorRewards } from "@/hooks/use-creator-rewards";
import { useMonthProgress } from "@/hooks/use-month-progress";
import { Button } from "@/components/ui/button";

export function useCreatorDashboardStats(userId?: string) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showWarning, setShowWarning] = useState(false);
  const { dayOfMonth, daysInMonth, monthProgress } = useMonthProgress();
  
  const { data: liveSchedule, isError: isLiveScheduleError } = useLiveSchedule(userId, "creator");
  const { data: rewardsData, isError: isRewardsError } = useCreatorRewards(userId, "creator");

  useEffect(() => {
    if (liveSchedule) {
      const monthlyHours = liveSchedule.hours * liveSchedule.days;
      const requiredHours = 15;
      const progressPercentage = (monthlyHours / requiredHours) * 100;
      
      if (monthProgress > 50 && progressPercentage < 50) {
        setShowWarning(true);
        toast({
          variant: "destructive",
          title: "Attention aux objectifs",
          description: "Vous risquez de ne pas atteindre vos objectifs mensuels, ce qui peut entraîner une exclusion de l'agence ou une perte de récompenses.",
          action: (
            <Button 
              variant="outline" 
              size="sm"
              className="border-white/20 text-white hover:bg-red-900/50"
              onClick={() => navigate('/messages')}
            >
              Contacter le fondateur
            </Button>
          ),
        });
      }
    }
  }, [liveSchedule, monthProgress, toast, navigate]);

  if (isLiveScheduleError || isRewardsError) {
    toast({
      variant: "destructive",
      title: "Erreur",
      description: "Erreur lors de la récupération des statistiques"
    });
  }

  const monthlyHours = liveSchedule ? (liveSchedule.hours * liveSchedule.days) : 0;
  const requiredHours = 15;
  const requiredDays = 7;
  
  const hoursCompleted = monthlyHours >= requiredHours;
  const daysCompleted = (liveSchedule?.days || 0) >= requiredDays;
  
  const getProgressColor = () => {
    const progressPercentage = (monthlyHours / requiredHours) * 100;
    
    if (hoursCompleted) return "text-green-500";
    
    if (monthProgress < 33) return "text-green-500";
    
    if (monthProgress < 66) {
      return progressPercentage >= monthProgress ? "text-green-500" : "text-orange-500";
    }
    
    return progressPercentage >= monthProgress ? "text-green-500" : "text-red-500";
  };
  
  const getDaysProgressColor = () => {
    const progressPercentage = ((liveSchedule?.days || 0) / requiredDays) * 100;
    
    if (daysCompleted) return "text-green-500";
    
    if (monthProgress < 33) return "text-green-500";
    
    if (monthProgress < 66) {
      return progressPercentage >= monthProgress ? "text-green-500" : "text-orange-500";
    }
    
    return progressPercentage >= monthProgress ? "text-green-500" : "text-red-500";
  };
  
  const hoursColor = getProgressColor();
  const daysColor = getDaysProgressColor();
  
  const diamondsText = rewardsData ? `${rewardsData}` : "0";

  return {
    liveSchedule,
    rewardsData,
    monthlyHours,
    requiredHours,
    requiredDays,
    hoursColor,
    daysColor,
    diamondsText,
    showWarning,
    navigate
  };
}
