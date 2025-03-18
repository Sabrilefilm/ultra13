
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface TransferHeaderProps {
  role: string;
  onOpenTransferDialog: () => void;
}

export const TransferHeader: React.FC<TransferHeaderProps> = ({ role, onOpenTransferDialog }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white dark:bg-slate-950 border-b border-gray-200 dark:border-gray-800 p-4 flex items-center justify-between shadow-sm">
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/")}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold">Gestion des Transferts</h1>
      </div>
      
      {(role === 'creator' || role === 'agent') && (
        <Button
          onClick={onOpenTransferDialog}
          className="bg-purple-600 hover:bg-purple-700 text-white"
        >
          <Plus className="mr-2 h-4 w-4" />
          Demande de transfert
        </Button>
      )}
    </div>
  );
};
