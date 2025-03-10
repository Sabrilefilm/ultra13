
import * as React from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, Plus } from "lucide-react";
import { format } from "date-fns";
import { fr } from 'date-fns/locale';
import { cn } from "@/lib/utils";
import { ScheduleMatchDialog } from "../matches/ScheduleMatchDialog";
import { DayContentProps } from "react-day-picker";

interface Match {
  id: string;
  creator_id: string;
  opponent_id: string;
  match_date: string;
  status: string;
  winner_id?: string;
}

interface MatchCalendarProps {
  matches: Match[];
  role: string;
  isLoading: boolean;
  creatorId: string;
}

export const MatchCalendar = ({ matches, isLoading, role, creatorId }: MatchCalendarProps) => {
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
      return (
        matchDate.getDate() === date.getDate() &&
        matchDate.getMonth() === date.getMonth() &&
        matchDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const renderDay = (day: Date) => {
    const dayMatches = getMatchesForDate(day);
    const hasMatches = dayMatches && dayMatches.length > 0;

    return (
      <div className="relative w-full h-full">
        <div className={cn(
          "w-full h-full flex items-center justify-center rounded-md",
          hasMatches && "bg-purple-50 dark:bg-purple-950/30"
        )}>
          <span className={cn(
            "text-sm",
            hasMatches && "font-medium text-purple-900 dark:text-purple-300"
          )}>
            {format(day, "d")}
          </span>
        </div>
        {hasMatches && (
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 mb-1">
            <div className="w-1 h-1 rounded-full bg-purple-500"></div>
          </div>
        )}
      </div>
    );
  };

  const selectedDateMatches = selectedDate ? getMatchesForDate(selectedDate) : [];

  return (
    <Card className="bg-white dark:bg-slate-950 border border-gray-200 dark:border-gray-800 shadow-md overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-4 space-y-0 bg-gradient-to-r from-purple-50 to-white dark:from-purple-950/30 dark:to-slate-950">
        <div className="flex items-center space-x-3">
          <CalendarDays className="h-6 w-6 text-purple-500" />
          <CardTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Calendrier des Matchs
          </CardTitle>
        </div>
        {canScheduleMatch && (
          <Button 
            onClick={() => setIsDialogOpen(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white transition-all duration-200 shadow-md hover:shadow-lg"
            size="sm"
          >
            <Plus className="w-4 h-4 mr-1" />
            Programmer un match
          </Button>
        )}
      </CardHeader>
      <CardContent className="p-5">
        <div className="grid gap-6 md:grid-cols-[1fr,300px]">
          <div className="bg-white dark:bg-slate-900 rounded-lg p-4 border border-gray-100 dark:border-gray-800 shadow-sm">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border-0 p-3 pointer-events-auto"
              locale={fr}
              components={{
                Day: ({ date, ...props }) => {
                  return (
                    <button
                      {...props}
                      className="h-9 w-9 p-0 font-normal aria-selected:opacity-100"
                    >
                      {renderDay(date)}
                    </button>
                  );
                },
              }}
            />
          </div>
          <div className="space-y-4 bg-white dark:bg-slate-900 rounded-lg p-4 border border-gray-100 dark:border-gray-800 shadow-sm">
            <h3 className="font-medium text-purple-700 dark:text-purple-400 flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-2">
              {selectedDate ? (
                `Matchs du ${format(selectedDate, "d MMMM yyyy", { locale: fr })}`
              ) : (
                "Sélectionnez une date"
              )}
            </h3>
            <div className="space-y-3 max-h-[400px] overflow-y-auto p-1">
              {isLoading ? (
                <div className="flex justify-center p-4">
                  <div className="animate-pulse h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              ) : selectedDateMatches.length === 0 ? (
                <div className="text-sm text-gray-500 dark:text-gray-400 p-4 border border-dashed border-gray-200 dark:border-gray-700 rounded-lg flex flex-col items-center justify-center">
                  <CalendarDays className="w-8 h-8 mb-2 text-purple-200 dark:text-purple-900" />
                  <p>Aucun match programmé pour cette date</p>
                </div>
              ) : (
                selectedDateMatches.map(match => (
                  <div
                    key={match.id}
                    className="p-4 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-900 hover:bg-purple-50 dark:hover:bg-purple-900/10 transition-colors duration-150 shadow-sm"
                  >
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {match.creator_id} vs {match.opponent_id}
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {format(new Date(match.match_date), "HH:mm")}
                      </div>
                      <div className={cn(
                        "text-xs font-medium px-2 py-1 rounded-full",
                        match.status === "scheduled" && "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
                        match.status === "completed" && "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
                        match.status === "cancelled" && "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                      )}>
                        {match.status === "scheduled" && "Programmé"}
                        {match.status === "completed" && "Terminé"}
                        {match.status === "cancelled" && "Annulé"}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </CardContent>
      {canScheduleMatch && (
        <ScheduleMatchDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          preselectedDate={selectedDate}
        />
      )}
    </Card>
  );
};
