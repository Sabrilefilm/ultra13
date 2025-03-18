
import { Users, Diamond, Clock, Gift, Calendar } from "lucide-react";
import { StatsCard } from "@/components/StatsCard";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

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

  // Requête pour récupérer les horaires de live
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

  // Nouvelle requête pour récupérer les diamants reçus
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
        
        // Calculer le total des diamants reçus
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
    // Calculer le nombre total d'heures de live par mois
    const monthlyHours = liveSchedule ? (liveSchedule.hours * liveSchedule.days) : 0;
    const requiredHours = 15; // Objectif mensuel requis
    const requiredDays = 7; // Jours requis par mois
    
    // Déterminer si l'objectif est atteint
    const hoursCompleted = monthlyHours >= requiredHours;
    const daysCompleted = (liveSchedule?.days || 0) >= requiredDays;
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Heures de Live / Mois"
          value={`${monthlyHours}h / ${requiredHours}h`}
          icon={<Clock className={`w-6 h-6 ${hoursCompleted ? "text-green-500" : "text-primary"}`} />}
        />
        <StatsCard
          title="Jours Streamés / Mois"
          value={`${liveSchedule?.days || 0}j / ${requiredDays}j`}
          icon={<Calendar className={`w-6 h-6 ${daysCompleted ? "text-green-500" : "text-primary"}`} />}
        />
        <StatsCard
          title="Diamants Reçus"
          value={`${rewardsData || 0}`}
          icon={<Diamond className="w-6 h-6 text-primary" />}
        />
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
