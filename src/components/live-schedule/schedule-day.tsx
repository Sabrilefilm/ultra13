
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Schedule } from "./types";

interface ScheduleDayProps {
  day: { id: string; label: string };
  schedule: Schedule;
  onUpdate: (
    dayId: string,
    field: "start_time" | "end_time" | "is_active",
    value: string | boolean
  ) => void;
}

export const ScheduleDay = ({ day, schedule, onUpdate }: ScheduleDayProps) => {
  return (
    <div className="grid grid-cols-[120px_1fr_1fr] gap-4 items-center">
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={schedule.is_active}
          onChange={(e) => onUpdate(day.id, "is_active", e.target.checked)}
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
          onChange={(e) => onUpdate(day.id, "start_time", e.target.value)}
          disabled={!schedule.is_active}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor={`end-${day.id}`}>Fin</Label>
        <Input
          id={`end-${day.id}`}
          type="time"
          value={schedule.end_time}
          onChange={(e) => onUpdate(day.id, "end_time", e.target.value)}
          disabled={!schedule.is_active}
        />
      </div>
    </div>
  );
};
