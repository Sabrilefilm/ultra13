
import React from "react";
import { AlertTriangle, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ObjectiveWarningProps {
  show: boolean;
  onContactClick: () => void;
}

export const ObjectiveWarning: React.FC<ObjectiveWarningProps> = ({
  show,
  onContactClick
}) => {
  if (!show) return null;
  
  return (
    <div className="bg-red-900/20 border border-red-700/30 rounded-lg p-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <AlertTriangle className="h-6 w-6 text-red-400 animate-pulse" />
        <div>
          <h4 className="font-medium text-red-300">Attention aux objectifs</h4>
          <p className="text-red-400/80 text-sm">Vous risquez de ne pas atteindre vos objectifs mensuels, ce qui peut entraîner une exclusion de l'agence ou une perte de récompenses.</p>
        </div>
      </div>
      <Button 
        variant="outline" 
        className="border-red-700/50 text-red-300 hover:bg-red-800/30"
        onClick={onContactClick}
      >
        <MessageCircle className="h-4 w-4 mr-2" />
        Contacter le fondateur
      </Button>
    </div>
  );
};
