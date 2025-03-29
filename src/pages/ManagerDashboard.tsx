
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SidebarProvider } from "@/components/ui/sidebar";
import { UltraDashboard } from "@/components/dashboard/UltraDashboard";
import { useIndexAuth } from "@/hooks/use-index-auth";
import { usePlatformSettings } from "@/hooks/use-platform-settings";
import { useAccountManagement } from "@/hooks/use-account-management";
import { useInactivityTimer } from "@/hooks/use-inactivity-timer";
import { Button } from "@/components/ui/button";
import { BarChart3, Calendar, MessageSquare, Star, Users, ClipboardCheck, UserCheck, PieChart, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";

const ManagerDashboard = () => {
  const { isAuthenticated, username, role, userId, handleLogout } = useIndexAuth();
  const { platformSettings, handleUpdateSettings } = usePlatformSettings(role);
  const { handleCreateAccount } = useAccountManagement();
  const { toast } = useToast();
  const [agents, setAgents] = useState([]);
  const [selectedTab, setSelectedTab] = useState("performance");
  const [loading, setLoading] = useState(true);
  
  // Inactivity timer for automatic logout
  const { showWarning, dismissWarning, formattedTime } = useInactivityTimer({
    timeout: 120000, // 2 minutes
    onTimeout: () => {
      handleLogout();
      toast({
        title: "Déconnexion automatique",
        description: "Vous avez été déconnecté en raison d'inactivité.",
      });
    },
    warningTime: 30000,
    onWarning: () => {}
  });

  useEffect(() => {
    if (!isAuthenticated) {
      window.location.href = '/';
      return;
    }
    
    // Restrict access to manager and founder roles
    if (role !== 'manager' && role !== 'founder') {
      window.location.href = '/';
      return;
    }
    
    fetchAgents();
  }, [isAuthenticated, role]);

  const fetchAgents = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from("user_accounts")
        .select("*")
        .eq("role", "agent");
      
      if (error) {
        throw error;
      }
      
      // Add random performance data for demo
      const enhancedAgents = data.map(agent => {
        const creatorsCount = Math.floor(Math.random() * 10) + 1;
        const activeCreators = Math.floor(Math.random() * creatorsCount);
        const performanceScore = Math.floor(Math.random() * 100);
        const hoursLogged = Math.floor(Math.random() * 40) + 10;
        const status = performanceScore >= 70 ? "active" : performanceScore >= 40 ? "moderate" : "inactive";
        
        return {
          ...agent,
          creatorsCount,
          activeCreators,
          performanceScore,
          hoursLogged,
          status
        };
      });
      
      setAgents(enhancedAgents);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching agents:", error);
      toast({
        variant: "destructive",
        title: "Erreur!",
        description: "Impossible de récupérer la liste des agents.",
      });
      setLoading(false);
    }
  };

  if (!isAuthenticated || (role !== 'manager' && role !== 'founder')) {
    return null;
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <UltraDashboard
        username={username || ''}
        role={role || ''}
        userId={userId || ''}
        onLogout={handleLogout}
        platformSettings={platformSettings}
        handleCreateAccount={handleCreateAccount}
        handleUpdateSettings={handleUpdateSettings}
        showWarning={showWarning}
        dismissWarning={dismissWarning}
        formattedTime={formattedTime}
        currentPage="manager-dashboard"
      >
        <div className="max-w-7xl mx-auto p-6 space-y-6">
          <Card className="bg-gradient-to-br from-blue-950 to-indigo-950 shadow-lg border-blue-900/30 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-900/30 to-indigo-900/30 border-b border-blue-800/30">
              <CardTitle className="text-3xl font-bold text-white flex items-center gap-2">
                <BarChart3 className="h-8 w-8 text-blue-400" />
                Espace Manager
              </CardTitle>
              <p className="text-blue-300">Gestion des agents et des performances</p>
              
              <Tabs value={selectedTab} onValueChange={setSelectedTab} className="mt-6">
                <TabsList className="bg-blue-900/30">
                  <TabsTrigger value="performance" className="data-[state=active]:bg-blue-700 data-[state=active]:text-white">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Performance
                  </TabsTrigger>
                  <TabsTrigger value="communication" className="data-[state=active]:bg-blue-700 data-[state=active]:text-white">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Communication
                  </TabsTrigger>
                  <TabsTrigger value="agents" className="data-[state=active]:bg-blue-700 data-[state=active]:text-white">
                    <Users className="h-4 w-4 mr-2" />
                    Mes Agents
                  </TabsTrigger>
                </TabsList>
              
                <CardContent className="p-0">
                  <TabsContent value="performance" className="m-0">
                    <div className="p-6 bg-blue-900/10">
                      <h2 className="text-xl font-bold text-white mb-4">Vue d'ensemble des performances</h2>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card className="bg-blue-900/20 border-blue-800/30">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-lg text-blue-100 flex items-center">
                              <UserCheck className="h-5 w-5 mr-2 text-green-400" />
                              Agents Actifs
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-3xl font-bold text-white">{agents.filter(a => a.status === "active").length} / {agents.length}</div>
                            <p className="text-blue-300 mt-1">Agents avec performance &gt; 70%</p>
                          </CardContent>
                        </Card>
                        <Card className="bg-blue-900/20 border-blue-800/30">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-lg text-blue-100 flex items-center">
                              <Star className="h-5 w-5 mr-2 text-yellow-400" />
                              Performance Moyenne
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-3xl font-bold text-white">
                              {agents.length > 0 
                                ? Math.round(agents.reduce((acc, agent) => acc + agent.performanceScore, 0) / agents.length) 
                                : 0}%
                            </div>
                            <p className="text-blue-300 mt-1">Sur l'ensemble des agents</p>
                          </CardContent>
                        </Card>
                        <Card className="bg-blue-900/20 border-blue-800/30">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-lg text-blue-100 flex items-center">
                              <ClipboardCheck className="h-5 w-5 mr-2 text-purple-400" />
                              Heures Totales
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-3xl font-bold text-white">
                              {agents.reduce((acc, agent) => acc + agent.hoursLogged, 0)}h
                            </div>
                            <p className="text-blue-300 mt-1">Heures de travail enregistrées</p>
                          </CardContent>
                        </Card>
                      </div>
                      
                      <h3 className="text-xl font-bold text-white mt-8 mb-4">Analyse détaillée</h3>
                      <div className="bg-blue-900/20 rounded-lg border border-blue-800/30 overflow-hidden">
                        <div className="grid grid-cols-12 gap-2 p-4 border-b border-blue-800/30 bg-blue-900/40 text-blue-300 font-medium">
                          <div className="col-span-3">Agent</div>
                          <div className="col-span-2">Performance</div>
                          <div className="col-span-2">Créateurs</div>
                          <div className="col-span-2">Actifs</div>
                          <div className="col-span-2">Heures</div>
                          <div className="col-span-1 text-right">Action</div>
                        </div>
                        
                        {loading ? (
                          <div className="p-8 text-center text-blue-400">
                            <div className="animate-spin h-8 w-8 border-4 border-current border-t-transparent rounded-full mx-auto mb-2"></div>
                            Chargement des données...
                          </div>
                        ) : agents.length === 0 ? (
                          <div className="p-8 text-center text-blue-400">
                            <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
                            Aucun agent trouvé
                          </div>
                        ) : (
                          agents.map(agent => (
                            <div 
                              key={agent.id} 
                              className="grid grid-cols-12 gap-2 p-4 border-b border-blue-800/10 text-white items-center hover:bg-blue-800/20 transition-colors"
                            >
                              <div className="col-span-3 font-medium">{agent.username}</div>
                              <div className="col-span-2">
                                <div className="flex items-center">
                                  <div className="w-full bg-blue-950/50 rounded-full h-2 mr-2">
                                    <div 
                                      className={`h-2 rounded-full ${
                                        agent.performanceScore >= 70 ? 'bg-green-500' : 
                                        agent.performanceScore >= 40 ? 'bg-amber-500' : 'bg-red-500'
                                      }`}
                                      style={{ width: `${agent.performanceScore}%` }}
                                    ></div>
                                  </div>
                                  <span className="text-sm">{agent.performanceScore}%</span>
                                </div>
                              </div>
                              <div className="col-span-2">{agent.creatorsCount}</div>
                              <div className="col-span-2">
                                <span className={`px-2 py-1 rounded-full text-xs ${
                                  agent.status === 'active' ? 'bg-green-900/40 text-green-300' :
                                  agent.status === 'moderate' ? 'bg-amber-900/40 text-amber-300' :
                                  'bg-red-900/40 text-red-300'
                                }`}>
                                  {agent.activeCreators} / {agent.creatorsCount}
                                </span>
                              </div>
                              <div className="col-span-2">{agent.hoursLogged}h</div>
                              <div className="col-span-1 text-right">
                                <Link to={`/agent-creators/${agent.id}`}>
                                  <Button size="sm" className="h-7 bg-blue-700 hover:bg-blue-600">
                                    <ArrowRight className="h-3.5 w-3.5" />
                                  </Button>
                                </Link>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="communication" className="m-0">
                    <div className="p-6 bg-blue-900/10">
                      <h2 className="text-xl font-bold text-white mb-4">Centre de communication</h2>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card className="bg-blue-900/20 border-blue-800/30 h-[400px] flex flex-col">
                          <CardHeader>
                            <CardTitle className="text-lg text-blue-100">Annonces</CardTitle>
                          </CardHeader>
                          <CardContent className="flex-grow overflow-auto">
                            <div className="space-y-4">
                              <div className="bg-blue-950/40 p-4 rounded-lg border border-blue-800/30">
                                <div className="flex justify-between items-center mb-2">
                                  <h4 className="font-medium text-white">Mise à jour du système</h4>
                                  <span className="text-xs text-blue-400">Il y a 2 jours</span>
                                </div>
                                <p className="text-blue-200 text-sm">Nous avons déployé une mise à jour majeure du tableau de bord. Découvrez les nouvelles fonctionnalités de suivi des performances!</p>
                              </div>
                              
                              <div className="bg-blue-950/40 p-4 rounded-lg border border-blue-800/30">
                                <div className="flex justify-between items-center mb-2">
                                  <h4 className="font-medium text-white">Rappel: Réunion mensuelle</h4>
                                  <span className="text-xs text-blue-400">Il y a 5 jours</span>
                                </div>
                                <p className="text-blue-200 text-sm">La réunion mensuelle des managers aura lieu ce vendredi à 14h. Préparez vos rapports d'activité.</p>
                              </div>
                              
                              <div className="bg-blue-950/40 p-4 rounded-lg border border-blue-800/30">
                                <div className="flex justify-between items-center mb-2">
                                  <h4 className="font-medium text-white">Nouveaux objectifs trimestriels</h4>
                                  <span className="text-xs text-blue-400">Il y a 1 semaine</span>
                                </div>
                                <p className="text-blue-200 text-sm">Les nouveaux objectifs pour le trimestre ont été définis. Consultez-les dans la section Performance de votre tableau de bord.</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card className="bg-blue-900/20 border-blue-800/30 h-[400px] flex flex-col">
                          <CardHeader>
                            <CardTitle className="text-lg text-blue-100">Messages récents</CardTitle>
                          </CardHeader>
                          <CardContent className="flex-grow overflow-auto">
                            <div className="space-y-4">
                              <div className="bg-blue-950/40 p-4 rounded-lg border border-blue-800/30">
                                <div className="flex items-start gap-3">
                                  <div className="w-8 h-8 rounded-full bg-purple-700 flex items-center justify-center text-white font-medium">
                                    S
                                  </div>
                                  <div className="flex-grow">
                                    <div className="flex justify-between items-center mb-1">
                                      <h4 className="font-medium text-white">Sophie Martin</h4>
                                      <span className="text-xs text-blue-400">10:25</span>
                                    </div>
                                    <p className="text-blue-200 text-sm">Bonjour, pourriez-vous valider les nouveaux créateurs que j'ai ajoutés hier?</p>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="bg-blue-950/40 p-4 rounded-lg border border-blue-800/30">
                                <div className="flex items-start gap-3">
                                  <div className="w-8 h-8 rounded-full bg-green-700 flex items-center justify-center text-white font-medium">
                                    T
                                  </div>
                                  <div className="flex-grow">
                                    <div className="flex justify-between items-center mb-1">
                                      <h4 className="font-medium text-white">Thomas Dubois</h4>
                                      <span className="text-xs text-blue-400">Hier</span>
                                    </div>
                                    <p className="text-blue-200 text-sm">J'ai besoin d'aide pour résoudre un conflit entre deux créateurs. Pouvons-nous en discuter?</p>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="bg-blue-950/40 p-4 rounded-lg border border-blue-800/30">
                                <div className="flex items-start gap-3">
                                  <div className="w-8 h-8 rounded-full bg-amber-700 flex items-center justify-center text-white font-medium">
                                    L
                                  </div>
                                  <div className="flex-grow">
                                    <div className="flex justify-between items-center mb-1">
                                      <h4 className="font-medium text-white">Lucie Bernard</h4>
                                      <span className="text-xs text-blue-400">2 jours</span>
                                    </div>
                                    <p className="text-blue-200 text-sm">Le rapport mensuel est prêt. Vous pouvez le consulter dans le dossier partagé.</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="agents" className="m-0">
                    <div className="p-6 bg-blue-900/10">
                      <h2 className="text-xl font-bold text-white mb-4">Liste de mes agents</h2>
                      
                      {loading ? (
                        <div className="p-8 text-center text-blue-400">
                          <div className="animate-spin h-8 w-8 border-4 border-current border-t-transparent rounded-full mx-auto mb-2"></div>
                          Chargement des agents...
                        </div>
                      ) : agents.length === 0 ? (
                        <div className="p-8 text-center text-blue-400 bg-blue-900/20 rounded-lg border border-blue-800/30">
                          <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
                          <h3 className="text-xl font-semibold mb-2">Aucun agent trouvé</h3>
                          <p>Vous n'avez pas encore d'agents sous votre supervision.</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {agents.map(agent => (
                            <Card key={agent.id} className="bg-blue-900/20 border-blue-800/30 hover:bg-blue-800/20 transition-colors overflow-hidden">
                              <CardHeader className="pb-2">
                                <CardTitle className="text-xl text-white">{agent.username}</CardTitle>
                                <p className="text-blue-300">Agent</p>
                              </CardHeader>
                              <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-3">
                                  <div className="bg-blue-950/40 p-3 rounded-lg">
                                    <div className="text-sm text-blue-400">Créateurs</div>
                                    <div className="text-2xl font-semibold text-white">{agent.creatorsCount}</div>
                                  </div>
                                  <div className="bg-blue-950/40 p-3 rounded-lg">
                                    <div className="text-sm text-blue-400">Actifs</div>
                                    <div className="text-2xl font-semibold text-white">{agent.activeCreators}</div>
                                  </div>
                                </div>
                                
                                <div>
                                  <div className="flex justify-between items-center mb-1">
                                    <span className="text-sm text-blue-300">Performance</span>
                                    <span className="text-sm font-medium text-white">{agent.performanceScore}%</span>
                                  </div>
                                  <div className="w-full bg-blue-950/50 rounded-full h-2">
                                    <div 
                                      className={`h-2 rounded-full ${
                                        agent.performanceScore >= 70 ? 'bg-green-500' : 
                                        agent.performanceScore >= 40 ? 'bg-amber-500' : 'bg-red-500'
                                      }`}
                                      style={{ width: `${agent.performanceScore}%` }}
                                    ></div>
                                  </div>
                                </div>
                                
                                <div className="pt-2">
                                  <Link to={`/agent-creators/${agent.id}`} className="w-full">
                                    <Button className="w-full bg-blue-700 hover:bg-blue-600">
                                      Voir les créateurs
                                      <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                  </Link>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </CardContent>
              </Tabs>
            </CardHeader>
          </Card>
        </div>
      </UltraDashboard>
    </SidebarProvider>
  );
};

export default ManagerDashboard;
