
import React, { useEffect, useState } from "react";
import { Users, Clock, Calendar, Diamond, Award } from "lucide-react";
import { StatsCard } from "@/components/StatsCard";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/lib/supabase";

interface AgentStatsProps {
  creatorStats?: {
    totalCreators: number;
    averageHours: number;
    averageDays: number;
    totalDiamonds: number;
    performanceScore: number;
  };
  userId?: string;
}

const AgentStats: React.FC<AgentStatsProps> = ({ 
  creatorStats = {
    totalCreators: 0,
    averageHours: 0,
    averageDays: 0,
    totalDiamonds: 0,
    performanceScore: 0
  },
  userId 
}) => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(creatorStats);
  
  useEffect(() => {
    const fetchAgentCreators = async () => {
      if (!userId) return;
      
      try {
        // Get all creators assigned to this agent
        const { data: creators, error } = await supabase
          .from("user_accounts")
          .select(`
            id, 
            username,
            live_schedules (hours, days),
            profiles (total_diamonds)
          `)
          .eq("role", "creator")
          .eq("agent_id", userId);
        
        if (error) {
          console.error("Error fetching creators:", error);
          return;
        }
        
        if (!creators || creators.length === 0) {
          return;
        }
        
        // Calculate statistics
        const totalCreators = creators.length;
        let totalHours = 0;
        let totalDays = 0;
        let totalDiamonds = 0;
        
        creators.forEach(creator => {
          const hours = creator.live_schedules?.[0]?.hours || 0;
          const days = creator.live_schedules?.[0]?.days || 0;
          const diamonds = creator.profiles?.[0]?.total_diamonds || 0;
          
          totalHours += hours;
          totalDays += days;
          totalDiamonds += diamonds;
        });
        
        const averageHours = totalCreators > 0 ? totalHours / totalCreators : 0;
        const averageDays = totalCreators > 0 ? totalDays / totalCreators : 0;
        
        // Calculate performance score (15 hours and 7 days are the targets)
        const hoursPercentage = Math.min(100, (averageHours / 15) * 100);
        const daysPercentage = Math.min(100, (averageDays / 7) * 100);
        const performanceScore = Math.round((hoursPercentage + daysPercentage) / 2);
        
        setStats({
          totalCreators,
          averageHours,
          averageDays,
          totalDiamonds,
          performanceScore
        });
        
      } catch (error) {
        console.error("Error in fetchAgentCreators:", error);
      }
    };
    
    fetchAgentCreators();
  }, [userId]);

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
          value={stats.totalCreators.toString()}
          icon={<Users className="w-6 h-6 text-primary" />}
        />
        <StatsCard
          title="Heures de Live / Mois"
          value={`${stats.averageHours.toFixed(1)}h / 15h`}
          icon={<Clock className="w-6 h-6 text-primary" />}
        />
        <StatsCard
          title="Jours Streamés / Mois"
          value={`${stats.averageDays.toFixed(1)}j / 7j`}
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
              <span className="font-medium">{stats.performanceScore}%</span>
            </div>
            <Progress value={stats.performanceScore} className="h-2" 
              indicatorClassName={getScoreColor(stats.performanceScore)} />
            
            <div className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-indigo-900/30 flex items-center justify-center">
                  <Diamond className="h-6 w-6 text-indigo-400" />
                </div>
                <div>
                  <div className="text-sm text-gray-400">Total Diamants</div>
                  <div className="text-xl font-semibold">{stats.totalDiamonds.toLocaleString()}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-purple-900/30 flex items-center justify-center">
                  <Users className="h-6 w-6 text-purple-400" />
                </div>
                <div>
                  <div className="text-sm text-gray-400">Créateurs performants</div>
                  <div className="text-xl font-semibold">{Math.round(stats.totalCreators * (stats.performanceScore / 100))} / {stats.totalCreators}</div>
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
