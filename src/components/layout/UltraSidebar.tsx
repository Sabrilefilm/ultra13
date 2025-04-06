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
interface SidebarToggleProps {
  collapsed: boolean;
  onToggle: () => void;
}
export const SidebarToggle: React.FC<SidebarToggleProps> = ({
  collapsed,
  onToggle
}) => {
  return <Button variant="ghost" size="icon" onClick={e => {
    e.stopPropagation(); // Prevent event bubbling
    onToggle();
  }} className="h-8 w-8 p-0 text-white hover:bg-slate-800">
      <Menu className="h-5 w-5" />
    </Button>;
};
interface SidebarMobileCloseProps {
  onClose: () => void;
  className?: string;
}
export const SidebarMobileClose: React.FC<SidebarMobileCloseProps> = ({
  onClose,
  className
}) => {
  return <Button variant="ghost" size="icon" onClick={e => {
    e.stopPropagation(); // Prevent event bubbling
    onClose();
  }} className={`h-8 w-8 p-0 text-white hover:bg-slate-800 ${className}`}>
      <X className="h-5 w-5" />
    </Button>;
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
}
export const UltraSidebar: React.FC<UltraSidebarProps> = ({
  username,
  role,
  userId,
  onLogout,
  currentPage = "",
  onAction,
  isMobileOpen,
  setMobileMenuOpen: setParentMobileMenuOpen,
  // Renamed prop to avoid conflict
  version,
  children
}: UltraSidebarProps) => {
  const {
    collapsed,
    toggleSidebar
  } = useSidebar();
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setLocalMobileMenuOpen] = useState(false); // Renamed local state setter

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
      onAction(action, data);
    }
    handleMobileClose();
  };
  const navigationItems = getNavigationItems(role, currentPage);
  return <div className="flex flex-col h-full">
      {isMobile && <MobileMenu username={username} role={role} currentPage={currentPage} onLogout={onLogout} />}
      
      <div className="flex h-full bg-slate-900">
        <Sidebar className={`fixed h-full bg-gradient-to-b from-slate-900 to-slate-950 text-white shadow-lg z-50 flex flex-col border-r border-purple-800/50 transition-all duration-300 ${collapsed ? "w-16" : "w-64"} hidden md:flex`}>
          <div className="flex justify-between items-center p-4 border-b border-purple-800/30">
            <SidebarLogo collapsed={collapsed} />
            <SidebarToggle collapsed={collapsed} onToggle={toggleSidebar} />
          </div>
          
          <SidebarUserProfile username={username} role={role} collapsed={collapsed} />
          
          <div className="flex-1 overflow-y-auto py-4">
            <SidebarNavigation items={navigationItems} currentPage={currentPage} role={role} onClick={handleSidebarItemClick} collapsed={collapsed} />
          </div>
          
          <SidebarLogout onLogout={onLogout} collapsed={collapsed} username={username} role={role} />
        </Sidebar>
        
        <div className={`flex-1 transition-all duration-300 w-full max-w-full mx-auto ${collapsed ? 'md:ml-16' : 'md:ml-64'}`}>
          {children}
        </div>
      </div>
      
      {isMobile && <MobileNavigation role={role} currentPage={currentPage || ''} onOpenMenu={handleOpenMobileMenu} />}
    </div>;
};