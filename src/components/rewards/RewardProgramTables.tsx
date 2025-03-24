
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Diamond, Save, Edit, Trash } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface RewardEntry {
  id: string;
  tier: string;
  diamonds_min: number;
  diamonds_max: number;
  reward_amount: number;
  creator_type: 'beginner' | 'experienced';
}

interface RewardProgramTablesProps {
  canEdit: boolean;
}

export function RewardProgramTables({ canEdit }: RewardProgramTablesProps) {
  const [beginnerRewards, setBeginnerRewards] = useState<RewardEntry[]>([]);
  const [experiencedRewards, setExperiencedRewards] = useState<RewardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentReward, setCurrentReward] = useState<RewardEntry | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newReward, setNewReward] = useState<Omit<RewardEntry, 'id'>>({
    tier: '',
    diamonds_min: 0,
    diamonds_max: 0,
    reward_amount: 0,
    creator_type: 'beginner'
  });

  const fetchRewards = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('reward_tiers')
        .select('*')
        .order('diamonds_min', { ascending: true });

      if (error) throw error;

      if (data) {
        const beginnerData = data.filter(reward => reward.creator_type === 'beginner');
        const experiencedData = data.filter(reward => reward.creator_type === 'experienced');
        
        setBeginnerRewards(beginnerData);
        setExperiencedRewards(experiencedData);
      }
    } catch (error) {
      console.error("Error fetching rewards:", error);
      toast.error("Erreur lors du chargement des récompenses");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRewards();
  }, []);

  const handleEditReward = (reward: RewardEntry) => {
    setCurrentReward(reward);
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!currentReward) return;

    try {
      const { error } = await supabase
        .from('reward_tiers')
        .update({
          tier: currentReward.tier,
          diamonds_min: currentReward.diamonds_min,
          diamonds_max: currentReward.diamonds_max,
          reward_amount: currentReward.reward_amount
        })
        .eq('id', currentReward.id);

      if (error) throw error;

      toast.success("Récompense mise à jour avec succès");
      setIsEditDialogOpen(false);
      fetchRewards();
    } catch (error) {
      console.error("Error updating reward:", error);
      toast.error("Erreur lors de la mise à jour de la récompense");
    }
  };

  const handleDeleteReward = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette récompense?")) return;

    try {
      const { error } = await supabase
        .from('reward_tiers')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success("Récompense supprimée avec succès");
      fetchRewards();
    } catch (error) {
      console.error("Error deleting reward:", error);
      toast.error("Erreur lors de la suppression de la récompense");
    }
  };

  const handleAddReward = async () => {
    try {
      const { error } = await supabase
        .from('reward_tiers')
        .insert([newReward]);

      if (error) throw error;

      toast.success("Nouvelle récompense ajoutée avec succès");
      setIsAddDialogOpen(false);
      setNewReward({
        tier: '',
        diamonds_min: 0,
        diamonds_max: 0,
        reward_amount: 0,
        creator_type: 'beginner'
      });
      fetchRewards();
    } catch (error) {
      console.error("Error adding reward:", error);
      toast.error("Erreur lors de l'ajout de la récompense");
    }
  };

  const renderRewardTable = (rewards: RewardEntry[], title: string) => (
    <Card className="shadow-md">
      <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Diamond className="h-6 w-6" />
            <span className="text-xl font-bold">RÉCOMPENSES</span>
            <Diamond className="h-6 w-6" />
          </div>
          <div className="bg-yellow-400 text-blue-900 px-2 py-0.5 rounded text-sm font-bold">
            ★
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="bg-blue-100 dark:bg-blue-900/20 p-4">
          <h3 className="text-center font-bold">
            CRÉATEUR <span className="text-red-600 font-extrabold">{title}</span>
          </h3>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Palier</TableHead>
              <TableHead>Diamants Requis</TableHead>
              <TableHead className="text-right">CADEAUX</TableHead>
              {canEdit && <TableHead className="text-right">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rewards.map((reward) => (
              <TableRow key={reward.id} className="border-b border-gray-200 dark:border-gray-700">
                <TableCell>{reward.tier}</TableCell>
                <TableCell>
                  {reward.diamonds_min === reward.diamonds_max 
                    ? reward.diamonds_min.toLocaleString()
                    : `${reward.diamonds_min.toLocaleString()} - ${reward.diamonds_max.toLocaleString()}`
                  }
                </TableCell>
                <TableCell className="text-right font-medium">{reward.reward_amount} €</TableCell>
                {canEdit && (
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditReward(reward)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteReward(reward.id)}
                      >
                        <Trash className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))}
            {rewards.length === 0 && (
              <TableRow>
                <TableCell colSpan={canEdit ? 4 : 3} className="text-center py-4">
                  Aucune récompense définie
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Programme de Récompenses</h2>
        {canEdit && (
          <Button 
            onClick={() => setIsAddDialogOpen(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            Ajouter une récompense
          </Button>
        )}
      </div>

      <Tabs defaultValue="beginner" className="space-y-6">
        <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto">
          <TabsTrigger value="beginner">Créateurs Débutants</TabsTrigger>
          <TabsTrigger value="experienced">Créateurs Non-Débutants</TabsTrigger>
        </TabsList>

        <TabsContent value="beginner">
          {isLoading ? (
            <div className="text-center py-8">Chargement des récompenses...</div>
          ) : (
            renderRewardTable(beginnerRewards, "DÉBUTANT")
          )}
        </TabsContent>

        <TabsContent value="experienced">
          {isLoading ? (
            <div className="text-center py-8">Chargement des récompenses...</div>
          ) : (
            renderRewardTable(experiencedRewards, "NON-DÉBUTANT")
          )}
        </TabsContent>
      </Tabs>

      {/* Edit Dialog */}
      {currentReward && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Modifier la récompense</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="tier" className="text-right">
                  Palier
                </Label>
                <Input
                  id="tier"
                  value={currentReward.tier}
                  onChange={(e) => setCurrentReward({...currentReward, tier: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="min" className="text-right">
                  Min Diamants
                </Label>
                <Input
                  id="min"
                  type="number"
                  value={currentReward.diamonds_min}
                  onChange={(e) => setCurrentReward({...currentReward, diamonds_min: parseInt(e.target.value)})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="max" className="text-right">
                  Max Diamants
                </Label>
                <Input
                  id="max"
                  type="number"
                  value={currentReward.diamonds_max}
                  onChange={(e) => setCurrentReward({...currentReward, diamonds_max: parseInt(e.target.value)})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="amount" className="text-right">
                  Montant (€)
                </Label>
                <Input
                  id="amount"
                  type="number"
                  value={currentReward.reward_amount}
                  onChange={(e) => setCurrentReward({...currentReward, reward_amount: parseInt(e.target.value)})}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Annuler
              </Button>
              <Button onClick={handleSaveEdit}>
                <Save className="mr-2 h-4 w-4" />
                Enregistrer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Add Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Ajouter une récompense</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="newType" className="text-right">
                Type
              </Label>
              <div className="col-span-3">
                <select
                  id="newType"
                  value={newReward.creator_type}
                  onChange={(e) => setNewReward({...newReward, creator_type: e.target.value as 'beginner' | 'experienced'})}
                  className="w-full p-2 border rounded"
                >
                  <option value="beginner">Débutant</option>
                  <option value="experienced">Non-Débutant</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="newTier" className="text-right">
                Palier
              </Label>
              <Input
                id="newTier"
                value={newReward.tier}
                onChange={(e) => setNewReward({...newReward, tier: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="newMin" className="text-right">
                Min Diamants
              </Label>
              <Input
                id="newMin"
                type="number"
                value={newReward.diamonds_min}
                onChange={(e) => setNewReward({...newReward, diamonds_min: parseInt(e.target.value)})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="newMax" className="text-right">
                Max Diamants
              </Label>
              <Input
                id="newMax"
                type="number"
                value={newReward.diamonds_max}
                onChange={(e) => setNewReward({...newReward, diamonds_max: parseInt(e.target.value)})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="newAmount" className="text-right">
                Montant (€)
              </Label>
              <Input
                id="newAmount"
                type="number"
                value={newReward.reward_amount}
                onChange={(e) => setNewReward({...newReward, reward_amount: parseInt(e.target.value)})}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleAddReward}>
              Ajouter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
