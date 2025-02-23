
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";

interface ScheduleMatchDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ScheduleMatchDialog = ({ isOpen, onClose }: ScheduleMatchDialogProps) => {
  const [creator1, setCreator1] = useState("");
  const [creator2, setCreator2] = useState("");
  const [matchDate, setMatchDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("upcoming_matches").insert({
        creator_id: creator1,
        opponent_id: creator2,
        match_date: new Date(matchDate).toISOString(),
      });

      if (error) throw error;

      toast({
        title: "Match programmé",
        description: "Le match a été ajouté avec succès.",
      });
      
      onClose();
      setCreator1("");
      setCreator2("");
      setMatchDate("");
    } catch (error) {
      console.error("Erreur lors de la programmation du match:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la programmation du match.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Programmer un match</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="creator1">Premier créateur</Label>
            <Input
              id="creator1"
              value={creator1}
              onChange={(e) => setCreator1(e.target.value)}
              placeholder="ex: SABRI_AMD"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="creator2">Deuxième créateur</Label>
            <Input
              id="creator2"
              value={creator2}
              onChange={(e) => setCreator2(e.target.value)}
              placeholder="ex: TEST_123"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="matchDate">Date et heure du match</Label>
            <Input
              id="matchDate"
              type="datetime-local"
              value={matchDate}
              onChange={(e) => setMatchDate(e.target.value)}
              required
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "En cours..." : "Programmer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
