
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Plus, FileText, Handshake } from "lucide-react";

interface CreatorDashboardProps {
  onOpenSponsorshipForm: () => void;
  onOpenSponsorshipList: () => void;
  role?: string;
}

export function CreatorDashboard({
  onOpenSponsorshipForm,
  onOpenSponsorshipList,
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
          </>
        );
      case 'manager':
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
      case 'agent':
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
              <span>Parrainages en cours</span>
            </Button>
            <Button
              variant="outline"
              className="h-24 flex-col items-center justify-center space-y-2"
              asChild
            >
              <a 
                href="https://live-backstage.tiktok.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="border-purple-600 text-purple-400 hover:bg-purple-600 hover:text-white transition-colors"
              >
                <svg 
                  viewBox="0 0 24 24" 
                  fill="currentColor" 
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                </svg>
                <span>Backstage</span>
              </a>
            </Button>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {renderDashboardButtons()}
    </div>
  );
}
