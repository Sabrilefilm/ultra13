
import React from 'react';
import { 
  Dialog, 
  DialogContent,
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface Creator {
  id: string;
  username: string;
  role: string;
  total_diamonds: number;
  diamonds_goal: number;
}

interface DiamondManagementDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedCreator: Creator | null;
  diamondAmount: number;
  setDiamondAmount: (value: number) => void;
  operationType: 'add' | 'subtract';
  onSave: () => Promise<void>;
  isEditing: boolean;
}

export function DiamondManagementDialog({
  isOpen,
  onOpenChange,
  selectedCreator,
  diamondAmount,
  setDiamondAmount,
  operationType,
  onSave,
  isEditing
}: DiamondManagementDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {operationType === 'add' ? 'Ajouter des diamants' : 'Retirer des diamants'}
          </DialogTitle>
          <DialogDescription>
            {operationType === 'add' 
              ? 'Indiquez le nombre de diamants à ajouter' 
              : 'Indiquez le nombre de diamants à retirer'}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <p className="text-sm font-medium">Utilisateur:</p>
            <p className="font-bold">{selectedCreator?.username} ({selectedCreator?.role})</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium">Diamants actuels:</p>
            <p>{selectedCreator?.total_diamonds.toLocaleString()}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium">
              {operationType === 'add' ? 'Nombre de diamants à ajouter:' : 'Nombre de diamants à retirer:'}
            </p>
            <Input
              type="number"
              value={diamondAmount}
              onChange={(e) => setDiamondAmount(Number(e.target.value))}
              min={0}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={onSave} disabled={isEditing || diamondAmount <= 0}>
            {operationType === 'add' ? 'Ajouter' : 'Retirer'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
