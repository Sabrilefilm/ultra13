
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, HomeIcon } from "lucide-react";
import { useIndexAuth } from "@/hooks/use-index-auth";
import { CreatorPerformanceRanking } from "@/components/creators/CreatorPerformanceRanking";
import { Footer } from "@/components/layout/Footer";
import { SidebarProvider } from "@/components/ui/sidebar";
import { UltraSidebar } from "@/components/layout/UltraSidebar";
import { UsernameWatermark } from "@/components/layout/UsernameWatermark";

const CreatorRankings = () => {
  const navigate = useNavigate();
  const { role, username, userId, handleLogout } = useIndexAuth();

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex">
        {username && <UsernameWatermark username={username} />}
        
        <UltraSidebar 
          username={username || ''}
          role={role || ''}
          userId={userId || ''}
          onLogout={handleLogout}
          currentPage="creator-rankings"
        />
        
        <div className="flex-1 p-4">
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate("/")}
                  className="h-10 w-10"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <h1 className="text-2xl font-bold">Classement des Créateurs 🏆</h1>
              </div>
              
              <Button
                variant="outline"
                onClick={() => navigate("/")}
                className="flex items-center gap-2"
              >
                <HomeIcon className="h-4 w-4" />
                Retour au tableau de bord
              </Button>
            </div>
            
            <CreatorPerformanceRanking role={role || ''} />
            
            <Footer role={role} />
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default CreatorRankings;
