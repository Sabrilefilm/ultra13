
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { UltraDashboard } from "@/components/dashboard/UltraDashboard";
import { useIndexAuth } from "@/hooks/use-index-auth";
import { usePlatformSettings } from "@/hooks/use-platform-settings";
import { useAccountManagement } from "@/hooks/use-account-management";
import { useInactivityTimer } from "@/hooks/use-inactivity-timer";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, ArrowLeft, Diamond, Clock, Star, Calendar, Search, Pencil, Trash2, Key, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { supabase } from "@/lib/supabase";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Génération de mot de passe aléatoire
const generateRandomPassword = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
  let password = "";
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

const AgentCreators = () => {
  const { agentId } = useParams<{ agentId: string }>();
  const { toast } = useToast();
  const { isAuthenticated, username, role, userId, handleLogout } = useIndexAuth();
  const { platformSettings, handleUpdateSettings } = usePlatformSettings(role);
  const { handleCreateAccount } = useAccountManagement();
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const [agent, setAgent] = useState(null);
  const [creators, setCreators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(false);
  const [creatorToResetPassword, setCreatorToResetPassword] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [resetPasswordSuccess, setResetPasswordSuccess] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [creatorToDelete, setCreatorToDelete] = useState(null);
  const [isAssignCreatorModalOpen, setIsAssignCreatorModalOpen] = useState(false);
  const [availableCreators, setAvailableCreators] = useState([]);
  const [selectedCreator, setSelectedCreator] = useState("");
  
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
    
    // Restrict access to manager and founder roles
    if (role !== 'manager' && role !== 'founder') {
      navigate('/');
      return;
    }
    
    fetchAgentData();
    fetchCreators();
  }, [isAuthenticated, role, navigate, agentId]);

  const fetchAgentData = async () => {
    try {
      if (!agentId) return;
      
      const { data, error } = await supabase
        .from("user_accounts")
        .select("*")
        .eq("id", agentId)
        .single();
      
      if (error) {
        console.error("Error fetching agent:", error);
        toast({
          variant: "destructive",
          title: "Erreur!",
          description: "Impossible de récupérer les informations de l'agent.",
        });
        return;
      }
      
      setAgent(data);
    } catch (error) {
      console.error("Error:", error);
      toast({
        variant: "destructive",
        title: "Erreur!",
        description: "Une erreur s'est produite lors de la récupération des données.",
      });
    }
  };

  const fetchCreators = async () => {
    try {
      setLoading(true);
      
      if (!agentId) return;
      
      const { data, error } = await supabase
        .from("user_accounts")
        .select("*")
        .eq("agent_id", agentId)
        .eq("role", "creator");
      
      if (error) {
        console.error("Error fetching creators:", error);
        toast({
          variant: "destructive",
          title: "Erreur!",
          description: "Impossible de récupérer la liste des créateurs.",
        });
        setLoading(false);
        return;
      }
      
      // Ajouter des données aléatoires de performance pour la démo
      const enhancedCreators = data.map(creator => {
        const followers = Math.floor(Math.random() * 300000) + 50000;
        const diamonds = Math.floor(Math.random() * 4000) + 1000;
        const likes = Math.floor(Math.random() * 25000) + 5000;
        const hours = Math.floor(Math.random() * 20) + 5;
        const target = 15;
        const performance = Math.round((hours / target) * 100);
        const status = performance >= 80 ? "active" : performance >= 60 ? "warning" : "inactive";
        
        return {
          ...creator,
          followers,
          diamonds,
          likes,
          status,
          hours,
          target,
          performance
        };
      });
      
      setCreators(enhancedCreators);
      setLoading(false);
    } catch (error) {
      console.error("Error:", error);
      toast({
        variant: "destructive",
        title: "Erreur!",
        description: "Une erreur s'est produite lors de la récupération des créateurs.",
      });
      setLoading(false);
    }
  };

  const fetchAvailableCreators = async () => {
    try {
      const { data, error } = await supabase
        .from("user_accounts")
        .select("*")
        .eq("role", "creator")
        .is("agent_id", null);
      
      if (error) {
        throw error;
      }
      
      setAvailableCreators(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des créateurs disponibles:", error);
      toast({
        variant: "destructive",
        title: "Erreur!",
        description: "Impossible de récupérer la liste des créateurs disponibles.",
      });
    }
  };

  const handleAssignCreator = async () => {
    if (!selectedCreator) {
      toast({
        variant: "destructive",
        title: "Erreur!",
        description: "Veuillez sélectionner un créateur à assigner.",
      });
      return;
    }
    
    try {
      const { error } = await supabase
        .from("user_accounts")
        .update({ agent_id: agentId })
        .eq("id", selectedCreator);
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Succès!",
        description: "Créateur assigné avec succès.",
      });
      
      setIsAssignCreatorModalOpen(false);
      setSelectedCreator("");
      fetchCreators();
    } catch (error) {
      console.error("Erreur lors de l'assignation du créateur:", error);
      toast({
        variant: "destructive",
        title: "Erreur!",
        description: "Impossible d'assigner le créateur.",
      });
    }
  };

  const handleDeleteCreator = async () => {
    if (!creatorToDelete) return;
    
    try {
      const { error } = await supabase
        .from("user_accounts")
        .delete()
        .eq("id", creatorToDelete.id);
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Succès!",
        description: `Le créateur ${creatorToDelete.username} a été supprimé avec succès.`,
      });
      
      setIsDeleteModalOpen(false);
      setCreatorToDelete(null);
      fetchCreators();
    } catch (error) {
      console.error("Erreur lors de la suppression du créateur:", error);
      toast({
        variant: "destructive",
        title: "Erreur!",
        description: "Impossible de supprimer le créateur.",
      });
    }
  };

  const handleUnassignCreator = async (creatorId) => {
    try {
      const { error } = await supabase
        .from("user_accounts")
        .update({ agent_id: null })
        .eq("id", creatorId);
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Succès!",
        description: "Créateur désassigné avec succès.",
      });
      
      fetchCreators();
    } catch (error) {
      console.error("Erreur lors de la désassignation du créateur:", error);
      toast({
        variant: "destructive",
        title: "Erreur!",
        description: "Impossible de désassigner le créateur.",
      });
    }
  };

  const handleResetPassword = async () => {
    if (!creatorToResetPassword) return;
    
    try {
      const generatedPassword = generateRandomPassword();
      setNewPassword(generatedPassword);
      
      const { error } = await supabase
        .from("user_accounts")
        .update({ password: generatedPassword })
        .eq("id", creatorToResetPassword.id);
      
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
    setCreatorToResetPassword(null);
    setNewPassword("");
    setResetPasswordSuccess(false);
  };

  // Filter creators based on search query and active tab
  const filteredCreators = creators
    .filter(creator => creator.username?.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter(creator => {
      if (activeTab === "all") return true;
      if (activeTab === "active") return creator.status === "active";
      if (activeTab === "warning") return creator.status === "warning";
      if (activeTab === "inactive") return creator.status === "inactive";
      return true;
    });

  if (!isAuthenticated || (role !== 'manager' && role !== 'founder')) {
    return null;
  }

  if (loading || !agent) {
    return (
      <div className="min-h-screen p-4 flex justify-center items-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
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
              <div className="flex items-center">
                <Button 
                  variant="ghost" 
                  className="mr-4 text-blue-300 hover:text-white hover:bg-blue-800/30" 
                  onClick={() => navigate('/manager-dashboard')}
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                  <CardTitle className="text-3xl font-bold text-white flex items-center gap-2">
                    <Users className="h-8 w-8 text-blue-400" />
                    Créateurs de {agent.username}
                  </CardTitle>
                  <p className="text-blue-300 mt-1">Gestion et suivi des performances</p>
                </div>
              </div>
              
              <div className="mt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
                  <TabsList className="bg-blue-900/30">
                    <TabsTrigger value="all" className="data-[state=active]:bg-blue-700 data-[state=active]:text-white">
                      Tous
                    </TabsTrigger>
                    <TabsTrigger value="active" className="data-[state=active]:bg-green-700 data-[state=active]:text-white">
                      Actifs
                    </TabsTrigger>
                    <TabsTrigger value="warning" className="data-[state=active]:bg-yellow-700 data-[state=active]:text-white">
                      Alerte
                    </TabsTrigger>
                    <TabsTrigger value="inactive" className="data-[state=active]:bg-red-700 data-[state=active]:text-white">
                      Inactifs
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
                
                <div className="flex gap-2 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Rechercher un créateur..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-blue-900/20 border-blue-800/30 text-white placeholder:text-blue-400"
                    />
                  </div>
                  <Button 
                    className="bg-blue-700 hover:bg-blue-600 whitespace-nowrap"
                    onClick={() => {
                      fetchAvailableCreators();
                      setIsAssignCreatorModalOpen(true);
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Assigner
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-6">
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
                </div>
              ) : filteredCreators.length === 0 ? (
                <div className="p-8 text-center text-blue-400 bg-blue-900/20 rounded-lg border border-blue-800/30">
                  <Users className="h-10 w-10 mx-auto mb-4 text-blue-500 opacity-50" />
                  <h3 className="text-xl font-semibold mb-2">Aucun créateur trouvé</h3>
                  <p className="mb-4">Aucun créateur ne correspond à votre recherche ou aucun créateur n'est assigné à cet agent.</p>
                  <Button 
                    className="bg-blue-700 hover:bg-blue-600"
                    onClick={() => {
                      fetchAvailableCreators();
                      setIsAssignCreatorModalOpen(true);
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Assigner un créateur
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredCreators.map(creator => (
                    <Card key={creator.id} className="bg-blue-900/20 border-blue-800/30 hover:bg-blue-800/20 transition-colors">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between">
                          <CardTitle className="text-xl text-white flex items-center gap-2">
                            {creator.username}
                            {creator.status === "active" && (
                              <span className="inline-block w-2.5 h-2.5 bg-green-500 rounded-full"></span>
                            )}
                            {creator.status === "warning" && (
                              <span className="inline-block w-2.5 h-2.5 bg-amber-500 rounded-full"></span>
                            )}
                            {creator.status === "inactive" && (
                              <span className="inline-block w-2.5 h-2.5 bg-red-500 rounded-full"></span>
                            )}
                          </CardTitle>
                          <div className="text-sm font-medium text-blue-400">
                            {creator.followers.toLocaleString()} followers
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-blue-300">Performance</span>
                          <span className="text-sm font-medium text-white">{creator.performance}%</span>
                        </div>
                        <div className="w-full bg-blue-950/50 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              creator.performance >= 80 ? 'bg-green-500' : 
                              creator.performance >= 60 ? 'bg-amber-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${creator.performance}%` }}
                          ></div>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4 pt-2">
                          <div className="bg-blue-950/30 p-3 rounded-lg">
                            <div className="text-sm text-blue-400 flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              Heures
                            </div>
                            <div className="text-lg font-semibold text-white">{creator.hours}/{creator.target}h</div>
                          </div>
                          <div className="bg-blue-950/30 p-3 rounded-lg">
                            <div className="text-sm text-blue-400 flex items-center">
                              <Diamond className="h-3 w-3 mr-1" />
                              Diamants
                            </div>
                            <div className="text-lg font-semibold text-white">{creator.diamonds}</div>
                          </div>
                          <div className="bg-blue-950/30 p-3 rounded-lg">
                            <div className="text-sm text-blue-400 flex items-center">
                              <Star className="h-3 w-3 mr-1" />
                              Likes
                            </div>
                            <div className="text-lg font-semibold text-white">{creator.likes.toLocaleString()}</div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-4 gap-2 pt-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full border-blue-800 text-blue-300 hover:bg-blue-800/30"
                            title="Voir planning"
                          >
                            <Calendar className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full border-blue-800 text-blue-300 hover:bg-blue-800/30"
                            onClick={() => {
                              setCreatorToResetPassword(creator);
                              setIsResetPasswordModalOpen(true);
                            }}
                            title="Réinitialiser mot de passe"
                          >
                            <Key className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full border-blue-800 text-blue-300 hover:bg-blue-800/30"
                            onClick={() => handleUnassignCreator(creator.id)}
                            title="Désassigner"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full border-blue-800 text-blue-300 hover:bg-blue-800/30"
                            onClick={() => {
                              setCreatorToDelete(creator);
                              setIsDeleteModalOpen(true);
                            }}
                            title="Supprimer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
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
                Êtes-vous sûr de vouloir supprimer le créateur <span className="font-semibold text-white">{creatorToDelete?.username}</span> ?
                Cette action est irréversible.
              </DialogDescription>
            </DialogHeader>
            <Alert className="bg-red-900/20 border border-red-800/30 text-red-300">
              <AlertDescription>
                Toutes les données associées à ce créateur seront définitivement supprimées.
              </AlertDescription>
            </Alert>
            <DialogFooter className="flex gap-2 sm:justify-end">
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setCreatorToDelete(null);
                }}
                className="border-slate-700 hover:bg-slate-800 text-slate-300"
              >
                Annuler
              </Button>
              <Button 
                variant="destructive"
                onClick={handleDeleteCreator}
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
                  : `Réinitialiser le mot de passe de ${creatorToResetPassword?.username}`}
              </DialogTitle>
              <DialogDescription className="text-slate-400">
                {resetPasswordSuccess 
                  ? "Le mot de passe a été réinitialisé avec succès. Veuillez noter le nouveau mot de passe."
                  : "Cette action générera un nouveau mot de passe aléatoire pour ce créateur."}
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
                  <AlertDescription>
                    Assurez-vous de communiquer le nouveau mot de passe au créateur.
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

        {/* Modal d'assignation de créateur */}
        <Dialog
          open={isAssignCreatorModalOpen}
          onOpenChange={setIsAssignCreatorModalOpen}
        >
          <DialogContent className="bg-slate-900 border border-slate-800">
            <DialogHeader>
              <DialogTitle className="text-xl text-white">Assigner un créateur</DialogTitle>
              <DialogDescription className="text-slate-400">
                Sélectionnez un créateur à assigner à {agent.username}.
              </DialogDescription>
            </DialogHeader>
            
            {availableCreators.length === 0 ? (
              <div className="p-4 text-center">
                <p className="text-blue-300">Aucun créateur disponible pour l'assignation.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="max-h-60 overflow-y-auto pr-2">
                  {availableCreators.map(creator => (
                    <div 
                      key={creator.id} 
                      className={`p-3 mb-2 rounded-md cursor-pointer transition-colors ${
                        selectedCreator === creator.id
                          ? 'bg-blue-700/50 border border-blue-500'
                          : 'bg-blue-900/20 border border-blue-800/30 hover:bg-blue-800/30'
                      }`}
                      onClick={() => setSelectedCreator(creator.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="font-medium text-white">{creator.username}</div>
                        {selectedCreator === creator.id && (
                          <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                <DialogFooter className="flex gap-2 sm:justify-end">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setIsAssignCreatorModalOpen(false);
                      setSelectedCreator("");
                    }}
                    className="border-slate-700 hover:bg-slate-800 text-slate-300"
                  >
                    Annuler
                  </Button>
                  <Button 
                    variant="default"
                    onClick={handleAssignCreator}
                    className="bg-blue-700 hover:bg-blue-800 text-white"
                    disabled={!selectedCreator}
                  >
                    Assigner
                  </Button>
                </DialogFooter>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </UltraDashboard>
    </SidebarProvider>
  );
};

export default AgentCreators;
