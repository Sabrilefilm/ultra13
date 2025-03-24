
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import { Loader2, Plus, Edit, Trash2, Save, X } from 'lucide-react';

interface RewardTier {
  id: string;
  tier: string;
  diamonds_min: number;
  diamonds_max: number;
  reward_amount: number;
  creator_type: 'beginner' | 'experienced';
  created_at?: string;
  updated_at?: string;
}

export function RewardProgramTables({ role }: { role: string }) {
  const [activeTab, setActiveTab] = useState<'beginner' | 'experienced'>('beginner');
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newTier, setNewTier] = useState<Partial<RewardTier> | null>(null);
  
  const isFounder = role === 'founder';
  
  // Fetch reward tiers
  const { data: rewardTiers, isLoading, refetch } = useQuery({
    queryKey: ['reward-tiers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reward_tiers')
        .select('*')
        .order('diamonds_min', { ascending: true });
        
      if (error) {
        console.error('Error fetching reward tiers:', error);
        toast.error('Erreur lors du chargement des paliers de récompense');
        return [];
      }
      
      return data as RewardTier[];
    },
  });
  
  // Filter tiers based on active tab
  const filteredTiers = rewardTiers?.filter(tier => tier.creator_type === activeTab) || [];
  
  // Start editing a tier
  const handleEdit = (tier: RewardTier) => {
    if (!isFounder) return;
    
    setEditingId(tier.id);
    setIsEditing(true);
  };
  
  // Save edited tier
  const handleSave = async (tier: RewardTier) => {
    if (!isFounder) return;
    
    try {
      const { error } = await supabase
        .from('reward_tiers')
        .update({
          tier: tier.tier,
          diamonds_min: tier.diamonds_min,
          diamonds_max: tier.diamonds_max,
          reward_amount: tier.reward_amount,
          updated_at: new Date().toISOString()
        })
        .eq('id', tier.id);
        
      if (error) {
        console.error('Error updating reward tier:', error);
        toast.error('Erreur lors de la mise à jour du palier');
        return;
      }
      
      toast.success('Palier mis à jour avec succès');
      setEditingId(null);
      setIsEditing(false);
      refetch();
    } catch (error) {
      console.error('Error in reward tier update:', error);
      toast.error('Une erreur est survenue');
    }
  };
  
  // Delete a tier
  const handleDelete = async (id: string) => {
    if (!isFounder) return;
    
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce palier ?')) return;
    
    try {
      const { error } = await supabase
        .from('reward_tiers')
        .delete()
        .eq('id', id);
        
      if (error) {
        console.error('Error deleting reward tier:', error);
        toast.error('Erreur lors de la suppression du palier');
        return;
      }
      
      toast.success('Palier supprimé avec succès');
      refetch();
    } catch (error) {
      console.error('Error in reward tier deletion:', error);
      toast.error('Une erreur est survenue');
    }
  };
  
  // Add a new tier
  const addNewTier = () => {
    if (!isFounder) return;
    
    setNewTier({
      tier: `Tier ${filteredTiers.length + 1}`,
      diamonds_min: 0,
      diamonds_max: 0,
      reward_amount: 0,
      creator_type: activeTab
    });
  };
  
  // Save new tier
  const saveNewTier = async () => {
    if (!isFounder || !newTier) return;
    
    try {
      const { error } = await supabase
        .from('reward_tiers')
        .insert({
          tier: newTier.tier,
          diamonds_min: newTier.diamonds_min || 0,
          diamonds_max: newTier.diamonds_max || 0,
          reward_amount: newTier.reward_amount || 0,
          creator_type: activeTab
        });
        
      if (error) {
        console.error('Error creating reward tier:', error);
        toast.error('Erreur lors de la création du palier');
        return;
      }
      
      toast.success('Nouveau palier ajouté avec succès');
      setNewTier(null);
      refetch();
    } catch (error) {
      console.error('Error in reward tier creation:', error);
      toast.error('Une erreur est survenue');
    }
  };
  
  // Update field of edited tier
  const updateTierField = (id: string, field: keyof RewardTier, value: string | number) => {
    if (!rewardTiers) return;
    
    const updatedTiers = rewardTiers.map(tier => {
      if (tier.id === id) {
        return { ...tier, [field]: value };
      }
      return tier;
    });
    
    // @ts-ignore - we know this assignment is safe
    useQuery.setQueryData(['reward-tiers'], updatedTiers);
  };
  
  // Update field of new tier
  const updateNewTierField = (field: keyof RewardTier, value: string | number) => {
    if (!newTier) return;
    setNewTier({ ...newTier, [field]: value });
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <Card className="border-blue-200 dark:border-blue-900/30">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-white dark:from-blue-950/30 dark:to-slate-950">
        <CardTitle className="flex items-center justify-between">
          <span>Programme de Récompenses</span>
          {isFounder && (
            <Button 
              onClick={addNewTier} 
              variant="outline" 
              size="sm"
              className="bg-white dark:bg-gray-800"
              disabled={!!newTier}
            >
              <Plus className="h-4 w-4 mr-1" />
              Ajouter un palier
            </Button>
          )}
        </CardTitle>
        <CardDescription>
          Gérez les paliers de récompenses pour les créateurs
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-4">
        <Tabs defaultValue="beginner" onValueChange={(value) => setActiveTab(value as 'beginner' | 'experienced')}>
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="beginner">Créateurs Débutants</TabsTrigger>
            <TabsTrigger value="experienced">Créateurs Expérimentés</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab}>
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Palier</TableHead>
                    <TableHead>Diamants Min</TableHead>
                    <TableHead>Diamants Max</TableHead>
                    <TableHead>Récompense (€)</TableHead>
                    {isFounder && <TableHead className="text-right">Actions</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTiers.map(tier => (
                    <TableRow key={tier.id}>
                      <TableCell>
                        {editingId === tier.id ? (
                          <Input 
                            value={tier.tier} 
                            onChange={(e) => updateTierField(tier.id, 'tier', e.target.value)}
                            className="w-24"
                          />
                        ) : (
                          tier.tier
                        )}
                      </TableCell>
                      <TableCell>
                        {editingId === tier.id ? (
                          <Input 
                            type="number" 
                            value={tier.diamonds_min} 
                            onChange={(e) => updateTierField(tier.id, 'diamonds_min', parseInt(e.target.value))}
                            className="w-28"
                          />
                        ) : (
                          tier.diamonds_min.toLocaleString()
                        )}
                      </TableCell>
                      <TableCell>
                        {editingId === tier.id ? (
                          <Input 
                            type="number" 
                            value={tier.diamonds_max} 
                            onChange={(e) => updateTierField(tier.id, 'diamonds_max', parseInt(e.target.value))}
                            className="w-28"
                          />
                        ) : (
                          tier.diamonds_max.toLocaleString()
                        )}
                      </TableCell>
                      <TableCell>
                        {editingId === tier.id ? (
                          <Input 
                            type="number" 
                            value={tier.reward_amount} 
                            onChange={(e) => updateTierField(tier.id, 'reward_amount', parseFloat(e.target.value))}
                            className="w-24"
                          />
                        ) : (
                          `${tier.reward_amount.toLocaleString()}€`
                        )}
                      </TableCell>
                      {isFounder && (
                        <TableCell className="text-right">
                          {editingId === tier.id ? (
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  setEditingId(null);
                                  refetch(); // Reset to original data
                                }}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleSave(tier)}
                              >
                                <Save className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : (
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEdit(tier)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDelete(tier.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                  
                  {/* New tier row */}
                  {newTier && (
                    <TableRow className="bg-blue-50 dark:bg-blue-950/20">
                      <TableCell>
                        <Input 
                          value={newTier.tier} 
                          onChange={(e) => updateNewTierField('tier', e.target.value)}
                          className="w-24"
                          placeholder="Tier X"
                        />
                      </TableCell>
                      <TableCell>
                        <Input 
                          type="number" 
                          value={newTier.diamonds_min || ''} 
                          onChange={(e) => updateNewTierField('diamonds_min', parseInt(e.target.value))}
                          className="w-28"
                          placeholder="0"
                        />
                      </TableCell>
                      <TableCell>
                        <Input 
                          type="number" 
                          value={newTier.diamonds_max || ''} 
                          onChange={(e) => updateNewTierField('diamonds_max', parseInt(e.target.value))}
                          className="w-28"
                          placeholder="0"
                        />
                      </TableCell>
                      <TableCell>
                        <Input 
                          type="number" 
                          value={newTier.reward_amount || ''} 
                          onChange={(e) => updateNewTierField('reward_amount', parseFloat(e.target.value))}
                          className="w-24"
                          placeholder="0"
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setNewTier(null)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={saveNewTier}
                            disabled={!newTier.tier || !newTier.diamonds_min}
                          >
                            <Save className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                  
                  {filteredTiers.length === 0 && !newTier && (
                    <TableRow>
                      <TableCell colSpan={isFounder ? 5 : 4} className="text-center py-4 text-muted-foreground">
                        Aucun palier de récompense défini pour ce type de créateur
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="bg-gray-50 dark:bg-gray-900/30 flex flex-col items-start gap-2 text-sm text-muted-foreground">
        <p>
          <strong>Diamants Min/Max:</strong> Intervalle de diamants requis pour chaque palier. 
        </p>
        <p>
          <strong>Récompense:</strong> Montant en euros gagné lorsque le créateur atteint ce palier.
        </p>
        {!isFounder && (
          <p className="text-blue-500">
            Seul le fondateur peut modifier les paliers de récompense.
          </p>
        )}
      </CardFooter>
    </Card>
  );
}
