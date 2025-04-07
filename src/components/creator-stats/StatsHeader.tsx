
import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RefreshCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BackButton } from "@/components/ui/back-button";

interface StatsHeaderProps {
  totalCreators: number;
  totalActiveCreators: number;
  onViewTypeChange: (type: "all" | "week" | "month") => void;
  viewType: "all" | "week" | "month";
  onRefresh?: () => void;
  isLoading?: boolean;
}

export const StatsHeader: React.FC<StatsHeaderProps> = ({
  totalCreators,
  totalActiveCreators,
  onViewTypeChange,
  viewType,
  onRefresh,
  isLoading = false
}) => {
  const navigate = useNavigate();
  
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <BackButton returnTo="/" />
        <h2 className="text-2xl font-bold">Statistiques des Créateurs</h2>
      </div>
      
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <p className="text-gray-500 dark:text-gray-400">
            {totalCreators} créateurs au total, {totalActiveCreators} actifs
          </p>
          {onRefresh && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={onRefresh}
              disabled={isLoading}
              className="h-8 w-8 p-0"
            >
              <RefreshCcw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span className="sr-only">Actualiser</span>
            </Button>
          )}
        </div>
        <Tabs value={viewType} onValueChange={onViewTypeChange as (value: string) => void}>
          <TabsList>
            <TabsTrigger value="all">Tous</TabsTrigger>
            <TabsTrigger value="week">Cette semaine</TabsTrigger>
            <TabsTrigger value="month">Ce mois</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
};
