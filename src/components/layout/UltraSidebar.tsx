
import React, { useState } from "react";
import { SidebarNavigation } from "./sidebar/SidebarNavigation";
import { SidebarUserProfile } from "./sidebar/SidebarUserProfile";
import { SidebarToggle } from "./sidebar/SidebarToggle";
import { Sidebar } from "@/components/ui/sidebar";
import { SidebarMobileClose } from "./sidebar/SidebarMobileClose";
import { SidebarLogo } from "./SidebarLogo";
import { SidebarLogout } from "./sidebar/SidebarLogout";
import { getNavigationItems } from "./sidebar/navigationItems";

interface UltraSidebarProps {
  username: string;
  role: string;
  userId: string;
  onLogout: () => void;
  currentPage?: string;
}

export const UltraSidebar = ({ 
  username, 
  role, 
  userId,
  onLogout, 
  currentPage = "" 
}: UltraSidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobile, setMobile] = useState(false);
  
  const handleToggle = () => {
    setCollapsed(!collapsed);
  };
  
  const handleMobileToggle = () => {
    setMobile(!mobile);
  };
  
  const navigationItems = getNavigationItems(role, currentPage);

  return (
    <Sidebar 
      className={`fixed h-full bg-slate-900 text-white shadow-lg z-50 flex flex-col border-r border-slate-700/50 transition-all duration-300 ${
        collapsed ? "w-16" : "w-64"
      } ${
        mobile ? "left-0" : "-left-64 md:left-0"
      }`}
    >
      <div className="flex justify-between items-center p-4 border-b border-slate-700/50">
        {!collapsed && <SidebarLogo />}
        <SidebarToggle onClick={handleToggle} collapsed={collapsed} />
        <SidebarMobileClose onClick={handleMobileToggle} className="md:hidden" />
      </div>
      
      <SidebarUserProfile 
        username={username}
        role={role} 
        collapsed={collapsed}
      />
      
      <div className="flex-1 overflow-y-auto py-4">
        <SidebarNavigation 
          items={navigationItems}
          currentPage={currentPage}
          role={role}
          onClick={() => mobile && handleMobileToggle()}
          collapsed={collapsed}
        />
      </div>
      
      <SidebarLogout 
        onLogout={onLogout} 
        collapsed={collapsed}
        username={username}
        role={role}
      />
    </Sidebar>
  );
};
