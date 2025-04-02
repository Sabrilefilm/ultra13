
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, LogOut } from "lucide-react";

interface DashboardContentProps {
  username: string;
  role: string;
  currentPage?: string;
  onAction?: (action: string, data?: any) => void;
  onLogout: () => void;
  children?: React.ReactNode;
}

export const DashboardContent: React.FC<DashboardContentProps> = ({
  username,
  role,
  currentPage,
  onAction,
  onLogout,
  children
}) => {
  const navigate = useNavigate();
  
  const handleBackClick = () => {
    navigate('/'); // Toujours rediriger vers l'accueil
  };
  
  return (
    <div className="flex-1 p-0 md:p-4 overflow-y-auto">
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-center p-4 md:hidden border-b border-slate-700/30">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleBackClick}
            className="flex md:hidden h-10 w-10 bg-slate-800/50 text-white"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          <h1 className="text-xl font-bold text-white">{currentPage}</h1>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={onLogout}
            className="flex md:hidden h-10 w-10 bg-slate-800/50 text-white"
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="flex-1">
          {children}
        </div>
      </div>
    </div>
  );
};
