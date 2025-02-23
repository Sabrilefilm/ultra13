
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DAYS_OF_WEEK } from "./constants";
import { LiveScheduleModalProps } from "./types";
import { useLiveSchedule } from "./use-live-schedule";
import { ScheduleDay } from "./schedule-day";

export const LiveScheduleModal = ({
  isOpen,
  onClose,
  creatorId,
}: LiveScheduleModalProps) => {
  const { schedules, loading, updateSchedule, handleSave } = useLiveSchedule(
    isOpen,
    creatorId
  );

  const onSave = async () => {
    const success = await handleSave();
    if (success) {
      onClose();
    }
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
                  <ScheduleDay
                    key={day.id}
                    day={day}
                    schedule={schedule}
                    onUpdate={updateSchedule}
                  />
                );
              })}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button onClick={onSave} disabled={loading}>
            Enregistrer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
