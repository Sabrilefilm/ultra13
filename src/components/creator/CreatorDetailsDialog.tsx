
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CreatorDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  creatorDetails: {
    snapchat?: string;
  } | null;
  isFounder: boolean;
}

export function CreatorDetailsDialog({ isOpen, onClose, creatorDetails, isFounder }: CreatorDetailsProps) {
  if (!creatorDetails) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Détails du Créateur</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {isFounder ? (
            <>
              <div>
                <span className="font-medium">Snapchat:</span>{" "}
                {creatorDetails.snapchat || "Non renseigné"}
              </div>
            </>
          ) : (
            <div className="text-center text-muted-foreground">
              Ces informations sont réservées au fondateur.
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
