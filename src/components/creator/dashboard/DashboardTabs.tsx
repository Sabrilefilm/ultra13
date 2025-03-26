
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Trophy } from "lucide-react";
import { CreatorSchedule } from "./CreatorSchedule";
import { RewardsTab } from "./RewardsTab";

interface DashboardTabsProps {
  creatorData: any;
  isLoading: boolean;
  weeklyHours: number;
  targetHours: number;
  targetDays: number;
  totalDiamonds: number;
}

export const DashboardTabs = ({
  creatorData,
  isLoading,
  weeklyHours,
  targetHours,
  targetDays,
  totalDiamonds
}: DashboardTabsProps) => {
  return (
    <Tabs defaultValue="schedule" className="w-full">
      <TabsList className="bg-slate-800/40 border border-slate-700/50 w-full mb-4">
        <TabsTrigger value="schedule" className="flex-1">
          <Calendar className="h-4 w-4 mr-2" /> Planning
        </TabsTrigger>
        <TabsTrigger value="rewards" className="flex-1">
          <Trophy className="h-4 w-4 mr-2" /> Récompenses
        </TabsTrigger>
      </TabsList>
      <TabsContent value="schedule">
        <CreatorSchedule 
          isLoading={isLoading}
          hours={creatorData.schedule?.hours || 0}
          days={creatorData.schedule?.days || 0}
          weeklyHours={weeklyHours}
          targetHours={targetHours}
          targetDays={targetDays}
        />
      </TabsContent>
      <TabsContent value="rewards">
        <RewardsTab totalDiamonds={totalDiamonds} />
      </TabsContent>
    </Tabs>
  );
};

export default DashboardTabs;
