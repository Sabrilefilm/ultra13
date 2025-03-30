
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { UserCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface User {
  id: string;
  username: string;
  role: string;
}

export const AgentAssignment = () => {
  const [managers, setManagers] = useState<User[]>([]);
  const [agents, setAgents] = useState<User[]>([]);
  const [selectedManager, setSelectedManager] = useState<string>('');
  const [selectedAgent, setSelectedAgent] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      
      // Fetch managers
      const { data: managersData, error: managersError } = await supabase
        .from('users')
        .select('id, username, role')
        .eq('role', 'manager');
        
      if (managersError) throw managersError;
      
      // Fetch agents
      const { data: agentsData, error: agentsError } = await supabase
        .from('users')
        .select('id, username, role')
        .eq('role', 'agent');
        
      if (agentsError) throw agentsError;
      
      setManagers(managersData || []);
      setAgents(agentsData || []);
      
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de récupérer les utilisateurs',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAssignAgent = async () => {
    if (!selectedManager || !selectedAgent) {
      toast({
        title: 'Information requise',
        description: 'Veuillez sélectionner un manager et un agent',
        variant: 'default',
      });
      return;
    }

    try {
      setIsLoading(true);
      
      // Here you would update your database to assign the agent to the manager
      // This is a placeholder for the actual implementation
      const { error } = await supabase
        .from('manager_agents')
        .upsert([
          {
            manager_id: selectedManager,
            agent_id: selectedAgent,
          }
        ]);
        
      if (error) throw error;
      
      toast({
        title: 'Succès',
        description: 'Agent assigné avec succès',
        variant: 'default',
      });
      
      // Reset selections
      setSelectedManager('');
      setSelectedAgent('');
      
    } catch (error) {
      console.error('Error assigning agent:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible d\'assigner l\'agent',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNavigateToFullManagement = () => {
    navigate('/agency-assignment');
  };

  return (
    <Card className="bg-white/10 backdrop-blur-sm border-purple-200/20 dark:bg-slate-900/50 dark:border-purple-900/30">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-semibold text-white flex items-center gap-2">
          <UserCheck className="h-5 w-5 text-purple-400" />
          Attribution d'Agents aux Managers
        </CardTitle>
        <Button 
          onClick={handleNavigateToFullManagement} 
          variant="outline" 
          className="border-white/10 hover:bg-white/10"
        >
          Gestion agence/créateurs complète
        </Button>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Sélectionner un Manager
            </label>
            <Select 
              value={selectedManager} 
              onValueChange={setSelectedManager}
              disabled={isLoading}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choisir un manager" />
              </SelectTrigger>
              <SelectContent>
                {managers.map((manager) => (
                  <SelectItem key={manager.id} value={manager.id}>
                    {manager.username}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Sélectionner un Agent
            </label>
            <Select 
              value={selectedAgent} 
              onValueChange={setSelectedAgent}
              disabled={isLoading}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choisir un agent" />
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
          
          <div className="flex items-end">
            <Button 
              onClick={handleAssignAgent} 
              disabled={isLoading || !selectedManager || !selectedAgent}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
            >
              Assigner l'agent au manager
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
