
import React from "react";
import { UltraSidebar } from "@/components/layout/UltraSidebar";
import { useAuth } from "@/hooks/use-auth";
import { useInactivityTimer } from "@/hooks/use-inactivity-timer";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useNavigate } from "react-router-dom";
import { InactivityWarning } from "@/components/InactivityWarning";
import { useToast } from "@/hooks/use-toast";
import { MobileNavigation } from "@/components/mobile/MobileNavigation";
import { useIsMobile } from "@/hooks/use-mobile";
import { useLocation } from "react-router-dom";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user, logout, lastLogin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const { pathname } = useLocation();
  const currentPage = pathname === "/" ? "dashboard" : pathname.replace(/^\//, "");
  
  const {
    showWarning,
    dismissWarning,
    formattedTime
  } = useInactivityTimer({
    timeout: 120000, // 2 minutes
    onTimeout: () => {
      logout();
      toast({
        title: "Déconnexion automatique",
        description: "Vous avez été déconnecté en raison d'inactivité."
      });
    },
    warningTime: 60000, // Afficher l'avertissement 60 secondes avant
  });

  const handleAction = (action: string, data?: any) => {
    if (action === 'navigate') {
      navigate(data);
    }
  };

  const handleMobileMenuOpen = () => {
    // Handle mobile menu
  };

  if (!user) {
    return null;
  }

  return (
    <SidebarProvider defaultOpen={!window.matchMedia('(max-width: 768px)').matches}>
      <div className="flex h-screen w-full overflow-hidden bg-gradient-to-br from-slate-900 to-slate-950">
        <UltraSidebar
          username={user.username}
          role={user.role || ""}
          userId={user.id || ""}
          onLogout={logout}
          onAction={handleAction}
          currentPage={currentPage}
          lastLogin={lastLogin}
        />
        
        <div className="flex-1 h-full overflow-y-auto">
          <div className="w-full max-w-full mx-auto">
            {children}
          </div>
        </div>
        
        {isMobile && (
          <MobileNavigation
            role={user.role || ""}
            currentPage={currentPage}
            onOpenMenu={handleMobileMenuOpen}
          />
        )}
        
        <InactivityWarning
          open={showWarning}
          onStay={dismissWarning}
          onLogout={logout}
          remainingTime={formattedTime}
        />
      </div>
    </SidebarProvider>
  );
};
