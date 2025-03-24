
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Diamond, Settings, RotateCcw, Plus, Minus, TrendingUp } from "lucide-react";
import { AddRewardDialog } from "./AddRewardDialog";
import { RewardsTable } from "./RewardsTable";
import { useRewards } from "./useRewards";
import { Button } from "@/components/ui/button";
import { RewardSettingsModal } from "../RewardSettingsModal";
import { usePlatformSettings } from "@/hooks/use-platform-settings";
import { useScheduleManagement } from "@/hooks/user-management/use-schedule-management";
import { useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";

interface RewardsPanelProps {
  role: string;
  userId: string;
}

export function RewardsPanel({ role, userId }: RewardsPanelProps) {
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDiamondModalOpen, setIsDiamondModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [diamondAmount, setDiamondAmount] = useState<number>(0);
  const [operationType, setOperationType] = useState<'add' | 'subtract'>('add');
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const { data: rewards, isLoading: rewardsLoading, refetch } = useRewards(role, userId);
  const { platformSettings, handleUpdateSettings } = usePlatformSettings(role);
  const queryClient = useQueryClient();
  const { resetRewards } = useScheduleManagement(() => {
    queryClient.invalidateQueries({ queryKey: ["rewards"] });
    refetch();
  });

  const handleResetRewards = async () => {
    await resetRewards();
  };

  const handleOpenCreatorRewards = () => {
    navigate('/creator-rewards');
  };

  const handleOpenDiamondsPage = () => {
    navigate('/creator-diamonds');
  };

  const openDiamondModal = async (type: 'add' | 'subtract') => {
    setOperationType(type);
    setDiamondAmount(0);
    setSelectedUser("");
    
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('user_accounts')
        .select('id, username, role')
        .order('role')
        .order('username');
        
      if (error) throw error;
      setUsers(data || []);
      
      setIsDiamondModalOpen(true);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Erreur lors du chargement des utilisateurs');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateDiamonds = async () => {
    if (!selectedUser || diamondAmount <= 0) {
      toast.error('Veuillez sélectionner un utilisateur et entrer un nombre valide de diamants');
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Get current diamond count
      const { data: profileData, error: fetchError } = await supabase
        .from('profiles')
        .select('total_diamonds')
        .eq('id', selectedUser)
        .single();
      
      if (fetchError) {
        // If profile doesn't exist, create it
        if (fetchError.code === 'PGRST116') {
          const { error: insertError } = await supabase
            .from('profiles')
            .insert([
              { id: selectedUser, total_diamonds: operationType === 'add' ? diamondAmount : 0 }
            ]);
            
          if (insertError) throw insertError;
          
          toast.success(`${diamondAmount} diamants ${operationType === 'add' ? 'ajoutés' : 'retirés'}`);
          setIsDiamondModalOpen(false);
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
        .eq('id', selectedUser);
        
      if (error) throw error;
      
      const actionText = operationType === 'add' ? 'ajoutés' : 'retirés';
      toast.success(`${diamondAmount} diamants ${actionText}`);
      setIsDiamondModalOpen(false);
    } catch (error) {
      console.error('Erreur lors de la mise à jour des diamants:', error);
      toast.error('Erreur lors de la mise à jour des diamants');
    } finally {
      setIsLoading(false);
    }
  };

  if (rewardsLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Chargement des récompenses...</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  const pendingRewards = rewards?.filter(reward => reward.payment_status === 'pending') || [];
  const hasPendingRewards = pendingRewards.length > 0;

  // Seul le fondateur peut gérer les récompenses
  const canManageRewards = role === 'founder';
  const canViewRewards = ['founder', 'manager'].includes(role);

  return (
    <Card className="bg-white dark:bg-slate-800 shadow-md border-purple-100 dark:border-purple-900/30">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Diamond className="w-5 h-5 text-purple-500" />
          Récompenses 💎
        </CardTitle>
        {canManageRewards && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsSettingsOpen(true)}
              className="border-purple-200 dark:border-purple-800"
            >
              <Settings className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline"
              className="flex items-center gap-2 border-purple-200 dark:border-purple-800"
              onClick={() => setIsDialogOpen(true)}
            >
              <Diamond className="h-4 w-4 text-purple-500" />
              Ajouter des diamants
            </Button>
            <Button 
              variant="outline"
              className="flex items-center gap-2 border-purple-200 dark:border-purple-800"
              onClick={() => openDiamondModal('add')}
            >
              <Plus className="h-4 w-4 text-green-500" />
              Ajouter
            </Button>
            <Button 
              variant="outline"
              className="flex items-center gap-2 border-purple-200 dark:border-purple-800"
              onClick={() => openDiamondModal('subtract')}
            >
              <Minus className="h-4 w-4 text-red-500" />
              Déduire
            </Button>
            <Button
              className="bg-purple-600 hover:bg-purple-700"
              onClick={handleOpenCreatorRewards}
            >
              Programme de récompenses
            </Button>
            <Button
              variant="default"
              className="bg-indigo-600 hover:bg-indigo-700 flex items-center gap-2"
              onClick={handleOpenDiamondsPage}
            >
              <TrendingUp className="h-4 w-4" />
              Gestion des Diamants
            </Button>
          </div>
        )}
        {role === 'creator' && (
          <Button
            variant="outline"
            onClick={handleOpenCreatorRewards}
            className="border-purple-200 dark:border-purple-800"
          >
            Voir le programme de récompenses 🏆
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {canViewRewards && platformSettings && (
          <div className="mb-4 p-4 bg-muted/50 rounded-lg">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Valeur d'un diamant ✨</p>
                <p className="text-2xl font-bold">{platformSettings.diamondValue}€</p>
              </div>
              <div>
                <p className="text-sm font-medium">Paiement minimum 💰</p>
                <p className="text-2xl font-bold">{platformSettings.minimumPayout}€</p>
              </div>
            </div>
          </div>
        )}
        <RewardsTable rewards={rewards || []} />
      </CardContent>
      {canManageRewards && (
        <>
          <CardFooter className="flex justify-end">
            {hasPendingRewards && (
              <Button 
                onClick={handleResetRewards}
                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700"
              >
                <RotateCcw className="h-4 w-4" />
                Marquer toutes les récompenses comme payées
              </Button>
            )}
          </CardFooter>
          <AddRewardDialog
            isOpen={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            onSuccess={refetch}
          />
          <RewardSettingsModal
            isOpen={isSettingsOpen}
            onClose={() => setIsSettingsOpen(false)}
            onSubmit={handleUpdateSettings}
            currentSettings={platformSettings || undefined}
          />
          
          {/* Diamond Management Modal */}
          <Dialog open={isDiamondModalOpen} onOpenChange={setIsDiamondModalOpen}>
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
                    value={selectedUser} 
                    onValueChange={setSelectedUser}
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
                  onClick={() => setIsDiamondModalOpen(false)}
                  disabled={isLoading}
                >
                  Annuler
                </Button>
                <Button 
                  onClick={handleUpdateDiamonds}
                  disabled={isLoading || !selectedUser || diamondAmount <= 0}
                >
                  {isLoading ? 'Traitement...' : operationType === 'add' ? 'Ajouter' : 'Déduire'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )}
    </Card>
  );
}
