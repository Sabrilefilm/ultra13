
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Plus, FileText, Handshake } from "lucide-react";

interface CreatorDashboardProps {
  onOpenSponsorshipForm: () => void;
  onOpenSponsorshipList: () => void;
}

export function CreatorDashboard({
  onOpenSponsorshipForm,
  onOpenSponsorshipList
}: CreatorDashboardProps) {
  const navigate = useNavigate();

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Button
        variant="outline"
        onClick={() => navigate("/personal-information")}
        className="h-24 flex-col items-center justify-center space-y-2"
      >
        <FileText className="h-6 w-6" />
        <span>Informations personnelles</span>
      </Button>
      <Button
        variant="outline"
        className="h-24 flex-col items-center justify-center space-y-2"
        onClick={onOpenSponsorshipForm}
      >
        <Plus className="h-6 w-6" />
        <span>Demander un parrainage</span>
      </Button>
      <Button
        variant="outline"
        className="h-24 flex-col items-center justify-center space-y-2"
        onClick={onOpenSponsorshipList}
      >
        <Handshake className="h-6 w-6" />
        <span>Mes parrainages</span>
      </Button>
    </div>
  );
}
