
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
import { Plus } from "lucide-react";
import { CreatorSelect } from "@/components/live-schedule/creator-select";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

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

  const handleAddReward = async () => {
    if (!recipientId || !diamonds || parseInt(diamonds) <= 0) {
      toast.error("Veuillez sélectionner un créateur et entrer un nombre valide de diamants");
      return;
    }

    setIsLoading(true);
    try {
      // Récupérer les paramètres de la plateforme pour calculer le montant gagné
      const { data: settings } = await supabase
        .from('platform_settings')
        .select('diamond_value')
        .single();

      const diamondValue = settings?.diamond_value || 0.01;
      const diamondsCount = parseInt(diamonds);
      const amountEarned = diamondsCount * diamondValue;

      const { error: insertError } = await supabase
        .from("creator_rewards")
        .insert([
          {
            creator_id: recipientId,
            diamonds_count: diamondsCount,
            amount_earned: amountEarned,
            payment_status: 'pending'
          }
        ]);

      if (insertError) {
        throw insertError;
      }

      toast.success("La récompense a été ajoutée avec succès");
      onOpenChange(false);
      setDiamonds("");
      setRecipientId("");
      
      // Invalider les queries pour forcer le rafraîchissement des données
      await queryClient.invalidateQueries({ queryKey: ["rewards"] });
      await queryClient.invalidateQueries({ queryKey: ["creator-stats"] });
      
      onSuccess();
    } catch (error) {
      console.error('Error adding reward:', error);
      toast.error("Impossible d'ajouter la récompense. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
  );
}
