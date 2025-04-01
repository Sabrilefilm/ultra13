
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Trophy, Users, Diamond, Clock } from "lucide-react";
import { CreatorSchedule } from "./CreatorSchedule";
import { RewardsTab } from "./RewardsTab";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

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
        <TabsTrigger value="statistiques" className="flex-1">
          <Diamond className="h-4 w-4 mr-2" /> Statistiques
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
      <TabsContent value="statistiques">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-slate-800/40 border-slate-700/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-blue-600/20 rounded-full">
                  <Diamond className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <div className="text-xl font-bold text-white">Diamants</div>
                  <div className="text-sm text-slate-300">Total accumulé</div>
                </div>
                <div className="ml-auto text-2xl font-bold text-blue-400">
                  {totalDiamonds.toLocaleString()}
                </div>
              </div>
              <Progress value={Math.min(100, (totalDiamonds / 50000) * 100)} className="h-2 bg-slate-700" />
              <div className="mt-2 text-xs text-slate-400 text-right">
                {Math.round((totalDiamonds / 50000) * 100)}% de l'objectif
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/40 border-slate-700/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-green-600/20 rounded-full">
                  <Clock className="h-6 w-6 text-green-400" />
                </div>
                <div>
                  <div className="text-xl font-bold text-white">Heures de Live</div>
                  <div className="text-sm text-slate-300">Ce mois-ci</div>
                </div>
                <div className="ml-auto text-2xl font-bold text-green-400">
                  {weeklyHours}h
                </div>
              </div>
              <Progress value={Math.min(100, (weeklyHours / targetHours) * 100)} className="h-2 bg-slate-700" />
              <div className="mt-2 text-xs text-slate-400 text-right">
                {Math.round((weeklyHours / targetHours) * 100)}% de l'objectif ({targetHours}h)
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/40 border-slate-700/50 backdrop-blur-sm md:col-span-2">
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-purple-600/20 rounded-full">
                  <Calendar className="h-6 w-6 text-purple-400" />
                </div>
                <div>
                  <div className="text-xl font-bold text-white">Jours de Stream</div>
                  <div className="text-sm text-slate-300">Ce mois-ci</div>
                </div>
                <div className="ml-auto text-2xl font-bold text-purple-400">
                  {creatorData.schedule?.days || 0} / {targetDays}
                </div>
              </div>
              <Progress 
                value={Math.min(100, ((creatorData.schedule?.days || 0) / targetDays) * 100)} 
                className="h-2 bg-slate-700" 
              />
              <div className="mt-2 text-xs text-slate-400 text-right">
                {Math.round(((creatorData.schedule?.days || 0) / targetDays) * 100)}% de l'objectif
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default DashboardTabs;
