
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import { TransferRequest } from './hooks/useTransferRequests';

interface TransferTableProps {
  requests: TransferRequest[];
  role: string;
  selectedTab: string;
  onApprove: (requestId: string) => Promise<void>;
  onReject: (requestId: string, rejectionReason?: string) => Promise<void>;
}

export const TransferTable: React.FC<TransferTableProps> = ({ 
  requests, 
  role, 
  selectedTab,
  onApprove, 
  onReject 
}) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Créateur</TableHead>
          <TableHead>Agent actuel</TableHead>
          <TableHead>Agent demandé</TableHead>
          <TableHead>Raison</TableHead>
          <TableHead>Statut</TableHead>
          <TableHead>Date</TableHead>
          {(role === 'founder' || role === 'manager') && selectedTab === 'pending' && (
            <TableHead>Actions</TableHead>
          )}
        </TableRow>
      </TableHeader>
      <TableBody>
        {requests.map((request) => (
          <TableRow key={request.id}>
            <TableCell>{request.creator?.username || 'Inconnu'}</TableCell>
            <TableCell>{request.current_agent?.username || 'Aucun'}</TableCell>
            <TableCell>{request.requested_agent?.username || 'Inconnu'}</TableCell>
            <TableCell className="max-w-xs truncate">{request.reason || 'Non spécifiée'}</TableCell>
            <TableCell>
              <div className="flex items-center">
                {request.status === 'pending' && (
                  <Clock className="h-4 w-4 text-amber-500 mr-1" />
                )}
                {request.status === 'approved' && (
                  <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                )}
                {request.status === 'rejected' && (
                  <XCircle className="h-4 w-4 text-red-500 mr-1" />
                )}
                <span className="capitalize">
                  {request.status === 'pending' ? 'En attente' : 
                   request.status === 'approved' ? 'Approuvée' : 'Rejetée'}
                </span>
              </div>
              {request.status === 'rejected' && request.rejection_reason && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Raison: {request.rejection_reason}
                </p>
              )}
            </TableCell>
            <TableCell>
              {new Date(request.created_at).toLocaleDateString('fr-FR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
              })}
            </TableCell>
            {(role === 'founder' || role === 'manager') && request.status === 'pending' && (
              <TableCell>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-green-600 border-green-600 hover:bg-green-50 dark:hover:bg-green-950"
                    onClick={() => onApprove(request.id)}
                  >
                    Approuver
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-red-600 border-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                    onClick={() => onReject(request.id)}
                  >
                    Rejeter
                  </Button>
                </div>
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
