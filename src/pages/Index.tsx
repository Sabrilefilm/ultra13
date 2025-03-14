
import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AuthView } from "@/components/auth/AuthView";
import { useInactivityTimer } from "@/hooks/use-inactivity-timer";
import { useIndexAuth } from "@/hooks/use-index-auth";
import { usePlatformSettings } from "@/hooks/use-platform-settings";
import { useAccountManagement } from "@/hooks/use-account-management";
import { usePersonalInfoCheck } from "@/hooks/use-personal-info-check";
import { useToast } from "@/hooks/use-toast";
import { UltraDashboard } from "@/components/dashboard/UltraDashboard";

const Index = () => {
  const { toast } = useToast();
  const { isAuthenticated, username, role, handleLogout, handleLogin } = useIndexAuth();
  const { platformSettings, handleUpdateSettings } = usePlatformSettings(role);
  const { handleCreateAccount } = useAccountManagement();
  
  // Check personal info for creators
  usePersonalInfoCheck(isAuthenticated, role);
  
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
    warningTime: 30000, // Afficher l'avertissement 30 secondes avant
    onWarning: () => {
      // L'avertissement est géré par le hook et affiché via showWarning
    }
  });

  if (!isAuthenticated) {
    return <AuthView onLogin={handleLogin} />;
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <UltraDashboard
        username={username}
        role={role || ''}
        onLogout={handleLogout}
        platformSettings={platformSettings}
        handleCreateAccount={handleCreateAccount}
        handleUpdateSettings={handleUpdateSettings}
        showWarning={showWarning}
        dismissWarning={dismissWarning}
        formattedTime={formattedTime}
      />
    </SidebarProvider>
  );
}

export default Index;
