
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
import { Users, ArrowLeft, Diamond, Clock, Star, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Sample creators data
const sampleCreators = [
  {
    id: "1",
    name: "Créateur One",
    followers: 250000,
    diamonds: 3500,
    likes: 18000,
    status: "active" as const,
    hours: 18,
    target: 15,
    performance: 95,
  },
  {
    id: "2",
    name: "Créateur Two",
    followers: 120000,
    diamonds: 1800,
    likes: 9500,
    status: "warning" as const,
    hours: 12,
    target: 15,
    performance: 75,
  },
  {
    id: "3",
    name: "Créateur Three",
    followers: 300000,
    diamonds: 4200,
    likes: 22000,
    status: "active" as const,
    hours: 16,
    target: 15,
    performance: 90,
  },
  {
    id: "4",
    name: "Créateur Four",
    followers: 90000,
    diamonds: 1200,
    likes: 6000,
    status: "inactive" as const,
    hours: 5,
    target: 15,
    performance: 30,
  },
  {
    id: "5",
    name: "Créateur Five",
    followers: 180000,
    diamonds: 2800,
    likes: 14000,
    status: "active" as const,
    hours: 17,
    target: 15,
    performance: 92,
  }
];

// Find the agent name based on the ID
const getAgentNameById = (id: string) => {
  const agents = [
    { id: "1", name: "Agent Alpha" },
    { id: "2", name: "Agent Beta" },
    { id: "3", name: "Agent Gamma" },
    { id: "4", name: "Agent Delta" },
    { id: "5", name: "Agent Epsilon" },
  ];
  
  const agent = agents.find(agent => agent.id === id);
  return agent ? agent.name : "Agent inconnu";
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
    
    // Restrict access to manager role
    if (role !== 'manager' && role !== 'founder') {
      navigate('/');
      return;
    }
  }, [isAuthenticated, role, navigate]);

  // Filter creators based on search query and active tab
  const filteredCreators = sampleCreators
    .filter(creator => creator.name.toLowerCase().includes(searchQuery.toLowerCase()))
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
                    Créateurs de {getAgentNameById(agentId || "")}
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
                
                <div className="relative w-full sm:w-64">
                  <Input
                    placeholder="Rechercher un créateur..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-3 bg-blue-900/20 border-blue-800/30 text-white placeholder:text-blue-400"
                  />
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredCreators.map(creator => (
                  <Card key={creator.id} className="bg-blue-900/20 border-blue-800/30 hover:bg-blue-800/20 transition-colors">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between">
                        <CardTitle className="text-xl text-white flex items-center gap-2">
                          {creator.name}
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
                      
                      <div className="pt-2">
                        <Button 
                          variant="default" 
                          className="w-full bg-blue-700 hover:bg-blue-600"
                        >
                          <Calendar className="h-4 w-4 mr-2" />
                          Voir planning
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </UltraDashboard>
    </SidebarProvider>
  );
};

export default AgentCreators;
