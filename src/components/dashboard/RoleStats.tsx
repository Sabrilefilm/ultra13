
import { Users, Diamond, Clock, Gift, Calendar, AlertTriangle, MessageCircle } from "lucide-react";
import { StatsCard } from "@/components/StatsCard";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { usePlatformSettings } from "@/hooks/use-platform-settings";

interface RoleStatsProps {
  role: string;
  userId?: string;
}

interface LiveSchedule {
  hours: number;
  days: number;
}

export const RoleStats = ({ role, userId }: RoleStatsProps) => {
  const navigate = useNavigate();
  const { toast: toastHook } = useToast();
  const [dayOfMonth, setDayOfMonth] = useState(0);
  const [daysInMonth, setDaysInMonth] = useState(0);
  const [monthProgress, setMonthProgress] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
  const { platformSettings } = usePlatformSettings(role || null);

  useEffect(() => {
    const now = new Date();
    const currentDay = now.getDate();
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    
    setDayOfMonth(currentDay);
    setDaysInMonth(lastDay);
    setMonthProgress(Math.floor((currentDay / lastDay) * 100));
  }, []);

  const { data: liveSchedule, isError: isLiveScheduleError } = useQuery({
    queryKey: ["live-schedule", userId],
    queryFn: async () => {
      if (role !== "creator" || !userId) return null;

      try {
        const { data: userAccount, error: userError } = await supabase
          .from("user_accounts")
          .select("id")
          .eq("username", userId)
          .eq("role", "creator")
          .maybeSingle();

        if (userError) {
          console.error("Error fetching user account:", userError);
          throw new Error("Erreur lors de la récupération du compte utilisateur");
        }

        if (!userAccount) {
          console.log("No user account found for:", userId);
          return null;
        }

        console.log("User account found:", userAccount);

        const { data: schedule, error: scheduleError } = await supabase
          .from("live_schedules")
          .select("hours, days")
          .eq("creator_id", userAccount.id)
          .maybeSingle();

        if (scheduleError) {
          console.error("Error fetching live schedule:", scheduleError);
          throw new Error("Erreur lors de la récupération des horaires");
        }

        console.log("Schedule found:", schedule);

        if (!schedule) {
          const { data: newSchedule, error: createError } = await supabase
            .from("live_schedules")
            .insert([
              { creator_id: userAccount.id, hours: 0, days: 0 }
            ])
            .select()
            .single();

          if (createError) {
            console.error("Error creating live schedule:", createError);
            throw new Error("Erreur lors de la création des horaires");
          }

          console.log("New schedule created:", newSchedule);
          return newSchedule;
        }

        return schedule;
      } catch (error) {
        console.error("Error in live schedule query:", error);
        toast.error(error instanceof Error ? error.message : "Une erreur est survenue");
        return null;
      }
    },
    enabled: role === "creator" && !!userId
  });

  const { data: rewardsData, isError: isRewardsError } = useQuery({
    queryKey: ["creator-rewards", userId],
    queryFn: async () => {
      if (role !== "creator" || !userId) return null;

      try {
        const { data: rewards, error } = await supabase
          .from("creator_rewards")
          .select("diamonds_count")
          .eq("creator_id", userId);

        if (error) {
          console.error("Error fetching rewards:", error);
          throw new Error("Erreur lors de la récupération des récompenses");
        }

        console.log("Rewards found:", rewards);
        
        const totalDiamonds = rewards?.reduce((sum, reward) => sum + reward.diamonds_count, 0) || 0;
        return totalDiamonds;
      } catch (error) {
        console.error("Error in rewards query:", error);
        toast.error(error instanceof Error ? error.message : "Une erreur est survenue");
        return 0;
      }
    },
    enabled: role === "creator" && !!userId
  });

  useEffect(() => {
    if (role === 'creator' && liveSchedule) {
      const monthlyHours = liveSchedule.hours * liveSchedule.days;
      const requiredHours = 15;
      const progressPercentage = (monthlyHours / requiredHours) * 100;
      
      if (monthProgress > 50 && progressPercentage < 50) {
        setShowWarning(true);
        toastHook({
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
  }, [liveSchedule, monthProgress, role, toastHook, navigate]);

  if (isLiveScheduleError || isRewardsError) {
    toast.error("Erreur lors de la récupération des statistiques");
  }

  if (role === 'client') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Vos Créateurs Suivis"
          value="0"
          icon={<Users className="w-6 h-6 text-primary" />}
        />
        <StatsCard
          title="Diamants Envoyés"
          value="0"
          icon={<Diamond className="w-6 h-6 text-primary" />}
        />
        <StatsCard
          title="Temps de Visionnage"
          value="0h"
          icon={<Clock className="w-6 h-6 text-primary" />}
        />
      </div>
    );
  }

  if (role === 'creator') {
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
    
    const diamondValue = platformSettings?.diamondValue || (10/36000); // Valeur par défaut: 10€ pour 36000 diamants
    const diamondsText = rewardsData ? `${rewardsData}` : "0";
    const diamondValueText = rewardsData ? 
      `(${((rewardsData * diamondValue) || 0).toFixed(2)}€)` : 
      "(0.00€)";
    
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
            value={`${diamondsText} ${diamondValueText}`}
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
  }

  if (role === 'manager') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Créateurs Actifs"
          value="0"
          icon={<Users className="w-6 h-6 text-primary" />}
        />
        <StatsCard
          title="Total des Gains"
          value="0 €"
          icon={<Gift className="w-6 h-6 text-primary" />}
        />
        <StatsCard
          title="Performance Moyenne"
          value="0%"
          icon={<Clock className="w-6 h-6 text-primary" />}
        />
      </div>
    );
  }

  if (role === 'agent') {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatsCard
            title="Créateurs Assignés"
            value="0"
            icon={<Users className="w-6 h-6 text-primary" />}
          />
          <StatsCard
            title="Heures de Live / Mois"
            value="0h / 15h"
            icon={<Clock className="w-6 h-6 text-primary" />}
          />
          <StatsCard
            title="Jours Streamés / Mois"
            value="0j / 7j"
            icon={<Calendar className="w-6 h-6 text-primary" />}
          />
        </div>
        <div className="flex justify-end">
          <Button 
            onClick={() => navigate("/creator-stats")} 
            className="flex items-center gap-2"
          >
            <Users className="h-4 w-4" />
            Mes créateurs
          </Button>
        </div>
      </div>
    );
  }

  return null;
};
