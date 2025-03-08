
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
  userRole?: string;
}

export const EditMatchDialog = ({ isOpen, onClose, match, onUpdate, userRole = 'creator' }: EditMatchDialogProps) => {
  const [creator1, setCreator1] = useState(match?.creator_id || "");
  const [creator2, setCreator2] = useState(match?.opponent_id || "");
  const [matchDate, setMatchDate] = useState(match?.match_date ? new Date(match.match_date).toISOString().split('T')[0] : "");
  const [matchTime, setMatchTime] = useState(match?.match_date ? new Date(match.match_date).toTimeString().slice(0, 5) : "");
  const [isBoost, setIsBoost] = useState(match?.status !== 'off');
  const [points, setPoints] = useState(match?.points?.toString() || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const canEditPoints = ['founder', 'agent'].includes(userRole);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const matchDateTime = new Date(`${matchDate}T${matchTime}`);
      
      // Déterminer le statut correct en fonction de isBoost et winner_id
      let newStatus;
      if (match.winner_id) {
        // Pour les matchs avec un gagnant, utiliser toujours 'completed'
        newStatus = 'completed';
      } else {
        // Pour les matchs sans gagnant
        newStatus = isBoost ? 'scheduled' : 'off';
      }

      const updatedData: any = {
        creator_id: creator1,
        opponent_id: creator2,
        match_date: matchDateTime.toISOString(),
        status: newStatus
      };

      // Only include points in the update if the user is allowed to edit them
      if (canEditPoints && points) {
        updatedData.points = parseInt(points) || 0;
      }

      await onUpdate(match.id, updatedData);
      
      onClose();
    } catch (error) {
      console.error("Error updating match:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-background border border-border">
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
          {match.winner_id && canEditPoints && (
            <div className="space-y-2">
              <Label htmlFor="points">Points</Label>
              <Input
                id="points"
                type="number"
                value={points}
                onChange={(e) => setPoints(e.target.value)}
                placeholder="Nombre de points"
              />
            </div>
          )}
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
