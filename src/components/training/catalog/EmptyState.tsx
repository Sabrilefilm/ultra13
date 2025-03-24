
import React from "react";
import { Sparkles } from "lucide-react";

interface EmptyStateProps {
  selectedTheme: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ selectedTheme }) => {
  return (
    <div className="col-span-3 flex flex-col items-center justify-center py-12 text-center">
      <Sparkles className="h-12 w-12 text-blue-200 mb-4" />
      <h3 className="text-lg font-medium mb-2">Aucune formation trouvée</h3>
      <p className="text-sm text-muted-foreground max-w-md">
        {selectedTheme !== "all" 
          ? `Aucune formation disponible pour la thématique "${selectedTheme}".` 
          : "Aucune formation n'est disponible pour le moment."}
      </p>
    </div>
  );
};
