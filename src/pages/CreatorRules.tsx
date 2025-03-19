
import { useEffect } from "react";
import { UltraDashboard } from "@/components/dashboard/UltraDashboard";
import { useIndexAuth } from "@/hooks/use-index-auth";
import { useInactivityTimer } from "@/hooks/use-inactivity-timer";
import { usePlatformSettings } from "@/hooks/use-platform-settings";

const CreatorRules = () => {
  const {
    isAuthenticated,
    username,
    role,
    userId,
    handleLogout,
    handleCreateAccount,
  } = useIndexAuth();

  const {
    showWarning,
    dismissWarning,
    formattedTime,
    resetTimer,
  } = useInactivityTimer();

  const { platformSettings, handleUpdateSettings } = usePlatformSettings();

  useEffect(() => {
    document.title = "Règles des Créateurs | Ultra";
    
    // Reset inactivity timer on page load
    resetTimer();
    
    // Event listener to reset timer on user activity
    const resetOnActivity = () => resetTimer();
    window.addEventListener("mousemove", resetOnActivity);
    window.addEventListener("keydown", resetOnActivity);
    
    return () => {
      window.removeEventListener("mousemove", resetOnActivity);
      window.removeEventListener("keydown", resetOnActivity);
    };
  }, [resetTimer]);

  if (!isAuthenticated) {
    return <p>Vous n'êtes pas connecté.</p>;
  }

  return (
    <UltraDashboard
      username={username}
      role={role}
      userId={userId}
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
