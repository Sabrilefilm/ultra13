
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { UserCheck, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface User {
  id: string;
  username: string;
  role: string;
}

export const AgentAssignment = ({ onPageView = false }) => {
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
        .from('user_accounts')
        .select('id, username, role')
        .eq('role', 'manager');
        
      if (managersError) throw managersError;
      
      // Fetch agents
      const { data: agentsData, error: agentsError } = await supabase
        .from('user_accounts')
        .select('id, username, role')
        .eq('role', 'agent');
        
      if (agentsError) throw agentsError;
      
      console.log('Fetched users:', managersData?.length + agentsData?.length);
      
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
      
      // Update the agent's profile to assign them to the manager
      const { error } = await supabase
        .from('user_accounts')
        .update({ manager_id: selectedManager })
        .eq('id', selectedAgent);
        
      if (error) throw error;
      
      toast({
        title: 'Succès',
        description: 'Agent assigné avec succès au manager',
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
    <Card className="bg-slate-800/90 backdrop-blur-sm border-purple-900/30 text-white">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-semibold text-white flex items-center gap-2">
          <UserCheck className="h-5 w-5 text-purple-400" />
          Attribution d'Agents aux Managers
        </CardTitle>
        {!onPageView && (
          <Button 
            onClick={handleNavigateToFullManagement} 
            variant="outline" 
            className="border-purple-700/30 bg-purple-900/20 hover:bg-purple-800/30 text-white"
          >
            Gestion agence/créateurs complète
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">
              Sélectionner un Manager
            </label>
            <Select 
              value={selectedManager} 
              onValueChange={setSelectedManager}
              disabled={isLoading}
            >
              <SelectTrigger className="bg-slate-700 border-purple-800/50 text-white">
                <SelectValue placeholder="Choisir un manager" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-purple-800/50 text-white">
                {managers.map((manager) => (
                  <SelectItem key={manager.id} value={manager.id} className="text-white hover:bg-slate-700 focus:bg-slate-700">
                    {manager.username}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">
              Sélectionner un Agent
            </label>
            <Select 
              value={selectedAgent} 
              onValueChange={setSelectedAgent}
              disabled={isLoading}
            >
              <SelectTrigger className="bg-slate-700 border-purple-800/50 text-white">
                <SelectValue placeholder="Choisir un agent" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-purple-800/50 text-white">
                {agents.map((agent) => (
                  <SelectItem key={agent.id} value={agent.id} className="text-white hover:bg-slate-700 focus:bg-slate-700">
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
