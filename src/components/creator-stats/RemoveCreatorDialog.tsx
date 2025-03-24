
import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface RemoveCreatorDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  creatorUsername?: string;
  onConfirm: () => Promise<void>;
}

export const RemoveCreatorDialog: React.FC<RemoveCreatorDialogProps> = ({
  isOpen,
  onOpenChange,
  creatorUsername,
  onConfirm,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Retirer le créateur</DialogTitle>
          <DialogDescription>
            Êtes-vous sûr de vouloir retirer {creatorUsername} de votre agence ?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Annuler</Button>
          <Button variant="destructive" onClick={onConfirm}>Confirmer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
