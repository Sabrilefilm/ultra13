
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UpcomingMatches } from '@/components/dashboard/UpcomingMatches';
import { Loading } from '@/components/ui/loading';
import { ArrowLeft, User, Calendar, Trophy, Award, Diamond, BookOpen } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { MobileMenu } from '@/components/mobile/MobileMenu';
import { toast } from 'sonner';

interface Creator {
  id: string;
  username: string;
  role: string;
  diamonds_count: number;
  agent_id: string | null;
  last_active: string | null;
  weekly_hours: number;
  matches_won: number;
  matches_lost: number;
}

const CreatorDetails = () => {
  const { creatorId } = useParams<{ creatorId: string }>();
  const navigate = useNavigate();
  const [creator, setCreator] = useState<Creator | null>(null);
  const [agentName, setAgentName] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const isMobile = useIsMobile();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  
  useEffect(() => {
    const storedRole = localStorage.getItem('userRole');
    const storedUsername = localStorage.getItem('userId');
    setUserRole(storedRole);
    setUsername(storedUsername);
    
    fetchCreatorDetails();
  }, [creatorId]);
  
  const fetchCreatorDetails = async () => {
    try {
      setLoading(true);
      
      // Fetch creator details
      const { data: creatorData, error: creatorError } = await supabase
        .from('users')
        .select('*')
        .eq('id', creatorId)
        .single();
      
      if (creatorError) throw creatorError;
      
      if (creatorData) {
        setCreator(creatorData as Creator);
        
        // Fetch agent name if there's an agent_id
        if (creatorData.agent_id) {
          const { data: agentData, error: agentError } = await supabase
            .from('users')
            .select('username')
            .eq('id', creatorData.agent_id)
            .single();
          
          if (!agentError && agentData) {
            setAgentName(agentData.username);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching creator details:', error);
      toast.error('Erreur lors du chargement des informations');
    } finally {
      setLoading(false);
    }
  };
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole');
    navigate('/');
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <Loading size="large" text="Chargement des informations du créateur..." />
      </div>
    );
  }
  
  if (!creator) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
        <div className="text-red-400 text-6xl mb-4">😕</div>
        <h1 className="text-2xl font-bold text-white mb-4">Créateur non trouvé</h1>
        <p className="text-gray-400 mb-6">Le créateur que vous recherchez n'existe pas ou a été supprimé.</p>
        <Button onClick={() => navigate(-1)} variant="outline" className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" /> Retour
        </Button>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-[#111827] text-white">
      {isMobile && username && userRole && (
        <MobileMenu 
          username={username} 
          role={userRole} 
          currentPage="/creator-details" 
          onLogout={handleLogout} 
        />
      )}
      
      <Header role={userRole || ''} username={username || ''} />
      
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            className="mr-4 text-white/80 hover:text-white hover:bg-white/10"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Button>
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
            Détails du Créateur
          </h1>
        </div>
        
        <Card className="bg-slate-800/90 backdrop-blur-sm border border-purple-800/30 rounded-xl overflow-hidden shadow-md mb-6">
          <CardHeader className="bg-gradient-to-r from-purple-900/20 to-indigo-900/20 pb-2">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center text-white text-2xl font-bold">
                  {creator.username.charAt(0).toUpperCase()}
                </div>
                <div>
                  <CardTitle className="text-xl md:text-2xl text-white">
                    {creator.username}
                  </CardTitle>
                  <p className="text-purple-400 text-sm">@{creator.id}</p>
                </div>
              </div>
              <div className="mt-4 md:mt-0 flex flex-wrap gap-3">
                <div className="px-3 py-1 rounded-full bg-purple-900/40 border border-purple-700/30 text-purple-300 text-xs">
                  {creator.role === 'creator' ? 'Créateur' : creator.role}
                </div>
                {agentName && (
                  <div className="px-3 py-1 rounded-full bg-blue-900/40 border border-blue-700/30 text-blue-300 text-xs">
                    Agent: {agentName}
                  </div>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="w-full grid grid-cols-2 md:grid-cols-3 mb-6 bg-gray-100 dark:bg-slate-800 p-1 rounded-lg">
                <TabsTrigger 
                  value="overview" 
                  className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:text-purple-700 dark:data-[state=active]:text-purple-300 data-[state=active]:shadow-sm rounded-md text-gray-600 dark:text-gray-300"
                >
                  Aperçu
                </TabsTrigger>
                <TabsTrigger 
                  value="stats" 
                  className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:text-purple-700 dark:data-[state=active]:text-purple-300 data-[state=active]:shadow-sm rounded-md text-gray-600 dark:text-gray-300"
                >
                  Statistiques
                </TabsTrigger>
                <TabsTrigger 
                  value="matches" 
                  className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:text-purple-700 dark:data-[state=active]:text-purple-300 data-[state=active]:shadow-sm rounded-md text-gray-600 dark:text-gray-300"
                >
                  Matchs
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="bg-slate-700/50 border-slate-600/30">
                    <CardContent className="p-4 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-purple-900/60 flex items-center justify-center">
                        <User className="h-5 w-5 text-purple-300" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Identifiant</p>
                        <p className="text-white font-medium">{creator.id}</p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-slate-700/50 border-slate-600/30">
                    <CardContent className="p-4 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-green-900/60 flex items-center justify-center">
                        <Diamond className="h-5 w-5 text-green-300" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Diamants</p>
                        <p className="text-white font-medium">{creator.diamonds_count || 0}</p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-slate-700/50 border-slate-600/30">
                    <CardContent className="p-4 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-900/60 flex items-center justify-center">
                        <Calendar className="h-5 w-5 text-blue-300" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Heures Hebdo</p>
                        <p className="text-white font-medium">{creator.weekly_hours || 0}h</p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-slate-700/50 border-slate-600/30">
                    <CardContent className="p-4 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-yellow-900/60 flex items-center justify-center">
                        <Trophy className="h-5 w-5 text-yellow-300" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Matchs Gagnés</p>
                        <p className="text-white font-medium">{creator.matches_won || 0}</p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-slate-700/50 border-slate-600/30">
                    <CardContent className="p-4 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-red-900/60 flex items-center justify-center">
                        <Trophy className="h-5 w-5 text-red-300" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Matchs Perdus</p>
                        <p className="text-white font-medium">{creator.matches_lost || 0}</p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-slate-700/50 border-slate-600/30">
                    <CardContent className="p-4 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-900/60 flex items-center justify-center">
                        <Award className="h-5 w-5 text-indigo-300" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Récompenses</p>
                        <p className="text-white font-medium">0</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <Card className="bg-slate-700/50 border-slate-600/30">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Informations Agent</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    {agentName ? (
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-900/60 flex items-center justify-center">
                          <User className="h-5 w-5 text-blue-300" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Agent assigné</p>
                          <p className="text-white font-medium">{agentName}</p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-yellow-400">Aucun agent assigné à ce créateur</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="stats" className="space-y-4">
                <Card className="bg-slate-700/50 border-slate-600/30">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Statistiques Détaillées</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Performance de Lives</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="p-4 bg-slate-800/80 rounded-lg">
                            <p className="text-gray-400 text-sm">Heures Hebdo</p>
                            <p className="text-xl font-bold">{creator.weekly_hours || 0}h</p>
                            <div className="mt-2 h-2 bg-slate-700 rounded-full">
                              <div 
                                className="h-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full" 
                                style={{ width: `${Math.min(100, (creator.weekly_hours || 0) / 15 * 100)}%` }}
                              ></div>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Objectif: 15h</p>
                          </div>
                          
                          <div className="p-4 bg-slate-800/80 rounded-lg">
                            <p className="text-gray-400 text-sm">Dernière Activité</p>
                            <p className="text-xl font-bold">
                              {creator.last_active ? new Date(creator.last_active).toLocaleDateString() : 'Inconnue'}
                            </p>
                          </div>
                          
                          <div className="p-4 bg-slate-800/80 rounded-lg">
                            <p className="text-gray-400 text-sm">Total Diamants</p>
                            <p className="text-xl font-bold">{creator.diamonds_count || 0}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Performance de Matchs</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-4 bg-slate-800/80 rounded-lg">
                            <p className="text-gray-400 text-sm">Ratio de Victoires</p>
                            <p className="text-xl font-bold">
                              {creator.matches_won + creator.matches_lost > 0 
                                ? Math.round((creator.matches_won / (creator.matches_won + creator.matches_lost)) * 100) 
                                : 0}%
                            </p>
                            <div className="mt-2 h-2 bg-slate-700 rounded-full">
                              <div 
                                className="h-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full" 
                                style={{ 
                                  width: `${creator.matches_won + creator.matches_lost > 0 
                                    ? Math.round((creator.matches_won / (creator.matches_won + creator.matches_lost)) * 100) 
                                    : 0}%` 
                                }}
                              ></div>
                            </div>
                          </div>
                          
                          <div className="p-4 bg-slate-800/80 rounded-lg flex items-center justify-between">
                            <div>
                              <p className="text-gray-400 text-sm">Matchs Gagnés</p>
                              <p className="text-xl font-bold text-green-400">{creator.matches_won || 0}</p>
                            </div>
                            <div>
                              <p className="text-gray-400 text-sm">Matchs Perdus</p>
                              <p className="text-xl font-bold text-red-400">{creator.matches_lost || 0}</p>
                            </div>
                            <div>
                              <p className="text-gray-400 text-sm">Total</p>
                              <p className="text-xl font-bold">{(creator.matches_won || 0) + (creator.matches_lost || 0)}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="matches" className="space-y-4">
                <UpcomingMatches role={userRole || ''} creatorId={creator.id} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
      
      <Footer role={userRole || ''} />
    </div>
  );
};

export default CreatorDetails;
