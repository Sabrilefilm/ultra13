
import React from "react";
import { Clock, Calendar, Diamond } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface StatsSummaryCardsProps {
  totalHours: number;
  totalDays: number;
  totalDiamonds: number;
  diamondValue?: number;
}

export const StatsSummaryCards: React.FC<StatsSummaryCardsProps> = ({
  totalHours,
  totalDays,
  totalDiamonds,
  diamondValue
}) => {
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
          <p className="text-3xl font-bold">{totalHours}h</p>
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
          <p className="text-3xl font-bold">{totalDays}j</p>
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
          <p className="text-3xl font-bold">{totalDiamonds.toLocaleString()}</p>
          {diamondValue && (
            <p className="text-sm text-muted-foreground">
              Valeur: {((totalDiamonds * diamondValue) || 0).toLocaleString()}€
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
