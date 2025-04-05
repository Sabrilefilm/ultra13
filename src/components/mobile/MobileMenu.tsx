
import React, { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, Home, Users, MessageSquare, Book, FileText, User, Bell, ArrowLeft, Trophy } from "lucide-react";
import { useNavigate } from "react-router-dom";
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
  const [isOpen, setIsOpen] = useState(false);
  
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
  
  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="outline" 
          size="icon" 
          className="md:hidden fixed top-4 left-4 z-50 bg-slate-800/60 backdrop-blur-sm border-slate-700"
          onClick={(e) => {
            e.stopPropagation(); // Prevent event bubbling
          }}
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent 
        side="left" 
        className="w-full sm:w-[300px] p-0 bg-black/50 backdrop-blur-lg border-r border-purple-800/30"
        onClick={(e) => e.stopPropagation()} // Stop clicks within menu from propagating
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-slate-700/50">
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
                      currentPage === item.path 
                        ? "bg-gradient-to-r from-purple-800/50 to-blue-800/50 text-white" 
                        : "text-slate-300 hover:text-white hover:bg-slate-800/50"
                    }`}
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent event bubbling
                      handleNavigate(item.path);
                    }}
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
              onClick={(e) => {
                e.stopPropagation(); // Prevent event bubbling
                onLogout();
              }}
            >
              Déconnexion
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
