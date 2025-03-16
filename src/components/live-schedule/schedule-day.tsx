
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Schedule } from "./types";
import { User, Clock, Calendar } from "lucide-react";

interface ScheduleDayProps {
  schedule: Schedule;
  onUpdate: (
    scheduleId: string,
    field: "hours" | "days" | "is_active",
    value: string | boolean
  ) => void;
  creatorName: string;
}

export const ScheduleDay = ({ 
  schedule, 
  onUpdate, 
  creatorName 
}: ScheduleDayProps) => {
  // Calculate total hours per week
  const totalHours = schedule.hours * schedule.days;
  
  return (
    <div className="p-6 border rounded-lg bg-white dark:bg-slate-900 shadow-sm transition-all duration-200 hover:shadow-md">
      <div className="flex items-center justify-between mb-4">
        <Label className="text-lg font-semibold text-slate-900 dark:text-white">Horaires de Live</Label>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2 border-purple-200 dark:border-purple-800"
        >
          <User className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          {creatorName}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <Label htmlFor="hours" className="text-gray-700 dark:text-gray-300">Nombre d'heures par jour</Label>
          <div className="relative">
            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-gray-400" />
            <Input
              id="hours"
              type="number"
              min="0"
              max="24"
              step="0.5"
              value={schedule.hours}
              onChange={(e) => onUpdate(schedule.id, "hours", e.target.value)}
              className="pl-10 bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-gray-700"
            />
          </div>
        </div>

        <div className="space-y-3">
          <Label htmlFor="days" className="text-gray-700 dark:text-gray-300">Nombre de jours par semaine</Label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-gray-400" />
            <Input
              id="days"
              type="number"
              min="0"
              max="7"
              value={schedule.days}
              onChange={(e) => onUpdate(schedule.id, "days", e.target.value)}
              className="pl-10 bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-gray-700"
            />
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800/30">
        <div className="flex justify-between items-center">
          <div>
            <h4 className="font-medium text-purple-800 dark:text-purple-300">Récapitulatif</h4>
            <p className="text-sm text-purple-600 dark:text-purple-400 mt-1">
              {schedule.hours} heures par jour × {schedule.days} jours par semaine
            </p>
          </div>
          
          <div className="text-right">
            <span className="text-2xl font-bold text-purple-700 dark:text-purple-300">
              {totalHours}h
            </span>
            <p className="text-xs text-purple-600 dark:text-purple-400">total par semaine</p>
          </div>
        </div>
      </div>
    </div>
  );
};
