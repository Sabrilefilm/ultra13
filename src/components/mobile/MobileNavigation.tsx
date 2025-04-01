
import React from "react";
import { useNavigate } from "react-router-dom";
import { Home, Users, MessageSquare, Settings, Menu } from "lucide-react";
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
      roles: ["founder", "manager", "agent", "creator", "ambassadeur"]
    },
    {
      icon: Users,
      label: "Utilisateurs",
      path: "/user-management",
      roles: ["founder", "manager", "agent"]
    },
    {
      icon: MessageSquare,
      label: "Messages",
      path: "/messages",
      roles: ["founder", "manager", "agent", "creator", "ambassadeur"]
    },
    {
      icon: Settings,
      label: "Règles",
      path: role === "creator" || role === "ambassadeur" ? "/creator-rules" : "/internal-rules",
      roles: ["founder", "manager", "agent", "creator", "ambassadeur"]
    }
  ];
  
  const filteredItems = navItems.filter(item => item.roles.includes(role));
  
  return (
    <motion.div 
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 bg-slate-900/90 backdrop-blur-md border-t border-purple-800/20 z-50 px-2 py-1 md:hidden"
    >
      <div className="flex items-center justify-between">
        {filteredItems.map((item) => (
          <Button
            key={item.label}
            variant="ghost"
            size="sm"
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center py-2 px-1 ${
              currentPage === item.path ? "text-purple-500" : "text-slate-400"
            }`}
          >
            <item.icon className="h-5 w-5 mb-1" />
            <span className="text-xs">{item.label}</span>
          </Button>
        ))}
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onOpenMenu}
          className="flex flex-col items-center py-2 px-1 text-slate-400"
        >
          <Menu className="h-5 w-5 mb-1" />
          <span className="text-xs">Menu</span>
        </Button>
      </div>
    </motion.div>
  );
};
