
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Clock3, Calendar, AlertTriangle, TrendingUp } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface LiveStatisticsProps {
  hoursProgress: number;
  daysProgress: number;
  creatorData: any;
  targetHours: number;
  targetDays: number;
}

export const LiveStatistics = ({ 
  hoursProgress, 
  daysProgress, 
  creatorData, 
  targetHours, 
  targetDays 
}: LiveStatisticsProps) => {
  return (
    <Card className="col-span-1 md:col-span-2 bg-slate-800/40 border-slate-700/50 backdrop-blur-sm">
      <CardHeader className="border-b border-slate-700/50">
        <CardTitle className="text-xl flex items-center text-white">
          <TrendingUp className="mr-2 h-5 w-5 text-indigo-400" />
          Statistiques de LIVE
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Clock3 className="h-5 w-5 mr-2 text-blue-400" />
                <span className="text-white">Heures de LIVE</span>
              </div>
              <Badge variant="outline" className="bg-blue-500/10 text-blue-300 border-blue-500/30">
                {creatorData.schedule?.hours || 0}h / {targetHours}h
              </Badge>
            </div>
            <Progress value={hoursProgress} className="h-2 bg-slate-700" />
            
            {hoursProgress < 75 && (
              <Alert variant="warning" className="mt-2 py-2">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  Vous n'avez pas encore atteint votre quota d'heures de live
                </AlertDescription>
              </Alert>
            )}
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-emerald-400" />
                <span className="text-white">Jours streamés</span>
              </div>
              <Badge variant="outline" className="bg-emerald-500/10 text-emerald-300 border-emerald-500/30">
                {creatorData.schedule?.days || 0}j / {targetDays}j
              </Badge>
            </div>
            <Progress value={daysProgress} className="h-2 bg-slate-700" />
            
            {daysProgress < 75 && (
              <Alert variant="warning" className="mt-2 py-2">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  Augmentez votre nombre de jours de live pour débloquer plus de récompenses
                </AlertDescription>
              </Alert>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LiveStatistics;
