
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export const useLiveSchedule = (userId?: string, role?: string) => {
  return useQuery({
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
};
