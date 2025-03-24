
import React, { useState, useEffect } from "react";
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
  const [displayedDiamonds, setDisplayedDiamonds] = useState<number>(currentDiamonds);

  // Update displayed diamonds when prop changes
  useEffect(() => {
    setDisplayedDiamonds(currentDiamonds);
  }, [currentDiamonds]);

  const handleSubmit = async () => {
    if (diamondAmount < 0) {
      toast.error("La valeur des diamants ne peut pas être négative");
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Calculer la nouvelle valeur avant l'appel à l'API
      const newDiamondValue = calculateNewTotal();
      
      // Vérifier si le profil existe
      const { data: profileExists, error: checkError } = await supabase
        .from('profiles')
        .select('id, total_diamonds, username')
        .eq('id', creatorId)
        .maybeSingle();
        
      if (checkError && checkError.code !== 'PGRST204') {
        console.error("Error checking profile:", checkError);
        throw checkError;
      }
      
      if (profileExists) {
        // Si le profil existe, mise à jour
        const { error } = await supabase
          .from('profiles')
          .update({ 
            total_diamonds: newDiamondValue,
            updated_at: new Date()
          })
          .eq('id', creatorId);
          
        if (error) {
          console.error("Error updating profile:", error);
          throw error;
        }
      } else {
        // Si le profil n'existe pas, création avec la valeur initiale
        // Obtenir le nom d'utilisateur et le rôle de user_accounts
        const { data: userData, error: userError } = await supabase
          .from('user_accounts')
          .select('username, role')
          .eq('id', creatorId)
          .single();
          
        if (userError) {
          console.error("Error fetching user data:", userError);
          throw userError;
        }
        
        const { error } = await supabase
          .from('profiles')
          .insert([{ 
            id: creatorId,
            username: userData.username,
            role: userData.role,
            total_diamonds: newDiamondValue,
            created_at: new Date(),
            updated_at: new Date()
          }]);
          
        if (error) {
          console.error("Error creating profile:", error);
          throw error;
        }
      }
      
      // Mettre à jour l'état local immédiatement
      setDisplayedDiamonds(newDiamondValue);
      
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
    <div className="bg-slate-900 border border-slate-800 shadow-md rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium flex items-center gap-2 text-white">
          <Diamond className="h-4 w-4 text-purple-500" />
          Modifier les diamants pour {creatorUsername}
        </h3>
        <span className="text-sm text-gray-400">Total actuel: {displayedDiamonds} 💎</span>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="flex-1">
          <Input
            type="number"
            min="0"
            value={diamondAmount}
            onChange={(e) => setDiamondAmount(parseInt(e.target.value) || 0)}
            placeholder="Quantité de diamants"
            className="bg-slate-800 border-slate-700 text-white"
          />
        </div>
        
        <div className="flex gap-2">
          <Button 
            type="button"
            variant={operationType === 'add' ? 'default' : 'outline'}
            onClick={() => setOperationType('add')}
            className={`flex-1 ${operationType === 'add' ? 'bg-purple-700 hover:bg-purple-800' : 'bg-transparent border-slate-700 text-white hover:bg-slate-800'}`}
          >
            <Plus className="h-4 w-4 mr-1" />
            Ajouter
          </Button>
          <Button 
            type="button"
            variant={operationType === 'subtract' ? 'default' : 'outline'}
            onClick={() => setOperationType('subtract')}
            className={`flex-1 ${operationType === 'subtract' ? 'bg-purple-700 hover:bg-purple-800' : 'bg-transparent border-slate-700 text-white hover:bg-slate-800'}`}
          >
            <Minus className="h-4 w-4 mr-1" />
            Déduire
          </Button>
          <Button 
            type="button"
            variant={operationType === 'set' ? 'default' : 'outline'}
            onClick={() => setOperationType('set')}
            className={`flex-1 ${operationType === 'set' ? 'bg-purple-700 hover:bg-purple-800' : 'bg-transparent border-slate-700 text-white hover:bg-slate-800'}`}
          >
            <Diamond className="h-4 w-4 mr-1" />
            Définir
          </Button>
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-300">
          Nouvelle valeur: <span className="font-bold text-white">{calculateNewTotal()} 💎</span>
        </div>
        <Button 
          onClick={handleSubmit}
          disabled={isSubmitting || diamondAmount <= 0}
          className="bg-green-600 hover:bg-green-700 text-white"
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
