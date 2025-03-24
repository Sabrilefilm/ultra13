
import React, { useEffect, useState } from "react";
import { Clock, Calendar, Diamond, AlertTriangle, MessageCircle } from "lucide-react";
import { StatsCard } from "@/components/StatsCard";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useLiveSchedule } from "@/hooks/use-live-schedule";
import { useCreatorRewards } from "@/hooks/use-creator-rewards";
import { useMonthProgress } from "@/hooks/use-month-progress";

interface CreatorStatsProps {
  userId?: string;
}

const CreatorStats: React.FC<CreatorStatsProps> = ({ userId }) => {
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
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Heures de Live / Mois"
          value={`${monthlyHours}h / ${requiredHours}h`}
          icon={<Clock className={`w-6 h-6 ${hoursColor}`} />}
        />
        <StatsCard
          title="Jours Streamés / Mois"
          value={`${liveSchedule?.days || 0}j / ${requiredDays}j`}
          icon={<Calendar className={`w-6 h-6 ${daysColor}`} />}
        />
        <StatsCard
          title="Diamants Reçus"
          value={diamondsText}
          icon={<Diamond className="w-6 h-6 text-primary" />}
        />
      </div>
      
      <div className="bg-blue-900/20 border border-blue-700/30 rounded-lg p-4 flex items-center gap-3">
        <Clock className="h-6 w-6 text-blue-400 animate-pulse" />
        <p className="text-blue-400/80 text-sm">
          Les horaires et jours de live sont mis à jour toutes les 24-48 heures. 
          Seul le fondateur peut modifier ces valeurs.
        </p>
      </div>
      
      {showWarning && (
        <div className="bg-red-900/20 border border-red-700/30 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-6 w-6 text-red-400 animate-pulse" />
            <div>
              <h4 className="font-medium text-red-300">Attention aux objectifs</h4>
              <p className="text-red-400/80 text-sm">Vous risquez de ne pas atteindre vos objectifs mensuels, ce qui peut entraîner une exclusion de l'agence ou une perte de récompenses.</p>
            </div>
          </div>
          <Button 
            variant="outline" 
            className="border-red-700/50 text-red-300 hover:bg-red-800/30"
            onClick={() => navigate('/messages')}
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Contacter le fondateur
          </Button>
        </div>
      )}
    </div>
  );
};

export default CreatorStats;
