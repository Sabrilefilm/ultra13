
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
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

interface EditGoalDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedCreator: Creator | null;
  newDiamondGoal: number;
  setNewDiamondGoal: (value: number) => void;
  onSave: () => Promise<void>;
  isEditing: boolean;
}

export function EditGoalDialog({
  isOpen,
  onOpenChange,
  selectedCreator,
  newDiamondGoal,
  setNewDiamondGoal,
  onSave,
  isEditing
}: EditGoalDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifier l'objectif de diamants</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <p className="text-sm font-medium">Utilisateur:</p>
            <p className="font-bold">{selectedCreator?.username}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium">Diamants actuels:</p>
            <p>{selectedCreator?.total_diamonds.toLocaleString()}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium">Nouvel objectif:</p>
            <Input
              type="number"
              value={newDiamondGoal}
              onChange={(e) => setNewDiamondGoal(Number(e.target.value))}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={onSave} disabled={isEditing}>
            Enregistrer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
