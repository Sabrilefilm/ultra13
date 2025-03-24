
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, HomeIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const StatsHeader: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/")}
          className="h-10 w-10"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">
          Mes Créateurs 👨‍💻
        </h1>
      </div>
      
      <Button
        variant="outline"
        onClick={() => navigate("/")}
        className="flex items-center gap-2"
      >
        <HomeIcon className="h-4 w-4" />
        Retour au tableau de bord
      </Button>
    </div>
  );
};
