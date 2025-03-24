
import React from "react";
import { Users, Clock, Calendar } from "lucide-react";
import { StatsCard } from "@/components/StatsCard";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const AgentStats: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Créateurs Assignés"
          value="0"
          icon={<Users className="w-6 h-6 text-primary" />}
        />
        <StatsCard
          title="Heures de Live / Mois"
          value="0h / 15h"
          icon={<Clock className="w-6 h-6 text-primary" />}
        />
        <StatsCard
          title="Jours Streamés / Mois"
          value="0j / 7j"
          icon={<Calendar className="w-6 h-6 text-primary" />}
        />
      </div>
      <div className="flex justify-end">
        <Button 
          onClick={() => navigate("/creator-stats")} 
          className="flex items-center gap-2"
        >
          <Users className="h-4 w-4" />
          Mes créateurs
        </Button>
      </div>
    </div>
  );
};

export default AgentStats;
