
import { Settings, Users, Diamond, Gamepad, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface FounderDashboardProps {
  onCreateAccount: () => void;
  onConfigureRewards: () => void;
  onOpenLiveSchedule: (creatorId: string) => void;
  onOpenSponsorships: () => void;
  onScheduleMatch: () => void;
  onCreatePoster: () => void;
  username: string;
}

export const FounderDashboard = ({
  onCreateAccount,
  onConfigureRewards,
  onOpenLiveSchedule,
  onOpenSponsorships,
  onScheduleMatch,
  onCreatePoster,
  username
}: FounderDashboardProps) => {
  const navigate = useNavigate();

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
            <span className="font-semibold">Nouveau Compte</span>
          </div>
          <p className="text-sm text-muted-foreground text-left">
            Créer et gérer les comptes (Créateurs, Managers)
          </p>
        </Button>

        <Button
          variant="outline"
          className="p-6 h-auto flex-col items-start gap-4 hover:bg-accent/5 text-primary-foreground hover:text-primary-foreground"
          onClick={onScheduleMatch}
        >
          <div className="flex items-center gap-2">
            <Gamepad className="w-5 h-5 text-primary" />
            <span className="font-semibold">Programmer un Match</span>
          </div>
          <p className="text-sm text-muted-foreground text-left">
            Créer un nouveau match entre créateurs
          </p>
        </Button>

        <Button
          variant="outline"
          className="p-6 h-auto flex-col items-start gap-4 hover:bg-accent/5 text-primary-foreground hover:text-primary-foreground"
          onClick={onCreatePoster}
        >
          <div className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-primary" />
            <span className="font-semibold">Créer une affiche</span>
          </div>
          <p className="text-sm text-muted-foreground text-left">
            Générer une affiche pour un match
          </p>
        </Button>

        <Button
          variant="outline"
          className="p-6 h-auto flex-col items-start gap-4 hover:bg-accent/5 text-primary-foreground hover:text-primary-foreground"
          onClick={onOpenSponsorships}
        >
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            <span className="font-semibold">Parrainages</span>
          </div>
          <p className="text-sm text-muted-foreground text-left">
            Gérer les demandes de parrainage
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

        <Button
          variant="outline"
          className="p-6 h-auto flex-col items-start gap-4 hover:bg-accent/5 text-primary-foreground hover:text-primary-foreground"
          onClick={() => navigate("/rewards-management")}
        >
          <div className="flex items-center gap-2">
            <Diamond className="w-5 h-5 text-primary" />
            <span className="font-semibold">Gestion des Récompenses</span>
          </div>
          <p className="text-sm text-muted-foreground text-left">
            Gérer les diamants et les récompenses des créateurs
          </p>
        </Button>
      </div>
    </div>
  );
};
