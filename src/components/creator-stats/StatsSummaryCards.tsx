
import React from "react";
import { Clock, Calendar, Diamond } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Creator } from "@/hooks/creator-stats/types";

interface StatsSummaryCardsProps {
  creators: Creator[];
}

export const StatsSummaryCards: React.FC<StatsSummaryCardsProps> = ({
  creators,
}) => {
  // Calculate totals from creators array
  const totalHours = creators.reduce((sum, creator) => {
    return sum + (creator.live_schedules?.[0]?.hours || 0);
  }, 0);
  
  const totalDays = creators.reduce((sum, creator) => {
    return sum + (creator.live_schedules?.[0]?.days || 0);
  }, 0);
  
  const totalDiamonds = creators.reduce((sum, creator) => {
    return sum + (creator.profiles?.[0]?.total_diamonds || creator.diamonds || 0);
  }, 0);

  // Format number to one decimal place, remove trailing zeros
  const formatNumber = (value: number): string => {
    return Number(value.toFixed(1)).toString();
  };

  // Format diamonds to integer with thousands separators
  const formatDiamonds = (value: number): string => {
    return Math.floor(value).toLocaleString('fr-FR');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Total heures de live ⏰
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{formatNumber(totalHours)}h</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Total jours streamés 📅
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{formatNumber(totalDays)}j</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Diamond className="h-5 w-5 text-purple-500" />
            Total diamants 💎
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{formatDiamonds(totalDiamonds)}</p>
        </CardContent>
      </Card>
    </div>
  );
};
