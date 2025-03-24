
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, Calendar, UserMinus, PencilLine, Diamond, HomeIcon, Coins } from "lucide-react";
import { useIndexAuth } from "@/hooks/use-index-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/lib/supabase";
import { Account } from "@/types/accounts";
import { toast } from "sonner";
import { UltraSidebar } from "@/components/layout/UltraSidebar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useIsMobile } from "@/hooks/use-mobile";
import { Footer } from "@/components/layout/Footer";
import { usePlatformSettings } from "@/hooks/use-platform-settings";
import { UsernameWatermark } from "@/components/layout/UsernameWatermark";

const CreatorStats = () => {
  const navigate = useNavigate();
  const { role, username, userId } = useIndexAuth();
  const [creators, setCreators] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCreator, setSelectedCreator] = useState<any>(null);
  const [isEditingSchedule, setIsEditingSchedule] = useState(false);
  const [hours, setHours] = useState(0);
  const [days, setDays] = useState(0);
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
  const isMobile = useIsMobile();
  
  const [isEditingDiamonds, setIsEditingDiamonds] = useState(false);
  const [diamondAmount, setDiamondAmount] = useState(0);
  const [operationType, setOperationType] = useState<'set' | 'add' | 'subtract'>('set');
  const { platformSettings } = usePlatformSettings(role || null);

  useEffect(() => {
    if (!['agent', 'manager', 'founder', 'ambassadeur'].includes(role || '')) {
      navigate('/');
      return;
    }

    const fetchCreators = async () => {
      setLoading(true);
      try {
        console.log("Fetching creators for agent:", username);
        
        if (role === 'founder' || role === 'manager') {
          const { data: creatorsData, error: creatorsError } = await supabase
            .from("user_accounts")
            .select(`
              id,
              username,
              live_schedules (
                hours,
                days
              ),
              profiles (
                total_diamonds
              )
            `)
            .eq("role", "creator");

          if (creatorsError) {
            console.error("Error fetching creators:", creatorsError);
            toast.error("Erreur lors de la récupération des créateurs");
            return;
          }

          console.log("All creators found:", creatorsData);
          setCreators(creatorsData || []);
          return;
        }
        
        const { data: agentData, error: agentError } = await supabase
          .from("user_accounts")
          .select("id")
          .eq("username", username)
          .eq("role", role)
          .single();

        if (agentError) {
          console.error("Error fetching agent:", agentError);
          toast.error("Erreur lors de la récupération des informations de l'agent");
          return;
        }

        if (!agentData || !agentData.id) {
          console.error("Agent data not found:", username);
          toast.error("Données de l'agent introuvables");
          return;
        }

        console.log("Agent ID found:", agentData.id);

        const { data: creatorsData, error: creatorsError } = await supabase
          .from("user_accounts")
          .select(`
            id,
            username,
            live_schedules (
              hours,
              days
            ),
            profiles (
              total_diamonds
            )
          `)
          .eq("role", "creator")
          .eq("agent_id", agentData.id);

        if (creatorsError) {
          console.error("Error fetching creators:", creatorsError);
          toast.error("Erreur lors de la récupération des créateurs");
          return;
        }

        console.log("Creators found:", creatorsData);
        setCreators(creatorsData || []);
      } catch (error) {
        console.error("Error:", error);
        toast.error("Une erreur est survenue");
      } finally {
        setLoading(false);
      }
    };

    fetchCreators();
  }, [navigate, role, username]);

  const getTotalHours = () => {
    return creators.reduce((total, creator) => {
      const hours = creator.live_schedules?.[0]?.hours || 0;
      return total + Number(hours);
    }, 0);
  };

  const getTotalDays = () => {
    return creators.reduce((total, creator) => {
      const days = creator.live_schedules?.[0]?.days || 0;
      return total + Number(days);
    }, 0);
  };

  const getTotalDiamonds = () => {
    return creators.reduce((total, creator) => {
      const diamonds = creator.profiles?.[0]?.total_diamonds || 0;
      return total + Number(diamonds);
    }, 0);
  };

  const handleEditSchedule = (creator: any) => {
    setSelectedCreator(creator);
    setHours(creator.live_schedules?.[0]?.hours || 0);
    setDays(creator.live_schedules?.[0]?.days || 0);
    setIsEditingSchedule(true);
  };

  const handleSaveSchedule = async () => {
    if (!selectedCreator) return;
    
    try {
      if (selectedCreator.live_schedules && selectedCreator.live_schedules.length > 0) {
        const scheduleId = selectedCreator.live_schedules[0].id;
        const { error } = await supabase
          .from("live_schedules")
          .update({ hours, days })
          .eq("creator_id", selectedCreator.id);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("live_schedules")
          .insert([
            { creator_id: selectedCreator.id, hours, days }
          ]);
        
        if (error) throw error;
      }
      
      toast.success("Horaires mis à jour avec succès");
      
      setCreators(creators.map(c => {
        if (c.id === selectedCreator.id) {
          return {
            ...c,
            live_schedules: [{ hours, days }]
          };
        }
        return c;
      }));
      
      setIsEditingSchedule(false);
    } catch (error) {
      console.error("Error updating schedule:", error);
      toast.error("Erreur lors de la mise à jour des horaires");
    }
  };

  const handleRemoveCreator = (creator: any) => {
    setSelectedCreator(creator);
    setRemoveDialogOpen(true);
  };

  const confirmRemoveCreator = async () => {
    if (!selectedCreator) return;
    
    try {
      const { error } = await supabase
        .from("user_accounts")
        .update({ agent_id: null })
        .eq("id", selectedCreator.id);
      
      if (error) throw error;
      
      toast.success("Créateur retiré avec succès");
      
      setCreators(creators.filter(c => c.id !== selectedCreator.id));
      setRemoveDialogOpen(false);
    } catch (error) {
      console.error("Error removing creator:", error);
      toast.error("Erreur lors du retrait du créateur");
    }
  };

  const handleEditDiamonds = (creator: any) => {
    setSelectedCreator(creator);
    setDiamondAmount(creator.profiles?.[0]?.total_diamonds || 0);
    setOperationType('set');
    setIsEditingDiamonds(true);
  };

  const handleSaveDiamonds = async () => {
    if (!selectedCreator) return;
    
    try {
      let newDiamondValue = 0;
      const currentDiamonds = selectedCreator.profiles?.[0]?.total_diamonds || 0;
      
      switch (operationType) {
        case 'set':
          newDiamondValue = diamondAmount;
          break;
        case 'add':
          newDiamondValue = currentDiamonds + diamondAmount;
          break;
        case 'subtract':
          newDiamondValue = Math.max(0, currentDiamonds - diamondAmount);
          break;
      }
      
      const { error } = await supabase
        .from('profiles')
        .update({ total_diamonds: newDiamondValue })
        .eq('id', selectedCreator.id);
        
      if (error) throw error;
      
      setCreators(creators.map(c => {
        if (c.id === selectedCreator.id) {
          return {
            ...c,
            profiles: [{ ...c.profiles[0], total_diamonds: newDiamondValue }]
          };
        }
        return c;
      }));
      
      const actionText = operationType === 'set' ? 'définis à' : operationType === 'add' ? 'augmentés de' : 'réduits de';
      toast.success(`Diamants ${actionText} ${diamondAmount} pour ${selectedCreator.username}`);
      setIsEditingDiamonds(false);
    } catch (error) {
      console.error("Erreur lors de la mise à jour des diamants:", error);
      toast.error("Erreur lors de la mise à jour des diamants");
    }
  };

  const usernameWatermark = (
    <div className="fixed inset-0 pointer-events-none select-none z-0 flex items-center justify-center">
      <div className="w-full h-full flex items-center justify-center rotate-[-30deg]">
        <p className="text-slate-200/30 text-[6vw] font-bold whitespace-nowrap">
          {username?.toUpperCase()}
        </p>
      </div>
    </div>
  );

  const miniWatermark = (
    <div className="fixed inset-0 pointer-events-none select-none z-0">
      <div className="w-full h-full opacity-30">
        {Array.from({ length: 500 }).map((_, i) => (
          <div 
            key={i} 
            style={{
              position: 'absolute',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              transform: 'rotate(-30deg)',
              fontSize: '8px',
              color: 'rgba(100, 100, 100, 0.3)'
            }}
          >
            {username?.toUpperCase()}
          </div>
        ))}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen p-4 flex justify-center items-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const rewardThreshold = 36000;
  const creatorsWithRewards = creators.filter(creator => 
    (creator.profiles?.[0]?.total_diamonds || 0) >= rewardThreshold
  );

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Utiliser notre composant UsernameWatermark */}
      {username && <UsernameWatermark username={username} />}
      
      <UltraSidebar 
        username={username || ''}
        role={role || ''}
        onLogout={() => {
          localStorage.clear();
          navigate('/');
        }}
        currentPage="creator-stats"
      />
      
      <div className="flex-1 p-4 max-w-full md:max-w-6xl mx-auto space-y-6 overflow-x-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/")}
              className="h-10 w-10"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold">
              Mes Créateurs 👨‍💻
            </h1>
          </div>
          
          <Button
            variant="outline"
            onClick={() => navigate("/")}
            className="flex items-center gap-2"
          >
            <HomeIcon className="h-4 w-4" />
            Retour au tableau de bord
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Total heures de live ⏰
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{getTotalHours()}h</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Total jours streamés 📅
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{getTotalDays()}j</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Diamond className="h-5 w-5 text-purple-500" />
                Total diamants 💎
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{getTotalDiamonds().toLocaleString()}</p>
              {platformSettings && (
                <p className="text-sm text-muted-foreground">
                  Valeur: {((getTotalDiamonds() * platformSettings.diamondValue) || 0).toLocaleString()}€
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {creatorsWithRewards.length > 0 && (
          <div className="bg-green-900/20 border border-green-700/30 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-3">
              <Coins className="h-6 w-6 text-green-400 animate-pulse" />
              <div>
                <h4 className="font-medium text-green-300">🎉 Récompenses disponibles!</h4>
                <p className="text-green-400/80 text-sm">
                  {creatorsWithRewards.length} créateur(s) {creatorsWithRewards.length > 1 ? 'ont' : 'a'} atteint le seuil de {rewardThreshold.toLocaleString()} diamants pour une récompense.
                </p>
              </div>
            </div>
          </div>
        )}

        <Card className="w-full overflow-hidden">
          <CardHeader>
            <CardTitle>Détails des Créateurs ({creators.length}) 📊</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            {creators.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {role === 'agent' || role === 'ambassadeur' ? 
                  "Aucun créateur n'est assigné à votre compte" : 
                  "Aucun créateur n'est enregistré"
                }
              </div>
            ) : (
              <div className="w-full overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Créateur</TableHead>
                      <TableHead>Heures de live</TableHead>
                      <TableHead>Jours streamés</TableHead>
                      <TableHead>Diamants</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {creators.map((creator) => (
                      <TableRow key={creator.id}>
                        <TableCell className="font-medium">{creator.username}</TableCell>
                        <TableCell>{creator.live_schedules?.[0]?.hours || 0}h</TableCell>
                        <TableCell>{creator.live_schedules?.[0]?.days || 0}j</TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span>{(creator.profiles?.[0]?.total_diamonds || 0).toLocaleString()} 💎</span>
                            {platformSettings && (
                              <span className="text-xs text-muted-foreground">
                                {((creator.profiles?.[0]?.total_diamonds || 0) * platformSettings.diamondValue).toLocaleString()}€
                              </span>
                            )}
                            {(creator.profiles?.[0]?.total_diamonds || 0) >= rewardThreshold && (
                              <span className="text-xs text-green-500 animate-pulse">
                                🏆 Récompense disponible!
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleEditSchedule(creator)}
                            >
                              <PencilLine className="h-4 w-4 mr-1" />
                              {isMobile ? '' : 'Modifier les horaires'}
                            </Button>
                            
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="border-purple-500 text-purple-500 hover:bg-purple-100 hover:text-purple-700"
                              onClick={() => handleEditDiamonds(creator)}
                            >
                              <Diamond className="h-4 w-4 mr-1" />
                              {isMobile ? '' : 'Modifier les diamants'}
                            </Button>
                            
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="text-red-500 border-red-500 hover:bg-red-100 hover:text-red-700"
                              onClick={() => handleRemoveCreator(creator)}
                            >
                              <UserMinus className="h-4 w-4 mr-1" />
                              {isMobile ? '' : 'Retirer'}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        <Dialog open={isEditingSchedule} onOpenChange={setIsEditingSchedule}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Modifier les horaires ⏰</DialogTitle>
              <DialogDescription>
                Ajustez les heures de streaming et les jours pour {selectedCreator?.username}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="hours" className="text-right">
                  Heures
                </Label>
                <Input
                  id="hours"
                  type="number"
                  value={hours}
                  onChange={(e) => setHours(Number(e.target.value))}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="days" className="text-right">
                  Jours
                </Label>
                <Input
                  id="days"
                  type="number"
                  value={days}
                  onChange={(e) => setDays(Number(e.target.value))}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleSaveSchedule}>Sauvegarder</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isEditingDiamonds} onOpenChange={setIsEditingDiamonds}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Gérer les diamants 💎</DialogTitle>
              <DialogDescription>
                Modifiez les diamants pour {selectedCreator?.username}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="flex items-center justify-between mb-2">
                <Label>Diamants actuels:</Label>
                <span className="font-bold text-lg">{(selectedCreator?.profiles?.[0]?.total_diamonds || 0).toLocaleString()} 💎</span>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="operationType" className="text-right">
                  Opération
                </Label>
                <div className="col-span-3 flex gap-2">
                  <Button
                    type="button"
                    variant={operationType === 'set' ? 'default' : 'outline'}
                    onClick={() => setOperationType('set')}
                    className="flex-1"
                  >
                    Définir
                  </Button>
                  <Button
                    type="button"
                    variant={operationType === 'add' ? 'default' : 'outline'}
                    onClick={() => setOperationType('add')}
                    className="flex-1"
                  >
                    Ajouter
                  </Button>
                  <Button
                    type="button"
                    variant={operationType === 'subtract' ? 'default' : 'outline'}
                    onClick={() => setOperationType('subtract')}
                    className="flex-1"
                  >
                    Déduire
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="diamonds" className="text-right">
                  {operationType === 'set' ? 'Nouvelle valeur' : 'Quantité'}
                </Label>
                <Input
                  id="diamonds"
                  type="number"
                  min="0"
                  value={diamondAmount}
                  onChange={(e) => setDiamondAmount(Number(e.target.value))}
                  className="col-span-3"
                />
              </div>

              {platformSettings && (
                <div className="bg-muted/50 p-3 rounded-md">
                  <p className="text-sm">
                    Valeur: {(diamondAmount * platformSettings.diamondValue).toLocaleString()}€
                  </p>
                </div>
              )}
              
              {operationType !== 'set' && (
                <div className="flex items-center justify-between">
                  <Label>Nouvelle valeur totale:</Label>
                  <span className="font-bold">
                    {operationType === 'add' 
                      ? (selectedCreator?.profiles?.[0]?.total_diamonds || 0) + diamondAmount
                      : Math.max(0, (selectedCreator?.profiles?.[0]?.total_diamonds || 0) - diamondAmount)
                    } 💎
                  </span>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditingDiamonds(false)}>Annuler</Button>
              <Button type="submit" onClick={handleSaveDiamonds}>Sauvegarder</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={removeDialogOpen} onOpenChange={setRemoveDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Retirer le créateur</DialogTitle>
              <DialogDescription>
                Êtes-vous sûr de vouloir retirer {selectedCreator?.username} de votre agence ?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setRemoveDialogOpen(false)}>Annuler</Button>
              <Button variant="destructive" onClick={confirmRemoveCreator}>Confirmer</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        <Footer role={role} version="1.3" />
      </div>
    </div>
  );
};

export default CreatorStats;
