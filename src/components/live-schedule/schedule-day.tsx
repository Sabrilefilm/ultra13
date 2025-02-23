
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Schedule } from "./types";
import { Clock, Calendar, User } from "lucide-react";

interface ScheduleDayProps {
  day: { id: string; label: string };
  schedule: Schedule;
  onUpdate: (
    dayId: string,
    field: "start_time" | "end_time" | "is_active",
    value: string | boolean
  ) => void;
  totalDays: number;
  totalHours: number;
  creatorName: string;
}

export const ScheduleDay = ({ 
  day, 
  schedule, 
  onUpdate, 
  totalDays, 
  totalHours,
  creatorName 
}: ScheduleDayProps) => {
  // Calculer les heures pour ce créneau
  const getHoursForSlot = () => {
    if (!schedule.is_active) return 0;
    const start = new Date(`2000-01-01 ${schedule.start_time}`);
    const end = new Date(`2000-01-01 ${schedule.end_time}`);
    const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    // Arrondir à 1 décimale
    return Math.round(hours * 10) / 10;
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={schedule.is_active}
            onChange={(e) => onUpdate(day.id, "is_active", e.target.checked)}
            className="w-4 h-4"
          />
          <Label>{day.label}</Label>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            {getHoursForSlot()}H
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            {totalDays}J
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <User className="w-4 h-4" />
            {creatorName}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
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
    </div>
  );
};
