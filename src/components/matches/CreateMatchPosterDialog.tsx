
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { downloadImage } from "@/utils/download";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/lib/supabase";
import { Loader2, Upload } from "lucide-react";
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
  const [player1Image, setPlayer1Image] = useState<File | null>(null);
  const [player2Image, setPlayer2Image] = useState<File | null>(null);
  const [player1ImagePreview, setPlayer1ImagePreview] = useState<string>("");
  const [player2ImagePreview, setPlayer2ImagePreview] = useState<string>("");
  const [matchType, setMatchType] = useState<MatchType>("OFF");
  const [backgroundTheme, setBackgroundTheme] = useState<BackgroundTheme>("GAMING");
  const [matchDate, setMatchDate] = useState("");
  const [matchTime, setMatchTime] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleImageUpload = async (file: File, playerNumber: 1 | 2) => {
    if (!file) return;

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const filePath = `profile-images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('matches')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('matches')
        .getPublicUrl(filePath);

      if (playerNumber === 1) {
        setPlayer1ImagePreview(publicUrl);
      } else {
        setPlayer2ImagePreview(publicUrl);
      }

      toast.success(`Photo de profil du joueur ${playerNumber} uploadée !`);
    } catch (error) {
      console.error("Erreur upload:", error);
      toast.error(`Erreur lors de l'upload de la photo du joueur ${playerNumber}`);
    }
  };

  const generateAIImage = async (prompt: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('generate-match-poster', {
        body: {
          prompt: `Create an esports tournament poster with ${backgroundTheme.toLowerCase()} theme. Show a VS battle between "${player1Name}" (use this profile picture: ${player1ImagePreview}) on the left and "${player2Name}" (use this profile picture: ${player2ImagePreview}) on the right. Include "Match ${matchType}" at the top. Display date: "${matchDate}" and time: "${matchTime}". Add "Phocéen Agency" at the bottom. Style: intense, dramatic, professional gaming event`
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

  const handleGenerate = async () => {
    if (!player1Name || !player2Name || !matchDate || !matchTime || !player1ImagePreview || !player2ImagePreview) {
      toast.error("Veuillez remplir tous les champs et uploader les photos de profil");
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

          <div className="grid gap-4">
            <div className="space-y-2">
              <Label>Joueur 1</Label>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Nom du joueur 1 (ex: SABRI_AMD)"
                    value={player1Name}
                    onChange={(e) => setPlayer1Name(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={player1ImagePreview} />
                    <AvatarFallback>{player1Name?.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="relative">
                    <Input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      id="player1-image"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setPlayer1Image(file);
                          handleImageUpload(file, 1);
                        }
                      }}
                    />
                    <Label
                      htmlFor="player1-image"
                      className="flex items-center justify-center p-2 border rounded-md cursor-pointer hover:bg-gray-50"
                    >
                      <Upload className="h-4 w-4" />
                    </Label>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Joueur 2</Label>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Nom du joueur 2 (ex: TEST_123)"
                    value={player2Name}
                    onChange={(e) => setPlayer2Name(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={player2ImagePreview} />
                    <AvatarFallback>{player2Name?.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="relative">
                    <Input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      id="player2-image"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setPlayer2Image(file);
                          handleImageUpload(file, 2);
                        }
                      }}
                    />
                    <Label
                      htmlFor="player2-image"
                      className="flex items-center justify-center p-2 border rounded-md cursor-pointer hover:bg-gray-50"
                    >
                      <Upload className="h-4 w-4" />
                    </Label>
                  </div>
                </div>
              </div>
            </div>
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
          <Button onClick={handleGenerate} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Génération en cours...
              </>
            ) : (
              'Générer et Télécharger'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
