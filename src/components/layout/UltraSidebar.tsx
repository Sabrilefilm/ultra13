
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
  Users,
  Clock,
  Rocket,
  BookOpen
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

  // Créons les éléments du menu de base disponibles pour tous les rôles
  const menuItems = [
    { 
      title: "Tableau de bord", 
      icon: <Home />, 
      action: () => onAction('navigateTo', 'dashboard'),
      active: currentPage === 'dashboard',
      roles: ['founder', 'manager', 'agent', 'creator', 'client']
    },
    { 
      title: "Pénalités", 
      icon: <AlertOctagon />, 
      action: () => onAction('navigateTo', 'penalties'),
      active: currentPage === 'penalties',
      roles: ['founder', 'manager', 'agent', 'creator']
    },
    { 
      title: "Règlement intérieur", 
      icon: <BookOpen />, 
      action: () => onAction('navigateTo', 'internal-rules'),
      active: currentPage === 'internal-rules',
      roles: ['founder', 'manager', 'agent', 'creator', 'client']
    }
  ];
  
  // Options avancées uniquement pour founder, manager et agent
  const advancedMenuItems = [
    { 
      title: "Gestion d'équipe", 
      icon: <Users />, 
      action: () => onAction('navigateTo', 'team'),
      active: currentPage === 'team',
      roles: ['founder', 'manager', 'agent']
    },
    { 
      title: "Planning", 
      icon: <Clock />, 
      action: () => onAction('navigateTo', 'schedule'),
      active: currentPage === 'schedule',
      roles: ['founder', 'manager', 'agent']
    }
  ];

  // Fusionner et filtrer les éléments du menu selon le rôle
  const filteredMenuItems = [...menuItems, ...advancedMenuItems]
    .filter(item => item.roles.includes(role));

  return (
    <Sidebar>
      <SidebarRail />
      <SidebarHeader className="border-b border-gray-700/50">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <Rocket className="w-6 h-6 text-purple-400" />
            <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
              ULTRA
            </span>
            <span className="text-sm text-white/70">by Phocéen Agency</span>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarMenu>
          {filteredMenuItems.map((item, index) => (
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
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white">
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
            className="w-full justify-start text-gray-400 border-gray-700 hover:text-white group transition-all duration-300 overflow-hidden"
            onClick={onLogout}
          >
            <div className="relative flex items-center w-full">
              <LogOut className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1 group-hover:scale-110 duration-300" />
              <span className="transition-transform group-hover:-translate-x-1 duration-300">Déconnexion</span>
              <span className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-transparent w-0 group-hover:w-full transition-all duration-500 rounded-lg"></span>
            </div>
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};
