
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { TransferCreatorSelect } from './TransferCreatorSelect';
import { TransferAgentSelect } from './TransferAgentSelect';
import { TransferReasonInput } from './TransferReasonInput';
import { TransferDialogLoading } from './TransferDialogLoading';
import { useTransferRequestForm } from './hooks/useTransferRequestForm';

interface TransferRequestDialogProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  role: string;
  onSuccess: () => void;
}

export const TransferRequestDialog = ({
  isOpen,
  onClose,
  userId,
  role,
  onSuccess
}: TransferRequestDialogProps) => {
  const {
    agents,
    creators,
    loading,
    selectedAgent,
    setSelectedAgent,
    selectedCreator,
    setSelectedCreator,
    reason,
    setReason,
    handleSubmit,
    isFormValid
  } = useTransferRequestForm(isOpen, userId, role, onSuccess, onClose);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Nouvelle demande de transfert</DialogTitle>
          <DialogDescription>
            {role === 'creator' 
              ? "Demandez à être transféré à un autre agent" 
              : "Demandez un transfert pour l'un de vos créateurs"}
          </DialogDescription>
        </DialogHeader>
        
        {loading ? (
          <TransferDialogLoading />
        ) : (
          <div className="space-y-4 py-4">
            {role === 'agent' && (
              <TransferCreatorSelect
                creators={creators}
                selectedCreator={selectedCreator}
                onSelectCreator={setSelectedCreator}
              />
            )}
            
            <TransferAgentSelect
              agents={agents}
              selectedAgent={selectedAgent}
              onSelectAgent={setSelectedAgent}
            />
            
            <TransferReasonInput
              reason={reason}
              onReasonChange={(e) => setReason(e.target.value)}
            />
          </div>
        )}
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Annuler
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={loading || !isFormValid()}
          >
            Envoyer la demande
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
