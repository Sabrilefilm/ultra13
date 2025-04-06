
import React from "react";
import { useNavigate } from "react-router-dom";
import { Home, Users, MessageSquare, Book, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { motion } from "framer-motion";

interface MobileNavigationProps {
  role: string;
  currentPage: string;
  onOpenMenu: () => void;
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({
  role,
  currentPage,
  onOpenMenu
}) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  if (!isMobile) return null;
  
  const navItems = [
    {
      icon: Home,
      label: "Accueil",
      path: "/",
      roles: ["founder", "manager", "agent", "creator", "ambassadeur", "client"]
    },
    {
      icon: Users,
      label: "Équipe",
      path: "/user-management",
      roles: ["founder", "manager", "agent"]
    },
    {
      icon: MessageSquare,
      label: "Messages",
      path: "/messages",
      roles: ["founder", "manager", "agent", "creator", "ambassadeur", "client"]
    },
    {
      icon: Book,
      label: "Cours",
      path: "/training",
      roles: ["founder", "manager", "agent", "creator", "ambassadeur", "client"]
    }
  ];
  
  const filteredItems = navItems.filter(item => item.roles.includes(role));
  
  const handleNavigation = (path: string) => {
    navigate(path);
  };
  
  return (
    <motion.div 
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-lg border-t border-purple-800/20 z-50 px-2 py-1 md:hidden"
    >
      <div className="flex items-center justify-between">
        {filteredItems.slice(0, 4).map((item) => (
          <Button
            key={item.label}
            variant="ghost"
            size="sm"
            onClick={() => handleNavigation(item.path)}
            className={`flex flex-col items-center justify-center py-1 px-1 ${
              currentPage === item.path || 
              (item.path === '/' && currentPage === 'dashboard') ? 
              "text-purple-400 bg-purple-900/20" : 
              "text-slate-400"
            }`}
          >
            <item.icon className="h-4 w-4 mb-1" />
            <span className="text-[10px]">{item.label}</span>
          </Button>
        ))}
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onOpenMenu}
          className="flex flex-col items-center justify-center py-1 px-1 text-slate-400"
        >
          <Menu className="h-4 w-4 mb-1" />
          <span className="text-[10px]">Menu</span>
        </Button>
      </div>
    </motion.div>
  );
};
