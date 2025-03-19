
import { useEffect } from "react";
import { UltraDashboard } from "@/components/dashboard/UltraDashboard";
import { useIndexAuth } from "@/hooks/use-index-auth";
import { useAccountManagement } from "@/hooks/use-account-management";
import { usePlatformSettings } from "@/hooks/use-platform-settings";
import { useToast } from "@/hooks/use-toast";

const CreatorRules = () => {
  const {
    isAuthenticated,
    username,
    role,
    userId,
    handleLogout,
  } = useIndexAuth();

  const { toast } = useToast();

  // Add the missing handleCreateAccount
  const { handleCreateAccount } = useAccountManagement();

  // Setup properly configured inactivity timer with required parameters
  const { showWarning, dismissWarning, formattedTime } = useInactivityTimer({
    timeout: 120000, // 2 minutes
    onTimeout: () => {
      handleLogout();
      toast({
        title: "Déconnexion automatique",
        description: "Vous avez été déconnecté en raison d'inactivité.",
      });
    },
    warningTime: 30000, // Show warning 30 seconds before timeout
    onWarning: () => {
      // Warning is handled by the hook and displayed via showWarning
    }
  });

  const { platformSettings, handleUpdateSettings } = usePlatformSettings(role);

  useEffect(() => {
    document.title = "Règles des Créateurs | Ultra";
  }, []);

  if (!isAuthenticated) {
    return <p>Vous n'êtes pas connecté.</p>;
  }

  return (
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
      currentPage="creator-rules"
    />
  );
};

export default CreatorRules;
