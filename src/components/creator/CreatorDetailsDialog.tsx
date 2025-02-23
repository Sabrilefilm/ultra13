
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface CreatorDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  creatorDetails: {
    first_name?: string;
    last_name?: string;
    address?: string;
    id_card_number?: string;
    email?: string;
    paypal_address?: string;
    snapchat?: string;
  } | null;
}

export function CreatorDetailsDialog({ isOpen, onClose, creatorDetails }: CreatorDetailsProps) {
  const fields = [
    { label: "Prénom", value: creatorDetails?.first_name },
    { label: "Nom", value: creatorDetails?.last_name },
    { label: "Adresse", value: creatorDetails?.address },
    { label: "Numéro de carte d'identité", value: creatorDetails?.id_card_number },
    { label: "Email", value: creatorDetails?.email },
    { label: "Adresse PayPal", value: creatorDetails?.paypal_address },
    { label: "Snapchat", value: creatorDetails?.snapchat },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Informations détaillées</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {fields.map((field, index) => (
            <div key={index} className="space-y-2">
              <Label className="font-medium">{field.label}</Label>
              <p className="text-sm text-muted-foreground">
                {field.value || "Non renseigné"}
              </p>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
