
import React from "react";
import { SearchX } from "lucide-react";

interface EmptyStateProps {
  selectedTheme: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ selectedTheme }) => {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-12 px-4 text-center bg-blue-50/50 dark:bg-blue-900/5 rounded-lg border border-blue-100 dark:border-blue-900/20">
      <SearchX className="h-12 w-12 text-blue-300 dark:text-blue-700 mb-4" />
      <h3 className="text-lg font-medium text-blue-700 dark:text-blue-400 mb-2">
        Aucune formation trouvée
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md">
        {selectedTheme === "all" 
          ? "Aucune formation n'est disponible dans cette catégorie pour le moment."
          : `Aucune formation sur "${selectedTheme}" n'est disponible dans cette catégorie pour le moment.`}
      </p>
    </div>
  );
};
