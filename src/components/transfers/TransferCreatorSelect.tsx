
import React from 'react';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Creator } from './hooks/useTransferRequestForm';

interface TransferCreatorSelectProps {
  creators: Creator[];
  selectedCreator: string;
  onSelectCreator: (value: string) => void;
}

export const TransferCreatorSelect: React.FC<TransferCreatorSelectProps> = ({
  creators,
  selectedCreator,
  onSelectCreator
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="creator">Créateur</Label>
      <Select 
        value={selectedCreator} 
        onValueChange={onSelectCreator}
      >
        <SelectTrigger id="creator">
          <SelectValue placeholder="Sélectionnez un créateur" />
        </SelectTrigger>
        <SelectContent>
          {creators.map((creator) => (
            <SelectItem key={creator.id} value={creator.id}>
              {creator.username}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
