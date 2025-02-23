
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { downloadImage } from "@/utils/download";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/lib/supabase";

interface CreateMatchPosterDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

type MatchType = 'OFF' | 'ANNIVERSAIRE';

export const CreateMatchPosterDialog = ({ isOpen, onClose }: CreateMatchPosterDialogProps) => {
  const [player1Name, setPlayer1Name] = useState("");
  const [player2Name, setPlayer2Name] = useState("");
  const [matchType, setMatchType] = useState<MatchType>("OFF");
  const [matchDate, setMatchDate] = useState("");
  const [matchTime, setMatchTime] = useState("");
  const [width] = useState("1080");
  const [height] = useState("1920");

  const generateAIImage = async (prompt: string) => {
    try {
      const { data: { generatedText }, error } = await supabase.functions.invoke('generate-match-poster', {
        body: {
          prompt: `Create a professional e-sports tournament poster featuring two players facing off. The poster should show "${player1Name}" on the left vs "${player2Name}" on the right. Include the text "${matchType} MATCH" prominently at the top. Display the date "${matchDate}" and time "${matchTime}" in the middle. Add "Phocéen Agency" at the bottom. Use a dynamic, modern gaming style with high contrast and engaging visual effects. Make it look professional and impressive.`
        }
      });

      if (error) throw error;
      return generatedText;
    } catch (error) {
      console.error("Erreur lors de la génération de l'image:", error);
      throw error;
    }
  };

  const handleGenerate = async () => {
    if (!player1Name || !player2Name || !matchDate || !matchTime) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    toast.info("Génération de l'affiche en cours...");

    try {
      const imageUrl = await generateAIImage(`Match ${matchType}`);
      await downloadImage(imageUrl, `match-${matchType.toLowerCase()}-${matchDate.replace(/\//g, '-')}`);
      toast.success("Affiche téléchargée avec succès!");
      onClose();
    } catch (error) {
      toast.error("Erreur lors de la génération de l'affiche");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}} modal>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Créer une affiche de match</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="matchType">Type de match</Label>
            <Select 
              value={matchType} 
              onValueChange={(value: MatchType) => setMatchType(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner le type de match" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="OFF">Match OFF</SelectItem>
                <SelectItem value="ANNIVERSAIRE">Match Anniversaire</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="player1Name">Nom du joueur 1</Label>
            <Input
              id="player1Name"
              placeholder="ex: SABRI_AMD"
              value={player1Name}
              onChange={(e) => setPlayer1Name(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="player2Name">Nom du joueur 2</Label>
            <Input
              id="player2Name"
              placeholder="ex: TEST_123"
              value={player2Name}
              onChange={(e) => setPlayer2Name(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="matchDate">Date du match</Label>
              <Input
                id="matchDate"
                type="date"
                value={matchDate}
                onChange={(e) => setMatchDate(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="matchTime">Heure du match</Label>
              <Input
                id="matchTime"
                type="time"
                value={matchTime}
                onChange={(e) => setMatchTime(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button onClick={handleGenerate}>
            Générer et Télécharger
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
