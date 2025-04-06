import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Plus, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
interface TransferHeaderProps {
  role: string;
  onOpenTransferDialog: () => void;
  onExportData?: () => void;
}
export const TransferHeader: React.FC<TransferHeaderProps> = ({
  role,
  onOpenTransferDialog,
  onExportData
}) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const getRoleButtonClass = () => {
    switch (role) {
      case 'creator':
        return "bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white";
      case 'agent':
        return "bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white";
      default:
        return "bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white";
    }
  };
  return <div className="border-b border-gray-200 dark:border-gray-800 p-4 flex flex-wrap gap-4 items-center justify-between shadow-md bg-gray-800">
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="sm" onClick={() => navigate("/")} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-600">
          {isMobile ? "Transferts" : "Gestion des Transferts"}
        </h1>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {(role === 'creator' || role === 'agent') && <Button onClick={onOpenTransferDialog} className={`${getRoleButtonClass()} shadow-md transition-all duration-200`}>
            <Plus className="mr-2 h-4 w-4" />
            {isMobile ? "Demande" : "Demande de transfert"}
          </Button>}
        
        {role === 'founder' && onExportData && <Button onClick={onExportData} variant="outline" className="border-indigo-200 text-indigo-700 hover:bg-indigo-50 dark:border-indigo-800 dark:text-indigo-400 dark:hover:bg-indigo-950/50">
            <Download className="mr-2 h-4 w-4" />
            {isMobile ? "Exporter" : "Exporter les données"}
          </Button>}
      </div>
    </div>;
};