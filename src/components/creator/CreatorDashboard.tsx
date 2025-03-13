
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { FileText, Handshake } from "lucide-react";

interface CreatorDashboardProps {
  onOpenSponsorshipForm: () => void;
  onOpenSponsorshipList: () => void;
  role?: string;
  onCreatePoster?: () => void;
}

export function CreatorDashboard({
  onOpenSponsorshipForm,
  onOpenSponsorshipList,
  onCreatePoster,
  role = 'creator'
}: CreatorDashboardProps) {
  const navigate = useNavigate();

  const renderDashboardButtons = () => {
    switch (role) {
      case 'creator':
        return (
          <>
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
              <Handshake className="h-6 w-6" />
              <span>Demander un parrainage</span>
            </Button>
          </>
        );
      case 'manager':
      case 'agent':
      case 'founder':
        return (
          <>
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
              onClick={onOpenSponsorshipList}
            >
              <Handshake className="h-6 w-6" />
              <span>Liste des parrainages</span>
            </Button>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {renderDashboardButtons()}
    </div>
  );
}
