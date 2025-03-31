
import React from "react";
import { Creator } from "@/hooks/creator-stats/types";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, CalendarDays, Diamond } from "lucide-react";

interface StatsSummaryCardsProps {
  creators: Creator[];
  totalHours?: number; // For compatibility
  totalDays?: number; // For compatibility
  totalDiamonds?: number; // For compatibility
}

export const StatsSummaryCards: React.FC<StatsSummaryCardsProps> = ({ 
  creators,
  totalHours,
  totalDays,
  totalDiamonds 
}) => {
  // Calculate totals if not provided
  const calculatedTotalHours = totalHours !== undefined 
    ? totalHours 
    : creators.reduce((sum, creator) => sum + (creator.live_schedules?.[0]?.hours || 0), 0);
  
  const calculatedTotalDays = totalDays !== undefined 
    ? totalDays 
    : creators.reduce((sum, creator) => sum + (creator.live_schedules?.[0]?.days || 0), 0);
  
  const calculatedTotalDiamonds = totalDiamonds !== undefined 
    ? totalDiamonds 
    : creators.reduce((sum, creator) => sum + (creator.profiles?.[0]?.total_diamonds || 0), 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardContent className="p-4 flex items-center space-x-4">
          <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
            <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Heures totales</p>
            <h3 className="text-2xl font-bold">{calculatedTotalHours}h</h3>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4 flex items-center space-x-4">
          <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
            <CalendarDays className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Jours streamés</p>
            <h3 className="text-2xl font-bold">{calculatedTotalDays}j</h3>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4 flex items-center space-x-4">
          <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
            <Diamond className="h-6 w-6 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Diamants totaux</p>
            <h3 className="text-2xl font-bold">{calculatedTotalDiamonds.toLocaleString()} 💎</h3>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
