
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { UltraSidebar } from "@/components/layout/UltraSidebar";
import { useIndexAuth } from "@/hooks/use-index-auth";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent 
} from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { supabase } from "@/lib/supabase";
import { ArrowLeft, UserRound, UserPlus, UserMinus, Clock, Calendar, Diamond } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { MobileMenu } from "@/components/mobile/MobileMenu";
import { MobileNavigation } from "@/components/mobile/MobileNavigation";

interface Creator {
  id: string;
  username: string;
  live_schedules?: { hours?: number; days?: number }[];
  profiles?: { total_diamonds?: number }[];
}

interface Agent {
  id: string;
  username: string;
}

const CreatorAgencyManagement = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated, username, role, userId, handleLogout } = useIndexAuth();
  const isMobile = useIsMobile();
  
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedAgentId, setSelectedAgentId] = useState<string>("");
  const [selectedAgentName, setSelectedAgentName] = useState<string>("");
  const [assignedCreators, setAssignedCreators] = useState<Creator[]>([]);
  const [unassignedCreators, setUnassignedCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
      return;
    }

    if (!['founder', 'manager', 'agent'].includes(role)) {
      toast({
        title: "Accès refusé",
        description: "Vous n'avez pas les permissions nécessaires pour accéder à cette page.",
        variant: "destructive",
      });
      navigate('/dashboard');
      return;
    }
    
    fetchAgents();
  }, [isAuthenticated, role, navigate]);
  
  useEffect(() => {
    if (selectedAgentId) {
      fetchCreators();
    }
  }, [selectedAgentId]);
  
  const fetchAgents = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from("user_accounts")
        .select("id, username")
        .eq("role", "agent");
        
      // Si l'utilisateur est un agent, ne montrer que lui-même
      if (role === 'agent') {
        query = query.eq("username", username);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      setAgents(data || []);
      
      // Auto-sélectionner le premier agent ou l'agent actuel si l'utilisateur est un agent
      if (data && data.length > 0) {
        if (role === 'agent') {
          setSelectedAgentId(data[0].id);
          setSelectedAgentName(data[0].username);
        }
      }
    } catch (error) {
      console.error("Error fetching agents:", error);
      toast({
        title: "Erreur",
        description: "Impossible de récupérer la liste des agents",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const fetchCreators = async () => {
    if (!selectedAgentId) return;
    
    try {
      setLoading(true);
      
      // Récupérer les créateurs assignés à cet agent
      const { data: assignedData, error: assignedError } = await supabase
        .from("user_accounts")
        .select(`
          id,
          username,
          live_schedules (
            hours,
            days
          ),
          profiles (
            total_diamonds
          )
        `)
        .eq("role", "creator")
        .eq("agent_id", selectedAgentId);
        
      if (assignedError) throw assignedError;
      
      setAssignedCreators(assignedData || []);
      
      // Si l'utilisateur est un fondateur ou un manager, récupérer aussi les créateurs non assignés
      if (role === 'founder' || role === 'manager') {
        const { data: unassignedData, error: unassignedError } = await supabase
          .from("user_accounts")
          .select(`
            id,
            username,
            live_schedules (
              hours,
              days
            ),
            profiles (
              total_diamonds
            )
          `)
          .eq("role", "creator")
          .is("agent_id", null);
          
        if (unassignedError) throw unassignedError;
        
        setUnassignedCreators(unassignedData || []);
      }
    } catch (error) {
      console.error("Error fetching creators:", error);
      toast({
        title: "Erreur",
        description: "Impossible de récupérer la liste des créateurs",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleSelectAgent = (agentId: string) => {
    setSelectedAgentId(agentId);
    const agent = agents.find(a => a.id === agentId);
    if (agent) {
      setSelectedAgentName(agent.username);
    }
  };
  
  const handleAssignCreator = async (creatorId: string) => {
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from("user_accounts")
        .update({ agent_id: selectedAgentId })
        .eq("id", creatorId);
        
      if (error) throw error;
      
      toast({
        title: "Succès",
        description: "Créateur assigné avec succès",
        variant: "default",
      });
      
      // Rafraîchir les listes
      fetchCreators();
    } catch (error) {
      console.error("Error assigning creator:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'assigner le créateur",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleRemoveCreator = async (creatorId: string) => {
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from("user_accounts")
        .update({ agent_id: null })
        .eq("id", creatorId);
        
      if (error) throw error;
      
      toast({
        title: "Succès",
        description: "Créateur retiré avec succès",
        variant: "default",
      });
      
      // Rafraîchir les listes
      fetchCreators();
    } catch (error) {
      console.error("Error removing creator:", error);
      toast({
        title: "Erreur",
        description: "Impossible de retirer le créateur",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleViewCreatorDetails = (creatorId: string) => {
    // Naviguer vers la page de détails du créateur
    navigate(`/creator-details/${creatorId}`);
  };
  
  const watermarkStyle = {
    position: 'fixed' as 'fixed',
    inset: 0,
    pointerEvents: 'none' as 'none',
    userSelect: 'none' as 'none',
    zIndex: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };
  
  const watermarkTextStyle = {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transform: 'rotate(-30deg)',
    color: 'rgba(255, 255, 255, 0.05)',
    fontSize: '6vw',
    fontWeight: 'bold',
    whiteSpace: 'nowrap' as 'nowrap',
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-950 text-white">
        {isMobile && (
          <MobileMenu 
            username={username}
            role={role}
            currentPage="/agency-assignment"
            onLogout={handleLogout}
          />
        )}
        
        <div style={watermarkStyle}>
          <div style={watermarkTextStyle}>
            {username?.toUpperCase()}
          </div>
        </div>
        
        <div className="flex">
          <UltraSidebar
            username={username}
            role={role}
            userId={userId}
            onLogout={handleLogout}
            currentPage="agency-assignment"
          />
          
          <div className="flex-1 p-4 md:p-6 w-full max-w-full mx-auto">
            <div className="max-w-6xl mx-auto space-y-6">
              <div className="flex items-center gap-4 mb-6">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate("/dashboard")}
                  className="h-10 w-10 bg-white/5 hover:bg-white/10 text-white"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                  <span className="text-2xl mr-2">👥</span>
                  Gestion des équipes d'agence
                </h1>
              </div>

              <Card className="bg-gradient-to-br from-slate-900 to-slate-950 border-indigo-800/30 shadow-lg overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-indigo-950/50 to-slate-950/70 pb-6 border-b border-indigo-900/20">
                  <CardTitle className="text-xl md:text-2xl font-bold flex items-center gap-2">
                    <span className="text-white opacity-80">🔍</span>
                    <span className="bg-gradient-to-r from-indigo-300 to-blue-300 bg-clip-text text-transparent">
                      Sélectionner un agent
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="max-w-md">
                    {role === 'agent' ? (
                      <div className="text-xl font-medium text-white">{selectedAgentName}</div>
                    ) : (
                      <Select 
                        value={selectedAgentId} 
                        onValueChange={handleSelectAgent}
                      >
                        <SelectTrigger className="bg-slate-700 border-purple-900/50 text-white">
                          <SelectValue placeholder="Sélectionner un agent" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-purple-900/50 text-white">
                          {agents.map((agent) => (
                            <SelectItem 
                              key={agent.id} 
                              value={agent.id} 
                              className="text-white hover:bg-slate-700 focus:bg-slate-700"
                            >
                              {agent.username}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                </CardContent>
              </Card>

              {selectedAgentId && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Créateurs assignés */}
                  <Card className="bg-gradient-to-br from-slate-900 to-slate-950 border-indigo-800/30 shadow-lg overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-indigo-950/50 to-slate-950/70 pb-4 border-b border-indigo-900/20">
                      <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <UserRound className="h-5 w-5 text-indigo-400" />
                          <span className="text-lg font-medium text-white">
                            Créateurs assignés ({assignedCreators.length})
                          </span>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      {loading ? (
                        <div className="flex justify-center py-8">
                          <div className="animate-spin h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full" />
                        </div>
                      ) : assignedCreators.length === 0 ? (
                        <div className="text-center py-8 text-gray-400 bg-slate-800/50 rounded-lg border border-slate-700/30 p-6">
                          Aucun créateur assigné à cet agent
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {assignedCreators.map((creator) => (
                            <Card key={creator.id} className="bg-slate-700/70 border-purple-800/30 overflow-hidden">
                              <div className="p-4">
                                <div className="flex justify-between items-center">
                                  <div className="flex-1">
                                    <p className="font-medium text-white text-lg">{creator.username}</p>
                                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-300">
                                      <div className="flex items-center gap-1">
                                        <Clock className="h-4 w-4 text-blue-400" />
                                        <span>{creator.live_schedules?.[0]?.hours || 0} heures</span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <Calendar className="h-4 w-4 text-green-400" />
                                        <span>{creator.live_schedules?.[0]?.days || 0} jours</span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <Diamond className="h-4 w-4 text-pink-400" />
                                        <span>{creator.profiles?.[0]?.total_diamonds || 0} diamants</span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex gap-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleViewCreatorDetails(creator.id)}
                                      className="bg-slate-800/50 border-slate-700/50 hover:bg-slate-700 text-white"
                                    >
                                      Détails
                                    </Button>
                                    {(role === 'founder' || role === 'manager') && (
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleRemoveCreator(creator.id)}
                                        className="bg-red-900/30 border-red-800/50 hover:bg-red-800/50 text-white"
                                      >
                                        <UserMinus className="h-4 w-4 mr-1" />
                                        Retirer
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </Card>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Créateurs non assignés - seulement pour les fondateurs et managers */}
                  {(role === 'founder' || role === 'manager') && (
                    <Card className="bg-gradient-to-br from-slate-900 to-slate-950 border-indigo-800/30 shadow-lg overflow-hidden">
                      <CardHeader className="bg-gradient-to-r from-indigo-950/50 to-slate-950/70 pb-4 border-b border-indigo-900/20">
                        <CardTitle className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <UserPlus className="h-5 w-5 text-indigo-400" />
                            <span className="text-lg font-medium text-white">
                              Créateurs non assignés ({unassignedCreators.length})
                            </span>
                          </div>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4">
                        {loading ? (
                          <div className="flex justify-center py-8">
                            <div className="animate-spin h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full" />
                          </div>
                        ) : unassignedCreators.length === 0 ? (
                          <div className="text-center py-8 text-gray-400 bg-slate-800/50 rounded-lg border border-slate-700/30 p-6">
                            Tous les créateurs sont assignés
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {unassignedCreators.map((creator) => (
                              <Card key={creator.id} className="bg-slate-700/70 border-purple-800/30 overflow-hidden">
                                <div className="p-4">
                                  <div className="flex justify-between items-center">
                                    <div className="flex-1">
                                      <p className="font-medium text-white text-lg">{creator.username}</p>
                                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-300">
                                        <div className="flex items-center gap-1">
                                          <Clock className="h-4 w-4 text-blue-400" />
                                          <span>{creator.live_schedules?.[0]?.hours || 0} heures</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                          <Calendar className="h-4 w-4 text-green-400" />
                                          <span>{creator.live_schedules?.[0]?.days || 0} jours</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                          <Diamond className="h-4 w-4 text-pink-400" />
                                          <span>{creator.profiles?.[0]?.total_diamonds || 0} diamants</span>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="flex gap-2">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleViewCreatorDetails(creator.id)}
                                        className="bg-slate-800/50 border-slate-700/50 hover:bg-slate-700 text-white"
                                      >
                                        Détails
                                      </Button>
                                      <Button
                                        size="sm"
                                        onClick={() => handleAssignCreator(creator.id)}
                                        className="bg-purple-600 hover:bg-purple-700 text-white"
                                      >
                                        <UserPlus className="h-4 w-4 mr-1" />
                                        Assigner
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </Card>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        
        <MobileNavigation 
          role={role}
          currentPage="agency-assignment"
          onOpenMenu={() => {}}
        />
      </div>
    </SidebarProvider>
  );
};

export default CreatorAgencyManagement;
