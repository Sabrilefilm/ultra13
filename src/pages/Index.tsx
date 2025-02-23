
import { Award, Clock, Diamond, Gift } from "lucide-react";
import { ProfileHeader } from "@/components/ProfileHeader";
import { StatsCard } from "@/components/StatsCard";
import { WebCrawler } from "@/components/WebCrawler";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/10 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        <ProfileHeader username="Sabri" handle="@Sabri_amd" />
        
        <WebCrawler />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <StatsCard
            title="Total des Diamants"
            value="0"
            icon={<Diamond className="w-6 h-6 text-primary" />}
          />
          <StatsCard
            title="Total des Heures en Direct"
            value="0 heures"
            icon={<Clock className="w-6 h-6 text-primary" />}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-lg bg-card backdrop-blur-sm border border-border/50 shadow-lg animate-fadeIn">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Diamants Reçus</h2>
              <Diamond className="w-6 h-6 text-primary" />
            </div>
            <p className="text-secondary mb-4">
              Historique de vos diamants reçus
            </p>
            <div className="grid grid-cols-3 gap-4 font-medium text-secondary">
              <div>Date</div>
              <div>Quantité</div>
              <div>Valeur</div>
            </div>
          </div>

          <div className="p-6 rounded-lg bg-card backdrop-blur-sm border border-border/50 shadow-lg animate-fadeIn">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Récompenses TikTok</h2>
              <Gift className="w-6 h-6 text-primary" />
            </div>
            <p className="text-secondary mb-4">
              Historique des récompenses TikTok
            </p>
            <div className="grid grid-cols-3 gap-4 font-medium text-secondary">
              <div>Date</div>
              <div>Type</div>
              <div>Valeur</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div className="p-6 rounded-lg bg-card backdrop-blur-sm border border-border/50 shadow-lg animate-fadeIn">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Statistiques des Récompenses</h2>
              <Award className="w-6 h-6 text-primary" />
            </div>
            <p className="text-secondary mb-4">
              Vue d'ensemble de vos gains
            </p>
            <div className="grid grid-cols-2 gap-4 font-medium text-secondary">
              <div>Période</div>
              <div>Total</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
