
import React from "react";
import { Users, Diamond, Clock } from "lucide-react";
import { StatsCard } from "@/components/StatsCard";

const ClientStats: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatsCard
        title="Vos Créateurs Suivis"
        value="0"
        icon={<Users className="w-6 h-6 text-primary" />}
      />
      <StatsCard
        title="Diamants Envoyés"
        value="0"
        icon={<Diamond className="w-6 h-6 text-primary" />}
      />
      <StatsCard
        title="Temps de Visionnage"
        value="0h"
        icon={<Clock className="w-6 h-6 text-primary" />}
      />
    </div>
  );
};

export default ClientStats;
