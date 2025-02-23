
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
  // Requête pour récupérer les horaires de live
  const { data: liveSchedule, isError } = useQuery({
    queryKey: ["live-schedule", userId],
    queryFn: async () => {
      if (role !== "creator" || !userId) return null;

      try {
        // Première requête pour récupérer l'ID depuis user_accounts
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

        // Deuxième requête pour récupérer les horaires avec l'ID correct
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
          // Si aucun horaire n'existe, on crée une nouvelle entrée
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

  if (isError) {
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
