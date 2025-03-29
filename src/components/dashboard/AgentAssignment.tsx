
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { UserCheck, UserPlus, Users } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface User {
  id: string;
  username: string;
  role: string;
}

export const AgentAssignment = () => {
  const [managers, setManagers] = useState<User[]>([]);
  const [agents, setAgents] = useState<User[]>([]);
  const [selectedManager, setSelectedManager] = useState<string>("");
  const [selectedAgent, setSelectedAgent] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Fetch managers
        const { data: managersData, error: managersError } = await supabase
          .from("user_accounts")
          .select("id, username")
          .eq("role", "manager");

        if (managersError) throw managersError;
        
        // Fetch agents
        const { data: agentsData, error: agentsError } = await supabase
          .from("user_accounts")
          .select("id, username")
          .eq("role", "agent");

        if (agentsError) throw agentsError;

        setManagers(managersData || []);
        setAgents(agentsData || []);
      } catch (error) {
        console.error("Erreur lors de la récupération des utilisateurs:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleAssignAgent = async () => {
    if (!selectedManager || !selectedAgent) {
      toast.error("Veuillez sélectionner un manager et un agent");
      return;
    }

    setIsLoading(true);
    try {
      // Mettre à jour l'agent_id du manager sélectionné
      const { error } = await supabase
        .from("user_accounts")
        .update({ agent_id: selectedAgent })
        .eq("id", selectedManager);

      if (error) throw error;

      toast.success("Agent assigné avec succès au manager");
      setSelectedManager("");
      setSelectedAgent("");
    } catch (error) {
      console.error("Erreur lors de l'assignation de l'agent:", error);
      toast.error("Erreur lors de l'assignation de l'agent");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-[#1e1f2e]/90 backdrop-blur-sm border border-gray-800/50 rounded-xl shadow-lg">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <UserCheck className="h-5 w-5 text-purple-400" />
          Assigner un Agent à un Manager
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="manager" className="text-gray-300">Sélectionner un Manager</Label>
          <Select value={selectedManager} onValueChange={setSelectedManager}>
            <SelectTrigger id="manager" className="bg-[#2a2b3d] border-gray-700 text-white">
              <SelectValue placeholder="Sélectionner un manager" />
            </SelectTrigger>
            <SelectContent className="bg-[#2a2b3d] border-gray-700">
              {managers.length > 0 ? (
                managers.map(manager => (
                  <SelectItem key={manager.id} value={manager.id} className="text-white">
                    {manager.username}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="none" disabled className="text-gray-400">
                  Aucun manager disponible
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="agent" className="text-gray-300">Sélectionner un Agent</Label>
          <Select value={selectedAgent} onValueChange={setSelectedAgent}>
            <SelectTrigger id="agent" className="bg-[#2a2b3d] border-gray-700 text-white">
              <SelectValue placeholder="Sélectionner un agent" />
            </SelectTrigger>
            <SelectContent className="bg-[#2a2b3d] border-gray-700">
              {agents.length > 0 ? (
                agents.map(agent => (
                  <SelectItem key={agent.id} value={agent.id} className="text-white">
                    {agent.username}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="none" disabled className="text-gray-400">
                  Aucun agent disponible
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>

        <Button 
          className="w-full bg-purple-600 hover:bg-purple-700 mt-4"
          onClick={handleAssignAgent}
          disabled={isLoading || !selectedManager || !selectedAgent}
        >
          {isLoading ? (
            <span className="flex items-center">
              <span className="animate-spin mr-2 h-4 w-4 border-2 border-white border-opacity-50 border-t-transparent rounded-full"></span>
              Assignation...
            </span>
          ) : (
            <span className="flex items-center">
              <UserPlus className="mr-2 h-4 w-4" />
              Assigner l'agent au manager
            </span>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};
