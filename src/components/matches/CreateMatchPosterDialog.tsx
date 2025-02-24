
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { downloadImage } from "@/utils/download";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/lib/supabase";
import { Loader2, Eye } from "lucide-react";

interface CreateMatchPosterDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

type MatchType = 'OFF' | 'ANNIVERSAIRE';

export const CreateMatchPosterDialog = ({ isOpen, onClose }: CreateMatchPosterDialogProps) => {
  const [player1Name, setPlayer1Name] = useState("");
  const [player2Name, setPlayer2Name] = useState("");
  const [player1ImageUrl, setPlayer1ImageUrl] = useState("");
  const [player2ImageUrl, setPlayer2ImageUrl] = useState("");
  const [backgroundImageUrl, setBackgroundImageUrl] = useState("");
  const [matchType, setMatchType] = useState<MatchType>("OFF");
  const [matchDate, setMatchDate] = useState("");
  const [matchTime, setMatchTime] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  const handlePreview = async () => {
    if (!player1Name || !player2Name || !matchDate || !matchTime || !backgroundImageUrl || !player1ImageUrl || !player2ImageUrl) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    setIsPreviewLoading(true);
    try {
      // Utilisez directement l'image de fond comme prévisualisation
      setPreviewUrl(backgroundImageUrl);
      toast.success("Prévisualisation mise à jour!");
    } catch (error) {
      console.error("Erreur preview:", error);
      toast.error("Erreur lors de la prévisualisation");
    } finally {
      setIsPreviewLoading(false);
    }
  };

  const handleGenerate = async () => {
    if (!player1Name || !player2Name || !matchDate || !matchTime || !backgroundImageUrl || !player1ImageUrl || !player2ImageUrl) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    setIsLoading(true);
    try {
      const fileName = `match-${matchType.toLowerCase()}-${matchDate.replace(/\//g, '-')}`;
      await downloadImage(backgroundImageUrl, fileName);
      toast.success("Affiche téléchargée avec succès!");
      onClose();
    } catch (error) {
      console.error("Erreur complète:", error);
      toast.error("Erreur lors de la génération de l'affiche");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose} modal>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Créer une affiche de match</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-8">
          {/* Formulaire à gauche */}
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="matchType">Type de match</Label>
              <Select 
                value={matchType} 
                onValueChange={(value: MatchType) => setMatchType(value)}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Sélectionner le type de match" />
                </SelectTrigger>
                <SelectContent className="bg-popover border shadow-lg">
                  <SelectItem value="OFF">Match OFF</SelectItem>
                  <SelectItem value="ANNIVERSAIRE">Match Anniversaire</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="backgroundImageUrl">URL de l'image d'arrière-plan</Label>
              <Input
                id="backgroundImageUrl"
                placeholder="https://exemple.com/image-background.jpg"
                value={backgroundImageUrl}
                onChange={(e) => setBackgroundImageUrl(e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="player1Name">Joueur 1</Label>
              <Input
                id="player1Name"
                placeholder="Nom du joueur 1"
                value={player1Name}
                onChange={(e) => setPlayer1Name(e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="player1ImageUrl">Image du joueur 1</Label>
              <Input
                id="player1ImageUrl"
                placeholder="https://exemple.com/joueur1.jpg"
                value={player1ImageUrl}
                onChange={(e) => setPlayer1ImageUrl(e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="player2Name">Joueur 2</Label>
              <Input
                id="player2Name"
                placeholder="Nom du joueur 2"
                value={player2Name}
                onChange={(e) => setPlayer2Name(e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="player2ImageUrl">Image du joueur 2</Label>
              <Input
                id="player2ImageUrl"
                placeholder="https://exemple.com/joueur2.jpg"
                value={player2ImageUrl}
                onChange={(e) => setPlayer2ImageUrl(e.target.value)}
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

            <div className="flex justify-between gap-4 mt-4">
              <Button variant="outline" onClick={onClose}>
                Annuler
              </Button>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={handlePreview}
                  disabled={isPreviewLoading}
                >
                  {isPreviewLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Prévisualisation...
                    </>
                  ) : (
                    <>
                      <Eye className="mr-2 h-4 w-4" />
                      Prévisualiser
                    </>
                  )}
                </Button>
                <Button onClick={handleGenerate} disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Génération...
                    </>
                  ) : (
                    'Générer et Télécharger'
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Prévisualisation à droite */}
          <div className="relative min-h-[400px] border rounded-lg overflow-hidden bg-gray-50">
            {previewUrl ? (
              <img 
                src={previewUrl} 
                alt="Prévisualisation de l'affiche" 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                <p>Cliquez sur "Prévisualiser" pour voir l'affiche</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
