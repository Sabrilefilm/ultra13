
import React from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { UserRound, Plus, CalendarDays, TrendingUp, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FounderDashboardProps {
  onCreateAccount: () => void;
  onConfigureRewards: () => void;
  onOpenLiveSchedule: (creatorId: string) => void;
  onScheduleMatch: () => void;
  onOpenSponsorships: () => void;
  onCreatePoster: () => void;
  username: string;
}

export const FounderDashboard: React.FC<FounderDashboardProps> = ({
  onCreateAccount,
  onConfigureRewards,
  onOpenLiveSchedule,
  onScheduleMatch,
  onOpenSponsorships,
  onCreatePoster,
  username,
}) => {
  const navigate = useNavigate();

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card className="p-4 space-y-8 bg-white/10 backdrop-blur-sm border-sky-200/20">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-sky-100">Gestion des Utilisateurs</h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/users")}
          >
            <UserRound className="h-5 w-5" />
          </Button>
        </div>
        <Button
          variant="outline"
          className="w-full"
          onClick={onCreateAccount}
        >
          <Plus className="mr-2 h-4 w-4" />
          Créer un compte
        </Button>
      </Card>

      <Card className="p-4 space-y-8 bg-white/10 backdrop-blur-sm border-sky-200/20">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-sky-100">Gestion des Notifications</h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/notifications")}
          >
            <Bell className="h-5 w-5" />
          </Button>
        </div>
        <Button
          variant="outline"
          className="w-full"
          onClick={() => navigate("/notifications")}
        >
          Gérer les notifications
        </Button>
      </Card>

      <Card className="p-4 space-y-8 bg-white/10 backdrop-blur-sm border-sky-200/20">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-sky-100">Calendrier</h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onOpenLiveSchedule(username)}
          >
            <CalendarDays className="h-5 w-5" />
          </Button>
        </div>
        <Button
          variant="outline"
          className="w-full"
          onClick={() => onScheduleMatch()}
        >
          Programmer un match
        </Button>
      </Card>

      <Card className="p-4 space-y-8 bg-white/10 backdrop-blur-sm border-sky-200/20">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-sky-100">Récompenses</h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={onConfigureRewards}
          >
            <TrendingUp className="h-5 w-5" />
          </Button>
        </div>
        <Button
          variant="outline"
          className="w-full"
          onClick={onConfigureRewards}
        >
          Configurer les récompenses
        </Button>
      </Card>
    </div>
  );
};
