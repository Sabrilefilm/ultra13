
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
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface CreateMatchPosterDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

type MatchType = 'OFF' | 'ANNIVERSAIRE';
type BackgroundTheme = 'GAMING' | 'SPORT' | 'NEON' | 'DISNEY' | 'ANIMALS' | 'SUPERHERO' | 'ANIME' | 'SPACE' | 'FANTASY';

export const CreateMatchPosterDialog = ({ isOpen, onClose }: CreateMatchPosterDialogProps) => {
  const [player1Name, setPlayer1Name] = useState("");
  const [player2Name, setPlayer2Name] = useState("");
  const [matchType, setMatchType] = useState<MatchType>("OFF");
  const [backgroundTheme, setBackgroundTheme] = useState<BackgroundTheme>("GAMING");
  const [matchDate, setMatchDate] = useState("");
  const [matchTime, setMatchTime] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  const generateAIImage = async (prompt: string, isPreview: boolean = false) => {
    try {
      const { data, error } = await supabase.functions.invoke('generate-match-poster', {
        body: {
          prompt: `Create an esports tournament poster with ${backgroundTheme.toLowerCase()} theme. Show a VS battle between "${player1Name}" on the left and "${player2Name}" on the right. Include "Match ${matchType}" at the top. Display date: "${matchDate}" and time: "${matchTime}". Add "Phocéen Agency" at the bottom. Style: intense, dramatic, professional gaming event`
        }
      });

      console.log("Réponse de l'API:", data);

      if (error) throw error;
      
      if (!data?.imageUrl) {
        throw new Error('URL de l\'image non reçue');
      }

      return data.imageUrl;
    } catch (error) {
      console.error("Erreur lors de la génération de l'image:", error);
      throw error;
    }
  };

  const handlePreview = async () => {
    if (!player1Name || !player2Name || !matchDate || !matchTime) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    setIsPreviewLoading(true);
    toast.info("Génération de la prévisualisation...");

    try {
      const imageUrl = await generateAIImage(`Match ${matchType}`, true);
      setPreviewUrl(imageUrl);
      toast.success("Prévisualisation générée!");
    } catch (error) {
      console.error("Erreur preview:", error);
      toast.error("Erreur lors de la génération de la prévisualisation");
    } finally {
      setIsPreviewLoading(false);
    }
  };

  const handleGenerate = async () => {
    if (!player1Name || !player2Name || !matchDate || !matchTime) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    setIsLoading(true);
    toast.info("Génération de l'affiche en cours... Cela peut prendre quelques secondes.");

    try {
      const imageUrl = await generateAIImage(`Match ${matchType}`);
      await downloadImage(imageUrl, `match-${matchType.toLowerCase()}-${matchDate.replace(/\//g, '-')}`);
      toast.success("Affiche téléchargée avec succès!");
      onClose();
    } catch (error) {
      console.error("Erreur complète:", error);
      toast.error("Erreur lors de la génération de l'affiche. Veuillez réessayer.");
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
              <Label htmlFor="backgroundTheme">Thème de l'arrière-plan</Label>
              <Select 
                value={backgroundTheme} 
                onValueChange={(value: BackgroundTheme) => setBackgroundTheme(value)}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Sélectionner le thème" />
                </SelectTrigger>
                <SelectContent className="bg-popover border shadow-lg">
                  <SelectItem value="GAMING">Gaming</SelectItem>
                  <SelectItem value="SPORT">Sport</SelectItem>
                  <SelectItem value="NEON">Néon</SelectItem>
                  <SelectItem value="DISNEY">Disney</SelectItem>
                  <SelectItem value="ANIMALS">Animaux</SelectItem>
                  <SelectItem value="SUPERHERO">Super-héros</SelectItem>
                  <SelectItem value="ANIME">Anime</SelectItem>
                  <SelectItem value="SPACE">Espace</SelectItem>
                  <SelectItem value="FANTASY">Fantasy</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="player1Name">Joueur 1</Label>
              <Input
                id="player1Name"
                placeholder="Nom du joueur 1 (ex: SABRI_AMD)"
                value={player1Name}
                onChange={(e) => setPlayer1Name(e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="player2Name">Joueur 2</Label>
              <Input
                id="player2Name"
                placeholder="Nom du joueur 2 (ex: TEST_123)"
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
