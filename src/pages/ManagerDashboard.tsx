
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { UltraDashboard } from "@/components/dashboard/UltraDashboard";
import { useIndexAuth } from "@/hooks/use-index-auth";
import { usePlatformSettings } from "@/hooks/use-platform-settings";
import { useAccountManagement } from "@/hooks/use-account-management";
import { useInactivityTimer } from "@/hooks/use-inactivity-timer";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  Users, 
  Search, 
  UserPlus, 
  ArrowRight, 
  FileText,
  ChevronRight, 
  ArrowUpRight, 
  Star,
  Mail,
  Key,
  Trash2,
  AlertCircle,
  CheckCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SocialCommunityLinks } from "@/components/layout/SocialCommunityLinks";
import { AgentPerformanceChart } from "@/components/manager/AgentPerformanceChart";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/lib/supabase";

// Génération de mot de passe aléatoire
const generateRandomPassword = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
  let password = "";
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

const ManagerDashboard = () => {
  const { toast } = useToast();
  const { isAuthenticated, username, role, userId, handleLogout } = useIndexAuth();
  const { platformSettings, handleUpdateSettings } = usePlatformSettings(role);
  const { handleCreateAccount } = useAccountManagement();
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [messageContent, setMessageContent] = useState("");
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [agentToDelete, setAgentToDelete] = useState(null);
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(false);
  const [agentToResetPassword, setAgentToResetPassword] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [resetPasswordSuccess, setResetPasswordSuccess] = useState(false);
  const navigate = useNavigate();
  
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
      navigate('/');
      return;
    }
    
    // Restrict access to manager role
    if (role !== 'manager' && role !== 'founder') {
      navigate('/');
      return;
    }

    fetchAgents();
  }, [isAuthenticated, role, navigate]);

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

      const enhancedAgents = await Promise.all(data.map(async (agent) => {
        // Récupérer le nombre de créateurs assignés à cet agent
        const { count, error: countError } = await supabase
          .from("user_accounts")
          .select("*", { count: 'exact', head: true })
          .eq("agent_id", agent.id);
        
        if (countError) {
          console.error("Erreur lors du comptage des créateurs:", countError);
          return { ...agent, creatorCount: 0 };
        }

        // Calculer les performances aléatoires pour la démo
        const performance = Math.floor(Math.random() * 60) + 40; // Entre 40 et 100
        const status = performance >= 80 ? "active" : performance >= 60 ? "warning" : "inactive";
        const liveHours = Math.floor(Math.random() * 20) + 5; // Entre 5 et 25 heures
        const targetHours = 15;
        const diamonds = Math.floor(Math.random() * 3000) + 500; // Entre 500 et 3500 diamants
        
        return {
          ...agent,
          creatorCount: count || 0,
          performance,
          status,
          liveHours,
          targetHours,
          diamonds
        };
      }));

      setAgents(enhancedAgents);
      setLoading(false);
    } catch (error) {
      console.error("Erreur lors de la récupération des agents:", error);
      toast({
        variant: "destructive",
        title: "Erreur!",
        description: "Impossible de récupérer la liste des agents.",
      });
      setLoading(false);
    }
  };

  // Filtrer les agents en fonction de la recherche
  const filteredAgents = agents.filter(agent => 
    agent.username?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Supprimer un agent
  const handleDeleteAgent = async () => {
    if (!agentToDelete) return;

    try {
      // Mettre à jour les créateurs assignés à cet agent (les désassigner)
      const { error: updateError } = await supabase
        .from("user_accounts")
        .update({ agent_id: null })
        .eq("agent_id", agentToDelete.id);
      
      if (updateError) {
        throw updateError;
      }
      
      // Supprimer l'agent
      const { error: deleteError } = await supabase
        .from("user_accounts")
        .delete()
        .eq("id", agentToDelete.id);
      
      if (deleteError) {
        throw deleteError;
      }

      toast({
        title: "Succès!",
        description: `L'agent ${agentToDelete.username} a été supprimé avec succès.`,
      });
      
      setIsDeleteModalOpen(false);
      setAgentToDelete(null);
      fetchAgents(); // Rafraîchir la liste des agents
    } catch (error) {
      console.error("Erreur lors de la suppression de l'agent:", error);
      toast({
        variant: "destructive",
        title: "Erreur!",
        description: "Impossible de supprimer l'agent.",
      });
    }
  };

  // Réinitialiser le mot de passe d'un agent
  const handleResetPassword = async () => {
    if (!agentToResetPassword) return;

    try {
      const generatedPassword = generateRandomPassword();
      setNewPassword(generatedPassword);
      
      const { error } = await supabase
        .from("user_accounts")
        .update({ password: generatedPassword })
        .eq("id", agentToResetPassword.id);
      
      if (error) {
        throw error;
      }

      setResetPasswordSuccess(true);
    } catch (error) {
      console.error("Erreur lors de la réinitialisation du mot de passe:", error);
      toast({
        variant: "destructive",
        title: "Erreur!",
        description: "Impossible de réinitialiser le mot de passe.",
      });
    }
  };

  const closeResetPasswordModal = () => {
    setIsResetPasswordModalOpen(false);
    setAgentToResetPassword(null);
    setNewPassword("");
    setResetPasswordSuccess(false);
  };

  // Gérer le contact avec un agent
  const handleContactAgent = (agentId) => {
    toast({
      title: "Contact Agent",
      description: `Contacter l'agent - fonctionnalité en développement`,
    });
  };

  // Voir les créateurs d'un agent
  const handleViewCreators = (agentId) => {
    navigate(`/agent-creators/${agentId}`);
  };
  
  // Envoyer un message
  const handleSendMessage = () => {
    if (!messageContent.trim()) return;
    
    toast({
      title: "Message envoyé",
      description: "Votre message a été envoyé avec succès",
    });
    
    setMessageContent("");
  };

  if (!isAuthenticated || (role !== 'manager' && role !== 'founder')) {
    return null;
  }

  // Données pour le graphique de performance
  const performanceData = filteredAgents.slice(0, 5).map(agent => ({
    name: agent.username.split(' ')[0],
    hours: agent.liveHours,
    diamonds: agent.diamonds / 100, // Échelle pour le graphique
    target: agent.targetHours
  }));

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
              <div className="flex justify-between items-center">
                <CardTitle className="text-3xl font-bold text-white flex items-center gap-2">
                  <Users className="h-8 w-8 text-blue-400" />
                  Espace Manager
                </CardTitle>
              </div>
              
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mt-6">
                <TabsList className="grid grid-cols-3 bg-blue-900/30">
                  <TabsTrigger value="overview" className="data-[state=active]:bg-blue-700 data-[state=active]:text-white">
                    Vue d'ensemble
                  </TabsTrigger>
                  <TabsTrigger value="agents" className="data-[state=active]:bg-blue-700 data-[state=active]:text-white">
                    Mes Agents
                  </TabsTrigger>
                  <TabsTrigger value="communication" className="data-[state=active]:bg-blue-700 data-[state=active]:text-white">
                    Communication
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            
            <CardContent className="p-6">
              <TabsContent value="overview" className="mt-0">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <Card className="bg-gradient-to-br from-blue-900/20 to-blue-800/20 border-blue-800/30">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg text-blue-300">Total Agents</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-white">{agents.length}</div>
                        <p className="text-sm text-blue-400 mt-1">Agents actifs</p>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border-indigo-800/30">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg text-indigo-300">Performances</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-white">
                          {agents.length > 0 
                            ? `${Math.round(agents.reduce((sum, agent) => sum + agent.performance, 0) / agents.length)}%` 
                            : "N/A"}
                        </div>
                        <p className="text-sm text-indigo-400 mt-1">Objectifs atteints</p>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-gradient-to-br from-red-900/20 to-orange-900/20 border-red-800/30">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg text-red-300">Alertes</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-white">
                          {agents.filter(agent => agent.performance < 60).length}
                        </div>
                        <p className="text-sm text-red-400 mt-1">Agents en dessous des objectifs</p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <Card className="mb-6 bg-blue-900/20 border-blue-800/30">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2 text-white">
                        <AlertCircle className="h-5 w-5 text-red-400" />
                        Alertes récentes
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {agents
                          .filter(agent => agent.performance < 60)
                          .slice(0, 2)
                          .map(agent => (
                            <div key={agent.id} className="p-4 border border-red-900/30 rounded-lg bg-red-900/20">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="font-semibold text-red-300">{agent.username}</h4>
                                  <p className="text-sm text-red-400">Moins de 10h de live cette semaine ({agent.liveHours}h/{agent.targetHours}h)</p>
                                </div>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="border-red-800 text-red-400 hover:bg-red-900/20"
                                  onClick={() => handleContactAgent(agent.id)}
                                >
                                  Contacter
                                </Button>
                              </div>
                            </div>
                          ))}
                        
                        {agents.filter(agent => agent.performance < 60).length === 0 && (
                          <div className="p-4 border border-green-900/30 rounded-lg bg-green-900/20">
                            <div className="flex items-center">
                              <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                              <p className="text-green-300">Aucune alerte à signaler</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                  
                  {performanceData.length > 0 && (
                    <Card className="bg-blue-900/20 border-blue-800/30">
                      <CardHeader>
                        <CardTitle className="text-lg text-white">Performance des agents</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <AgentPerformanceChart data={performanceData} />
                      </CardContent>
                    </Card>
                  )}
                  
                  <div className="mt-6">
                    <SocialCommunityLinks compact={true} className="mt-6" />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="agents" className="mt-0">
                <div className="space-y-6">
                  <div className="flex justify-between items-center mb-6">
                    <div className="relative w-full md:w-96">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Rechercher un agent..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 bg-blue-900/20 border-blue-800/30 text-white placeholder:text-blue-400"
                      />
                    </div>
                    
                    <Button className="hidden md:flex items-center bg-blue-700 hover:bg-blue-600">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Ajouter un agent
                    </Button>
                  </div>
                  
                  {loading ? (
                    <div className="flex justify-center py-8">
                      <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
                    </div>
                  ) : filteredAgents.length === 0 ? (
                    <div className="p-8 text-center text-blue-400 bg-blue-900/20 rounded-lg border border-blue-800/30">
                      <Users className="h-10 w-10 mx-auto mb-4 text-blue-500 opacity-50" />
                      <h3 className="text-xl font-semibold mb-2">Aucun agent trouvé</h3>
                      <p>Aucun agent ne correspond à votre recherche ou aucun agent n'est enregistré.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {filteredAgents.map(agent => (
                        <Card key={agent.id} className="bg-blue-900/20 border-blue-800/30 hover:bg-blue-800/20 transition-colors">
                          <CardHeader className="pb-2">
                            <div className="flex justify-between">
                              <CardTitle className="text-xl text-white flex items-center gap-2">
                                {agent.username}
                                {agent.status === "active" && (
                                  <span className="inline-block w-2.5 h-2.5 bg-green-500 rounded-full"></span>
                                )}
                                {agent.status === "warning" && (
                                  <span className="inline-block w-2.5 h-2.5 bg-amber-500 rounded-full"></span>
                                )}
                                {agent.status === "inactive" && (
                                  <span className="inline-block w-2.5 h-2.5 bg-red-500 rounded-full"></span>
                                )}
                              </CardTitle>
                              <div className="text-sm font-medium text-blue-400">
                                {agent.creatorCount} créateurs
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-blue-300">Performance</span>
                              <span className="text-sm font-medium text-white">{agent.performance}%</span>
                            </div>
                            <div className="w-full bg-blue-950/50 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${
                                  agent.performance >= 80 ? 'bg-green-500' : 
                                  agent.performance >= 60 ? 'bg-amber-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${agent.performance}%` }}
                              ></div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4 pt-2">
                              <div className="bg-blue-950/30 p-3 rounded-lg">
                                <div className="text-sm text-blue-400">Heures Live</div>
                                <div className="text-lg font-semibold text-white">{agent.liveHours}/{agent.targetHours}h</div>
                              </div>
                              <div className="bg-blue-950/30 p-3 rounded-lg">
                                <div className="text-sm text-blue-400">Diamants</div>
                                <div className="text-lg font-semibold text-white">{agent.diamonds}</div>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-4 gap-2 pt-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="w-full border-blue-800 text-blue-300 hover:bg-blue-800/30"
                                onClick={() => handleContactAgent(agent.id)}
                                title="Contacter l'agent"
                              >
                                <Mail className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="w-full border-blue-800 text-blue-300 hover:bg-blue-800/30"
                                onClick={() => {
                                  setAgentToResetPassword(agent);
                                  setIsResetPasswordModalOpen(true);
                                }}
                                title="Réinitialiser le mot de passe"
                              >
                                <Key className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="w-full border-blue-800 text-blue-300 hover:bg-blue-800/30"
                                onClick={() => {
                                  setAgentToDelete(agent);
                                  setIsDeleteModalOpen(true);
                                }}
                                title="Supprimer l'agent"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="w-full border-blue-800 text-blue-300 hover:bg-blue-800/30"
                                onClick={() => handleViewCreators(agent.id)}
                                title="Voir les créateurs"
                              >
                                <Users className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="communication" className="mt-0">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1">
                      <Card className="bg-blue-900/20 border-blue-800/30 h-full">
                        <CardHeader>
                          <CardTitle className="text-lg text-white">Conversations</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 max-h-[500px] overflow-auto">
                          {[1, 2, 3, 4].map(item => (
                            <div 
                              key={item} 
                              className={`p-3 rounded-lg cursor-pointer ${
                                item === 1 
                                  ? 'bg-blue-800/40 border-l-4 border-blue-500' 
                                  : 'bg-blue-950/30 hover:bg-blue-900/30'
                              }`}
                            >
                              <div className="flex justify-between">
                                <h4 className="font-medium text-white">Agent {item}</h4>
                                <span className="text-xs text-blue-400">{item === 1 ? "10:30" : item === 2 ? "Hier" : "Il y a 2 jours"}</span>
                              </div>
                              <p className="text-sm text-blue-300 truncate">
                                {item === 1 ? "J'ai besoin d'aide pour mon créateur qui ne respecte pas les heures." : 
                                 item === 2 ? "Nouveaux créateurs disponibles pour assignation" : 
                                 item === 3 ? "Rapport hebdomadaire envoyé" : 
                                 "Demande d'augmentation d'objectif pour créateur XYZ"}
                              </p>
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    </div>
                    
                    <div className="lg:col-span-2">
                      <Card className="bg-blue-900/20 border-blue-800/30 h-full flex flex-col">
                        <CardHeader>
                          <CardTitle className="text-lg text-white">Messages</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-grow space-y-4">
                          <div className="bg-blue-950/30 p-4 rounded-lg max-h-[400px] overflow-auto">
                            <div className="space-y-4">
                              <div className="flex justify-end">
                                <div className="bg-blue-700 text-white p-3 rounded-lg rounded-tr-none max-w-[80%]">
                                  <p className="text-sm">Bonjour, avez-vous reçu mon rapport sur les performances des créateurs?</p>
                                  <span className="text-xs text-blue-300 block text-right mt-1">10:15</span>
                                </div>
                              </div>
                              
                              <div className="flex">
                                <div className="bg-blue-950/50 text-white p-3 rounded-lg rounded-tl-none max-w-[80%]">
                                  <p className="text-sm">Oui, je l'ai bien reçu. J'ai besoin d'aide pour mon créateur qui ne respecte pas les heures.</p>
                                  <span className="text-xs text-blue-400 block mt-1">10:30</span>
                                </div>
                              </div>
                              
                              <div className="flex justify-end">
                                <div className="bg-blue-700 text-white p-3 rounded-lg rounded-tr-none max-w-[80%]">
                                  <p className="text-sm">Je comprends. Pouvez-vous me donner plus de détails sur ce créateur? Combien d'heures manque-t-il?</p>
                                  <span className="text-xs text-blue-300 block text-right mt-1">10:32</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex gap-2">
                            <Input
                              placeholder="Écrivez votre message..."
                              value={messageContent}
                              onChange={(e) => setMessageContent(e.target.value)}
                              className="bg-blue-950/30 border-blue-800/30 text-white placeholder:text-blue-400"
                            />
                            <Button 
                              className="bg-blue-700 hover:bg-blue-600"
                              onClick={handleSendMessage}
                            >
                              Envoyer
                              <ArrowRight className="h-4 w-4 ml-2" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                  
                  <Card className="bg-blue-900/20 border-blue-800/30">
                    <CardHeader>
                      <CardTitle className="text-lg text-white">Documents partagés</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[1, 2, 3].map(item => (
                          <div key={item} className="bg-blue-950/30 p-4 rounded-lg border border-blue-800/30">
                            <div className="flex items-start">
                              <FileText className="h-8 w-8 text-blue-400 mr-3" />
                              <div>
                                <h4 className="font-medium text-white">Rapport performances_{item}.pdf</h4>
                                <p className="text-xs text-blue-400 mt-1">Partagé il y a {item} jour{item > 1 ? 's' : ''}</p>
                              </div>
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="w-full mt-3 border-blue-800 text-blue-300 hover:bg-blue-800/30"
                            >
                              Télécharger
                              <ArrowUpRight className="h-4 w-4 ml-2" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </CardContent>
          </Card>
        </div>

        {/* Modal de confirmation de suppression */}
        <Dialog
          open={isDeleteModalOpen}
          onOpenChange={setIsDeleteModalOpen}
        >
          <DialogContent className="bg-slate-900 border border-slate-800">
            <DialogHeader>
              <DialogTitle className="text-xl text-white">Confirmer la suppression</DialogTitle>
              <DialogDescription className="text-slate-400">
                Êtes-vous sûr de vouloir supprimer l'agent <span className="font-semibold text-white">{agentToDelete?.username}</span> ?
                Cette action est irréversible.
              </DialogDescription>
            </DialogHeader>
            <Alert className="bg-red-900/20 border border-red-800/30 text-red-300">
              <AlertCircle className="h-4 w-4 mr-2" />
              <AlertDescription>
                Les créateurs assignés à cet agent seront désassignés.
              </AlertDescription>
            </Alert>
            <DialogFooter className="flex gap-2 sm:justify-end">
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setAgentToDelete(null);
                }}
                className="border-slate-700 hover:bg-slate-800 text-slate-300"
              >
                Annuler
              </Button>
              <Button 
                variant="destructive"
                onClick={handleDeleteAgent}
                className="bg-red-700 hover:bg-red-800 text-white"
              >
                Supprimer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Modal de réinitialisation de mot de passe */}
        <Dialog
          open={isResetPasswordModalOpen}
          onOpenChange={(open) => {
            if (!open) closeResetPasswordModal();
            else setIsResetPasswordModalOpen(open);
          }}
        >
          <DialogContent className="bg-slate-900 border border-slate-800 max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl text-white">
                {resetPasswordSuccess 
                  ? "Mot de passe réinitialisé" 
                  : `Réinitialiser le mot de passe de ${agentToResetPassword?.username}`}
              </DialogTitle>
              <DialogDescription className="text-slate-400">
                {resetPasswordSuccess 
                  ? "Le mot de passe a été réinitialisé avec succès. Veuillez noter le nouveau mot de passe."
                  : "Cette action générera un nouveau mot de passe aléatoire pour cet utilisateur."}
              </DialogDescription>
            </DialogHeader>
            
            {resetPasswordSuccess ? (
              <div className="space-y-4">
                <div className="p-3 bg-blue-900/20 border border-blue-800/30 rounded-md">
                  <p className="text-sm text-blue-400 mb-1">Nouveau mot de passe:</p>
                  <p className="font-mono text-white break-all">{newPassword}</p>
                </div>
                <Button 
                  className="w-full bg-green-700 hover:bg-green-800"
                  onClick={closeResetPasswordModal}
                >
                  Fermer
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <Alert className="bg-yellow-900/20 border border-yellow-800/30 text-yellow-300">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  <AlertDescription>
                    Assurez-vous de communiquer le nouveau mot de passe à l'utilisateur.
                  </AlertDescription>
                </Alert>
                <div className="flex gap-2 justify-end">
                  <Button 
                    variant="outline" 
                    onClick={closeResetPasswordModal}
                    className="border-slate-700 hover:bg-slate-800 text-slate-300"
                  >
                    Annuler
                  </Button>
                  <Button 
                    variant="default"
                    onClick={handleResetPassword}
                    className="bg-blue-700 hover:bg-blue-800 text-white"
                  >
                    Réinitialiser
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </UltraDashboard>
    </SidebarProvider>
  );
};

export default ManagerDashboard;
