
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface RewardSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (diamondValue: number, minimumPayout: number) => Promise<void>;
  currentSettings?: {
    diamondValue: number;
    minimumPayout: number;
  };
}

export function RewardSettingsModal({ isOpen, onClose, onSubmit, currentSettings }: RewardSettingsModalProps) {
  const [diamondValue, setDiamondValue] = useState(currentSettings?.diamondValue.toString() || "0.01");
  const [minimumPayout, setMinimumPayout] = useState(currentSettings?.minimumPayout.toString() || "50");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    const dValue = parseFloat(diamondValue);
    const mPayout = parseFloat(minimumPayout);

    if (isNaN(dValue) || isNaN(mPayout)) return;

    setIsLoading(true);
    try {
      await onSubmit(dValue, mPayout);
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Configuration des récompenses</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="diamondValue">Valeur d'un diamant (€)</Label>
            <Input
              id="diamondValue"
              type="number"
              step="0.01"
              value={diamondValue}
              onChange={(e) => setDiamondValue(e.target.value)}
              placeholder="0.01"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="minimumPayout">Paiement minimum (€)</Label>
            <Input
              id="minimumPayout"
              type="number"
              step="0.01"
              value={minimumPayout}
              onChange={(e) => setMinimumPayout(e.target.value)}
              placeholder="50"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "Mise à jour..." : "Mettre à jour"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
