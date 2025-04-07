
import React, { useState } from "react";
import { SidebarNavigation } from "./sidebar/SidebarNavigation";
import { SidebarUserProfile } from "./sidebar/SidebarUserProfile";
import { SidebarLogout } from "./sidebar/SidebarLogout";
import { SidebarLogo } from "./SidebarLogo";
import { Sidebar } from "@/components/ui/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { getNavigationItems } from "./sidebar/navigationItems";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/hooks/use-sidebar";
import { MobileMenu } from "@/components/mobile/MobileMenu";
import { useIsMobile } from "@/hooks/use-mobile";
import { MobileNavigation } from "@/components/mobile/MobileNavigation";
import { LastLoginInfo } from "@/components/layout/LastLoginInfo";
import { NavigationItem } from "./sidebar/types";

interface SidebarToggleProps {
  collapsed: boolean;
  onToggle: () => void;
}

export const SidebarToggle: React.FC<SidebarToggleProps> = ({
  collapsed,
  onToggle
}) => {
  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={(e) => {
        e.stopPropagation(); // Prevent event bubbling
        onToggle();
      }} 
      className="h-8 w-8 p-0 text-white hover:bg-slate-800"
    >
      <Menu className="h-5 w-5" />
    </Button>
  );
};

interface SidebarMobileCloseProps {
  onClose: () => void;
  className?: string;
}

export const SidebarMobileClose: React.FC<SidebarMobileCloseProps> = ({
  onClose,
  className
}) => {
  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={(e) => {
        e.stopPropagation(); // Prevent event bubbling
        onClose();
      }} 
      className={`h-8 w-8 p-0 text-white hover:bg-slate-800 ${className}`}
    >
      <X className="h-5 w-5" />
    </Button>
  );
};

interface UltraSidebarProps {
  username: string;
  role: string;
  userId: string;
  onLogout: () => void;
  currentPage?: string;
  onAction?: (action: string, data?: any) => void;
  isMobileOpen?: boolean;
  setMobileMenuOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  version?: string;
  children?: React.ReactNode;
  lastLogin?: string | null;
}

// Fonction pour transformer les NavigationItem en SidebarItem
const mapNavigationItemsToSidebarItems = (
  items: NavigationItem[]
): any[] => {
  return items.map(item => ({
    icon: () => item.icon,
    label: item.title,
    action: item.href ? 'navigate' : 'toggle',
    data: item.href || '',
    roles: item.roles || [],
    children: item.children ? mapNavigationItemsToSidebarItems(item.children) : undefined
  }));
};

export const UltraSidebar: React.FC<UltraSidebarProps> = ({
  username,
  role,
  userId,
  onLogout,
  currentPage = "",
  onAction,
  isMobileOpen,
  setMobileMenuOpen: setParentMobileMenuOpen,
  version,
  children,
  lastLogin
}: UltraSidebarProps) => {
  const { collapsed, toggleSidebar } = useSidebar();
  const isMobile = useIsMobile();
  const [localMobileMenuOpen, setLocalMobileMenuOpen] = useState(false);

  const handleOpenMobileMenu = () => {
    setLocalMobileMenuOpen(true);
    if (setParentMobileMenuOpen) {
      setParentMobileMenuOpen(true);
    }
  };
  
  const handleMobileClose = () => {
    setLocalMobileMenuOpen(false);
    if (setParentMobileMenuOpen) {
      setParentMobileMenuOpen(false);
    }
  };
  
  const handleSidebarItemClick = (action: string, data?: any) => {
    if (onAction) {
      try {
        onAction(action, data);
      } catch (error) {
        console.error("Error in sidebar item click handler:", error);
      }
    }
    handleMobileClose();
  };
  
  const navigationItems = getNavigationItems(role, currentPage);
  const sidebarItems = mapNavigationItemsToSidebarItems(navigationItems);
  
  return (
    <div className="flex h-full w-full">
      {isMobile && (
        <MobileMenu 
          username={username}
          role={role}
          currentPage={currentPage}
          onLogout={onLogout}
        />
      )}
      
      <Sidebar className={`h-full bg-gradient-to-b from-slate-900 to-slate-950 text-white shadow-lg z-40 flex flex-col border-r border-purple-800/50 transition-all duration-300 ${collapsed ? "w-16" : "w-64"} md:flex`}>
        <div className="flex justify-between items-center p-3 border-b border-purple-800/30">
          <SidebarLogo collapsed={collapsed} />
          <SidebarToggle collapsed={collapsed} onToggle={toggleSidebar} />
        </div>
        
        <SidebarUserProfile username={username} role={role} collapsed={collapsed} />
        
        <div className="flex-1 overflow-y-auto py-2">
          <SidebarNavigation 
            items={sidebarItems} 
            currentPage={currentPage} 
            role={role} 
            onClick={handleSidebarItemClick} 
            collapsed={collapsed} 
          />
        </div>
        
        <SidebarLogout onLogout={onLogout} collapsed={collapsed} username={username} role={role} />
      </Sidebar>
      
      <div className={`flex-1 transition-all duration-300 max-w-full`}>
        {children}
      </div>
    </div>
  );
};
