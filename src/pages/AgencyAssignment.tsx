
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check, UserPlus, UserMinus } from "lucide-react";
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
import { Account } from "@/types/accounts";
import { useAgencyMembers } from "@/hooks/user-management/use-agency-members";
import { useToast } from "@/hooks/use-toast";

const AgencyAssignment = () => {
  const navigate = useNavigate();
  const { role } = useIndexAuth();
  const [agents, setAgents] = useState<Account[]>([]);
  const [selectedAgentId, setSelectedAgentId] = useState<string>("");
  const { toast } = useToast();
  
  const {
    assignedCreators,
    unassignedCreators,
    isLoading,
    assignCreatorToAgent,
    removeCreatorFromAgent
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

  return (
    <div className="min-h-screen p-4">
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
  );
};

export default AgencyAssignment;
