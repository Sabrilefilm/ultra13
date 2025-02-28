
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CreateMatchPosterDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateMatchPosterDialog: React.FC<CreateMatchPosterDialogProps> = ({ isOpen, onClose }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [creatorName, setCreatorName] = useState<string>("");
  const [opponentName, setOpponentName] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [time, setTime] = useState<string>("");
  const [posterImage, setPosterImage] = useState<string | null>(null);
  
  // Vérifier l'autorisation en fonction du rôle
  const userRole = localStorage.getItem('userRole') || '';
  const isAuthorized = ['agent', 'manager', 'founder'].includes(userRole);

  if (!isAuthorized) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Accès refusé</DialogTitle>
            <DialogDescription>
              Vous n'avez pas les autorisations nécessaires pour accéder à cette fonctionnalité. Seuls les agents, managers et fondateurs peuvent créer des affiches.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center items-center py-8">
            <AlertCircle className="h-16 w-16 text-destructive" />
          </div>
          <DialogFooter>
            <Button onClick={onClose} className="w-full">Fermer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Créer une affiche de match</DialogTitle>
          <DialogDescription>
            Remplissez les informations pour générer une affiche de match
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="creatorName">Nom du créateur</Label>
              <Input
                id="creatorName"
                value={creatorName}
                onChange={(e) => setCreatorName(e.target.value)}
                placeholder="Ex: JohnDoe"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="opponentName">Nom de l'adversaire</Label>
              <Input
                id="opponentName"
                value={opponentName}
                onChange={(e) => setOpponentName(e.target.value)}
                placeholder="Ex: JaneDoe"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Heure</Label>
              <Input
                id="time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageUrl">URL de l'image (optionnel)</Label>
            <Input
              id="imageUrl"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          {posterImage && (
            <div className="mt-4 border rounded-md overflow-hidden">
              <img
                src={posterImage}
                alt="Match Poster"
                className="w-full h-auto"
              />
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            className="w-1/2"
          >
            Annuler
          </Button>
          <Button
            onClick={() => {
              setLoading(true);
              setTimeout(() => {
                toast({
                  title: "Affiche créée",
                  description: "Votre affiche a été générée avec succès"
                });
                setLoading(false);
                setPosterImage("/placeholder.svg");
              }, 2000);
            }}
            disabled={!creatorName || !opponentName || !date || !time || loading}
            className="w-1/2"
          >
            {loading ? "Génération..." : "Générer l'affiche"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
