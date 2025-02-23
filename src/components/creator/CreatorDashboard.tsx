
import { Button } from "@/components/ui/button";

interface CreatorDashboardProps {
  onOpenSponsorshipForm: () => void;
  onOpenSponsorshipList: () => void;
}

export const CreatorDashboard = ({ 
  onOpenSponsorshipForm,
  onOpenSponsorshipList
}: CreatorDashboardProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Button
        variant="outline"
        onClick={onOpenSponsorshipForm}
        className="p-6 h-auto flex-col items-start gap-4"
      >
        <span className="font-semibold">Demander un parrainage</span>
        <p className="text-sm text-muted-foreground text-left">
          Remplir le formulaire de parrainage
        </p>
      </Button>
      <Button
        variant="outline"
        onClick={onOpenSponsorshipList}
        className="p-6 h-auto flex-col items-start gap-4"
      >
        <span className="font-semibold">Mes parrainages</span>
        <p className="text-sm text-muted-foreground text-left">
          Voir l'état de mes demandes de parrainage
        </p>
      </Button>
    </div>
  );
};
