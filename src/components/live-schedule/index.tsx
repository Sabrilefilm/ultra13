
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LiveScheduleModalProps } from "./types";
import { useLiveSchedule } from "./use-live-schedule";
import { ScheduleDay } from "./schedule-day";
import { CreatorSelect } from "./creator-select";

export const LiveScheduleModal = ({
  isOpen,
  onClose,
  creatorId: initialCreatorId,
}: LiveScheduleModalProps) => {
  const [selectedCreator, setSelectedCreator] = useState(initialCreatorId);
  
  const { 
    schedules, 
    loading, 
    updateSchedule, 
    handleSave,
    resetSchedule,
    creatorName,
  } = useLiveSchedule(isOpen, selectedCreator);

  const onSave = async () => {
    const success = await handleSave();
    if (success) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Configuration des Horaires de Live</DialogTitle>
          <DialogDescription>
            Configurez vos horaires de live
          </DialogDescription>
        </DialogHeader>

        <div className="mb-4">
          <CreatorSelect 
            value={selectedCreator} 
            onSelect={setSelectedCreator} 
          />
        </div>

        <div className="space-y-6 py-4">
          {loading ? (
            <div className="flex items-center justify-center p-4">
              <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" />
            </div>
          ) : (
            <div className="space-y-4">
              {schedules.map((schedule) => (
                <ScheduleDay
                  key={schedule.id}
                  schedule={schedule}
                  onUpdate={updateSchedule}
                  creatorName={creatorName}
                  onReset={resetSchedule}
                />
              ))}
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
