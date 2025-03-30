
import React from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { UltraDashboard } from "@/components/dashboard/UltraDashboard";
import { useIndexAuth } from "@/hooks/use-index-auth";
import { usePlatformSettings } from "@/hooks/use-platform-settings";
import { useAccountManagement } from "@/hooks/use-account-management";
import { useInactivityTimer } from "@/hooks/use-inactivity-timer";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy } from "lucide-react";

const Matches = () => {
  const { toast } = useToast();
  const { isAuthenticated, username, role, userId, handleLogout } = useIndexAuth();
  const { platformSettings, handleUpdateSettings } = usePlatformSettings(role);
  const { handleCreateAccount } = useAccountManagement();
  
  // Inactivity timer for automatic logout
  const { showWarning, dismissWarning, formattedTime } = useInactivityTimer({
    timeout: 120000, // 2 minutes
    onTimeout: () => {
      handleLogout();
      toast({
        title: "Déconnexion automatique",
        description: "Vous avez été déconnecté en raison d'inactivité.",
      });
    },
    warningTime: 30000,
    onWarning: () => {}
  });

  if (!isAuthenticated) {
    window.location.href = '/';
    return null;
  }

  // Restrict access to authorized roles
  if (!['founder', 'manager'].includes(role || '')) {
    window.location.href = '/dashboard';
    return null;
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <UltraDashboard
        username={username}
        role={role || ''}
        userId={userId || ''}
        onLogout={handleLogout}
        platformSettings={platformSettings}
        handleCreateAccount={handleCreateAccount}
        handleUpdateSettings={handleUpdateSettings}
        showWarning={showWarning}
        dismissWarning={dismissWarning}
        formattedTime={formattedTime}
        currentPage="matches"
      />
      
      <div className="flex justify-center w-full p-6 md:ml-64">
        <div className="w-full max-w-6xl space-y-6">
          <Card className="bg-slate-900/90 shadow-lg border-purple-900/30">
            <CardHeader className="bg-gradient-to-r from-purple-950/50 to-slate-900/50">
              <CardTitle className="text-2xl font-bold text-white flex items-center gap-2">
                <Trophy className="h-6 w-6 text-purple-500" />
                Gestion des Matchs
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 text-white">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-slate-800/90 backdrop-blur-sm border border-purple-700/20 rounded-xl p-6 shadow-lg relative overflow-hidden">
                  <h3 className="text-xl font-medium mb-4 text-white">Matchs à venir</h3>
                  <p className="text-gray-300">Aucun match à venir pour le moment.</p>
                </div>
                
                <div className="bg-slate-800/90 backdrop-blur-sm border border-purple-700/20 rounded-xl p-6 shadow-lg relative overflow-hidden">
                  <h3 className="text-xl font-medium mb-4 text-white">Matchs passés</h3>
                  <p className="text-gray-300">Aucun match passé pour le moment.</p>
                </div>
                
                <div className="bg-slate-800/90 backdrop-blur-sm border border-purple-700/20 rounded-xl p-6 shadow-lg relative overflow-hidden">
                  <h3 className="text-xl font-medium mb-4 text-white">Statistiques</h3>
                  <p className="text-gray-300">Aucune statistique disponible.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Matches;
