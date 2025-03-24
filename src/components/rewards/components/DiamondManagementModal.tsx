
import React, { useState } from "react";
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

  const handleUpdateDiamonds = async () => {
    if (!userId || diamondAmount <= 0) {
      toast.error('Veuillez sélectionner un utilisateur et entrer un nombre valide de diamants');
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Get current diamond count
      const { data: profileData, error: fetchError } = await supabase
        .from('profiles')
        .select('total_diamonds')
        .eq('id', userId)
        .single();
      
      if (fetchError) {
        // If profile doesn't exist, create it
        if (fetchError.code === 'PGRST116') {
          const { error: insertError } = await supabase
            .from('profiles')
            .insert([
              { id: userId, total_diamonds: operationType === 'add' ? diamondAmount : 0 }
            ]);
            
          if (insertError) throw insertError;
          
          toast.success(`${diamondAmount} diamants ${operationType === 'add' ? 'ajoutés' : 'retirés'}`);
          onOpenChange(false);
          await onSuccess();
          return;
        }
        throw fetchError;
      }
      
      const currentDiamonds = profileData?.total_diamonds || 0;
      const newDiamondValue = operationType === 'add' 
        ? currentDiamonds + diamondAmount 
        : Math.max(0, currentDiamonds - diamondAmount);
      
      // Update diamonds count
      const { error } = await supabase
        .from('profiles')
        .update({ total_diamonds: newDiamondValue })
        .eq('id', userId);
        
      if (error) throw error;
      
      const actionText = operationType === 'add' ? 'ajoutés' : 'retirés';
      const username = users.find(user => user.id === userId)?.username || userId;
      toast.success(`${diamondAmount} diamants ${actionText} pour ${username}`);
      
      onOpenChange(false);
      await onSuccess();
    } catch (error) {
      console.error('Erreur lors de la mise à jour des diamants:', error);
      toast.error('Erreur lors de la mise à jour des diamants');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {operationType === 'add' ? '➕ Ajouter des diamants' : '➖ Déduire des diamants'}
          </DialogTitle>
          <DialogDescription>
            {operationType === 'add' 
              ? 'Indiquez le nombre de diamants à ajouter' 
              : 'Indiquez le nombre de diamants à retirer'}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Sélectionner un utilisateur</Label>
            <Select 
              value={userId} 
              onValueChange={setUserId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un utilisateur" />
              </SelectTrigger>
              <SelectContent>
                {users.map(user => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.username} ({user.role})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="diamondAmount">
              {operationType === 'add' ? 'Nombre de diamants à ajouter:' : 'Nombre de diamants à déduire:'}
            </Label>
            <Input
              id="diamondAmount"
              type="number"
              min="1"
              value={diamondAmount || ''}
              onChange={(e) => setDiamondAmount(Number(e.target.value))}
            />
          </div>
        </div>
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Annuler
          </Button>
          <Button 
            onClick={handleUpdateDiamonds}
            disabled={isLoading || !userId || diamondAmount <= 0}
          >
            {isLoading ? 'Traitement...' : operationType === 'add' ? 'Ajouter' : 'Déduire'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
