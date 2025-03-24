import { SidebarProvider } from "@/components/ui/sidebar";
import { AuthView } from "@/components/auth/AuthView";
import { useInactivityTimer } from "@/hooks/use-inactivity-timer";
import { useIndexAuth } from "@/hooks/use-index-auth";
import { usePlatformSettings } from "@/hooks/use-platform-settings";
import { useAccountManagement } from "@/hooks/use-account-management";
import { usePersonalInfoCheck } from "@/hooks/use-personal-info-check";
import { useToast } from "@/hooks/use-toast";
import { UltraDashboard } from "@/components/dashboard/UltraDashboard";
import { Loader2 } from "lucide-react";
import { SocialCommunityLinks } from "@/components/layout/SocialCommunityLinks";

const Index = () => {
  const { toast } = useToast();
  const { 
    isAuthenticated, 
    username, 
    role, 
    userId,
    isLoading,
    handleLogout, 
    handleLogin 
  } = useIndexAuth();
  
  const { platformSettings, handleUpdateSettings } = usePlatformSettings(role);
  const { handleCreateAccount } = useAccountManagement();
  
  usePersonalInfoCheck(isAuthenticated, role);
  
  const { showWarning, dismissWarning, formattedTime } = useInactivityTimer({
    timeout: 120000, // 2 minutes
    onTimeout: () => {
      handleLogout();
      toast({
        title: "Déconnexion automatique",
        description: "Vous avez été déconnecté en raison d'inactivity.",
      });
    },
    warningTime: 30000, // Afficher l'avertissement 30 secondes avant
    onWarning: () => {
      // L'avertissement est géré par le hook et affiché via showWarning
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#111827] flex flex-col items-center justify-center">
        <div className="text-white text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-purple-500" />
          <p className="text-lg font-medium">Connexion en cours...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#111827] flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md">
          <AuthView onLogin={handleLogin} />
          <div className="mt-8">
            <SocialCommunityLinks />
          </div>
        </div>
      </div>
    );
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
        currentPage="dashboard"
      />
    </SidebarProvider>
  );
}

export default Index;
