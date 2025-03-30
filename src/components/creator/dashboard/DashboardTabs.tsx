
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Trophy, Users } from "lucide-react";
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
        <TabsTrigger value="parrainages" className="flex-1">
          <Users className="h-4 w-4 mr-2" /> Parrainages
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
      <TabsContent value="parrainages">
        <div className="p-4 bg-indigo-900/20 border border-indigo-700/30 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-indigo-300 flex items-center gap-2">
              <Users className="h-4 w-4" />
              Vos parrainages 👥
            </h4>
            <div className="px-2 py-1 bg-indigo-800/30 border border-indigo-700/30 rounded-md text-xs text-indigo-300">
              {creatorData.sponsorships?.length || 0} parrainé(s)
            </div>
          </div>
          
          {creatorData.sponsorships && creatorData.sponsorships.length > 0 ? (
            <div className="space-y-2">
              {creatorData.sponsorships.map((sponsorship: any, index: number) => (
                <div key={index} className="bg-indigo-800/20 border border-indigo-700/20 rounded-md p-2 flex justify-between">
                  <span className="text-indigo-300">{sponsorship.username || 'Créateur'}</span>
                  <span className="text-indigo-300 font-semibold">{sponsorship.status || 'Actif'}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-indigo-800/10 border border-indigo-700/20 rounded-md p-4 text-center">
              <p className="text-indigo-300">Vous n'avez pas encore de parrainages.</p>
              <p className="text-xs text-indigo-400/70 mt-1">Parrainez d'autres créateurs pour gagner des récompenses !</p>
            </div>
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default DashboardTabs;
