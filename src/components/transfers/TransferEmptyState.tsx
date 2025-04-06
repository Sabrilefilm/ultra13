
import React from 'react';
import { Button } from '@/components/ui/button';
import { Clock, Plus } from 'lucide-react';

interface TransferEmptyStateProps {
  role: string;
  onOpenTransferDialog: () => void;
}

export const TransferEmptyState: React.FC<TransferEmptyStateProps> = ({
  role,
  onOpenTransferDialog
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-4 sm:py-8">
      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mb-3 shadow-inner">
        <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-purple-500 dark:text-purple-400" />
      </div>
      <p className="mb-2 text-slate-50 text-center text-sm">Aucune demande de transfert</p>
      {role === 'creator' && (
        <Button 
          onClick={onOpenTransferDialog} 
          variant="outline" 
          size="sm"
          className="mt-2 border-purple-300 dark:border-purple-700 text-purple-700 dark:text-purple-300 text-xs bg-purple-900/20 hover:bg-purple-900/30"
        >
          <Plus className="mr-1 h-3 w-3" />
          Demande
        </Button>
      )}
    </div>
  );
};
