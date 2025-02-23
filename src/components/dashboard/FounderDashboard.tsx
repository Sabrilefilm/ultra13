
import { Settings, Users, Diamond } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FounderDashboardProps {
  onCreateAccount: () => void;
  onConfigureRewards: () => void;
  onOpenLiveSchedule: (creatorId: string) => void;
  username: string;
}

export const FounderDashboard = ({
  onCreateAccount,
  onConfigureRewards,
  onOpenLiveSchedule,
  username
}: FounderDashboardProps) => {
  return (
    <div className="p-6 rounded-lg bg-card backdrop-blur-sm border border-border/50 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Settings className="w-6 h-6 text-primary" />
          Configuration Globale
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Button
          variant="outline"
          className="p-6 h-auto flex-col items-start gap-4 hover:bg-accent/5 text-primary-foreground hover:text-primary-foreground"
          onClick={onCreateAccount}
        >
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            <span className="font-semibold">Gestion des Comptes</span>
          </div>
          <p className="text-sm text-muted-foreground text-left">
            Créer et gérer les comptes (Créateurs, Managers)
          </p>
        </Button>

        <Button
          variant="outline"
          className="p-6 h-auto flex-col items-start gap-4 hover:bg-accent/5 text-primary-foreground hover:text-primary-foreground"
          onClick={onConfigureRewards}
        >
          <div className="flex items-center gap-2">
            <Diamond className="w-5 h-5 text-primary" />
            <span className="font-semibold">Configuration Récompenses</span>
          </div>
          <p className="text-sm text-muted-foreground text-left">
            Gérer les taux de conversion et les diamants
          </p>
        </Button>

        <Button
          variant="outline"
          className="p-6 h-auto flex-col items-start gap-4 hover:bg-accent/5 text-primary-foreground hover:text-primary-foreground"
          onClick={() => window.location.href = '/accounts'}
        >
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            <span className="font-semibold">Espace Identifiants</span>
          </div>
          <p className="text-sm text-muted-foreground text-left">
            Consulter tous les identifiants et mots de passe
          </p>
        </Button>

        <Button
          variant="outline"
          className="p-6 h-auto flex-col items-start gap-4 hover:bg-accent/5 text-primary-foreground hover:text-primary-foreground"
          onClick={() => onOpenLiveSchedule(username)}
        >
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-primary" />
            <span className="font-semibold">Configuration Générale</span>
          </div>
          <p className="text-sm text-muted-foreground text-left">
            Paramètres généraux et horaires des lives de la plateforme
          </p>
        </Button>
      </div>
    </div>
  );
};

