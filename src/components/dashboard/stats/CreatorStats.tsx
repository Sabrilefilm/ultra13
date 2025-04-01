
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useCreatorDashboardStats } from "@/hooks/use-creator-dashboard-stats";
import { StatsCardGrid } from "./components/StatsCardGrid";
import { UpdateNotice } from "./components/UpdateNotice";
import { ObjectiveWarning } from "./components/ObjectiveWarning";
import { PerformanceStats } from "./components/PerformanceStats";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

interface CreatorStatsProps {
  userId?: string;
}

const CreatorStats: React.FC<CreatorStatsProps> = ({ userId }) => {
  const navigate = useNavigate();
  const [role, setRole] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchUserRole = async () => {
      if (userId) {
        const { data, error } = await supabase
          .from("user_accounts")
          .select("role")
          .eq("id", userId)
          .single();
          
        if (!error && data) {
          setRole(data.role);
        }
      }
    };
    
    fetchUserRole();
  }, [userId]);
  
  const {
    liveSchedule,
    monthlyHours,
    requiredHours,
    requiredDays,
    hoursColor,
    daysColor,
    diamondsText,
    showWarning,
    navigate: statsNavigate,
    totalDiamonds,
    performanceMetrics
  } = useCreatorDashboardStats(userId);
  
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/')}
          className="h-10 w-10"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h2 className="text-2xl font-bold">Statistiques du Créateur</h2>
      </div>
      
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
      
      {role !== "agent" && (
        <ObjectiveWarning 
          show={showWarning} 
          onContactClick={() => navigate('/messages')} 
        />
      )}
      
      {role === "agent" && (
        <div className="flex justify-end mt-4">
          <Button onClick={() => navigate('/creator-stats')} className="bg-blue-600 hover:bg-blue-700">
            Voir tous mes créateurs
          </Button>
        </div>
      )}
    </div>
  );
};

export default CreatorStats;
