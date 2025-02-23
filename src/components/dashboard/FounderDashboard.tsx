
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { User, LogOut, Settings } from "lucide-react";

interface FounderDashboardProps {
  onCreateAccount: () => void;
  onConfigureRewards: () => void;
  onOpenLiveSchedule: (creatorId: string) => void;
  onOpenSponsorships: () => void;
  username: string;
}

export function FounderDashboard({
  onCreateAccount,
  onConfigureRewards,
  onOpenLiveSchedule,
  onOpenSponsorships,
  username,
}: FounderDashboardProps) {
  return (
    <Card className="p-6">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onConfigureRewards}
            className="text-xs px-2 py-1 h-8"
          >
            <Settings className="h-4 w-4 mr-1" />
            Configuration des récompenses
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Button
            variant="default"
            onClick={onCreateAccount}
            className="h-24 text-lg"
          >
            <User className="h-6 w-6 mr-2" />
            Gestion des utilisateurs
          </Button>
          
          <Button
            variant="default"
            onClick={() => onOpenLiveSchedule(username)}
            className="h-24 text-lg"
          >
            Gérer les horaires
          </Button>

          <Button
            variant="default"
            onClick={onOpenSponsorships}
            className="h-24 text-lg"
          >
            Gérer les sponsorings
          </Button>
        </div>
      </div>
    </Card>
  );
}
