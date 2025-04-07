
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
import { useEffect, useState } from "react";
import { useAppVersion } from "@/hooks/use-app-version";

const Index = () => {
  const {
    toast
  } = useToast();
  const [showAnimation, setShowAnimation] = useState(false);
  const {
    version
  } = useAppVersion();
  const {
    isAuthenticated,
    username,
    role,
    userId,
    isLoading,
    lastLogin,
    handleLogout,
    handleLogin
  } = useIndexAuth();
  const {
    platformSettings,
    handleUpdateSettings
  } = usePlatformSettings(role);
  const {
    handleCreateAccount
  } = useAccountManagement();
  usePersonalInfoCheck(isAuthenticated, role);
  
  useEffect(() => {
    // Démarre l'animation après le chargement
    const timer = setTimeout(() => {
      setShowAnimation(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);
  
  const {
    showWarning,
    dismissWarning,
    formattedTime
  } = useInactivityTimer({
    timeout: 120000,
    // 2 minutes
    onTimeout: () => {
      handleLogout();
      toast({
        title: "Déconnexion automatique",
        description: "Vous avez été déconnecté en raison d'inactivité."
      });
    },
    warningTime: 60000,
    // Afficher l'avertissement 60 secondes avant
    onWarning: () => {
      // L'avertissement est géré par le hook et affiché via showWarning
    }
  });

  // Animation des étoiles flottantes
  const renderBackground = () => {
    return <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {Array(15).fill(0).map((_, i) => <div key={i} className="absolute w-1 h-1 rounded-full bg-purple-300/20 dark:bg-purple-500/20 animate-ping-slow" style={{
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        animationDelay: `${i * 0.5}s`,
        animationDuration: `${3 + Math.random() * 4}s`
      }} />)}
      </div>;
  };
  
  if (isLoading) {
    return <div className="min-h-screen bg-[#111827] flex flex-col items-center justify-center">
        <div className="text-white text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-purple-500" />
          <p className="text-lg font-medium">Connexion en cours...</p>
        </div>
        {renderBackground()}
      </div>;
  }
  
  if (!isAuthenticated) {
    return <div className="min-h-screen bg-[#111827] flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md">
          <AuthView onLogin={handleLogin} />
        </div>
        {renderBackground()}
      </div>;
  }
  
  return <SidebarProvider defaultOpen={!window.matchMedia('(max-width: 768px)').matches}>
      <div className="w-full h-screen">
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
          lastLogin={lastLogin}
        />
      </div>
    </SidebarProvider>;
};

export default Index;
