
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

const DAYS_OF_WEEK = [
  { id: "monday", label: "Lundi" },
  { id: "tuesday", label: "Mardi" },
  { id: "wednesday", label: "Mercredi" },
  { id: "thursday", label: "Jeudi" },
  { id: "friday", label: "Vendredi" },
  { id: "saturday", label: "Samedi" },
  { id: "sunday", label: "Dimanche" },
];

interface LiveScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  creatorId: string;
}

interface Schedule {
  id: string;
  day_of_week: string;
  start_time: string;
  end_time: string;
  is_active: boolean;
}

export const LiveScheduleModal = ({
  isOpen,
  onClose,
  creatorId,
}: LiveScheduleModalProps) => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [profileId, setProfileId] = useState<string | null>(null);

  const fetchProfileId = async (username: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("id")
        .eq("username", username)
        .single();

      if (error) throw error;
      if (data) {
        setProfileId(data.id);
        return data.id;
      }
    } catch (error) {
      console.error("Erreur lors de la récupération du profil:", error);
      toast.error("Erreur lors de la récupération du profil");
    }
    return null;
  };

  const fetchSchedules = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from("live_schedules")
        .select("*")
        .eq("creator_id", id);

      if (error) throw error;

      // Assurez-vous d'avoir un horaire pour chaque jour
      const initialSchedules = DAYS_OF_WEEK.map((day) => {
        const existingSchedule = data?.find((s) => s.day_of_week === day.id);
        return (
          existingSchedule || {
            id: `new-${day.id}`,
            day_of_week: day.id,
            start_time: "09:00",
            end_time: "18:00",
            is_active: false,
          }
        );
      });

      setSchedules(initialSchedules);
    } catch (error) {
      console.error("Erreur lors du chargement des horaires:", error);
      toast.error("Erreur lors du chargement des horaires");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && creatorId) {
      setLoading(true);
      const initializeData = async () => {
        const id = await fetchProfileId(creatorId);
        if (id) {
          await fetchSchedules(id);
        }
      };
      initializeData();
    }
  }, [isOpen, creatorId]);

  const handleSave = async () => {
    if (!profileId) return;

    try {
      setLoading(true);

      for (const schedule of schedules) {
        if (schedule.is_active) {
          if (schedule.id.startsWith("new-")) {
            // Créer un nouvel horaire
            const { error } = await supabase.from("live_schedules").insert({
              creator_id: profileId,
              day_of_week: schedule.day_of_week,
              start_time: schedule.start_time,
              end_time: schedule.end_time,
              is_active: true,
            });
            if (error) throw error;
          } else {
            // Mettre à jour l'horaire existant
            const { error } = await supabase
              .from("live_schedules")
              .update({
                start_time: schedule.start_time,
                end_time: schedule.end_time,
              })
              .eq("id", schedule.id);
            if (error) throw error;
          }
        } else if (!schedule.id.startsWith("new-")) {
          // Supprimer l'horaire existant si désactivé
          const { error } = await supabase
            .from("live_schedules")
            .delete()
            .eq("id", schedule.id);
          if (error) throw error;
        }
      }

      toast.success("Horaires mis à jour avec succès");
      onClose();
    } catch (error) {
      console.error("Erreur lors de la sauvegarde des horaires:", error);
      toast.error("Erreur lors de la sauvegarde des horaires");
    } finally {
      setLoading(false);
    }
  };

  const updateSchedule = (
    dayId: string,
    field: "start_time" | "end_time" | "is_active",
    value: string | boolean
  ) => {
    setSchedules((prev) =>
      prev.map((schedule) =>
        schedule.day_of_week === dayId
          ? { ...schedule, [field]: value }
          : schedule
      )
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Configuration des Horaires de Live</DialogTitle>
          <DialogDescription>
            Configurez vos horaires de live pour chaque jour de la semaine
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {loading ? (
            <div className="flex items-center justify-center p-4">
              <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" />
            </div>
          ) : (
            <div className="space-y-4">
              {DAYS_OF_WEEK.map((day) => {
                const schedule = schedules.find((s) => s.day_of_week === day.id);
                if (!schedule) return null;

                return (
                  <div
                    key={day.id}
                    className="grid grid-cols-[120px_1fr_1fr] gap-4 items-center"
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={schedule.is_active}
                        onChange={(e) =>
                          updateSchedule(day.id, "is_active", e.target.checked)
                        }
                        className="w-4 h-4"
                      />
                      <Label>{day.label}</Label>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor={`start-${day.id}`}>Début</Label>
                      <Input
                        id={`start-${day.id}`}
                        type="time"
                        value={schedule.start_time}
                        onChange={(e) =>
                          updateSchedule(day.id, "start_time", e.target.value)
                        }
                        disabled={!schedule.is_active}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`end-${day.id}`}>Fin</Label>
                      <Input
                        id={`end-${day.id}`}
                        type="time"
                        value={schedule.end_time}
                        onChange={(e) =>
                          updateSchedule(day.id, "end_time", e.target.value)
                        }
                        disabled={!schedule.is_active}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            Enregistrer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
