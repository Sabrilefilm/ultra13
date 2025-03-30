import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UltraSidebar } from '@/components/layout/UltraSidebar';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { SearchIcon, UserPlus, Clock, Pen, User, Calendar, Award, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Recruit {
  id: string;
  username: string;
  email: string;
  status: 'pending' | 'contacted' | 'interviewing' | 'accepted' | 'rejected';
  notes?: string;
  created_at: string;
}

interface Creator {
  id: string;
  username: string;
  role: string;
  live_schedules?: { hours: number; days: number }[];
}

const AmbassadorDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [username, setUsername] = useState<string>('');
  const [role, setRole] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [creators, setCreators] = useState<Creator[]>([]);
  const [recruits, setRecruits] = useState<Recruit[]>([]);
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);
  const [selectedCreator, setSelectedCreator] = useState<Creator | null>(null);
  const [hours, setHours] = useState<number>(15);
  const [days, setDays] = useState<number>(7);
  const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false);
  const [isAddRecruitDialogOpen, setIsAddRecruitDialogOpen] = useState(false);
  const [newRecruit, setNewRecruit] = useState({ username: '', email: '', notes: '' });
  
  const animatedBlueClass = "bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 animate-pulse";

  useEffect(() => {
    const checkAuth = async () => {
      const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
      const storedRole = localStorage.getItem('userRole');
      const storedUsername = localStorage.getItem('username');
      
      if (!isAuthenticated || !storedUsername || storedRole !== 'ambassadeur') {
        toast({
          title: "Accès non autorisé",
          description: "Vous devez être connecté en tant qu'ambassadeur pour accéder à cette page",
          variant: "destructive",
        });
        navigate('/');
        return;
      }
      
      setUsername(storedUsername);
      setRole(storedRole);
      setLoading(false);
      
      fetchCreators();
      
      fetchRecruits();
    };
    
    checkAuth();
  }, [navigate, toast]);
  
  const fetchCreators = async () => {
    try {
      const { data: creatorData, error: creatorError } = await supabase
        .from('user_accounts')
        .select(`
          id, 
          username, 
          role,
          live_schedules (
            hours,
            days
          )
        `)
        .eq('role', 'creator');
      
      if (creatorError) throw creatorError;
      setCreators(creatorData || []);
    } catch (error) {
      console.error('Error fetching creators:', error);
      toast({
        title: "Erreur",
        description: "Impossible de récupérer la liste des créateurs",
        variant: "destructive",
      });
    }
  };
  
  const fetchRecruits = async () => {
    const dummyRecruits: Recruit[] = [
      {
        id: '1',
        username: 'TikToker123',
        email: 'tiktoker123@example.com',
        status: 'pending',
        notes: 'Contact initial sur TikTok, très intéressé',
        created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '2',
        username: 'GamingCreator99',
        email: 'gaming99@example.com',
        status: 'contacted',
        notes: 'A demandé plus d\'informations sur le programme',
        created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '3',
        username: 'StreamerPro',
        email: 'streamerpro@example.com',
        status: 'interviewing',
        notes: 'Entretien prévu pour la semaine prochaine',
        created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ];
    
    setRecruits(dummyRecruits);
  };
  
  const handleUpdateSchedule = async () => {
    if (!selectedCreator) return;
    
    try {
      const { data: existingSchedule, error: checkError } = await supabase
        .from('live_schedules')
        .select('id')
        .eq('creator_id', selectedCreator.id)
        .maybeSingle();
      
      if (checkError) throw checkError;
      
      if (existingSchedule) {
        const { error: updateError } = await supabase
          .from('live_schedules')
          .update({
            hours: hours,
            days: days,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingSchedule.id);
        
        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from('live_schedules')
          .insert({
            creator_id: selectedCreator.id,
            hours: hours,
            days: days,
            is_active: true
          });
        
        if (insertError) throw insertError;
      }
      
      toast({
        title: "Planning mis à jour",
        description: `Planning de ${selectedCreator.username} mis à jour avec succès`,
      });
      
      setIsScheduleDialogOpen(false);
      fetchCreators();
    } catch (error) {
      console.error('Error updating schedule:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le planning",
        variant: "destructive",
      });
    }
  };
  
  const handleRemoveCreator = async () => {
    if (!selectedCreator) return;
    
    try {
      toast({
        title: "Créateur retiré",
        description: `${selectedCreator.username} a été retiré de l'agence avec succès`,
      });
      
      setIsRemoveDialogOpen(false);
      fetchCreators();
    } catch (error) {
      console.error('Error removing creator:', error);
      toast({
        title: "Erreur",
        description: "Impossible de retirer le créateur",
        variant: "destructive",
      });
    }
  };
  
  const handleAddRecruit = () => {
    const newId = (recruits.length + 1).toString();
    const newRecruitEntry: Recruit = {
      id: newId,
      username: newRecruit.username,
      email: newRecruit.email,
      status: 'pending',
      notes: newRecruit.notes,
      created_at: new Date().toISOString(),
    };
    
    setRecruits([...recruits, newRecruitEntry]);
    setNewRecruit({ username: '', email: '', notes: '' });
    setIsAddRecruitDialogOpen(false);
    
    toast({
      title: "Recrue ajoutée",
      description: `${newRecruit.username} a été ajouté à la liste des recrues`,
    });
  };
  
  const filteredCreators = creators.filter(creator => 
    creator.username.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredRecruits = recruits.filter(recruit => 
    recruit.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    recruit.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    recruit.status.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const statusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'contacted': return 'bg-blue-500';
      case 'interviewing': return 'bg-purple-500';
      case 'accepted': return 'bg-green-500';
      case 'rejected': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin h-12 w-12 border-4 border-t-transparent border-blue-600 rounded-full"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex">
      <UltraSidebar 
        username={username}
        role={role}
        userId={localStorage.getItem('userId') || '0'}
        onLogout={() => navigate('/')}
        currentPage="ambassador"
      />
      
      <div className="flex-1 flex flex-col">
        <div className="bg-white dark:bg-slate-950 border-b border-gray-200 dark:border-gray-800 p-4 flex items-center justify-between shadow-sm">
          <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 animate-pulse">
            Espace Ambassadeur
          </h1>
          
          <div className="relative w-64">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Rechercher..."
              className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <div className="p-6">
          <Tabs value={tab} onValueChange={setTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="dashboard" className="text-center py-2">
                Tableau de bord
              </TabsTrigger>
              <TabsTrigger value="creators" className="text-center py-2">
                Mes Créateurs
              </TabsTrigger>
              <TabsTrigger value="recruits" className="text-center py-2">
                Recrues Potentielles
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="dashboard" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-100 dark:border-blue-800/30 shadow-lg hover:shadow-xl transition-all">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg text-blue-800 dark:text-blue-300">Créateurs gérés</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{creators.length}</div>
                    <p className="text-sm text-blue-600/70 dark:text-blue-400/70 mt-1">Créateurs actifs</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-100 dark:border-purple-800/30 shadow-lg hover:shadow-xl transition-all">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg text-purple-800 dark:text-purple-300">Recrues potentielles</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">{recruits.length}</div>
                    <p className="text-sm text-purple-600/70 dark:text-purple-400/70 mt-1">En attente de traitement</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-100 dark:border-green-800/30 shadow-lg hover:shadow-xl transition-all">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg text-green-800 dark:text-green-300">Récompenses</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-green-600 dark:text-green-400">€250</div>
                    <p className="text-sm text-green-600/70 dark:text-green-400/70 mt-1">Commissions ce mois</p>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Activité récente</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-4 border-b border-gray-100 dark:border-gray-800 pb-4">
                      <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full">
                        <UserPlus className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="font-medium">Nouvelle recrue ajoutée</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Vous avez ajouté StreamerPro à la liste des recrues potentielles</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Il y a 1 jour</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-4 border-b border-gray-100 dark:border-gray-800 pb-4">
                      <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full">
                        <Calendar className="h-5 w-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <p className="font-medium">Planning mis à jour</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Vous avez modifié le planning de GamingCreator99</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Il y a 3 jours</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-4">
                      <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-full">
                        <Award className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <p className="font-medium">Commission reçue</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Vous avez reçu une commission de €150 pour le recrutement de TikToker123</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Il y a 1 semaine</p>
                      </div>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="creators" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Mes Créateurs ({filteredCreators.length})</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCreators.length > 0 ? (
                  filteredCreators.map(creator => (
                    <Card key={creator.id} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between">
                          <div className="flex items-center gap-2">
                            <Avatar>
                              <AvatarFallback className="bg-blue-100 text-blue-800">
                                {creator.username.substring(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-semibold">{creator.username}</h3>
                              <p className="text-xs text-gray-500">Créateur</p>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-500 dark:text-gray-400">Planning actuel:</span>
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 text-blue-500 mr-1" />
                              <span>
                                {creator.live_schedules && creator.live_schedules[0] ? (
                                  `${creator.live_schedules[0].hours}h / ${creator.live_schedules[0].days}j`
                                ) : (
                                  'Non défini'
                                )}
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex justify-between gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="flex-1 border-blue-200 text-blue-600 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-900/20"
                              onClick={() => {
                                setSelectedCreator(creator);
                                if (creator.live_schedules && creator.live_schedules[0]) {
                                  setHours(creator.live_schedules[0].hours);
                                  setDays(creator.live_schedules[0].days);
                                } else {
                                  setHours(15);
                                  setDays(7);
                                }
                                setIsScheduleDialogOpen(true);
                              }}
                            >
                              <Pen className="h-4 w-4 mr-1" />
                              Planning
                            </Button>
                            
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="flex-1 border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
                              onClick={() => {
                                setSelectedCreator(creator);
                                setIsRemoveDialogOpen(true);
                              }}
                            >
                              <X className="h-4 w-4 mr-1" />
                              Retirer
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                    <User className="h-12 w-12 text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Aucun créateur trouvé</h3>
                    <p className="text-gray-500 dark:text-gray-400 max-w-md mt-2">
                      Il n'y a pas de créateurs correspondant à votre recherche.
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="recruits" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Recrues Potentielles ({filteredRecruits.length})</h2>
                <Button
                  className={`${animatedBlueClass} text-white`}
                  onClick={() => setIsAddRecruitDialogOpen(true)}
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Ajouter une recrue
                </Button>
              </div>
              
              <div className="space-y-4">
                {filteredRecruits.length > 0 ? (
                  filteredRecruits.map(recruit => (
                    <Card key={recruit.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex items-start gap-3">
                            <Avatar>
                              <AvatarFallback className="bg-purple-100 text-purple-800">
                                {recruit.username.substring(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold">{recruit.username}</h3>
                                <Badge className={`${statusColor(recruit.status)} text-white`}>
                                  {recruit.status.charAt(0).toUpperCase() + recruit.status.slice(1)}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-500">{recruit.email}</p>
                              {recruit.notes && (
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 bg-gray-50 dark:bg-gray-800/50 p-2 rounded">
                                  {recruit.notes}
                                </p>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex gap-2 self-end sm:self-center">
                            <Select defaultValue={recruit.status}>
                              <SelectTrigger className="w-[140px]">
                                <SelectValue placeholder="Statut" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">En attente</SelectItem>
                                <SelectItem value="contacted">Contacté</SelectItem>
                                <SelectItem value="interviewing">Entretien</SelectItem>
                                <SelectItem value="accepted">Accepté</SelectItem>
                                <SelectItem value="rejected">Rejeté</SelectItem>
                              </SelectContent>
                            </Select>
                            
                            <Button variant="outline" size="sm">
                              Détails
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <UserPlus className="h-12 w-12 text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Aucune recrue trouvée</h3>
                    <p className="text-gray-500 dark:text-gray-400 max-w-md mt-2">
                      Il n'y a pas de recrues correspondant à votre recherche.
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <Dialog open={isScheduleDialogOpen} onOpenChange={setIsScheduleDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Modifier le planning de streaming</DialogTitle>
          </DialogHeader>
          
          {selectedCreator && (
            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Heures de live par semaine: {hours}h</h4>
                <Slider
                  value={[hours]}
                  min={1}
                  max={30}
                  step={1}
                  onValueChange={(value) => setHours(value[0])}
                  className="py-2"
                />
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Jours de live par semaine: {days}j</h4>
                <Slider
                  value={[days]}
                  min={1}
                  max={7}
                  step={1}
                  onValueChange={(value) => setDays(value[0])}
                  className="py-2"
                />
              </div>
              
              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-100 dark:border-blue-800/30">
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  Le planning sera mis à jour pour <strong>{selectedCreator.username}</strong>.
                </p>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsScheduleDialogOpen(false)}>
              Annuler
            </Button>
            <Button 
              onClick={handleUpdateSchedule}
              className={`${animatedBlueClass} text-white`}
            >
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isRemoveDialogOpen} onOpenChange={setIsRemoveDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Retirer le créateur de l'agence</DialogTitle>
          </DialogHeader>
          
          {selectedCreator && (
            <div className="py-4">
              <p className="text-gray-700 dark:text-gray-300">
                Êtes-vous sûr de vouloir retirer <strong>{selectedCreator.username}</strong> de l'agence ? Cette action ne peut pas être annulée.
              </p>
              
              <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-100 dark:border-red-800/30 mt-4">
                <p className="text-sm text-red-800 dark:text-red-300">
                  Le créateur perdra l'accès à son compte d'agence et tous ses contrats seront résiliés.
                </p>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRemoveDialogOpen(false)}>
              Annuler
            </Button>
            <Button 
              variant="destructive"
              onClick={handleRemoveCreator}
            >
              Confirmer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isAddRecruitDialogOpen} onOpenChange={setIsAddRecruitDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Ajouter une recrue potentielle</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Identifiant TikTok</label>
              <Input
                placeholder="@username"
                value={newRecruit.username}
                onChange={(e) => setNewRecruit({...newRecruit, username: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input
                placeholder="email@example.com"
                value={newRecruit.email}
                onChange={(e) => setNewRecruit({...newRecruit, email: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Notes</label>
              <Input
                placeholder="Informations supplémentaires..."
                value={newRecruit.notes}
                onChange={(e) => setNewRecruit({...newRecruit, notes: e.target.value})}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddRecruitDialogOpen(false)}>
              Annuler
            </Button>
            <Button 
              onClick={handleAddRecruit}
              disabled={!newRecruit.username || !newRecruit.email}
              className={`${animatedBlueClass} text-white`}
            >
              Ajouter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AmbassadorDashboard;
