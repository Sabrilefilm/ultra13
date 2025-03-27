
import React from "react";
import { Users, Clock, Calendar, Diamond, Award } from "lucide-react";
import { StatsCard } from "@/components/StatsCard";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface AgentStatsProps {
  creatorStats?: {
    totalCreators: number;
    averageHours: number;
    averageDays: number;
    totalDiamonds: number;
    performanceScore: number;
  };
}

const AgentStats: React.FC<AgentStatsProps> = ({ creatorStats = {
  totalCreators: 0,
  averageHours: 0,
  averageDays: 0,
  totalDiamonds: 0,
  performanceScore: 0
}}) => {
  const navigate = useNavigate();

  const getScoreColor = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-yellow-500";
    if (score >= 40) return "bg-orange-500";
    return "bg-red-500";
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Créateurs Assignés"
          value={creatorStats.totalCreators.toString()}
          icon={<Users className="w-6 h-6 text-primary" />}
        />
        <StatsCard
          title="Heures de Live / Mois"
          value={`${creatorStats.averageHours.toFixed(1)}h / 15h`}
          icon={<Clock className="w-6 h-6 text-primary" />}
        />
        <StatsCard
          title="Jours Streamés / Mois"
          value={`${creatorStats.averageDays.toFixed(1)}j / 7j`}
          icon={<Calendar className="w-6 h-6 text-primary" />}
        />
      </div>

      <Card className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 border border-slate-700/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            Performance globale de l'équipe
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Score de performance</span>
              <span className="font-medium">{creatorStats.performanceScore}%</span>
            </div>
            <Progress value={creatorStats.performanceScore} className="h-2" 
              indicatorClassName={getScoreColor(creatorStats.performanceScore)} />
            
            <div className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-indigo-900/30 flex items-center justify-center">
                  <Diamond className="h-6 w-6 text-indigo-400" />
                </div>
                <div>
                  <div className="text-sm text-gray-400">Total Diamants</div>
                  <div className="text-xl font-semibold">{creatorStats.totalDiamonds.toLocaleString()}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-purple-900/30 flex items-center justify-center">
                  <Users className="h-6 w-6 text-purple-400" />
                </div>
                <div>
                  <div className="text-sm text-gray-400">Créateurs performants</div>
                  <div className="text-xl font-semibold">{Math.round(creatorStats.totalCreators * (creatorStats.performanceScore / 100))} / {creatorStats.totalCreators}</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-end">
        <Button 
          onClick={() => navigate("/creator-stats")} 
          className="flex items-center gap-2"
        >
          <Users className="h-4 w-4" />
          Détails des créateurs
        </Button>
      </div>
    </div>
  );
};

export default AgentStats;
