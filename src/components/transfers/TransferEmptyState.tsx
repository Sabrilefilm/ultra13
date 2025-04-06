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
  return <div className="flex flex-col items-center justify-center py-12">
      <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mb-4">
        <Clock className="h-8 w-8 text-purple-500 dark:text-purple-400" />
      </div>
      <p className="mb-2 text-slate-50">Aucune demande de transfert</p>
      {role === 'creator' && <Button onClick={onOpenTransferDialog} variant="outline" className="mt-4 border-purple-300 dark:border-purple-700 text-purple-700 dark:text-purple-300">
          <Plus className="mr-2 h-4 w-4" />
          Faire une demande
        </Button>}
    </div>;
};