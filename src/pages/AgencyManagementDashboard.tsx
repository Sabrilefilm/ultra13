
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check, UserPlus, UserMinus, Plus, HomeIcon } from "lucide-react";
import { useIndexAuth } from "@/hooks/use-index-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { supabase } from "@/lib/supabase";
import { useAgencyMembers } from "@/hooks/user-management/use-agency-members";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CreatorSelect } from "@/components/live-schedule/creator-select";
import { SidebarProvider } from "@/components/ui/sidebar";
import { UltraSidebar } from "@/components/layout/UltraSidebar";
import { Footer } from "@/components/layout/Footer";

const AgencyManagementDashboard = () => {
  const navigate = useNavigate();
  const { agentId } = useParams();
  const { toast } = useToast();
  const { isAuthenticated, username, role, userId, handleLogout, lastLogin } = useIndexAuth();
  const [agents, setAgents] = useState([]);
  const [selectedAgentId, setSelectedAgentId] = useState<string>(agentId || "");
  const [isAddCreatorOpen, setIsAddCreatorOpen] = useState(false);
  const [newCreatorUsername, setNewCreatorUsername] = useState("");
  
  const {
    assignedCreators,
    unassignedCreators,
    isLoading,
    assignCreatorToAgent,
    removeCreatorFromAgent
  } = useAgencyMembers(selectedAgentId);

  useEffect(() => {
    // Only founders and managers should be able to access this page
    if (!isAuthenticated || (role !== 'founder' && role !== 'manager')) {
      navigate('/dashboard');
      return;
    }

    const fetchAgents = async () => {
      try {
        const { data, error } = await supabase
          .from("user_accounts")
          .select("*")
          .eq("role", "agent");

        if (error) {
          console.error("Error fetching agents:", error);
          return;
        }

        setAgents(data || []);
        if (!selectedAgentId && data && data.length > 0) {
          setSelectedAgentId(data[0].id);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchAgents();
  }, [navigate, role, isAuthenticated, selectedAgentId]);

  const handleAssignCreator = async (creatorId: string) => {
    if (!selectedAgentId) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un agent",
        variant: "destructive",
      });
      return;
    }
    
    const success = await assignCreatorToAgent(creatorId, selectedAgentId);
    
    if (success) {
      toast({
        title: "Succès",
        description: "Le créateur a été assigné à l'agent",
        variant: "success",
      });
    } else {
      toast({
        title: "Erreur",
        description: "Impossible d'assigner le créateur",
        variant: "destructive",
      });
    }
  };

  const handleRemoveCreator = async (creatorId: string) => {
    const success = await removeCreatorFromAgent(creatorId);
    
    if (success) {
      toast({
        title: "Succès",
        description: "Le créateur a été retiré de l'agent",
        variant: "success",
      });
    } else {
      toast({
        title: "Erreur",
        description: "Impossible de retirer le créateur",
        variant: "destructive",
      });
    }
  };

  const handleSelectCreator = (username: string) => {
    setNewCreatorUsername(username);
  };

  const handleAddCreator = async () => {
    if (!newCreatorUsername) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un créateur",
        variant: "destructive",
      });
      return;
    }

    try {
      // Fetch the creator's ID based on the username
      const { data: creatorData, error: creatorError } = await supabase
        .from("user_accounts")
        .select("id")
        .eq("username", newCreatorUsername)
        .eq("role", "creator")
        .single();

      if (creatorError || !creatorData) {
        toast({
          title: "Erreur",
          description: "Impossible de trouver le créateur sélectionné",
          variant: "destructive",
        });
        return;
      }

      if (selectedAgentId) {
        const success = await assignCreatorToAgent(creatorData.id, selectedAgentId);
        
        if (success) {
          toast({
            title: "Succès",
            description: "Le créateur a été assigné à l'agent",
            variant: "success",
          });
          
          setNewCreatorUsername("");
          setIsAddCreatorOpen(false);
        } else {
          toast({
            title: "Erreur",
            description: "Impossible d'assigner le créateur",
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Erreur",
          description: "Veuillez sélectionner un agent",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite",
        variant: "destructive",
      });
    }
  };

  // If the user is not founder or manager, show a coming soon page
  if (isAuthenticated && role !== 'founder' && role !== 'manager') {
    return (
      <SidebarProvider defaultOpen={true}>
        <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-900 to-slate-950 text-white">
          <UltraSidebar 
            username={username || ''}
            role={role || ''}
            userId={userId || ''}
            onLogout={handleLogout}
            currentPage="agency-assignment"
            lastLogin={lastLogin}
          />
          
          <div className="flex-1 p-4 md:p-6 flex justify-center items-center">
            <Card className="max-w-lg w-full bg-slate-800/90 backdrop-blur-sm border-purple-900/30 text-center">
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl font-bold text-white">✨ Bientôt Disponible ✨</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                <p className="text-slate-300">
                  La gestion des agences sera bientôt disponible pour votre rôle.
                </p>
                <div className="flex justify-center">
                  <Button 
                    onClick={() => navigate("/dashboard")} 
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                  >
                    <HomeIcon className="mr-2 h-4 w-4" />
                    Retour à l'accueil
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-900 to-slate-950 text-white">
        <UltraSidebar 
          username={username || ''}
          role={role || ''}
          userId={userId || ''}
          onLogout={handleLogout}
          currentPage="agency-assignment"
          lastLogin={lastLogin}
        />
        
        <div className="flex-1 p-4 md:p-6 overflow-y-auto">
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-white">
                👥 Gestion des équipes d'agence
              </h1>
              
              <Button
                variant="outline"
                onClick={() => navigate("/")}
                className="flex items-center gap-2 bg-slate-800/80 border-slate-700/50 hover:bg-slate-700 text-white"
              >
                <HomeIcon className="h-4 w-4" />
                Retour au tableau de bord
              </Button>
            </div>

            <Card className="border-indigo-800/30 shadow-lg overflow-hidden bg-gradient-to-br from-slate-900 to-slate-950">
              <CardHeader className="bg-gradient-to-r from-indigo-950/50 to-slate-950/70 pb-6 border-b border-indigo-900/20">
                <CardTitle className="text-xl md:text-2xl font-bold bg-gradient-to-r from-indigo-300 to-blue-300 bg-clip-text text-transparent">
                  🔍 Sélection d'agent
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="max-w-xs">
                  <Select 
                    value={selectedAgentId} 
                    onValueChange={(value) => setSelectedAgentId(value)}
                  >
                    <SelectTrigger className="bg-slate-700 border-purple-900/50 text-white">
                      <SelectValue placeholder="Sélectionner un agent" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-purple-900/50 text-white">
                      {agents.map((agent) => (
                        <SelectItem key={agent.id} value={agent.id} className="text-white hover:bg-slate-700 focus:bg-slate-700">
                          {agent.username}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card className="border-indigo-800/30 shadow-lg overflow-hidden bg-gradient-to-br from-slate-900 to-slate-950">
              <CardHeader className="bg-gradient-to-r from-indigo-950/50 to-slate-950/70 pb-6 border-b border-indigo-900/20">
                <CardTitle className="flex justify-between items-center">
                  <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-indigo-300 to-blue-300 bg-clip-text text-transparent">
                    Attribution des créateurs
                  </span>
                  <Dialog open={isAddCreatorOpen} onOpenChange={setIsAddCreatorOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm" className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
                        <Plus className="h-4 w-4 mr-1" />
                        Ajouter un créateur
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-slate-800 border-purple-900/50 text-white">
                      <DialogHeader>
                        <DialogTitle className="text-white">Assigner un créateur</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <label htmlFor="creator" className="text-white">Sélectionner un créateur</label>
                          <CreatorSelect 
                            onSelect={handleSelectCreator}
                            value={newCreatorUsername}
                          />
                        </div>
                        <Button onClick={handleAddCreator} className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                          Assigner
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {/* Assigned Creators */}
                  <div>
                    <h3 className="text-lg font-medium text-white mb-4 flex items-center">
                      <Check className="h-5 w-5 text-green-500 mr-2" /> 
                      Créateurs assignés ({assignedCreators.length})
                    </h3>
                    
                    {isLoading ? (
                      <div className="flex justify-center py-8">
                        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
                      </div>
                    ) : assignedCreators.length === 0 ? (
                      <div className="text-center py-8 text-gray-400 bg-slate-800/50 rounded-lg border border-slate-700/30 p-6">
                        Aucun créateur assigné à cet agent
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {assignedCreators.map((creator) => (
                          <Card key={creator.id} className="p-4 bg-slate-700/70 border-purple-800/30">
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="font-medium text-white">{creator.username}</p>
                                <p className="text-sm text-gray-400">Créateur</p>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleRemoveCreator(creator.id)}
                                disabled={isLoading}
                                className="border-red-800/50 bg-red-950/30 hover:bg-red-900/50 text-white"
                              >
                                <UserMinus className="h-4 w-4 mr-1" />
                                Retirer
                              </Button>
                            </div>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {/* Unassigned Creators */}
                  <div>
                    <h3 className="text-lg font-medium text-white mb-4 flex items-center">
                      <UserPlus className="h-5 w-5 text-blue-500 mr-2" /> 
                      Créateurs disponibles ({unassignedCreators.length})
                    </h3>
                    
                    {isLoading ? (
                      <div className="flex justify-center py-8">
                        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
                      </div>
                    ) : unassignedCreators.length === 0 ? (
                      <div className="text-center py-8 text-gray-400 bg-slate-800/50 rounded-lg border border-slate-700/30 p-6">
                        Tous les créateurs sont assignés
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {unassignedCreators.map((creator) => (
                          <Card key={creator.id} className="p-4 bg-slate-700/70 border-purple-800/30">
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="font-medium text-white">{creator.username}</p>
                                <p className="text-sm text-gray-400">Créateur</p>
                              </div>
                              <Button
                                size="sm"
                                onClick={() => handleAssignCreator(creator.id)}
                                disabled={!selectedAgentId || isLoading}
                                className="bg-purple-600 hover:bg-purple-700 text-white"
                              >
                                <UserPlus className="h-4 w-4 mr-1" />
                                Assigner
                              </Button>
                            </div>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Footer role={role} />
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AgencyManagementDashboard;
