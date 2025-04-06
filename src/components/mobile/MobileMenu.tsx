
import React, { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, Home, Users, MessageSquare, Book, FileText, User, Bell, ArrowLeft, Trophy } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

interface MobileMenuProps {
  username: string;
  role: string;
  currentPage?: string;
  onLogout: () => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({
  username,
  role,
  currentPage,
  onLogout
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  
  // Réinitialiser l'état du menu lors du changement de route
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);
  
  const handleClose = () => {
    setIsOpen(false);
  };
  
  const menuItems = [
    {
      label: "Accueil",
      path: "/",
      icon: Home,
      roles: ["founder", "manager", "agent", "creator", "ambassadeur"]
    },
    {
      label: "Messages",
      path: "/messages",
      icon: MessageSquare,
      roles: ["founder", "manager", "agent", "creator", "ambassadeur"]
    },
    {
      label: "Utilisateurs",
      path: "/user-management",
      icon: Users,
      roles: ["founder", "manager"]
    },
    {
      label: "Matchs",
      path: "/matches",
      icon: Trophy,
      roles: ["founder", "manager", "agent", "creator", "ambassadeur"]
    },
    {
      label: "Gestion Agence",
      path: "/agency-assignment",
      icon: Users,
      roles: ["founder", "manager", "agent"]
    },
    {
      label: "Créateurs",
      path: "/creator-stats",
      icon: Users,
      roles: ["founder", "manager", "agent"]
    },
    {
      label: "Transferts",
      path: "/transfers",
      icon: ArrowLeft,
      roles: ["founder", "manager", "creator"]
    },
    {
      label: "Formations",
      path: "/training",
      icon: Book,
      roles: ["founder", "manager", "agent", "creator", "ambassadeur"]
    },
    {
      label: "Règles",
      path: role === "creator" || role === "ambassadeur" ? "/creator-rules" : "/internal-rules",
      icon: Book,
      roles: ["founder", "manager", "agent", "creator", "ambassadeur"]
    },
    {
      label: "Contrat",
      path: "/contract",
      icon: FileText,
      roles: ["founder", "manager", "agent", "creator", "ambassadeur"]
    },
    {
      label: "Infos personnelles",
      path: "/personal-info",
      icon: User,
      roles: ["founder", "manager", "agent", "creator", "ambassadeur"]
    },
    {
      label: "Notifications",
      path: "/notifications",
      icon: Bell,
      roles: ["founder", "manager", "agent", "creator", "ambassadeur"]
    }
  ];
  
  const filteredItems = menuItems.filter(item => item.roles.includes(role));
  
  const handleNavigate = (path: string) => {
    navigate(path);
    handleClose();
  };
  
  const isCurrentPage = (path: string) => {
    return location.pathname === path || currentPage === path;
  };
  
  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="outline" 
          size="icon" 
          className="md:hidden fixed top-4 left-4 z-50 bg-slate-800/60 backdrop-blur-sm border-slate-700"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent 
        side="left" 
        className="w-full sm:w-[300px] p-0 bg-black/80 backdrop-blur-lg border-r border-purple-800/30 overflow-y-auto"
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-slate-700/50 bg-gradient-to-r from-purple-900/50 to-slate-900/50">
            <h2 className="text-xl font-bold text-white">Menu</h2>
            <p className="text-sm text-slate-400">
              Connecté en tant que <span className="text-purple-400">{username}</span>
            </p>
          </div>
          
          <div className="flex-1 overflow-auto py-4 px-2">
            <div className="grid gap-2">
              {filteredItems.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  className="w-full"
                >
                  <Button
                    variant="ghost"
                    className={`w-full justify-start text-left ${
                      isCurrentPage(item.path)
                        ? "bg-gradient-to-r from-purple-800/50 to-blue-800/50 text-white" 
                        : "text-slate-300 hover:text-white hover:bg-slate-800/50"
                    }`}
                    onClick={() => handleNavigate(item.path)}
                  >
                    <item.icon className="h-4 w-4 mr-2" />
                    {item.label}
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>
          
          <div className="p-4 border-t border-slate-700/50">
            <Button 
              variant="destructive" 
              className="w-full"
              onClick={onLogout}
            >
              Déconnexion
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
