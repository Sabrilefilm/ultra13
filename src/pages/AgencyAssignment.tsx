
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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

const AgencyAssignment = () => {
  const navigate = useNavigate();
  const { role, username, userId, handleLogout } = useIndexAuth();
  const [agents, setAgents] = useState<Account[]>([]);
  const [selectedAgentId, setSelectedAgentId] = useState<string>("");
  const { toast } = useToast();
  const [isAddCreatorOpen, setIsAddCreatorOpen] = useState(false);
  const [newCreatorUsername, setNewCreatorUsername] = useState("");
  
  const {
    assignedCreators,
    unassignedCreators,
    isLoading,
    assignCreatorToAgent,
    removeCreatorFromAgent,
    fetchUnassignedCreators
  } = useAgencyMembers(selectedAgentId);

  useEffect(() => {
    // Only founders should be able to access this page
    if (role !== 'founder') {
      navigate('/');
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
        if (data && data.length > 0) {
          setSelectedAgentId(data[0].id);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchAgents();
  }, [navigate, role]);

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
        <p className="text-slate-200/30 text-[6vw] font-bold whitespace-nowrap">
          {username?.toUpperCase()}
        </p>
      </div>
    </div>
  );

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full">
        {usernameWatermark}
        
        <UltraSidebar 
          username={username || ''}
          role={role || ''}
          userId={userId || ''}
          onLogout={handleLogout}
          currentPage="user-management"
        />
        
        <div className="flex-1 p-4">
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex items-center gap-4 mb-6">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/users")}
                className="h-10 w-10"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-2xl font-bold">
                Gestion des équipes d'agence
              </h1>
            </div>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Sélectionner un agent</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="max-w-xs">
                  <Select 
                    value={selectedAgentId} 
                    onValueChange={(value) => setSelectedAgentId(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un agent" />
                    </SelectTrigger>
                    <SelectContent>
                      {agents.map((agent) => (
                        <SelectItem key={agent.id} value={agent.id}>
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
              <Card>
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>Créateurs non assignés ({unassignedCreators.length})</span>
                    <Dialog open={isAddCreatorOpen} onOpenChange={setIsAddCreatorOpen}>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline">
                          <Plus className="h-4 w-4 mr-1" />
                          Ajouter un créateur
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Assigner un créateur</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <label htmlFor="creator">Sélectionner un créateur</label>
                            <CreatorSelect 
                              onSelect={handleSelectCreator}
                              value={newCreatorUsername}
                            />
                          </div>
                          <Button onClick={handleAddCreator} className="w-full">
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
                    <div className="text-center py-8 text-muted-foreground">
                      Tous les créateurs sont assignés
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {unassignedCreators.map((creator) => (
                        <Card key={creator.id} className="p-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-medium">{creator.username}</p>
                              <p className="text-sm text-muted-foreground">Créateur</p>
                            </div>
                            <Button
                              size="sm"
                              onClick={() => handleAssignCreator(creator.id)}
                              disabled={!selectedAgentId || isLoading}
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
              <Card>
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>Créateurs assignés ({assignedCreators.length})</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex justify-center py-8">
                      <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
                    </div>
                  ) : assignedCreators.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      Aucun créateur assigné à cet agent
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {assignedCreators.map((creator) => (
                        <Card key={creator.id} className="p-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-medium">{creator.username}</p>
                              <p className="text-sm text-muted-foreground">Créateur</p>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRemoveCreator(creator.id)}
                              disabled={isLoading}
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
