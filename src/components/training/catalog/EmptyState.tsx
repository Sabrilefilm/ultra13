
import React from "react";
import { SearchX } from "lucide-react";

interface EmptyStateProps {
  selectedTheme: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ selectedTheme }) => {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-16 px-4 text-center bg-gradient-to-br from-blue-50/80 to-indigo-50/80 dark:from-blue-900/10 dark:to-indigo-900/10 rounded-lg border border-blue-100 dark:border-blue-900/20 shadow-sm">
      <div className="bg-blue-100/50 dark:bg-blue-900/20 p-4 rounded-full mb-4">
        <SearchX className="h-12 w-12 text-blue-500 dark:text-blue-400" />
      </div>
      <h3 className="text-xl font-medium text-blue-700 dark:text-blue-400 mb-3">
        Aucune formation trouvée
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md">
        {selectedTheme === "all" 
          ? "Aucune formation n'est disponible dans cette catégorie pour le moment."
          : `Aucune formation sur "${selectedTheme}" n'est disponible dans cette catégorie pour le moment.`}
      </p>
    </div>
  );
};
