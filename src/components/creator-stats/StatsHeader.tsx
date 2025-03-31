
import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface StatsHeaderProps {
  totalCreators: number;
  totalActiveCreators: number;
  onViewTypeChange: (type: "all" | "week" | "month") => void;
  viewType: "all" | "week" | "month";
}

export const StatsHeader: React.FC<StatsHeaderProps> = ({
  totalCreators,
  totalActiveCreators,
  onViewTypeChange,
  viewType
}) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-bold">Statistiques des créateurs</h1>
        <p className="text-gray-500 dark:text-gray-400">
          {totalCreators} créateurs au total, {totalActiveCreators} actifs
        </p>
      </div>
      <Tabs value={viewType} onValueChange={onViewTypeChange as (value: string) => void}>
        <TabsList>
          <TabsTrigger value="all">Tous</TabsTrigger>
          <TabsTrigger value="week">Cette semaine</TabsTrigger>
          <TabsTrigger value="month">Ce mois</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};
