
import React from "react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface SidebarLogoutProps {
  onLogout: () => void;
  collapsed: boolean;
}

export const SidebarLogout: React.FC<SidebarLogoutProps> = ({ onLogout, collapsed }) => {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    onLogout();
    // Rediriger vers la page d'authentification après la déconnexion
    navigate("/");
  };
  
  return (
    <div className="p-4 border-t border-slate-700/50">
      <Button 
        variant="ghost" 
        className={`w-full flex items-center ${collapsed ? "justify-center" : "justify-start"} px-3 py-2 text-sm rounded-md text-red-400 hover:bg-red-900/20 hover:text-red-300`} 
        onClick={handleLogout}
      >
        <LogOut className={`h-5 w-5 ${!collapsed && "mr-3"}`} />
        {!collapsed && <span>Déconnexion</span>}
      </Button>
    </div>
  );
};
