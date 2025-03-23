
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, CheckCircle, XCircle, ListFilter } from 'lucide-react';

interface TransferTabsProps {
  selectedTab: string;
  onTabChange: (value: string) => void;
  pendingCount?: number;
  approvedCount?: number;
  rejectedCount?: number;
  totalCount?: number;
}

export const TransferTabs: React.FC<TransferTabsProps> = ({ 
  selectedTab, 
  onTabChange,
  pendingCount = 0,
  approvedCount = 0,
  rejectedCount = 0,
  totalCount = 0
}) => {
  return (
    <CardHeader className="bg-gradient-to-r from-purple-50 to-white dark:from-purple-950/30 dark:to-slate-950 border-b border-purple-100 dark:border-purple-900/30">
      <CardTitle className="text-lg text-purple-900 dark:text-purple-100 mb-4 flex items-center gap-2">
        <Calendar className="h-5 w-5 text-purple-600 dark:text-purple-400" />
        Demandes de transfert
      </CardTitle>
      <Tabs defaultValue="pending" value={selectedTab} onValueChange={onTabChange} className="w-full">
        <TabsList className="bg-purple-100 dark:bg-purple-900/30 w-full justify-start overflow-x-auto">
          <TabsTrigger 
            value="pending" 
            className="data-[state=active]:bg-purple-600 data-[state=active]:text-white flex items-center gap-1"
          >
            <span>En attente</span>
            {pendingCount > 0 && (
              <span className="ml-1 bg-purple-700 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {pendingCount}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger 
            value="approved" 
            className="data-[state=active]:bg-green-600 data-[state=active]:text-white flex items-center gap-1"
          >
            <CheckCircle className="h-3.5 w-3.5" />
            <span>Approuvées</span>
            {approvedCount > 0 && (
              <span className="ml-1 bg-green-700 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {approvedCount}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger 
            value="rejected" 
            className="data-[state=active]:bg-red-600 data-[state=active]:text-white flex items-center gap-1"
          >
            <XCircle className="h-3.5 w-3.5" />
            <span>Rejetées</span>
            {rejectedCount > 0 && (
              <span className="ml-1 bg-red-700 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {rejectedCount}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger 
            value="all" 
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white flex items-center gap-1"
          >
            <ListFilter className="h-3.5 w-3.5" />
            <span>Toutes</span>
            {totalCount > 0 && (
              <span className="ml-1 bg-blue-700 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {totalCount}
              </span>
            )}
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </CardHeader>
  );
};
