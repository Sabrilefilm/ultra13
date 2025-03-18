
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface TransferReasonInputProps {
  reason: string;
  onReasonChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export const TransferReasonInput: React.FC<TransferReasonInputProps> = ({
  reason,
  onReasonChange
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="reason">Raison de la demande</Label>
      <Textarea
        id="reason"
        placeholder="Expliquez pourquoi vous souhaitez ce transfert..."
        value={reason}
        onChange={onReasonChange}
        rows={4}
      />
    </div>
  );
};
