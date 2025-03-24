
import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface EditDiamondsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  creatorUsername?: string;
  currentDiamonds: number;
  diamondAmount: number;
  setDiamondAmount: (amount: number) => void;
  operationType: 'set' | 'add' | 'subtract';
  setOperationType: (type: 'set' | 'add' | 'subtract') => void;
  onSave: () => Promise<void>;
  diamondValue?: number;
}

export const EditDiamondsDialog: React.FC<EditDiamondsDialogProps> = ({
  isOpen,
  onOpenChange,
  creatorUsername,
  currentDiamonds,
  diamondAmount,
  setDiamondAmount,
  operationType,
  setOperationType,
  onSave,
  diamondValue,
}) => {
  const calculateNewTotal = () => {
    switch (operationType) {
      case 'add':
        return currentDiamonds + diamondAmount;
      case 'subtract':
        return Math.max(0, currentDiamonds - diamondAmount);
      case 'set':
      default:
        return diamondAmount;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Gérer les diamants 💎</DialogTitle>
          <DialogDescription>
            Modifiez les diamants pour {creatorUsername}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center justify-between mb-2">
            <Label>Diamants actuels:</Label>
            <span className="font-bold text-lg">{currentDiamonds.toLocaleString()} 💎</span>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="operationType" className="text-right">
              Opération
            </Label>
            <div className="col-span-3 flex gap-2">
              <Button
                type="button"
                variant={operationType === 'set' ? 'default' : 'outline'}
                onClick={() => setOperationType('set')}
                className="flex-1"
              >
                Définir
              </Button>
              <Button
                type="button"
                variant={operationType === 'add' ? 'default' : 'outline'}
                onClick={() => setOperationType('add')}
                className="flex-1"
              >
                Ajouter
              </Button>
              <Button
                type="button"
                variant={operationType === 'subtract' ? 'default' : 'outline'}
                onClick={() => setOperationType('subtract')}
                className="flex-1"
              >
                Déduire
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="diamonds" className="text-right">
              {operationType === 'set' ? 'Nouvelle valeur' : 'Quantité'}
            </Label>
            <Input
              id="diamonds"
              type="number"
              min="0"
              value={diamondAmount}
              onChange={(e) => setDiamondAmount(Number(e.target.value))}
              className="col-span-3"
            />
          </div>

          {diamondValue && (
            <div className="bg-muted/50 p-3 rounded-md">
              <p className="text-sm">
                Valeur: {(diamondAmount * diamondValue).toLocaleString()}€
              </p>
            </div>
          )}
          
          {operationType !== 'set' && (
            <div className="flex items-center justify-between">
              <Label>Nouvelle valeur totale:</Label>
              <span className="font-bold">
                {calculateNewTotal().toLocaleString()} 💎
              </span>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Annuler</Button>
          <Button type="submit" onClick={onSave}>Sauvegarder</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
