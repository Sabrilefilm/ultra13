
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { UltraDashboard } from "@/components/dashboard/UltraDashboard";
import { useIndexAuth } from "@/hooks/use-index-auth";
import { usePlatformSettings } from "@/hooks/use-platform-settings";
import { useAccountManagement } from "@/hooks/use-account-management";
import { useInactivityTimer } from "@/hooks/use-inactivity-timer";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Plus, Diamond, Target, ArrowUp, ArrowDown, ArrowUpCircle, Search, X, Save, Award } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Creator {
  id: string;
  username: string;
  role: string;
  total_diamonds: number;
  diamonds_goal: number;
}

interface AgencyGoals {
  id: string;
  agency_id: string;
  month: string;
  year: number;
  diamonds_goal: number;
  created_at: string;
}

const CreatorDiamonds = () => {
  const { toast: toastHook } = useToast();
  const { isAuthenticated, username, role, userId, handleLogout } = useIndexAuth();
  const { platformSettings, handleUpdateSettings } = usePlatformSettings(role);
  const { handleCreateAccount } = useAccountManagement();
  const navigate = useNavigate();
  
  const [creators, setCreators] = useState<Creator[]>([]);
  const [filteredCreators, setFilteredCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);
  const [agencyGoals, setAgencyGoals] = useState<AgencyGoals | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // États pour les modales
  const [isCreatorDiamondDialogOpen, setIsCreatorDiamondDialogOpen] = useState(false);
  const [isAgencyGoalDialogOpen, setIsAgencyGoalDialogOpen] = useState(false);
  const [selectedCreator, setSelectedCreator] = useState<Creator | null>(null);
  const [diamondValue, setDiamondValue] = useState<string>('');
  const [diamondGoal, setDiamondGoal] = useState<string>('');
  const [agencyDiamondGoal, setAgencyDiamondGoal] = useState<string>('');
  
  // Current month and year
  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString('default', { month: 'long' });
  const currentYear = currentDate.getFullYear();
  const previousMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1).toLocaleString('default', { month: 'long' });
  
  // Inactivity timer for automatic logout
  const { showWarning, dismissWarning, formattedTime } = useInactivityTimer({
    timeout: 120000, // 2 minutes
    onTimeout: () => {
      handleLogout();
      toastHook({
        title: "Déconnexion automatique",
        description: "Vous avez été déconnecté en raison d'inactivité.",
      });
    },
    warningTime: 30000, 
    onWarning: () => {}
  });
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
      return;
    }
    
    if (role !== 'founder' && role !== 'manager' && role !== 'agent') {
      toast.error("Vous n'avez pas accès à cette page");
      navigate('/');
      return;
    }
    
    fetchCreators();
    fetchAgencyGoals();
  }, [isAuthenticated, role, navigate]);
  
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredCreators(creators);
    } else {
      const filtered = creators.filter(creator => 
        creator.username.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCreators(filtered);
    }
  }, [creators, searchTerm]);
  
  const fetchCreators = async () => {
    try {
      setLoading(true);
      
      let query = supabase.from('user_accounts')
        .select(`
          id,
          username,
          role,
          profiles:id(total_diamonds, diamonds_goal)
        `)
        .eq('role', 'creator');
        
      // Si l'utilisateur est un agent, ne montrer que ses créateurs
      if (role === 'agent') {
        query = query.eq('agent_id', userId);
      }
      
      const { data, error } = await query;
      
      if (error) {
        throw error;
      }
      
      const formattedCreators = data.map(user => ({
        id: user.id,
        username: user.username,
        role: user.role,
        total_diamonds: user.profiles?.total_diamonds || 0,
        diamonds_goal: user.profiles?.diamonds_goal || 0
      }));
      
      setCreators(formattedCreators);
      setFilteredCreators(formattedCreators);
    } catch (error) {
      console.error('Erreur lors du chargement des créateurs:', error);
      toast.error('Erreur lors du chargement des créateurs');
    } finally {
      setLoading(false);
    }
  };
  
  const fetchAgencyGoals = async () => {
    try {
      // Récupérer l'objectif du mois en cours
      const { data, error } = await supabase
        .from('agency_goals')
        .select('*')
        .eq('month', currentMonth)
        .eq('year', currentYear)
        .single();
      
      if (error && error.code !== 'PGSQL_ERROR') {
        throw error;
      }
      
      if (data) {
        setAgencyGoals(data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des objectifs:', error);
    }
  };
  
  const handleUpdateCreatorDiamonds = async () => {
    if (!selectedCreator) return;
    
    try {
      // Récupérer d'abord le profil actuel, ou le créer s'il n'existe pas
      const { data: existingProfile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', selectedCreator.id)
        .single();
      
      if (profileError && profileError.code !== 'PGSQL_ERROR') {
        // Si le profil n'existe pas encore, on le crée
        if (profileError.code === 'PGSQL_ERROR' || profileError.message.includes('not found')) {
          const { error: insertError } = await supabase
            .from('profiles')
            .insert({ 
              id: selectedCreator.id,
              username: selectedCreator.username,
              total_diamonds: parseInt(diamondValue || '0'),
              diamonds_goal: parseInt(diamondGoal || '0')
            });
          
          if (insertError) throw insertError;
        } else {
          throw profileError;
        }
      } else {
        // Si le profil existe, on le met à jour
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ 
            total_diamonds: parseInt(diamondValue || '0'),
            diamonds_goal: parseInt(diamondGoal || '0')
          })
          .eq('id', selectedCreator.id);
        
        if (updateError) throw updateError;
      }
      
      toast.success('Diamants mis à jour avec succès');
      fetchCreators();
      setIsCreatorDiamondDialogOpen(false);
    } catch (error) {
      console.error('Erreur lors de la mise à jour des diamants:', error);
      toast.error('Erreur lors de la mise à jour des diamants');
    }
  };
  
  const handleUpdateAgencyGoal = async () => {
    try {
      if (agencyGoals) {
        // Mettre à jour l'objectif existant
        const { error } = await supabase
          .from('agency_goals')
          .update({ diamonds_goal: parseInt(agencyDiamondGoal) })
          .eq('id', agencyGoals.id);
          
        if (error) throw error;
      } else {
        // Créer un nouvel objectif
        const { error } = await supabase
          .from('agency_goals')
          .insert({
            agency_id: userId, // Utiliser l'ID de l'agent ou manager connecté
            month: currentMonth,
            year: currentYear,
            diamonds_goal: parseInt(agencyDiamondGoal)
          });
          
        if (error) throw error;
      }
      
      toast.success("Objectif d'agence mis à jour avec succès");
      fetchAgencyGoals();
      setIsAgencyGoalDialogOpen(false);
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'objectif:", error);
      toast.error("Erreur lors de la mise à jour de l'objectif");
    }
  };
  
  const openCreatorDiamondDialog = (creator: Creator) => {
    setSelectedCreator(creator);
    setDiamondValue(creator.total_diamonds.toString());
    setDiamondGoal(creator.diamonds_goal.toString());
    setIsCreatorDiamondDialogOpen(true);
  };
  
  const openAgencyGoalDialog = () => {
    setAgencyDiamondGoal(agencyGoals?.diamonds_goal.toString() || '0');
    setIsAgencyGoalDialogOpen(true);
  };
  
  const calculateTotalDiamonds = () => {
    return creators.reduce((sum, creator) => sum + creator.total_diamonds, 0);
  };
  
  const calculateTotalGoal = () => {
    return creators.reduce((sum, creator) => sum + creator.diamonds_goal, 0);
  };
  
  const getProgressPercentage = (current: number, goal: number) => {
    if (!goal) return 0;
    const percentage = (current / goal) * 100;
    return Math.min(percentage, 100); // Cap at 100%
  };
  
  return (
    <SidebarProvider defaultOpen={true}>
      <UltraDashboard
        username={username}
        role={role || ''}
        userId={userId || ''}
        onLogout={handleLogout}
        platformSettings={platformSettings}
        handleCreateAccount={handleCreateAccount}
        handleUpdateSettings={handleUpdateSettings}
        showWarning={showWarning}
        dismissWarning={dismissWarning}
        formattedTime={formattedTime}
        currentPage="dashboard"
      />
      
      <div className="p-4 md:p-6 md:ml-64 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
              Gestion des Diamants
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Gérez les diamants et objectifs des créateurs
            </p>
          </div>
          
          {role === 'founder' && (
            <div className="flex gap-3">
              <Button 
                onClick={openAgencyGoalDialog}
                className="bg-amber-600 hover:bg-amber-700 flex items-center gap-2"
              >
                <Target className="h-4 w-4" />
                Objectif d'Agence ({currentMonth})
              </Button>
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="bg-gradient-to-br from-purple-600/10 to-blue-600/10 border-purple-200 dark:border-purple-900/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl flex items-center gap-2">
                <Diamond className="h-5 w-5 text-purple-400" />
                Total Diamants
              </CardTitle>
              <CardDescription>
                Tous les créateurs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{calculateTotalDiamonds().toLocaleString()}</div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Objectif: {calculateTotalGoal().toLocaleString()}
              </p>
              <Progress 
                className="h-2 mt-2" 
                value={getProgressPercentage(calculateTotalDiamonds(), calculateTotalGoal())} 
              />
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-amber-600/10 to-red-600/10 border-amber-200 dark:border-amber-900/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl flex items-center gap-2">
                <Target className="h-5 w-5 text-amber-400" />
                Objectif Agence
              </CardTitle>
              <CardDescription>
                {currentMonth} {currentYear}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {agencyGoals ? agencyGoals.diamonds_goal.toLocaleString() : "Non défini"}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Progression: {agencyGoals ? 
                  `${getProgressPercentage(calculateTotalDiamonds(), agencyGoals.diamonds_goal).toFixed(1)}%` : 
                  "N/A"}
              </p>
              <Progress 
                className="h-2 mt-2" 
                value={agencyGoals ? 
                  getProgressPercentage(calculateTotalDiamonds(), agencyGoals.diamonds_goal) : 
                  0
                } 
              />
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-blue-600/10 to-green-600/10 border-blue-200 dark:border-blue-900/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl flex items-center gap-2">
                <Award className="h-5 w-5 text-blue-400" />
                Valeur Diamants
              </CardTitle>
              <CardDescription>
                Conversion en €
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {(calculateTotalDiamonds() * (platformSettings?.diamondValue || 0.01)).toLocaleString()} €
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {platformSettings?.diamondValue || 0.01} € par diamant
              </p>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle>Créateurs</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un créateur..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <X
                  className="absolute right-2 top-2.5 h-4 w-4 text-muted-foreground cursor-pointer"
                  onClick={() => setSearchTerm('')}
                />
              )}
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
              </div>
            ) : filteredCreators.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Aucun créateur trouvé</p>
              </div>
            ) : (
              <ScrollArea className="h-[calc(100vh-450px)] min-h-[400px]">
                <div className="space-y-4">
                  {filteredCreators.map((creator) => (
                    <Card key={creator.id} className="overflow-hidden border border-gray-200 dark:border-gray-700">
                      <div className="p-4 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-primary/10 text-primary">
                              {creator.username.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-medium">{creator.username}</h3>
                            <div className="flex items-center gap-4 mt-1">
                              <div className="flex items-center gap-1 text-sm">
                                <Diamond className="h-4 w-4 text-purple-400" />
                                <span>{creator.total_diamonds.toLocaleString()}</span>
                              </div>
                              <div className="flex items-center gap-1 text-sm">
                                <Target className="h-4 w-4 text-amber-400" />
                                <span>Objectif: {creator.diamonds_goal.toLocaleString()}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="ml-auto flex items-center gap-2">
                          <Progress 
                            className="w-24 h-2 mr-2" 
                            value={getProgressPercentage(creator.total_diamonds, creator.diamonds_goal)} 
                          />
                          <Button
                            variant="outline"
                            className="border-purple-200 dark:border-purple-900/50"
                            onClick={() => openCreatorDiamondDialog(creator)}
                          >
                            <Diamond className="h-4 w-4 mr-2 text-purple-500" />
                            Mettre à jour
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
        
        {/* Modales */}
        <Dialog open={isCreatorDiamondDialogOpen} onOpenChange={setIsCreatorDiamondDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Mettre à jour les diamants</DialogTitle>
              <DialogDescription>
                {selectedCreator && `Créateur: ${selectedCreator.username}`}
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="diamonds">Nombre de diamants</Label>
                  <Input
                    id="diamonds"
                    type="number"
                    value={diamondValue}
                    onChange={(e) => setDiamondValue(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="diamondsGoal">Objectif diamants</Label>
                  <Input
                    id="diamondsGoal"
                    type="number"
                    value={diamondGoal}
                    onChange={(e) => setDiamondGoal(e.target.value)}
                  />
                </div>
              </div>
              
              {selectedCreator && (
                <Alert className="bg-blue-500/10 border-blue-200 dark:border-blue-800">
                  <AlertDescription className="text-sm flex items-center gap-2">
                    <Diamond className="h-4 w-4 text-blue-500" />
                    Valeur actuelle: {selectedCreator.total_diamonds.toLocaleString()} diamants.
                    {selectedCreator.diamonds_goal > 0 && 
                      ` Objectif actuel: ${selectedCreator.diamonds_goal.toLocaleString()} diamants.`}
                  </AlertDescription>
                </Alert>
              )}
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreatorDiamondDialogOpen(false)}>
                Annuler
              </Button>
              <Button onClick={handleUpdateCreatorDiamonds} className="bg-purple-600 hover:bg-purple-700">
                <Save className="h-4 w-4 mr-2" />
                Enregistrer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        <Dialog open={isAgencyGoalDialogOpen} onOpenChange={setIsAgencyGoalDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Objectif d'Agence</DialogTitle>
              <DialogDescription>
                Définir l'objectif d'agence pour {currentMonth} {currentYear}
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="agencyGoal">Nombre de diamants visé</Label>
                <Input
                  id="agencyGoal"
                  type="number"
                  value={agencyDiamondGoal}
                  onChange={(e) => setAgencyDiamondGoal(e.target.value)}
                />
              </div>
              
              {agencyGoals && (
                <Alert className="bg-amber-500/10 border-amber-200 dark:border-amber-800">
                  <AlertDescription className="text-sm flex items-center gap-2">
                    <Target className="h-4 w-4 text-amber-500" />
                    Objectif actuel: {agencyGoals.diamonds_goal.toLocaleString()} diamants
                  </AlertDescription>
                </Alert>
              )}
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAgencyGoalDialogOpen(false)}>
                Annuler
              </Button>
              <Button onClick={handleUpdateAgencyGoal} className="bg-amber-600 hover:bg-amber-700">
                <Target className="h-4 w-4 mr-2" />
                Définir l'objectif
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
      </div>
    </SidebarProvider>
  );
};

export default CreatorDiamonds;
