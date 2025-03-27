
import React from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useSidebar } from "@/hooks/use-sidebar";
import { SidebarLogo } from "./SidebarLogo";
import { SidebarUserProfile } from "./sidebar/SidebarUserProfile";
import { SidebarNavigation } from "./sidebar/SidebarNavigation";
import { SidebarLogout } from "./sidebar/SidebarLogout";
import { SidebarToggle } from "./sidebar/SidebarToggle";
import { SidebarMobileClose } from "./sidebar/SidebarMobileClose";
import { navigationItems, getAmbassadorItems } from "./sidebar/navigationItems";
import { UltraSidebarProps } from "./sidebar/types";
import { Users } from "lucide-react";
import { LogoutButton } from "./LogoutButton";

export const UltraSidebar: React.FC<UltraSidebarProps> = ({
  username,
  role,
  userId,
  onLogout,
  onAction,
  currentPage = 'dashboard',
  isMobileOpen,
  setMobileMenuOpen,
  version = "1.0"
}) => {
  const { collapsed, toggleSidebar } = useSidebar();
  const isMobile = useMediaQuery("(max-width: 768px)");

  const handleItemClick = (action: string, data?: any) => {
    if (onAction) {
      // Handle special cases where data is a function
      if (typeof data === 'function') {
        data = data(role);
      }
      
      onAction(action, data);
    }

    if (isMobile && setMobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  };

  const handleToggleSidebar = () => {
    toggleSidebar();
    if (onAction) {
      onAction('toggleSidebar');
    }
  };

  // Get navigation items based on role
  const items = role === 'ambassadeur' 
    ? getAmbassadorItems(navigationItems)
    : navigationItems;

  return (
    <div className={`h-full flex flex-col bg-slate-800/80 backdrop-blur-sm border-r border-slate-700/50 transition-all duration-300 ${collapsed ? "w-20" : "w-64"} ${isMobile ? "w-full md:w-auto" : ""}`}>
      {isMobile && (
        <SidebarMobileClose onClose={() => setMobileMenuOpen && setMobileMenuOpen(false)} />
      )}
      
      <div className={`flex items-center ${collapsed ? "justify-center" : "justify-between"} p-4`}>
        <SidebarLogo collapsed={collapsed} />
        
        {!isMobile && (
          <SidebarToggle collapsed={collapsed} onToggle={handleToggleSidebar} />
        )}
      </div>
      
      <SidebarUserProfile 
        username={username} 
        role={role} 
        collapsed={collapsed} 
      />
      
      <div className="flex-1 overflow-y-auto py-4 bg-sky-950">
        <SidebarNavigation 
          items={items}
          currentPage={currentPage}
          role={role}
          onClick={handleItemClick}
          collapsed={collapsed}
        />
      </div>

      {isMobile && (
        <div className="p-4 bg-slate-800/50">
          <LogoutButton 
            onLogout={onLogout} 
            username={username} 
            variant="ghost"
            className="w-full justify-center bg-red-900/20 text-red-400 hover:bg-red-900/30"
          />
        </div>
      )}
      
      {!collapsed && !isMobile && (
        <div className="p-3 text-center border-t border-slate-700/50 text-xs text-slate-500">
          <p>Version {version}</p>
        </div>
      )}
    </div>
  );
};
