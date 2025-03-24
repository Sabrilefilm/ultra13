
import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface EditScheduleDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  creatorUsername?: string;
  hours: number;
  days: number;
  setHours: (hours: number) => void;
  setDays: (days: number) => void;
  onSave: () => Promise<void>;
}

export const EditScheduleDialog: React.FC<EditScheduleDialogProps> = ({
  isOpen,
  onOpenChange,
  creatorUsername,
  hours,
  days,
  setHours,
  setDays,
  onSave,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Modifier les horaires ⏰</DialogTitle>
          <DialogDescription>
            Ajustez les heures de streaming et les jours pour {creatorUsername}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="hours" className="text-right">
              Heures
            </Label>
            <Input
              id="hours"
              type="number"
              value={hours}
              onChange={(e) => setHours(Number(e.target.value))}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="days" className="text-right">
              Jours
            </Label>
            <Input
              id="days"
              type="number"
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={onSave}>Sauvegarder</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
