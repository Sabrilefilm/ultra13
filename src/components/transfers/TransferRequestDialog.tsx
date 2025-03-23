
import React, { useState } from 'react';
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
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

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
    isFormValid
  } = useTransferRequestForm(isOpen, userId, role, onSuccess, onClose);

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!isFormValid()) {
      toast.error("Veuillez remplir tous les champs requis");
      return;
    }

    setSubmitting(true);

    try {
      // Résoudre le problème d'autorisation RLS en utilisant une fonction RPC
      const { data, error } = await supabase.rpc('create_transfer_request', {
        creator_id_param: selectedCreator,
        requested_agent_id_param: selectedAgent,
        current_agent_id_param: userId,
        reason_param: reason
      });

      if (error) throw error;

      toast.success("Demande de transfert envoyée avec succès");
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Erreur lors de la création de la demande de transfert:', error);
      toast.error("Une erreur est survenue lors de l'envoi de la demande");
    } finally {
      setSubmitting(false);
    }
  };

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
          <Button variant="outline" onClick={onClose} disabled={loading || submitting}>
            Annuler
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={loading || submitting || !isFormValid()}
            className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700"
          >
            {submitting ? "Envoi en cours..." : "Envoyer la demande"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
