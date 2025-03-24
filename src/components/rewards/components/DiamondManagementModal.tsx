
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

interface DiamondManagementModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedUser: any;
  operationType: 'add' | 'subtract';
  users: any[];
  onSuccess: () => Promise<void>;
}

export function DiamondManagementModal({
  isOpen,
  onOpenChange,
  selectedUser,
  operationType,
  users,
  onSuccess
}: DiamondManagementModalProps) {
  const [diamondAmount, setDiamondAmount] = useState<number>(0);
  const [userId, setUserId] = useState<string>(selectedUser?.id || "");
  const [isLoading, setIsLoading] = useState(false);
  const [updatedDiamonds, setUpdatedDiamonds] = useState<number | null>(null);

  // Mettre à jour l'identifiant de l'utilisateur sélectionné quand il change
  useEffect(() => {
    if (selectedUser?.id) {
      setUserId(selectedUser.id);
      setUpdatedDiamonds(null); // Reset updated diamonds when user changes
    }
  }, [selectedUser]);

  // Reset updated diamonds when diamond amount or operation type changes
  useEffect(() => {
    setUpdatedDiamonds(null);
  }, [diamondAmount, operationType]);

  const handleUpdateDiamonds = async () => {
    if (!userId || diamondAmount <= 0) {
      toast.error('Veuillez sélectionner un utilisateur et entrer un nombre valide de diamants');
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Récupérer les informations de l'utilisateur sélectionné
      const selectedUserInfo = users.find(user => user.id === userId);
      if (!selectedUserInfo) {
        toast.error('Utilisateur introuvable');
        return;
      }
      
      // Vérifier si le profil existe
      const { data: profileData, error: fetchError } = await supabase
        .from('profiles')
        .select('id, total_diamonds, username')
        .eq('id', userId)
        .maybeSingle();
      
      let newDiamondValue;
      
      if (!profileData) {
        // Si le profil n'existe pas, le créer
        newDiamondValue = operationType === 'add' ? diamondAmount : 0;
        
        const { error: insertError } = await supabase
          .from('profiles')
          .insert([{ 
            id: userId,
            username: selectedUserInfo.username,
            role: selectedUserInfo.role,
            total_diamonds: newDiamondValue,
            diamonds_goal: 0,
            created_at: new Date(),
            updated_at: new Date()
          }]);
          
        if (insertError) throw insertError;
      } else {
        // Si le profil existe, mettre à jour la valeur des diamants
        const currentDiamonds = profileData.total_diamonds || 0;
        newDiamondValue = operationType === 'add' 
          ? currentDiamonds + diamondAmount 
          : Math.max(0, currentDiamonds - diamondAmount);
        
        const { error } = await supabase
          .from('profiles')
          .update({ 
            total_diamonds: newDiamondValue,
            updated_at: new Date()
          })
          .eq('id', userId);
          
        if (error) throw error;
      }
      
      // Mettre à jour l'état local immédiatement
      setUpdatedDiamonds(newDiamondValue);
      
      const actionText = operationType === 'add' ? 'ajoutés' : 'retirés';
      const username = users.find(user => user.id === userId)?.username || userId;
      toast.success(`${diamondAmount} diamants ${actionText} pour ${username}`);
      
      // Réinitialiser le formulaire
      setDiamondAmount(0);
      
      // Rafraîchir les données
      await onSuccess();
    } catch (error) {
      console.error('Erreur lors de la mise à jour des diamants:', error);
      toast.error('Erreur lors de la mise à jour des diamants');
    } finally {
      setIsLoading(false);
    }
  };

  // Récupérer l'utilisateur sélectionné avec ses diamants
  const selectedUserData = users.find(u => u.id === userId);
  const currentDiamonds = selectedUserData?.profiles?.[0]?.total_diamonds || 0;
  
  // Calculer le nouveau total prévu
  const calculateNewTotal = () => {
    if (updatedDiamonds !== null) {
      return updatedDiamonds;
    }
    
    const diamondBase = currentDiamonds;
    if (operationType === 'add') {
      return diamondBase + diamondAmount;
    } else {
      return Math.max(0, diamondBase - diamondAmount);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-900 border-slate-800">
        <DialogHeader>
          <DialogTitle className="text-white">
            {operationType === 'add' ? '➕ Ajouter des diamants' : '➖ Déduire des diamants'}
          </DialogTitle>
          <DialogDescription className="text-slate-300">
            {operationType === 'add' 
              ? 'Indiquez le nombre de diamants à ajouter' 
              : 'Indiquez le nombre de diamants à retirer'}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label className="text-white">Sélectionner un utilisateur</Label>
            <Select 
              value={userId} 
              onValueChange={(value) => {
                setUserId(value);
                setUpdatedDiamonds(null);
              }}
            >
              <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                <SelectValue placeholder="Sélectionner un utilisateur" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700 text-white">
                {users.map(user => (
                  <SelectItem key={user.id} value={user.id} className="text-white hover:bg-slate-700">
                    {user.username} ({user.role})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="diamondAmount" className="text-white">
              {operationType === 'add' ? 'Nombre de diamants à ajouter:' : 'Nombre de diamants à déduire:'}
            </Label>
            <Input
              id="diamondAmount"
              type="number"
              min="1"
              value={diamondAmount || ''}
              onChange={(e) => setDiamondAmount(Number(e.target.value))}
              className="bg-slate-800 border-slate-700 text-white"
            />
          </div>
          
          {userId && (
            <div className="pt-2 border-t border-slate-700">
              <div className="flex justify-between text-slate-300">
                <span>Diamants actuels:</span>
                <span>{currentDiamonds} 💎</span>
              </div>
              <div className="flex justify-between font-medium mt-1">
                <span className="text-white">Nouvelle valeur:</span>
                <span className="text-white">{calculateNewTotal()} 💎</span>
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
            className="bg-transparent border-slate-700 text-white hover:bg-slate-800"
          >
            Annuler
          </Button>
          <Button 
            onClick={handleUpdateDiamonds}
            disabled={isLoading || !userId || diamondAmount <= 0}
            className="bg-purple-700 hover:bg-purple-800 text-white"
          >
            {isLoading ? 'Traitement...' : operationType === 'add' ? 'Ajouter' : 'Déduire'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
