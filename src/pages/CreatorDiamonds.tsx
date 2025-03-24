
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UltraSidebar } from '@/components/layout/UltraSidebar';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Diamond, Edit, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { Loading } from '@/components/ui/loading';

interface Creator {
  id: string;
  username: string;
  role: string;
  total_diamonds: number;
  diamonds_goal: number;
}

const CreatorDiamonds = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [creators, setCreators] = useState<Creator[]>([]);
  const [filteredCreators, setFilteredCreators] = useState<Creator[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [userId, setUserId] = useState<string>('');
  const [role, setRole] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCreator, setSelectedCreator] = useState<Creator | null>(null);
  const [newDiamondGoal, setNewDiamondGoal] = useState<number>(0);
  const [agencyGoal, setAgencyGoal] = useState<number>(0);
  const [diamondValue, setDiamondValue] = useState<number>(0);
  const [isEditing, setIsEditing] = useState(false);
  
  useEffect(() => {
    const checkAuth = async () => {
      const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
      const storedUsername = localStorage.getItem('username');
      const storedRole = localStorage.getItem('userRole');
      const storedUserId = localStorage.getItem('userId');
      
      if (!isAuthenticated || !storedUsername || !storedRole) {
        toast.error("Session expirée, veuillez vous reconnecter");
        navigate('/');
        return;
      }
      
      setUserId(storedUserId || '');
      setUsername(storedUsername);
      setRole(storedRole);
      
      // Fetch platform settings for diamond value
      const { data: settingsData } = await supabase
        .from('platform_settings')
        .select('diamond_value')
        .single();
        
      if (settingsData?.diamond_value) {
        setDiamondValue(settingsData.diamond_value);
      }
      
      // Fetch agency goal
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('diamonds_goal')
        .eq('role', 'agency')
        .single();
        
      if (profilesData?.diamonds_goal) {
        setAgencyGoal(profilesData.diamonds_goal);
      }
      
      await fetchCreators();
    };
    
    checkAuth();
  }, [navigate]);
  
  const fetchCreators = async () => {
    try {
      setLoading(true);
      
      let query = supabase.from('user_accounts')
        .select(`
          id,
          username,
          role,
          profiles(total_diamonds, diamonds_goal)
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
        total_diamonds: user.profiles?.[0]?.total_diamonds || 0,
        diamonds_goal: user.profiles?.[0]?.diamonds_goal || 0
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
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    
    if (query.trim() === '') {
      setFilteredCreators(creators);
    } else {
      const filtered = creators.filter(creator => 
        creator.username.toLowerCase().includes(query)
      );
      setFilteredCreators(filtered);
    }
  };
  
  const openEditDialog = (creator: Creator) => {
    setSelectedCreator(creator);
    setNewDiamondGoal(creator.diamonds_goal);
    setIsDialogOpen(true);
  };
  
  const handleUpdateDiamondGoal = async () => {
    if (!selectedCreator) return;
    
    try {
      setIsEditing(true);
      
      const { error } = await supabase
        .from('profiles')
        .update({ diamonds_goal: newDiamondGoal })
        .eq('id', selectedCreator.id);
        
      if (error) throw error;
      
      toast.success(`Objectif diamants mis à jour pour ${selectedCreator.username}`);
      await fetchCreators();
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      toast.error('Erreur lors de la mise à jour de l\'objectif');
    } finally {
      setIsEditing(false);
    }
  };
  
  const handleUpdateAgencyGoal = async () => {
    try {
      setIsEditing(true);
      
      const { error } = await supabase
        .from('profiles')
        .update({ diamonds_goal: agencyGoal })
        .eq('role', 'agency');
        
      if (error) {
        // Si le profil n'existe pas, le créer
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({ role: 'agency', diamonds_goal: agencyGoal });
          
        if (insertError) throw insertError;
      }
      
      toast.success('Objectif diamants de l\'agence mis à jour');
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      toast.error('Erreur lors de la mise à jour de l\'objectif de l\'agence');
    } finally {
      setIsEditing(false);
    }
  };
  
  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };
  
  // Calcul du total des diamants de l'agence
  const totalAgencyDiamonds = creators.reduce((sum, creator) => sum + creator.total_diamonds, 0);
  
  // Calcul du pourcentage de progression vers l'objectif de l'agence
  const agencyProgressPercentage = agencyGoal > 0 
    ? Math.min(Math.round((totalAgencyDiamonds / agencyGoal) * 100), 100) 
    : 0;
  
  if (loading) {
    return <Loading fullScreen size="large" text="Chargement des données diamants..." />;
  }
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex">
      <UltraSidebar 
        username={username}
        role={role}
        userId={userId}
        onLogout={handleLogout}
        currentPage="creator-diamonds"
      />
      
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Gestion des Diamants</h1>
            <Button 
              variant="outline" 
              onClick={fetchCreators}
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Actualiser
            </Button>
          </div>
          
          {/* Statistiques de l'agence */}
          <Card className="bg-gradient-to-br from-purple-600/10 to-blue-600/10 border-purple-200 dark:border-purple-900/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Diamond className="h-5 w-5 text-purple-400" />
                Objectif Diamants Agence
              </CardTitle>
              <CardDescription>
                Progression de l'agence vers l'objectif de diamants
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total Diamants</p>
                  <p className="text-2xl font-bold">{totalAgencyDiamonds.toLocaleString()}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Valeur: {(totalAgencyDiamonds * diamondValue).toLocaleString()}€
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Objectif</p>
                  {role === 'founder' || role === 'manager' ? (
                    <div className="flex items-center gap-2">
                      <Input 
                        type="number" 
                        value={agencyGoal} 
                        onChange={(e) => setAgencyGoal(Number(e.target.value))}
                        className="w-32"
                      />
                      <Button 
                        size="sm" 
                        onClick={handleUpdateAgencyGoal}
                        disabled={isEditing}
                      >
                        Enregistrer
                      </Button>
                    </div>
                  ) : (
                    <p className="text-2xl font-bold">{agencyGoal.toLocaleString()}</p>
                  )}
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Progression</p>
                  <p className="text-2xl font-bold">{agencyProgressPercentage}%</p>
                </div>
              </div>
              
              <div className="space-y-1">
                <Progress value={agencyProgressPercentage} className="h-2" />
                <p className="text-xs text-right text-gray-500 dark:text-gray-400">
                  {totalAgencyDiamonds.toLocaleString()} / {agencyGoal.toLocaleString()} diamants
                </p>
              </div>
            </CardContent>
          </Card>
          
          {/* Liste des créateurs */}
          <Card>
            <CardHeader>
              <CardTitle>Diamants des Créateurs</CardTitle>
              <CardDescription>
                Gérez les objectifs de diamants pour chaque créateur
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Rechercher un créateur..."
                    value={searchQuery}
                    onChange={handleSearch}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Créateur</TableHead>
                      <TableHead className="text-right">Diamants</TableHead>
                      <TableHead className="text-right">Objectif</TableHead>
                      <TableHead className="text-right">Progression</TableHead>
                      <TableHead className="text-right">Valeur (€)</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCreators.length > 0 ? (
                      filteredCreators.map(creator => {
                        const progressPercentage = creator.diamonds_goal > 0 
                          ? Math.min(Math.round((creator.total_diamonds / creator.diamonds_goal) * 100), 100)
                          : 0;
                          
                        return (
                          <TableRow key={creator.id}>
                            <TableCell>
                              <div className="font-medium">{creator.username}</div>
                            </TableCell>
                            <TableCell className="text-right">
                              {creator.total_diamonds.toLocaleString()}
                            </TableCell>
                            <TableCell className="text-right">
                              {creator.diamonds_goal.toLocaleString()}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-2">
                                <Progress value={progressPercentage} className="w-16 h-2" />
                                <span>{progressPercentage}%</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              {(creator.total_diamonds * diamondValue).toLocaleString()}€
                            </TableCell>
                            <TableCell className="text-right">
                              {(role === 'founder' || role === 'manager' || 
                                (role === 'agent' && creator.id)) && (
                                <Button
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => openEditDialog(creator)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-4">
                          Aucun créateur trouvé
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Dialog pour modifier l'objectif de diamants */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier l'objectif de diamants</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">Créateur:</p>
              <p className="font-bold">{selectedCreator?.username}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Diamants actuels:</p>
              <p>{selectedCreator?.total_diamonds.toLocaleString()}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Nouvel objectif:</p>
              <Input
                type="number"
                value={newDiamondGoal}
                onChange={(e) => setNewDiamondGoal(Number(e.target.value))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleUpdateDiamondGoal} disabled={isEditing}>
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreatorDiamonds;
