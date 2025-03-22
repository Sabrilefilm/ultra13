
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, Users, Calendar, Briefcase, Award, Bookmark, MessageSquare, Settings, LogOut, ChevronRight, ChevronLeft, FileText, Trophy, X, Pen } from "lucide-react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { SidebarLogo } from "./SidebarLogo";
interface SidebarItem {
  icon: React.ElementType;
  label: string;
  action: string;
  data?: string;
  roles: string[];
}
interface UltraSidebarProps {
  username: string;
  role: string;
  userId?: string;
  onLogout: () => void;
  onAction?: (action: string, data?: any) => void;
  currentPage?: string;
  isMobileOpen?: boolean;
  setMobileMenuOpen?: (isOpen: boolean) => void;
}
export const UltraSidebar = ({
  username,
  role,
  userId,
  onLogout,
  onAction,
  currentPage = 'dashboard',
  isMobileOpen,
  setMobileMenuOpen
}: UltraSidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Reset collapse state on mobile/desktop switch
  useEffect(() => {
    if (isMobile) {
      setCollapsed(false);
    }
  }, [isMobile]);
  const sidebarItems: SidebarItem[] = [{
    icon: Home,
    label: "Tableau de bord",
    action: "navigateTo",
    data: "dashboard",
    roles: ["founder", "manager", "agent", "creator", "ambassadeur"]
  }, {
    icon: Users,
    label: "Utilisateurs",
    action: "navigateTo",
    data: "user-management",
    roles: ["founder", "manager", "agent", "ambassadeur"]
  }, {
    icon: Calendar,
    label: "Planning",
    action: "navigateTo",
    data: "schedule",
    roles: ["founder", "manager", "agent", "creator", "ambassadeur"]
  }, {
    icon: Trophy,
    label: "Matchs",
    action: "navigateTo",
    data: "matches",
    roles: ["founder", "manager", "agent", "creator", "ambassadeur"]
  }, {
    icon: Briefcase,
    label: "Transferts",
    action: "navigateTo",
    data: "transfers",
    roles: ["founder", "manager", "creator", "ambassadeur"]
  }, {
    icon: Award,
    label: "Récompenses",
    action: "navigateTo",
    data: role === "creator" ? "creator-rewards" : "rewards-management",
    roles: ["founder", "manager", "creator"]
  }, {
    icon: MessageSquare,
    label: "Messagerie",
    action: "navigateTo",
    data: "messages",
    roles: ["founder", "manager", "agent", "creator", "ambassadeur"]
  }, {
    icon: FileText,
    label: "Documents",
    action: "navigateTo",
    data: "documents",
    roles: ["founder", "manager", "agent", "creator", "ambassadeur"]
  }, {
    icon: Bookmark,
    label: "Sanctions",
    action: "navigateTo",
    data: "penalties",
    roles: ["founder", "manager", "ambassadeur"]
  }, {
    icon: Settings,
    label: "Règles",
    action: "navigateTo",
    data: role === "creator" ? "creator-rules" : "internal-rules",
    roles: ["founder", "manager", "agent", "creator", "ambassadeur"]
  }, {
    icon: Pen,
    label: "Mes Créateurs",
    action: "navigateTo",
    data: "creator-stats",
    roles: ["agent", "manager", "founder", "ambassadeur"]
  }];
  const filteredItems = sidebarItems.filter(item => item.roles.includes(role));
  const handleItemClick = (action: string, data?: any) => {
    if (onAction) {
      onAction(action, data);
    }

    // Close mobile menu after navigation
    if (isMobile && setMobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  };
  const handleToggleSidebar = () => {
    setCollapsed(!collapsed);
    if (onAction) {
      onAction('toggleSidebar');
    }
  };
  return <div className={`h-full flex flex-col bg-slate-800/80 backdrop-blur-sm border-r border-slate-700/50 transition-all duration-300 ${collapsed ? "w-20" : "w-64"} ${isMobile ? "w-full md:w-auto" : ""}`}>
      {/* Mobile close button */}
      {isMobile && <div className="flex justify-end p-2">
          <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen && setMobileMenuOpen(false)} className="text-slate-300 hover:text-white">
            <X className="h-5 w-5" />
          </Button>
        </div>}
      
      {/* Sidebar header */}
      <div className={`flex items-center ${collapsed ? "justify-center" : "justify-between"} p-4`}>
        <SidebarLogo collapsed={collapsed} />
        
        {!isMobile && <Button variant="ghost" size="icon" onClick={handleToggleSidebar} className="text-slate-300 hover:text-white">
            {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </Button>}
      </div>
      
      {/* User info */}
      <div className={`flex items-center ${collapsed ? "flex-col justify-center" : "justify-start"} px-4 py-3 border-b border-slate-700/50`}>
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-700/50 flex items-center justify-center">
          {username.charAt(0).toUpperCase()}
        </div>
        {!collapsed && <div className="ml-3 flex flex-col overflow-hidden">
            <p className="text-sm font-medium text-white truncate">{username}</p>
            <p className="text-xs text-slate-400">{role}</p>
          </div>}
      </div>
      
      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4 bg-sky-950">
        <nav className="space-y-1 px-2">
          {filteredItems.map(item => <Button key={item.label} variant="ghost" className={`w-full flex items-center ${collapsed ? "justify-center" : "justify-start"} px-3 py-2 text-sm rounded-md ${currentPage === item.data ? "bg-purple-900/50 text-white" : "text-slate-300 hover:bg-slate-700/50 hover:text-white"}`} onClick={() => handleItemClick(item.action, item.data)}>
              <item.icon className={`h-5 w-5 ${!collapsed && "mr-3"}`} />
              {!collapsed && <span>{item.label}</span>}
            </Button>)}
        </nav>
      </div>
      
      {/* Footer / Logout */}
      <div className="p-4 border-t border-slate-700/50">
        <Button variant="ghost" className={`w-full flex items-center ${collapsed ? "justify-center" : "justify-start"} px-3 py-2 text-sm rounded-md text-red-400 hover:bg-red-900/20 hover:text-red-300`} onClick={onLogout}>
          <LogOut className={`h-5 w-5 ${!collapsed && "mr-3"}`} />
          {!collapsed && <span>Déconnexion</span>}
        </Button>
      </div>
    </div>;
};
