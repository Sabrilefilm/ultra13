
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface CreateMatchPosterDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateMatchPosterDialog = ({ isOpen, onClose }: CreateMatchPosterDialogProps) => {
  const [matchTitle, setMatchTitle] = useState("");
  const [player1Image, setPlayer1Image] = useState("");
  const [player2Image, setPlayer2Image] = useState("");
  const [backgroundImage, setBackgroundImage] = useState("");
  const [width, setWidth] = useState("1920");
  const [height, setHeight] = useState("1080");

  const handleGenerate = async () => {
    if (!matchTitle || !player1Image || !player2Image || !backgroundImage) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }

    try {
      // TODO: Intégrer la génération d'image
      toast.success("Affiche générée avec succès!");
      onClose();
    } catch (error) {
      toast.error("Erreur lors de la génération de l'affiche");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Créer une affiche de match</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="matchTitle">Titre du match</Label>
            <Input
              id="matchTitle"
              placeholder="ex: Player 1 VS Player 2"
              value={matchTitle}
              onChange={(e) => setMatchTitle(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="player1Image">URL image joueur 1</Label>
            <Input
              id="player1Image"
              placeholder="https://..."
              value={player1Image}
              onChange={(e) => setPlayer1Image(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="player2Image">URL image joueur 2</Label>
            <Input
              id="player2Image"
              placeholder="https://..."
              value={player2Image}
              onChange={(e) => setPlayer2Image(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="backgroundImage">URL image d'arrière-plan</Label>
            <Input
              id="backgroundImage"
              placeholder="https://..."
              value={backgroundImage}
              onChange={(e) => setBackgroundImage(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="width">Largeur (px)</Label>
              <Input
                id="width"
                type="number"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="height">Hauteur (px)</Label>
              <Input
                id="height"
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button onClick={handleGenerate}>
            Générer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
