
import React from "react";
import { Clock, Calendar, Diamond } from "lucide-react";
import { StatsCard } from "@/components/StatsCard";

interface StatsCardGridProps {
  monthlyHours: number;
  requiredHours: number;
  daysStreamed: number;
  requiredDays: number;
  diamondsText: string;
  hoursColor: string;
  daysColor: string;
}

export const StatsCardGrid: React.FC<StatsCardGridProps> = ({
  monthlyHours,
  requiredHours,
  daysStreamed,
  requiredDays,
  diamondsText,
  hoursColor,
  daysColor
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatsCard
        title="Heures de Live / Mois"
        value={`${monthlyHours}h / ${requiredHours}h`}
        icon={<Clock className={`w-6 h-6 ${hoursColor}`} />}
      />
      <StatsCard
        title="Jours Streamés / Mois"
        value={`${daysStreamed}j / ${requiredDays}j`}
        icon={<Calendar className={`w-6 h-6 ${daysColor}`} />}
      />
      <StatsCard
        title="Diamants Reçus"
        value={diamondsText}
        icon={<Diamond className="w-6 h-6 text-primary" />}
      />
    </div>
  );
};
