import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

interface EditMatchDialogProps {
  isOpen: boolean;
  onClose: () => void;
  match: any;
  onUpdate: (matchId: string, updatedData: any) => Promise<void>;
}

export const EditMatchDialog = ({ isOpen, onClose, match, onUpdate }: EditMatchDialogProps) => {
  const [creator1, setCreator1] = useState(match?.creator_id || "");
  const [creator2, setCreator2] = useState(match?.opponent_id || "");
  const [matchDate, setMatchDate] = useState(match?.match_date ? new Date(match.match_date).toISOString().split('T')[0] : "");
  const [matchTime, setMatchTime] = useState(match?.match_date ? new Date(match.match_date).toTimeString().slice(0, 5) : "");
  const [isBoost, setIsBoost] = useState(match?.status !== 'off' && match?.status !== 'completed_off');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const matchDateTime = new Date(`${matchDate}T${matchTime}`);
      
      // Determine the correct status based on the current status and isBoost value
      let newStatus = match.status;
      
      if (match.winner_id) {
        // If there's a winner, we keep it as completed but change if it's boost or not
        newStatus = isBoost ? 'completed' : 'completed_off';
      } else {
        // If there's no winner, we use the standard statuses
        newStatus = isBoost ? 'scheduled' : 'off';
      }

      await onUpdate(match.id, {
        creator_id: creator1,
        opponent_id: creator2,
        match_date: matchDateTime.toISOString(),
        status: newStatus
      });
      
      onClose();
    } catch (error) {
      console.error("Error updating match:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifier le match</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="creator1">Premier créateur</Label>
            <Input
              id="creator1"
              value={creator1}
              onChange={(e) => setCreator1(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="creator2">Deuxième créateur</Label>
            <Input
              id="creator2"
              value={creator2}
              onChange={(e) => setCreator2(e.target.value)}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="matchDate">Date du match</Label>
              <Input
                id="matchDate"
                type="date"
                value={matchDate}
                onChange={(e) => setMatchDate(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="matchTime">Heure du match</Label>
              <Input
                id="matchTime"
                type="time"
                value={matchTime}
                onChange={(e) => setMatchTime(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="boost-mode"
              checked={isBoost}
              onCheckedChange={setIsBoost}
            />
            <Label htmlFor="boost-mode" className="cursor-pointer">
              {isBoost ? "Avec Boost" : "Sans Boost"}
            </Label>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "En cours..." : "Enregistrer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
