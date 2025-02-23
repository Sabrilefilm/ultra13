
import { Users, Diamond, Clock, Gift, Calendar } from "lucide-react";
import { StatsCard } from "@/components/StatsCard";

interface RoleStatsProps {
  role: string;
}

export const RoleStats = ({ role }: RoleStatsProps) => {
  if (role === 'client') {
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
  }

  if (role === 'creator') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Heures de Live"
          value="0h"
          icon={<Clock className="w-6 h-6 text-primary" />}
        />
        <StatsCard
          title="Jours Streamés"
          value="0j"
          icon={<Calendar className="w-6 h-6 text-primary" />}
        />
        <StatsCard
          title="Diamants Reçus"
          value="0"
          icon={<Diamond className="w-6 h-6 text-primary" />}
        />
      </div>
    );
  }

  if (role === 'manager') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Créateurs Actifs"
          value="0"
          icon={<Users className="w-6 h-6 text-primary" />}
        />
        <StatsCard
          title="Total des Gains"
          value="0 €"
          icon={<Gift className="w-6 h-6 text-primary" />}
        />
        <StatsCard
          title="Performance Moyenne"
          value="0%"
          icon={<Clock className="w-6 h-6 text-primary" />}
        />
      </div>
    );
  }

  return null;
};
