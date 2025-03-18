
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CardHeader, CardTitle } from '@/components/ui/card';

interface TransferTabsProps {
  selectedTab: string;
  onTabChange: (value: string) => void;
}

export const TransferTabs: React.FC<TransferTabsProps> = ({ selectedTab, onTabChange }) => {
  return (
    <CardHeader className="bg-gradient-to-r from-purple-50 to-white dark:from-purple-950/30 dark:to-slate-950">
      <CardTitle className="text-lg text-purple-900 dark:text-purple-100">Demandes de transfert</CardTitle>
      <Tabs defaultValue="pending" value={selectedTab} onValueChange={onTabChange}>
        <TabsList className="bg-purple-100 dark:bg-purple-900/30">
          <TabsTrigger value="pending" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">En attente</TabsTrigger>
          <TabsTrigger value="approved" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">Approuvées</TabsTrigger>
          <TabsTrigger value="rejected" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">Rejetées</TabsTrigger>
          <TabsTrigger value="all" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">Toutes</TabsTrigger>
        </TabsList>
      </Tabs>
    </CardHeader>
  );
};
