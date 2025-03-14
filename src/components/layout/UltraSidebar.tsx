
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarRail,
  useSidebar
} from "@/components/ui/sidebar";
import {
  LogOut,
  Home,
  AlertOctagon,
  MessageCircle,
  Image as ImageIcon,
  Video,
  Music,
  BookOpen,
  Briefcase,
  Users,
  Settings,
  User,
  HelpCircle,
  Clock
} from "lucide-react";

interface UltraSidebarProps {
  username: string;
  role: string;
  onLogout: () => void;
  onAction: (action: string, data?: any) => void;
  currentPage: string;
}

export const UltraSidebar = ({
  username,
  role,
  onLogout,
  onAction,
  currentPage
}: UltraSidebarProps) => {
  const { toggleSidebar } = useSidebar();

  const menuItems = [
    { 
      title: "Tableau de bord", 
      icon: <Home />, 
      action: () => onAction('navigateTo', 'dashboard'),
      active: currentPage === 'dashboard'
    },
    { 
      title: "Outils de chat", 
      icon: <MessageCircle />, 
      action: () => onAction('navigateTo', 'chat'),
      active: currentPage === 'chat'
    },
    { 
      title: "Outils d'image", 
      icon: <ImageIcon />, 
      action: () => onAction('navigateTo', 'image'),
      active: currentPage === 'image'
    },
    { 
      title: "Outils vidéo", 
      icon: <Video />, 
      action: () => onAction('navigateTo', 'video'),
      active: currentPage === 'video'
    },
    { 
      title: "Outils audio", 
      icon: <Music />, 
      action: () => onAction('navigateTo', 'audio'),
      active: currentPage === 'audio'
    },
    { 
      title: "Pénalités", 
      icon: <AlertOctagon />, 
      action: () => onAction('navigateTo', 'penalties'),
      active: currentPage === 'penalties'
    },
    { 
      title: "Planning", 
      icon: <Clock />, 
      action: () => onAction('navigateTo', 'schedule'),
      active: currentPage === 'schedule'
    },
  ];
  
  if (role === 'founder' || role === 'manager' || role === 'agent') {
    menuItems.push(
      { 
        title: "Gestion d'équipe", 
        icon: <Users />, 
        action: () => onAction('navigateTo', 'team'),
        active: currentPage === 'team'
      }
    );
  }

  return (
    <Sidebar>
      <SidebarRail />
      <SidebarHeader className="border-b border-gray-700/50">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
              ULTRA
            </span>
            <span className="text-sm text-white/70">by Phocéen Agency</span>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item, index) => (
            <SidebarMenuItem key={index}>
              <SidebarMenuButton 
                onClick={item.action}
                isActive={item.active}
                className={`${item.active ? 'bg-purple-600/20 text-purple-400 border-l-4 border-purple-500' : ''}`}
              >
                {item.icon}
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      
      <SidebarFooter className="border-t border-gray-700/50">
        <div className="p-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-white">
              {username.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium text-white truncate">{username}</p>
              <p className="text-xs text-gray-400 truncate">{role}</p>
            </div>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start text-gray-400 border-gray-700 hover:text-white"
            onClick={onLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Déconnexion
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};
