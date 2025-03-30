
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check, UserPlus, UserMinus, Plus } from "lucide-react";
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
import { Account } from "@/types/accounts";
import { SidebarProvider } from "@/components/ui/sidebar";
import { UltraSidebar } from "@/components/layout/UltraSidebar";
import { usePlatformSettings } from "@/hooks/use-platform-settings";
import { useAccountManagement } from "@/hooks/use-account-management";
import { useInactivityTimer } from "@/hooks/use-inactivity-timer";
import { UltraDashboard } from "@/components/dashboard/UltraDashboard";

const AgencyAssignment = () => {
  const navigate = useNavigate();
  const { agentId } = useParams();
  const { toast } = useToast();
  const { isAuthenticated, role, username, userId, handleLogout } = useIndexAuth();
  const { platformSettings, handleUpdateSettings } = usePlatformSettings(role);
  const { handleCreateAccount } = useAccountManagement();
  const [agents, setAgents] = useState<Account[]>([]);
  const [selectedAgentId, setSelectedAgentId] = useState<string>(agentId || "");
  const [isAddCreatorOpen, setIsAddCreatorOpen] = useState(false);
  const [newCreatorUsername, setNewCreatorUsername] = useState("");
  
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
  
  const {
    assignedCreators,
    unassignedCreators,
    isLoading,
    assignCreatorToAgent,
    removeCreatorFromAgent,
    fetchUnassignedCreators
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
  }, [navigate, role, selectedAgentId]);

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

  const usernameWatermark = (
    <div className="fixed inset-0 pointer-events-none select-none z-0 flex items-center justify-center">
      <div className="w-full h-full flex items-center justify-center rotate-[-30deg]">
        <p className="text-slate-200/10 text-[6vw] font-bold whitespace-nowrap">
          {username?.toUpperCase()}
        </p>
      </div>
    </div>
  );

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full">
        {usernameWatermark}
        
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
          currentPage="agency-assignment"
        />
        
        <div className="flex-1 p-4 md:ml-64">
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex items-center gap-4 mb-6">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/dashboard")}
                className="h-10 w-10"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-2xl font-bold text-white">
                Gestion des équipes d'agence
              </h1>
            </div>

            <Card className="mb-6 bg-slate-800/90 backdrop-blur-sm border-purple-900/30">
              <CardHeader>
                <CardTitle className="text-white">Sélectionner un agent</CardTitle>
              </CardHeader>
              <CardContent>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Unassigned Creators */}
              <Card className="bg-slate-800/90 backdrop-blur-sm border-purple-900/30">
                <CardHeader>
                  <CardTitle className="flex justify-between items-center text-white">
                    <span>Créateurs non assignés ({unassignedCreators.length})</span>
                    <Dialog open={isAddCreatorOpen} onOpenChange={setIsAddCreatorOpen}>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline" className="bg-purple-800/30 border-purple-500/30 hover:bg-purple-700/50 text-white">
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
                <CardContent>
                  {isLoading ? (
                    <div className="flex justify-center py-8">
                      <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
                    </div>
                  ) : unassignedCreators.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">
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
                </CardContent>
              </Card>

              {/* Assigned Creators */}
              <Card className="bg-slate-800/90 backdrop-blur-sm border-purple-900/30">
                <CardHeader>
                  <CardTitle className="flex justify-between items-center text-white">
                    <span>Créateurs assignés ({assignedCreators.length})</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex justify-center py-8">
                      <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
                    </div>
                  ) : assignedCreators.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">
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
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AgencyAssignment;
