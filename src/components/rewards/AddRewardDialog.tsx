
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, ArrowLeft } from "lucide-react";
import { CreatorSelect } from "@/components/live-schedule/creator-select";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

interface AddRewardDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function AddRewardDialog({ isOpen, onOpenChange, onSuccess }: AddRewardDialogProps) {
  const [diamonds, setDiamonds] = useState("");
  const [recipientId, setRecipientId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const handleAddReward = async () => {
    if (!recipientId || !diamonds || parseInt(diamonds) <= 0) {
      toast("Veuillez sélectionner un créateur et entrer un nombre valide de diamants");
      return;
    }

    setIsLoading(true);
    try {
      const { error: insertError } = await supabase
        .from("creator_rewards")
        .insert([
          {
            creator_id: recipientId,
            diamonds_count: parseInt(diamonds),
          }
        ]);

      if (insertError) {
        throw insertError;
      }

      toast("La récompense a été ajoutée avec succès");
      onOpenChange(false);
      setDiamonds("");
      setRecipientId("");
      
      await queryClient.invalidateQueries({ queryKey: ["rewards"] });
      await queryClient.invalidateQueries({ queryKey: ["creator-stats"] });
      
      onSuccess();
    } catch (error) {
      console.error('Error adding reward:', error);
      toast("Impossible d'ajouter la récompense. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReturn = () => {
    navigate('/');
  };

  return (
    <>
      <Button 
        variant="ghost" 
        onClick={handleReturn}
        className="mb-4"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Retour à l'accueil
      </Button>

      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogTrigger asChild>
          <Button variant="outline" className="gap-2">
            <Plus className="w-4 h-4" />
            Ajouter des diamants
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter des diamants</DialogTitle>
            <DialogDescription>
              Ajoutez des diamants pour un créateur
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Sélectionner un créateur</Label>
              <CreatorSelect
                value={recipientId}
                onSelect={setRecipientId}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="diamonds">Nombre de diamants</Label>
              <Input
                id="diamonds"
                type="number"
                min="1"
                value={diamonds}
                onChange={(e) => setDiamonds(e.target.value)}
              />
            </div>
            <Button 
              onClick={handleAddReward} 
              className="w-full"
              disabled={isLoading || !recipientId || !diamonds || parseInt(diamonds) <= 0}
            >
              {isLoading ? "Ajout en cours..." : "Ajouter les diamants"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
