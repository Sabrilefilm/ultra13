
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Schedule } from "./types";
import { User } from "lucide-react";

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
  schedule, 
  onUpdate, 
  creatorName 
}: ScheduleDayProps) => {
  return (
    <div className="p-4 border rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <Label className="text-lg font-semibold">Horaires de Live</Label>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <User className="w-4 h-4" />
          {creatorName}
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="hours">Nombre d'heures par jour</Label>
          <Input
            id="hours"
            type="number"
            min="0"
            max="24"
            step="0.5"
            value={schedule.hours || "0"}
            onChange={(e) => onUpdate(schedule.id, "hours", e.target.value)}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="days">Nombre de jours</Label>
          <Input
            id="days"
            type="number"
            min="0"
            max="7"
            value={schedule.days || "0"}
            onChange={(e) => onUpdate(schedule.id, "days", e.target.value)}
            className="w-full"
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-4">
        <Button variant="outline" size="sm">
          {schedule.hours || "0"}H
        </Button>
        <Button variant="outline" size="sm">
          {schedule.days || "0"}J
        </Button>
      </div>
    </div>
  );
};
