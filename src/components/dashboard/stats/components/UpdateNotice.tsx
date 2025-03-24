
import React from "react";
import { Clock } from "lucide-react";

export const UpdateNotice: React.FC = () => {
  return (
    <div className="bg-blue-900/20 border border-blue-700/30 rounded-lg p-4 flex items-center gap-3">
      <Clock className="h-6 w-6 text-blue-400 animate-pulse" />
      <p className="text-blue-400/80 text-sm">
        Les horaires et diamants sont mis à jour toutes les 24-48 heures, hors week-end. 
        Seul le fondateur peut modifier ces valeurs.
      </p>
    </div>
  );
};
