
import React from "react";
import { Schedule } from "./types";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { HOURS_OPTIONS, DAYS_OPTIONS } from "./constants";

interface ScheduleDayProps {
  schedule: Schedule;
  onUpdate: (id: string, field: "hours" | "days" | "is_active", value: string | boolean) => void;
  creatorName?: string;
  disabled?: boolean;
}

export const ScheduleDay = ({ 
  schedule, 
  onUpdate, 
  creatorName,
  disabled = false
}: ScheduleDayProps) => {
  // Format number to one decimal place, remove trailing zeros
  const formatNumber = (value: number): string => {
    return Number(value.toFixed(1)).toString();
  };

  // Labels for the sliders
  const getHoursLabel = (value: number) => {
    return `${formatNumber(value)} heures/jour`;
  };

  const getDaysLabel = (value: number) => {
    return `${formatNumber(value)} jours/semaine`;
  };

  // Get percentage of required weekly hours
  const getRequiredPercentage = () => {
    const totalHours = schedule.hours * schedule.days;
    const requiredHours = 15; // 7 days * 2 hours per day
    return Math.min((totalHours / requiredHours) * 100, 100);
  };

  // Get color based on percentage
  const getPercentageColor = (percentage: number) => {
    if (percentage >= 100) return "text-green-500";
    if (percentage >= 70) return "text-yellow-500";
    return "text-red-500";
  };

  const percentage = getRequiredPercentage();
  const colorClass = getPercentageColor(percentage);

  // Calculate weekly hours with correct formatting
  const weeklyHours = Number((schedule.hours * schedule.days).toFixed(1));

  return (
    <div className={cn(
      "border rounded-md p-4 space-y-4",
      disabled 
        ? "border-gray-200 dark:border-gray-700" 
        : "border-blue-200 dark:border-blue-800",
      schedule.is_active 
        ? "bg-white dark:bg-slate-900" 
        : "bg-gray-50 dark:bg-slate-900/50"
    )}>
      <div className="flex justify-between items-center">
        <div>
          <h3 className={cn(
            "text-lg font-medium",
            schedule.is_active 
              ? "text-blue-600 dark:text-blue-400" 
              : "text-gray-500 dark:text-gray-400"
          )}>
            {creatorName || schedule.creator_name || "Horaires de Live"}
          </h3>
          <div className="flex items-center mt-1">
            <span className={cn(
              "text-sm font-medium",
              colorClass
            )}>
              {weeklyHours} heures/semaine
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
              ({Math.round(percentage)}% de l'objectif)
            </span>
          </div>
        </div>
        <div className="flex items-center">
          <Label htmlFor={`active-${schedule.id}`} className="mr-2 text-sm text-gray-500 dark:text-gray-400">
            {schedule.is_active ? "Actif" : "Inactif"}
          </Label>
          <Switch
            id={`active-${schedule.id}`}
            checked={schedule.is_active}
            onCheckedChange={(checked) => onUpdate(schedule.id, "is_active", checked)}
            disabled={disabled}
          />
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label>Heures par jour</Label>
            <span className="text-sm font-medium">{getHoursLabel(schedule.hours)}</span>
          </div>
          <Slider
            defaultValue={[schedule.hours]}
            min={0}
            max={12}
            step={1}
            onValueChange={(value) => onUpdate(schedule.id, "hours", value[0].toString())}
            disabled={disabled || !schedule.is_active}
          />
          <div className="flex justify-between text-xs text-gray-500">
            {HOURS_OPTIONS.map((hour) => (
              <span key={hour}>{hour}h</span>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <Label>Jours par semaine</Label>
            <span className="text-sm font-medium">{getDaysLabel(schedule.days)}</span>
          </div>
          <Slider
            defaultValue={[schedule.days]}
            min={0}
            max={7}
            step={1}
            onValueChange={(value) => onUpdate(schedule.id, "days", value[0].toString())}
            disabled={disabled || !schedule.is_active}
          />
          <div className="flex justify-between text-xs text-gray-500">
            {DAYS_OPTIONS.map((day) => (
              <span key={day}>{day}j</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
