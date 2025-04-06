
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
    <CardHeader className="bg-gradient-to-r from-purple-50 to-white dark:from-purple-950/30 dark:to-slate-950 border-b border-purple-100 dark:border-purple-900/30 bg-slate-50 p-3 sm:p-4">
      <CardTitle className="text-base sm:text-lg mb-3 sm:mb-4 flex items-center gap-2 text-slate-950">
        <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600 dark:text-purple-400" />
        Demandes de transfert
      </CardTitle>
      <Tabs defaultValue="pending" value={selectedTab} onValueChange={onTabChange} className="w-full">
        <TabsList className="bg-purple-100 dark:bg-purple-900/30 w-full justify-start overflow-x-auto">
          <TabsTrigger value="pending" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white flex items-center gap-1 text-xs sm:text-sm">
            <span className="font-normal text-gray-950">En attente</span>
            {pendingCount > 0 && (
              <span className="ml-1 bg-purple-700 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {pendingCount}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="approved" className="data-[state=active]:bg-green-600 data-[state=active]:text-white flex items-center gap-1 text-xs sm:text-sm">
            <CheckCircle className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            <span>Approuvées</span>
            {approvedCount > 0 && (
              <span className="ml-1 bg-green-700 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {approvedCount}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="rejected" className="data-[state=active]:bg-red-600 data-[state=active]:text-white flex items-center gap-1 text-xs sm:text-sm">
            <XCircle className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            <span>Rejetées</span>
            {rejectedCount > 0 && (
              <span className="ml-1 bg-red-700 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {rejectedCount}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="all" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white flex items-center gap-1 text-xs sm:text-sm">
            <ListFilter className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
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
