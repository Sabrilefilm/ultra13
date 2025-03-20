import * as React from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, Plus } from "lucide-react";
import { format } from "date-fns";
import { fr } from 'date-fns/locale';
import { cn } from "@/lib/utils";
import { ScheduleMatchDialog } from "../matches/ScheduleMatchDialog";
import { Match } from "@/types/matches";
interface MatchCalendarProps {
  matches: Match[];
  role: string;
  isLoading: boolean;
  creatorId: string;
}
export const MatchCalendar = ({
  matches,
  isLoading,
  role,
  creatorId
}: MatchCalendarProps) => {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(new Date());
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const canScheduleMatch = ['agent', 'manager', 'founder'].includes(role);
  const shouldShowCalendar = ['agent', 'manager', 'founder', 'creator'].includes(role);
  if (!shouldShowCalendar) {
    return null;
  }
  const getMatchesForDate = (date: Date) => {
    if (!matches) return [];
    return matches.filter(match => {
      const matchDate = new Date(match.match_date);
      return matchDate.getDate() === date.getDate() && matchDate.getMonth() === date.getMonth() && matchDate.getFullYear() === date.getFullYear();
    });
  };
  const renderDay = (day: Date) => {
    const dayMatches = getMatchesForDate(day);
    const hasMatches = dayMatches && dayMatches.length > 0;
    return <div className="relative w-full h-full">
        <div className={cn("w-full h-full flex items-center justify-center rounded-md", hasMatches && "bg-purple-50 dark:bg-purple-950/30")}>
          <span className={cn("text-sm", hasMatches && "font-medium text-purple-900 dark:text-purple-300")}>
            {format(day, "d")}
          </span>
        </div>
        {hasMatches && <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 mb-1">
            <div className="w-1 h-1 rounded-full bg-purple-500"></div>
          </div>}
      </div>;
  };
  const selectedDateMatches = selectedDate ? getMatchesForDate(selectedDate) : [];
  return;
};