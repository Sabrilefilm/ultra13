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
interface SidebarToggleProps {
  collapsed: boolean;
  onToggle: () => void;
}
export const SidebarToggle: React.FC<SidebarToggleProps> = ({
  collapsed,
  onToggle
}) => {
  return <Button variant="ghost" size="icon" onClick={onToggle} className="h-8 w-8 p-0 text-white hover:bg-slate-800">
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
  return <Button variant="ghost" size="icon" onClick={onClose} className={`h-8 w-8 p-0 text-white hover:bg-slate-800 ${className}`}>
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
  setMobileMenuOpen,
  version,
  children
}: UltraSidebarProps) => {
  const {
    collapsed,
    toggleSidebar
  } = useSidebar();
  const handleMobileClose = () => {
    if (setMobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  };
  const handleSidebarItemClick = (action: string, data?: any) => {
    if (onAction) {
      onAction(action, data);
    }
    if (setMobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  };
  const navigationItems = getNavigationItems(role, currentPage);
  const sidebarContent = <div className="flex">
      <Sidebar className={`fixed h-full bg-gradient-to-b from-slate-900 to-slate-950 text-white shadow-lg z-50 flex flex-col border-r border-purple-800/50 transition-all duration-300 ${collapsed ? "w-16" : "w-64"}`}>
        <div className="flex justify-between items-center p-4 border-b border-purple-800/30">
          {!collapsed && <SidebarLogo />}
          <div className="flex items-center">
            <SidebarToggle collapsed={collapsed} onToggle={toggleSidebar} />
            {isMobileOpen && <SidebarMobileClose onClose={handleMobileClose} className="md:hidden ml-2" />}
          </div>
        </div>
        
        <SidebarUserProfile username={username} role={role} collapsed={collapsed} />
        
        <div className="flex-1 overflow-y-auto py-4">
          <SidebarNavigation items={navigationItems} currentPage={currentPage} role={role} onClick={handleSidebarItemClick} collapsed={collapsed} />
        </div>
        
        <SidebarLogout onLogout={onLogout} collapsed={collapsed} username={username} role={role} />
      </Sidebar>
      <div className={`flex-1 transition-all duration-300 ml-${collapsed ? '16' : '64'}`}>
        {children}
      </div>
    </div>;

  // Wrap the sidebar content with SidebarProvider
  return <SidebarProvider defaultOpen={true}>
      <div className="flex w-full mx-0">
        {sidebarContent}
      </div>
    </SidebarProvider>;
};