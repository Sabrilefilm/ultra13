
import React from "react";
import { Button } from "@/components/ui/button";
import { useCreatorDashboardStats } from "@/hooks/use-creator-dashboard-stats";
import { StatsCardGrid } from "./components/StatsCardGrid";
import { UpdateNotice } from "./components/UpdateNotice";
import { ObjectiveWarning } from "./components/ObjectiveWarning";
import { PerformanceStats } from "./components/PerformanceStats";

interface CreatorStatsProps {
  userId?: string;
}

const CreatorStats: React.FC<CreatorStatsProps> = ({ userId }) => {
  const {
    liveSchedule,
    monthlyHours,
    requiredHours,
    requiredDays,
    hoursColor,
    daysColor,
    diamondsText,
    showWarning,
    navigate,
    totalDiamonds,
    performanceMetrics
  } = useCreatorDashboardStats(userId);
  
  return (
    <div className="space-y-6">
      <StatsCardGrid 
        monthlyHours={monthlyHours}
        requiredHours={requiredHours}
        daysStreamed={liveSchedule?.days || 0}
        requiredDays={requiredDays}
        diamondsText={diamondsText}
        hoursColor={hoursColor}
        daysColor={daysColor}
      />
      
      <PerformanceStats 
        performanceMetrics={performanceMetrics}
        totalDiamonds={totalDiamonds}
        requiredHours={requiredHours}
        requiredDays={requiredDays}
        currentHours={monthlyHours}
        currentDays={liveSchedule?.days || 0}
      />
      
      <UpdateNotice />
      
      <ObjectiveWarning 
        show={showWarning} 
        onContactClick={() => navigate('/messages')} 
      />
    </div>
  );
};

export default CreatorStats;
