
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
type BackgroundTheme = 'GAMING' | 'SPORT' | 'NEON' | 'DISNEY' | 'ANIMALS' | 'SUPERHERO' | 'ANIME' | 'SPACE' | 'FANTASY';

export const CreateMatchPosterDialog = ({ isOpen, onClose }: CreateMatchPosterDialogProps) => {
  const [player1Name, setPlayer1Name] = useState("");
  const [player2Name, setPlayer2Name] = useState("");
  const [player1ImageUrl, setPlayer1ImageUrl] = useState("");
  const [player2ImageUrl, setPlayer2ImageUrl] = useState("");
  const [matchType, setMatchType] = useState<MatchType>("OFF");
  const [backgroundTheme, setBackgroundTheme] = useState<BackgroundTheme>("GAMING");
  const [matchDate, setMatchDate] = useState("");
  const [matchTime, setMatchTime] = useState("");
  const [width] = useState("1080");
  const [height] = useState("1920");

  const generateAIImage = async (prompt: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('generate-match-poster', {
        body: {
          prompt: `Create a professional e-sports tournament poster with a ${backgroundTheme.toLowerCase()} theme background. The poster should show "${player1Name}" (using the profile image from ${player1ImageUrl}) on the left vs "${player2Name}" (using the profile image from ${player2ImageUrl}) on the right. Include the text "${matchType} MATCH" prominently at the top. Display the date "${matchDate}" and time "${matchTime}" in the middle. Add "Phocéen Agency" at the bottom. Use a dynamic, modern style with high contrast and engaging visual effects. Make it look professional and impressive. Theme details: ${getThemeDetails(backgroundTheme)}`
        }
      });

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

  const getThemeDetails = (theme: BackgroundTheme) => {
    switch (theme) {
      case 'GAMING':
        return 'Include gaming elements like controllers, RGB lights, and esports-style graphics';
      case 'SPORT':
        return 'Use dynamic sports elements, motion effects, and athletic imagery';
      case 'NEON':
        return 'Create a cyberpunk atmosphere with bright neon lights and glowing effects';
      case 'DISNEY':
        return 'Incorporate magical Disney-inspired elements, castles, and whimsical designs';
      case 'ANIMALS':
        return 'Use majestic animals, nature elements, and wildlife themes';
      case 'SUPERHERO':
        return 'Include comic book style elements, superhero imagery, and dramatic effects';
      case 'ANIME':
        return 'Use anime and manga inspired art style with bold colors and dynamic effects';
      case 'SPACE':
        return 'Create a cosmic theme with stars, planets, and space phenomena';
      case 'FANTASY':
        return 'Include magical elements, mythical creatures, and fantasy world imagery';
      default:
        return '';
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
      console.log("URL de l'image générée:", imageUrl); // Pour le débogage
      await downloadImage(imageUrl, `match-${matchType.toLowerCase()}-${matchDate.replace(/\//g, '-')}`);
      toast.success("Affiche téléchargée avec succès!");
      onClose();
    } catch (error) {
      console.error("Erreur complète:", error);
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
            <Input
              id="player1ImageUrl"
              placeholder="URL de la photo de profil du joueur 1"
              value={player1ImageUrl}
              onChange={(e) => setPlayer1ImageUrl(e.target.value)}
              className="mt-2"
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
            <Input
              id="player2ImageUrl"
              placeholder="URL de la photo de profil du joueur 2"
              value={player2ImageUrl}
              onChange={(e) => setPlayer2ImageUrl(e.target.value)}
              className="mt-2"
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
