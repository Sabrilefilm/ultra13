
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { UltraDashboard } from "@/components/dashboard/UltraDashboard";
import { useIndexAuth } from "@/hooks/use-index-auth";
import { usePlatformSettings } from "@/hooks/use-platform-settings";
import { useAccountManagement } from "@/hooks/use-account-management";
import { useInactivityTimer } from "@/hooks/use-inactivity-timer";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Calendar, BarChart3, AlertCircle, MessageSquare, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SocialCommunityLinks } from "@/components/layout/SocialCommunityLinks";
import { AgentStatusCard } from "@/components/manager/AgentStatusCard";
import { AgentPerformanceChart } from "@/components/manager/AgentPerformanceChart";
import { Input } from "@/components/ui/input";

// Sample agent data (in a real app this would come from an API)
const sampleAgents = [
  { 
    id: "1", 
    name: "Agent Alpha", 
    status: "active" as const, 
    performance: 95, 
    liveHours: 18, 
    targetHours: 15,
    diamonds: 2500
  },
  { 
    id: "2", 
    name: "Agent Beta", 
    status: "warning" as const, 
    performance: 75, 
    liveHours: 12, 
    targetHours: 15,
    diamonds: 1800
  },
  { 
    id: "3", 
    name: "Agent Gamma", 
    status: "active" as const, 
    performance: 88, 
    liveHours: 14, 
    targetHours: 15,
    diamonds: 2100
  },
  { 
    id: "4", 
    name: "Agent Delta", 
    status: "inactive" as const, 
    performance: 30, 
    liveHours: 5, 
    targetHours: 15,
    diamonds: 800
  },
  { 
    id: "5", 
    name: "Agent Epsilon", 
    status: "active" as const, 
    performance: 92, 
    liveHours: 16, 
    targetHours: 15,
    diamonds: 2300
  }
];

// Chart data
const performanceData = [
  { name: "Alpha", hours: 18, diamonds: 25, target: 15 },
  { name: "Beta", hours: 12, diamonds: 18, target: 15 },
  { name: "Gamma", hours: 14, diamonds: 21, target: 15 },
  { name: "Delta", hours: 5, diamonds: 8, target: 15 },
  { name: "Epsilon", hours: 16, diamonds: 23, target: 15 },
];

const ManagerDashboard = () => {
  const { toast } = useToast();
  const { isAuthenticated, username, role, userId, handleLogout } = useIndexAuth();
  const { platformSettings, handleUpdateSettings } = usePlatformSettings(role);
  const { handleCreateAccount } = useAccountManagement();
  const [activeTab, setActiveTab] = useState("overview");
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

  // Filter agents based on search query
  const filteredAgents = sampleAgents.filter(agent => 
    agent.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle contact button click
  const handleContactAgent = (agentId: string) => {
    toast({
      title: "Contact Agent",
      description: `Contacter l'agent ${agentId} - fonctionnalité en développement`,
    });
  };

  // Handle manage button click
  const handleManageAgent = (agentId: string) => {
    toast({
      title: "Gérer Agent",
      description: `Gérer l'agent ${agentId} - fonctionnalité en développement`,
    });
  };

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
          <Card className="bg-white dark:bg-slate-900 shadow-lg border-indigo-100 dark:border-indigo-900/30">
            <CardHeader className="bg-gradient-to-r from-indigo-50 to-white dark:from-indigo-950/30 dark:to-slate-950">
              <div className="flex justify-between items-center">
                <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Users className="h-6 w-6 text-indigo-500" />
                  Espace Manager
                </CardTitle>
              </div>
              
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mt-4">
                <TabsList className="grid grid-cols-4 bg-indigo-100 dark:bg-indigo-900/30">
                  <TabsTrigger value="overview" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Vue d'ensemble
                  </TabsTrigger>
                  <TabsTrigger value="agents" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
                    <Users className="h-4 w-4 mr-2" />
                    Mes Agents
                  </TabsTrigger>
                  <TabsTrigger value="planning" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
                    <Calendar className="h-4 w-4 mr-2" />
                    Planning
                  </TabsTrigger>
                  <TabsTrigger value="communication" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Communication
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            
            <CardContent className="p-6">
              <TabsContent value="overview" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <Card className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 border-indigo-100 dark:border-indigo-800/30">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg text-indigo-800 dark:text-indigo-300">Total Agents</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{sampleAgents.length}</div>
                      <p className="text-sm text-indigo-600/70 dark:text-indigo-400/70 mt-1">Agents actifs</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-100 dark:border-purple-800/30">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg text-purple-800 dark:text-purple-300">Performances</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">87%</div>
                      <p className="text-sm text-purple-600/70 dark:text-purple-400/70 mt-1">Objectifs atteints</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-amber-100 dark:border-amber-800/30">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg text-amber-800 dark:text-amber-300">Alertes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">2</div>
                      <p className="text-sm text-amber-600/70 dark:text-amber-400/70 mt-1">Agents en dessous des objectifs</p>
                    </CardContent>
                  </Card>
                </div>
                
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-red-500" />
                      Alertes récentes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 border border-red-100 dark:border-red-900/30 rounded-lg bg-red-50 dark:bg-red-900/20">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold text-red-800 dark:text-red-300">Agent Delta</h4>
                            <p className="text-sm text-red-700 dark:text-red-400">Moins de 10h de live cette semaine (5h/15h)</p>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
                            onClick={() => handleContactAgent("4")}
                          >
                            Contacter
                          </Button>
                        </div>
                      </div>
                      
                      <div className="p-4 border border-amber-100 dark:border-amber-900/30 rounded-lg bg-amber-50 dark:bg-amber-900/20">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold text-amber-800 dark:text-amber-300">Agent Beta</h4>
                            <p className="text-sm text-amber-700 dark:text-amber-400">Objectifs de diamants non atteints (75%)</p>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="border-amber-200 text-amber-600 hover:bg-amber-50 dark:border-amber-800 dark:text-amber-400 dark:hover:bg-amber-900/20"
                            onClick={() => handleContactAgent("2")}
                          >
                            Contacter
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <AgentPerformanceChart data={performanceData} />
                
                <div className="mt-6">
                  <SocialCommunityLinks compact={true} className="mt-6" />
                </div>
              </TabsContent>
              
              <TabsContent value="agents" className="mt-0">
                <div className="mb-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Rechercher un agent..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredAgents.map(agent => (
                    <AgentStatusCard
                      key={agent.id}
                      name={agent.name}
                      status={agent.status}
                      performance={agent.performance}
                      liveHours={agent.liveHours}
                      targetHours={agent.targetHours}
                      onContact={() => handleContactAgent(agent.id)}
                      onManage={() => handleManageAgent(agent.id)}
                    />
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="planning" className="mt-0">
                <div className="flex justify-center items-center h-64">
                  <div className="text-center">
                    <Calendar className="h-16 w-16 text-indigo-300 dark:text-indigo-800 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">
                      Module de planning en cours de développement
                    </p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="communication" className="mt-0">
                <div className="flex justify-center items-center h-64">
                  <div className="text-center">
                    <MessageSquare className="h-16 w-16 text-indigo-300 dark:text-indigo-800 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">
                      Module de communication en cours de développement
                    </p>
                  </div>
                </div>
              </TabsContent>
            </CardContent>
          </Card>
        </div>
      </UltraDashboard>
    </SidebarProvider>
  );
};

export default ManagerDashboard;
