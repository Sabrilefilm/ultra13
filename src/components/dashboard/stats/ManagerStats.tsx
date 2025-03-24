
import React from "react";
import { Users, Gift, Clock } from "lucide-react";
import { StatsCard } from "@/components/StatsCard";
import { useMonthProgress } from "@/hooks/use-month-progress";

const ManagerStats: React.FC = () => {
  const { monthProgress } = useMonthProgress();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
      <StatsCard
        title="Créateurs Actifs"
        value="0"
        icon={<Users className="w-6 h-6 text-primary" />}
      />
      <StatsCard
        title="Total des Gains"
        value="0 Diamants"
        icon={<Gift className="w-6 h-6 text-primary" />}
      />
      <StatsCard
        title="Performance Moyenne"
        value={`${monthProgress}%`}
        icon={<Clock className="w-6 h-6 text-primary" />}
      />
    </div>
  );
};

export default ManagerStats;
