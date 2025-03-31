
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { UserCheck, ArrowRight, Users, Building, UserCog } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { creatorManagementService } from '@/services/creators/creator-management-service';

interface User {
  id: string;
  username: string;
  role: string;
}

export const AgentAssignment = ({ onPageView = false }) => {
  const [managers, setManagers] = useState<User[]>([]);
  const [agents, setAgents] = useState<User[]>([]);
  const [creators, setCreators] = useState<User[]>([]);
  const [ambassadors, setAmbassadors] = useState<User[]>([]);
  
  const [selectedManager, setSelectedManager] = useState<string>('');
  const [selectedAgent, setSelectedAgent] = useState<string>('');
  const [selectedManagerForAgent, setSelectedManagerForAgent] = useState<string>('');
  const [selectedCreator, setSelectedCreator] = useState<string>('');
  const [activeTab, setActiveTab] = useState('agent-to-creator');
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const fetchAllUsers = async () => {
    try {
      setIsLoading(true);
      
      // Fetch all user types
      const { data: managersData, error: managersError } = await supabase
        .from('user_accounts')
        .select('id, username, role')
        .eq('role', 'manager');
        
      if (managersError) throw managersError;
      
      const { data: agentsData, error: agentsError } = await supabase
        .from('user_accounts')
        .select('id, username, role')
        .eq('role', 'agent');
        
      if (agentsError) throw agentsError;
      
      const { data: creatorsData, error: creatorsError } = await supabase
        .from('user_accounts')
        .select('id, username, role')
        .eq('role', 'creator');
        
      if (creatorsError) throw creatorsError;
      
      const { data: ambassadorsData, error: ambassadorsError } = await supabase
        .from('user_accounts')
        .select('id, username, role')
        .eq('role', 'ambassadeur');
        
      if (ambassadorsError) throw ambassadorsError;
      
      console.log('Fetched all user types');
      
      setManagers(managersData || []);
      setAgents(agentsData || []);
      setCreators(creatorsData || []);
      setAmbassadors(ambassadorsData || []);
      
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

  const handleAssignAgentToCreator = async () => {
    if (!selectedAgent || !selectedCreator) {
      toast({
        title: 'Information requise',
        description: 'Veuillez sélectionner un agent et un créateur',
        variant: 'default',
      });
      return;
    }

    try {
      setIsLoading(true);
      
      // Update the creator's profile to assign them to the agent
      const { error } = await supabase
        .from('user_accounts')
        .update({ agent_id: selectedAgent })
        .eq('id', selectedCreator);
        
      if (error) throw error;
      
      toast({
        title: 'Succès',
        description: 'Créateur assigné avec succès à l\'agent',
        variant: 'default',
      });
      
      // Reset selections
      setSelectedAgent('');
      setSelectedCreator('');
      
      // Refresh user lists
      fetchAllUsers();
      
    } catch (error) {
      console.error('Error assigning creator:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible d\'assigner le créateur',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAssignAgentToManager = async () => {
    if (!selectedManagerForAgent || !selectedAgent) {
      toast({
        title: 'Information requise',
        description: 'Veuillez sélectionner un manager et un agent',
        variant: 'default',
      });
      return;
    }

    try {
      setIsLoading(true);
      
      const success = await creatorManagementService.assignAgentToManager(
        selectedAgent, 
        selectedManagerForAgent
      );
        
      if (success) {
        toast({
          title: 'Succès',
          description: 'Agent assigné avec succès au manager',
          variant: 'default',
        });
        
        // Reset selections
        setSelectedManagerForAgent('');
        setSelectedAgent('');
        
        // Refresh user lists
        fetchAllUsers();
      }
      
    } catch (error) {
      console.error('Error assigning agent to manager:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible d\'assigner l\'agent au manager',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAssignCreatorToManager = async () => {
    if (!selectedManager || !selectedCreator) {
      toast({
        title: 'Information requise',
        description: 'Veuillez sélectionner un manager et un créateur',
        variant: 'default',
      });
      return;
    }

    try {
      setIsLoading(true);
      
      const success = await creatorManagementService.assignUserToManager(
        selectedCreator, 
        selectedManager
      );
        
      if (success) {
        toast({
          title: 'Succès',
          description: 'Créateur assigné avec succès au manager',
          variant: 'default',
        });
        
        // Reset selections
        setSelectedManager('');
        setSelectedCreator('');
        
        // Refresh user lists
        fetchAllUsers();
      }
      
    } catch (error) {
      console.error('Error assigning creator to manager:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible d\'assigner le créateur au manager',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAssignAmbassadorToManager = async () => {
    if (!selectedManager || !selectedAgent) {
      toast({
        title: 'Information requise',
        description: 'Veuillez sélectionner un manager et un ambassadeur',
        variant: 'default',
      });
      return;
    }

    try {
      setIsLoading(true);
      
      const success = await creatorManagementService.assignUserToManager(
        selectedAgent, // We're reusing the agent selection for ambassadors
        selectedManager
      );
        
      if (success) {
        toast({
          title: 'Succès',
          description: 'Ambassadeur assigné avec succès au manager',
          variant: 'default',
        });
        
        // Reset selections
        setSelectedManager('');
        setSelectedAgent('');
        
        // Refresh user lists
        fetchAllUsers();
      }
      
    } catch (error) {
      console.error('Error assigning ambassador to manager:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible d\'assigner l\'ambassadeur au manager',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNavigateToFullManagement = () => {
    navigate('/agency-assignment');
  };

  // Determine if we should show the ambassador related components
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
  const isFounder = userInfo.role === 'founder';

  return (
    <Card className="bg-slate-800/90 backdrop-blur-sm border-purple-900/30 text-white">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-semibold text-white flex items-center gap-2">
          <UserCheck className="h-5 w-5 text-purple-400" />
          Gestion des Équipes
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
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 mb-8 bg-slate-700/50">
            <TabsTrigger value="agent-to-creator" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              <UserCheck className="h-4 w-4 mr-2" />
              Agent → Créateur
            </TabsTrigger>
            <TabsTrigger value="manager-to-agent" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              <Building className="h-4 w-4 mr-2" />
              Manager → Agent
            </TabsTrigger>
            <TabsTrigger value="manager-to-creator" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              <UserCog className="h-4 w-4 mr-2" />
              Manager → Créateur
            </TabsTrigger>
            {isFounder && (
              <TabsTrigger value="manager-to-ambassador" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                <Users className="h-4 w-4 mr-2" />
                Manager → Ambassadeur
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="agent-to-creator" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Sélectionner un Créateur
                </label>
                <Select 
                  value={selectedCreator} 
                  onValueChange={setSelectedCreator}
                  disabled={isLoading}
                >
                  <SelectTrigger className="bg-slate-700 border-purple-800/50 text-white">
                    <SelectValue placeholder="Choisir un créateur" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-purple-800/50 text-white">
                    {creators.map((creator) => (
                      <SelectItem key={creator.id} value={creator.id} className="text-white hover:bg-slate-700 focus:bg-slate-700">
                        {creator.username}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-end">
                <Button 
                  onClick={handleAssignAgentToCreator} 
                  disabled={isLoading || !selectedAgent || !selectedCreator}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                >
                  Assigner le créateur à l'agent
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="manager-to-agent" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Sélectionner un Manager
                </label>
                <Select 
                  value={selectedManagerForAgent} 
                  onValueChange={setSelectedManagerForAgent}
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
                  onClick={handleAssignAgentToManager} 
                  disabled={isLoading || !selectedManagerForAgent || !selectedAgent}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                >
                  Assigner l'agent au manager
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="manager-to-creator" className="space-y-4">
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
                  Sélectionner un Créateur
                </label>
                <Select 
                  value={selectedCreator} 
                  onValueChange={setSelectedCreator}
                  disabled={isLoading}
                >
                  <SelectTrigger className="bg-slate-700 border-purple-800/50 text-white">
                    <SelectValue placeholder="Choisir un créateur" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-purple-800/50 text-white">
                    {creators.map((creator) => (
                      <SelectItem key={creator.id} value={creator.id} className="text-white hover:bg-slate-700 focus:bg-slate-700">
                        {creator.username}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-end">
                <Button 
                  onClick={handleAssignCreatorToManager} 
                  disabled={isLoading || !selectedManager || !selectedCreator}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                >
                  Assigner le créateur au manager
                </Button>
              </div>
            </div>
          </TabsContent>

          {isFounder && (
            <TabsContent value="manager-to-ambassador" className="space-y-4">
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
                    Sélectionner un Ambassadeur
                  </label>
                  <Select 
                    value={selectedAgent} 
                    onValueChange={setSelectedAgent}
                    disabled={isLoading}
                  >
                    <SelectTrigger className="bg-slate-700 border-purple-800/50 text-white">
                      <SelectValue placeholder="Choisir un ambassadeur" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-purple-800/50 text-white">
                      {ambassadors.map((ambassador) => (
                        <SelectItem key={ambassador.id} value={ambassador.id} className="text-white hover:bg-slate-700 focus:bg-slate-700">
                          {ambassador.username}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-end">
                  <Button 
                    onClick={handleAssignAmbassadorToManager} 
                    disabled={isLoading || !selectedManager || !selectedAgent}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    Assigner l'ambassadeur au manager
                  </Button>
                </div>
              </div>
            </TabsContent>
          )}
        </Tabs>
      </CardContent>
    </Card>
  );
};
