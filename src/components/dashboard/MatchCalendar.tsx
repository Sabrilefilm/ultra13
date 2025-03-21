
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
    if (!matches || !date) return [];
    
    return matches.filter(match => {
      if (!match.match_date) return false;
      
      const matchDate = new Date(match.match_date);
      return matchDate.getDate() === date.getDate() && 
             matchDate.getMonth() === date.getMonth() && 
             matchDate.getFullYear() === date.getFullYear();
    });
  };
  
  const renderCalendarDay = (date: Date) => {
    if (!date) return null;
    
    const dayMatches = getMatchesForDate(date);
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
            {format(date, "d")}
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
    <Card className="bg-slate-800/90 backdrop-blur-sm border border-purple-800/30 rounded-xl overflow-hidden shadow-md">
      <CardHeader className="bg-gradient-to-r from-purple-900/20 to-indigo-900/20 flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-base font-medium text-white flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-purple-400" />
          Calendrier des matchs
        </CardTitle>
        
        {canScheduleMatch && (
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => setIsDialogOpen(true)}
            className="h-8 px-2 text-xs border border-purple-700/50 bg-purple-800/30 hover:bg-purple-700/50 text-purple-300"
          >
            <Plus className="h-3.5 w-3.5 mr-1" />
            Match
          </Button>
        )}
      </CardHeader>
      
      <CardContent className="p-3">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          locale={fr}
          className="rounded-md border-slate-700 text-white"
          components={{
            Day: ({ date, ...props }: any) => (
              <button {...props}>
                {renderCalendarDay(date)}
              </button>
            )
          }}
        />
        
        {selectedDate && selectedDateMatches.length > 0 && (
          <div className="mt-4 space-y-2">
            <h4 className="text-sm font-medium text-white">
              Matchs du {format(selectedDate, "d MMMM yyyy", { locale: fr })}
            </h4>
            <div className="space-y-2">
              {selectedDateMatches.map((match) => (
                <div 
                  key={match.id}
                  className="p-2 bg-purple-900/20 rounded-md border border-purple-800/30 text-xs text-slate-300"
                >
                  <div className="font-medium">{match.creator1_name} vs {match.creator2_name}</div>
                  <div className="text-purple-400 text-xs mt-1">
                    {format(new Date(match.match_date), "HH:mm", { locale: fr })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      
      <ScheduleMatchDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        preselectedDate={selectedDate}
      />
    </Card>
  );
};
