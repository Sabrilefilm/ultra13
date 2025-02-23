
import { award, clock } from "lucide-react";
import { ProfileHeader } from "@/components/ProfileHeader";
import { StatsCard } from "@/components/StatsCard";
import { LiveDashboard } from "@/components/LiveDashboard";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/10 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        <ProfileHeader username="Sabri" handle="@Sabri_amd" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <StatsCard
            title="Total des Récompenses"
            value="0€"
            icon={<award className="w-6 h-6 text-primary" />}
          />
          <StatsCard
            title="Total des Heures en Direct"
            value="0 heures"
            icon={<clock className="w-6 h-6 text-primary" />}
          />
        </div>

        <LiveDashboard />

        <div className="grid grid-cols-1 gap-6">
          <div className="p-6 rounded-lg bg-card backdrop-blur-sm border border-border/50 shadow-lg animate-fadeIn">
            <h2 className="text-xl font-bold mb-4">Récompenses Récentes</h2>
            <p className="text-secondary mb-4">
              Historique de vos récompenses TikTok récentes
            </p>
            <div className="grid grid-cols-3 gap-4 font-medium text-secondary">
              <div>Date</div>
              <div>Type</div>
              <div>Montant</div>
            </div>
          </div>

          <div className="p-6 rounded-lg bg-card backdrop-blur-sm border border-border/50 shadow-lg animate-fadeIn">
            <h2 className="text-xl font-bold mb-4">Heures en Direct</h2>
            <p className="text-secondary mb-4">
              Votre activité de streaming récente
            </p>
            <div className="grid grid-cols-2 gap-4 font-medium text-secondary">
              <div>Date</div>
              <div>Heures</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
