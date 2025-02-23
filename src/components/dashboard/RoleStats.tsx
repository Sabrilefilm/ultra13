
import { Users, Diamond, Clock, Gift, Calendar } from "lucide-react";
import { StatsCard } from "@/components/StatsCard";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface RoleStatsProps {
  role: string;
  userId?: string;
}

interface LiveSchedule {
  hours: number;
  days: number;
}

export const RoleStats = ({ role, userId }: RoleStatsProps) => {
  const { data: liveSchedule } = useQuery({
    queryKey: ["live-schedule", userId],
    queryFn: async () => {
      if (role !== "creator" || !userId) return null;
      
      // D'abord, récupérer l'ID du créateur depuis user_accounts
      const { data: userAccount, error: userError } = await supabase
        .from("user_accounts")
        .select("id")
        .eq("username", userId)
        .eq("role", "creator")
        .single();

      if (userError) {
        console.error("Error fetching user account:", userError);
        toast.error("Erreur lors de la récupération des données");
        return null;
      }

      if (!userAccount) {
        console.log("No user account found");
        return null;
      }

      // Ensuite, récupérer les données de live_schedules avec l'ID du créateur
      const { data, error } = await supabase
        .from("live_schedules")
        .select("hours, days")
        .eq("creator_id", userAccount.id)
        .single();

      if (error) {
        console.error("Error fetching live schedule:", error);
        toast.error("Erreur lors de la récupération des horaires");
        return null;
      }

      return data as LiveSchedule;
    },
    enabled: role === "creator" && !!userId
  });

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
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Heures de Live"
          value={`${liveSchedule?.hours || 0}h`}
          icon={<Clock className="w-6 h-6 text-primary" />}
        />
        <StatsCard
          title="Jours Streamés"
          value={`${liveSchedule?.days || 0}j`}
          icon={<Calendar className="w-6 h-6 text-primary" />}
        />
        <StatsCard
          title="Diamants Reçus"
          value="0"
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

  return null;
};
