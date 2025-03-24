
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Diamond, Plus, Minus, Save } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface QuickDiamondsMenuProps {
  creatorId: string;
  creatorUsername: string;
  currentDiamonds: number;
  onSuccess: () => Promise<void>;
}

export const QuickDiamondsMenu: React.FC<QuickDiamondsMenuProps> = ({
  creatorId,
  creatorUsername,
  currentDiamonds,
  onSuccess
}) => {
  const [diamondAmount, setDiamondAmount] = useState<number>(0);
  const [operationType, setOperationType] = useState<'set' | 'add' | 'subtract'>('add');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (diamondAmount < 0) {
      toast.error("La valeur des diamants ne peut pas être négative");
      return;
    }

    try {
      setIsSubmitting(true);
      
      console.log("Calling manage_diamonds RPC with:", {
        target_user_id: creatorId,
        diamonds_value: diamondAmount,
        operation: operationType
      });
      
      const { data, error } = await supabase.rpc('manage_diamonds', {
        target_user_id: creatorId,
        diamonds_value: diamondAmount,
        operation: operationType
      });
      
      if (error) {
        console.error("Erreur lors de la mise à jour des diamants:", error);
        toast.error("Une erreur est survenue lors de la mise à jour des diamants");
        return;
      }
      
      // Message de confirmation en fonction de l'opération
      const actionText = operationType === 'set' ? 'définis à' : operationType === 'add' ? 'augmentés de' : 'réduits de';
      toast.success(`Diamants ${actionText} ${diamondAmount} pour ${creatorUsername}`);
      
      // Réinitialiser le formulaire
      setDiamondAmount(0);
      
      // Rafraîchir les données
      await onSuccess();
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Une erreur est survenue");
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateNewTotal = () => {
    switch (operationType) {
      case 'add':
        return currentDiamonds + diamondAmount;
      case 'subtract':
        return Math.max(0, currentDiamonds - diamondAmount);
      case 'set':
      default:
        return diamondAmount;
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium flex items-center gap-2">
          <Diamond className="h-4 w-4 text-purple-500" />
          Modifier les diamants pour {creatorUsername}
        </h3>
        <span className="text-sm text-gray-500">Total actuel: {currentDiamonds} 💎</span>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="flex-1">
          <Input
            type="number"
            min="0"
            value={diamondAmount}
            onChange={(e) => setDiamondAmount(parseInt(e.target.value) || 0)}
            placeholder="Quantité de diamants"
          />
        </div>
        
        <div className="flex gap-2">
          <Button 
            type="button"
            variant={operationType === 'add' ? 'default' : 'outline'}
            onClick={() => setOperationType('add')}
            className="flex-1"
          >
            <Plus className="h-4 w-4 mr-1" />
            Ajouter
          </Button>
          <Button 
            type="button"
            variant={operationType === 'subtract' ? 'default' : 'outline'}
            onClick={() => setOperationType('subtract')}
            className="flex-1"
          >
            <Minus className="h-4 w-4 mr-1" />
            Déduire
          </Button>
          <Button 
            type="button"
            variant={operationType === 'set' ? 'default' : 'outline'}
            onClick={() => setOperationType('set')}
            className="flex-1"
          >
            <Diamond className="h-4 w-4 mr-1" />
            Définir
          </Button>
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <div className="text-sm">
          Nouvelle valeur: <span className="font-bold">{calculateNewTotal()} 💎</span>
        </div>
        <Button 
          onClick={handleSubmit}
          disabled={isSubmitting || diamondAmount <= 0}
          className="bg-green-600 hover:bg-green-700"
        >
          {isSubmitting ? (
            <>
              <span className="opacity-0">Sauvegarder</span>
              <span className="absolute inset-0 flex items-center justify-center">
                <div className="h-5 w-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
              </span>
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-1" />
              Sauvegarder
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
