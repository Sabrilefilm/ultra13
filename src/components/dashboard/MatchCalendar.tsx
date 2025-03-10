
import * as React from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
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

export const MatchCalendar = ({ matches, role, isLoading, creatorId }: MatchCalendarProps) => {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(new Date());
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  
  const canScheduleMatch = ['agent', 'manager', 'founder'].includes(role);

  // Function to get matches for a specific date
  const getMatchesForDate = (date: Date) => {
    return matches?.filter(match => {
      const matchDate = new Date(match.match_date);
      return (
        matchDate.getDate() === date.getDate() &&
        matchDate.getMonth() === date.getMonth() &&
        matchDate.getFullYear() === date.getFullYear()
      );
    });
  };

  // Custom day render to show matches
  const renderDay = (day: Date, props: DayContentProps) => {
    const dayMatches = getMatchesForDate(day);
    const hasMatches = dayMatches.length > 0;

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

  // Display matches for selected date
  const selectedDateMatches = selectedDate ? getMatchesForDate(selectedDate) : [];

  return (
    <Card className="bg-white dark:bg-slate-950 border-gray-200 dark:border-gray-800">
      <CardHeader className="flex flex-row items-center justify-between pb-4 space-y-0">
        <CardTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Calendrier des Matchs
        </CardTitle>
        {canScheduleMatch && (
          <Button 
            onClick={() => setIsDialogOpen(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            <Plus className="w-4 h-4 mr-1" />
            Programmer un match
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-[1fr,300px]">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-md border p-3 pointer-events-auto"
            locale={fr}
            components={{
              Day: ({ date, ...dayProps }: DayContentProps) => (
                <button
                  {...dayProps}
                  className={cn(
                    dayProps.className,
                    "h-9 w-9 p-0 font-normal aria-selected:opacity-100"
                  )}
                >
                  {renderDay(date, dayProps)}
                </button>
              ),
            }}
          />
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900 dark:text-gray-100">
              {selectedDate ? (
                `Matchs du ${format(selectedDate, "d MMMM yyyy", { locale: fr })}`
              ) : (
                "Sélectionnez une date"
              )}
            </h3>
            <div className="space-y-2">
              {selectedDateMatches.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Aucun match programmé pour cette date
                </p>
              ) : (
                selectedDateMatches.map(match => (
                  <div
                    key={match.id}
                    className="p-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-900"
                  >
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {match.creator_id} vs {match.opponent_id}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {format(new Date(match.match_date), "HH:mm")}
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
