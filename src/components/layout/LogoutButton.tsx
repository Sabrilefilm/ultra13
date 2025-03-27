
import React from "react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface LogoutButtonProps {
  onLogout: () => void;
  username?: string;
  className?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

export const LogoutButton: React.FC<LogoutButtonProps> = ({ 
  onLogout, 
  username,
  className = "",
  variant = "outline",
  size = "default"
}) => {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    onLogout();
    toast.success("Vous êtes déconnecté");
    navigate("/");
  };
  
  return (
    <Button 
      variant={variant} 
      size={size}
      onClick={handleLogout}
      className={`flex items-center gap-2 ${className}`}
    >
      <LogOut className="h-4 w-4" />
      <span className="hidden sm:inline">{username ? `Déconnecter ${username}` : "Déconnexion"}</span>
      <span className="sm:hidden">Quitter</span>
    </Button>
  );
};
