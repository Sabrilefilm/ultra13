
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  Calendar, 
  BarChart3, 
  AlertCircle, 
  MessageSquare, 
  Search, 
  UserPlus, 
  ArrowRight, 
  FileText,
  ChevronRight, 
  ArrowUpRight, 
  Star,
  Mail
} from "lucide-react";
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
    diamonds: 2500,
    creatorCount: 5
  },
  { 
    id: "2", 
    name: "Agent Beta", 
    status: "warning" as const, 
    performance: 75, 
    liveHours: 12, 
    targetHours: 15,
    diamonds: 1800,
    creatorCount: 3
  },
  { 
    id: "3", 
    name: "Agent Gamma", 
    status: "active" as const, 
    performance: 88, 
    liveHours: 14, 
    targetHours: 15,
    diamonds: 2100,
    creatorCount: 4
  },
  { 
    id: "4", 
    name: "Agent Delta", 
    status: "inactive" as const, 
    performance: 30, 
    liveHours: 5, 
    targetHours: 15,
    diamonds: 800,
    creatorCount: 1
  },
  { 
    id: "5", 
    name: "Agent Epsilon", 
    status: "active" as const, 
    performance: 92, 
    liveHours: 16, 
    targetHours: 15,
    diamonds: 2300,
    creatorCount: 6
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

// Messages data
const messageData = [
  {
    id: "1",
    sender: "Agent Alpha",
    content: "J'ai besoin d'aide pour mon créateur qui ne respecte pas les heures.",
    time: "10:30",
    unread: true
  },
  {
    id: "2",
    sender: "System",
    content: "Nouveaux créateurs disponibles pour assignation",
    time: "Hier",
    unread: false
  },
  {
    id: "3",
    sender: "Agent Gamma",
    content: "Rapport hebdomadaire envoyé",
    time: "Hier",
    unread: false
  },
  {
    id: "4",
    sender: "Agent Beta",
    content: "Demande d'augmentation d'objectif pour créateur XYZ",
    time: "2 jours",
    unread: false
  }
];

const ManagerDashboard = () => {
  const { toast } = useToast();
  const { isAuthenticated, username, role, userId, handleLogout } = useIndexAuth();
  const { platformSettings, handleUpdateSettings } = usePlatformSettings(role);
  const { handleCreateAccount } = useAccountManagement();
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [messageContent, setMessageContent] = useState("");
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
  
  // Handle view creators button click
  const handleViewCreators = (agentId: string) => {
    navigate(`/agent-creators/${agentId}`);
    toast({
      title: "Voir les créateurs",
      description: `Affichage des créateurs de l'agent ${agentId}`,
    });
  };
  
  // Handle send message
  const handleSendMessage = () => {
    if (!messageContent.trim()) return;
    
    toast({
      title: "Message envoyé",
      description: "Votre message a été envoyé avec succès",
    });
    
    setMessageContent("");
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
          <Card className="bg-gradient-to-br from-blue-950 to-indigo-950 shadow-lg border-blue-900/30 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-900/30 to-indigo-900/30 border-b border-blue-800/30">
              <div className="flex justify-between items-center">
                <CardTitle className="text-3xl font-bold text-white flex items-center gap-2">
                  <Users className="h-8 w-8 text-blue-400" />
                  Espace Manager
                </CardTitle>
              </div>
              
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mt-6">
                <TabsList className="grid grid-cols-4 bg-blue-900/30">
                  <TabsTrigger value="overview" className="data-[state=active]:bg-blue-700 data-[state=active]:text-white">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Vue d'ensemble
                  </TabsTrigger>
                  <TabsTrigger value="agents" className="data-[state=active]:bg-blue-700 data-[state=active]:text-white">
                    <Users className="h-4 w-4 mr-2" />
                    Mes Agents
                  </TabsTrigger>
                  <TabsTrigger value="planning" className="data-[state=active]:bg-blue-700 data-[state=active]:text-white">
                    <Calendar className="h-4 w-4 mr-2" />
                    Planning
                  </TabsTrigger>
                  <TabsTrigger value="communication" className="data-[state=active]:bg-blue-700 data-[state=active]:text-white">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Communication
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            
            <div className="p-6">
              {activeTab === "overview" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <Card className="bg-gradient-to-br from-blue-900/20 to-blue-800/20 border-blue-800/30">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg text-blue-300">Total Agents</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-white">{sampleAgents.length}</div>
                        <p className="text-sm text-blue-400 mt-1">Agents actifs</p>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border-indigo-800/30">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg text-indigo-300">Performances</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-white">87%</div>
                        <p className="text-sm text-indigo-400 mt-1">Objectifs atteints</p>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-gradient-to-br from-red-900/20 to-orange-900/20 border-red-800/30">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg text-red-300">Alertes</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-white">2</div>
                        <p className="text-sm text-red-400 mt-1">Agents en dessous des objectifs</p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <Card className="mb-6 bg-blue-900/20 border-blue-800/30">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2 text-white">
                        <AlertCircle className="h-5 w-5 text-red-400" />
                        Alertes récentes
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="p-4 border border-red-900/30 rounded-lg bg-red-900/20">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-semibold text-red-300">Agent Delta</h4>
                              <p className="text-sm text-red-400">Moins de 10h de live cette semaine (5h/15h)</p>
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="border-red-800 text-red-400 hover:bg-red-900/20"
                              onClick={() => handleContactAgent("4")}
                            >
                              Contacter
                            </Button>
                          </div>
                        </div>
                        
                        <div className="p-4 border border-amber-900/30 rounded-lg bg-amber-900/20">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-semibold text-amber-300">Agent Beta</h4>
                              <p className="text-sm text-amber-400">Objectifs de diamants non atteints (75%)</p>
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="border-amber-800 text-amber-400 hover:bg-amber-900/20"
                              onClick={() => handleContactAgent("2")}
                            >
                              Contacter
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-blue-900/20 border-blue-800/30">
                    <CardHeader>
                      <CardTitle className="text-lg text-white">Performance des agents</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <AgentPerformanceChart data={performanceData} />
                    </CardContent>
                  </Card>
                  
                  <div className="mt-6">
                    <SocialCommunityLinks compact={true} className="mt-6" />
                  </div>
                </div>
              )}
              
              {activeTab === "agents" && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center mb-6">
                    <div className="relative w-full md:w-96">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Rechercher un agent..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 bg-blue-900/20 border-blue-800/30 text-white placeholder:text-blue-400"
                      />
                    </div>
                    
                    <Button className="hidden md:flex items-center bg-blue-700 hover:bg-blue-600">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Ajouter un agent
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredAgents.map(agent => (
                      <Card key={agent.id} className="bg-blue-900/20 border-blue-800/30 hover:bg-blue-800/20 transition-colors">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between">
                            <CardTitle className="text-xl text-white flex items-center gap-2">
                              {agent.name}
                              {agent.status === "active" && (
                                <span className="inline-block w-2.5 h-2.5 bg-green-500 rounded-full"></span>
                              )}
                              {agent.status === "warning" && (
                                <span className="inline-block w-2.5 h-2.5 bg-amber-500 rounded-full"></span>
                              )}
                              {agent.status === "inactive" && (
                                <span className="inline-block w-2.5 h-2.5 bg-red-500 rounded-full"></span>
                              )}
                            </CardTitle>
                            <div className="text-sm font-medium text-blue-400">
                              {agent.creatorCount} créateurs
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-blue-300">Performance</span>
                            <span className="text-sm font-medium text-white">{agent.performance}%</span>
                          </div>
                          <div className="w-full bg-blue-950/50 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                agent.performance >= 80 ? 'bg-green-500' : 
                                agent.performance >= 60 ? 'bg-amber-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${agent.performance}%` }}
                            ></div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 pt-2">
                            <div className="bg-blue-950/30 p-3 rounded-lg">
                              <div className="text-sm text-blue-400">Heures Live</div>
                              <div className="text-lg font-semibold text-white">{agent.liveHours}/{agent.targetHours}h</div>
                            </div>
                            <div className="bg-blue-950/30 p-3 rounded-lg">
                              <div className="text-sm text-blue-400">Diamants</div>
                              <div className="text-lg font-semibold text-white">{agent.diamonds}</div>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-2 pt-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="w-full border-blue-800 text-blue-300 hover:bg-blue-800/30"
                              onClick={() => handleContactAgent(agent.id)}
                            >
                              <Mail className="h-4 w-4 mr-1" />
                              Contact
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="w-full border-blue-800 text-blue-300 hover:bg-blue-800/30"
                              onClick={() => handleManageAgent(agent.id)}
                            >
                              <Star className="h-4 w-4 mr-1" />
                              Gérer
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="w-full border-blue-800 text-blue-300 hover:bg-blue-800/30"
                              onClick={() => handleViewCreators(agent.id)}
                            >
                              <Users className="h-4 w-4 mr-1" />
                              Créateurs
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
              
              {activeTab === "planning" && (
                <div className="space-y-6">
                  <Card className="bg-blue-900/20 border-blue-800/30">
                    <CardHeader>
                      <CardTitle className="text-lg text-white">Planning des agents</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {filteredAgents.map(agent => (
                          <div key={agent.id} className="p-4 border border-blue-800/30 rounded-lg bg-blue-950/30">
                            <div className="flex justify-between items-center">
                              <div>
                                <h4 className="font-semibold text-white">{agent.name}</h4>
                                <p className="text-sm text-blue-400">Live: {agent.liveHours}h / {agent.targetHours}h</p>
                              </div>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="border-blue-800 text-blue-300 hover:bg-blue-800/30"
                                onClick={() => handleManageAgent(agent.id)}
                              >
                                Voir détails
                                <ChevronRight className="h-4 w-4 ml-1" />
                              </Button>
                            </div>
                            
                            <div className="mt-4 grid grid-cols-7 gap-1">
                              {["L", "M", "M", "J", "V", "S", "D"].map((day, index) => (
                                <div key={index} className="flex flex-col items-center">
                                  <span className="text-xs text-blue-400">{day}</span>
                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mt-1 ${
                                    Math.random() > 0.3 ? 'bg-blue-700 text-white' : 'bg-blue-950/50 text-blue-500'
                                  }`}>
                                    {Math.floor(Math.random() * 4)}h
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
              
              {activeTab === "communication" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1">
                      <Card className="bg-blue-900/20 border-blue-800/30 h-full">
                        <CardHeader>
                          <CardTitle className="text-lg text-white">Conversations</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 max-h-[500px] overflow-auto">
                          {messageData.map(message => (
                            <div 
                              key={message.id} 
                              className={`p-3 rounded-lg cursor-pointer ${
                                message.unread 
                                  ? 'bg-blue-800/40 border-l-4 border-blue-500' 
                                  : 'bg-blue-950/30 hover:bg-blue-900/30'
                              }`}
                            >
                              <div className="flex justify-between">
                                <h4 className="font-medium text-white">{message.sender}</h4>
                                <span className="text-xs text-blue-400">{message.time}</span>
                              </div>
                              <p className="text-sm text-blue-300 truncate">{message.content}</p>
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    </div>
                    
                    <div className="lg:col-span-2">
                      <Card className="bg-blue-900/20 border-blue-800/30 h-full flex flex-col">
                        <CardHeader>
                          <CardTitle className="text-lg text-white">Messages</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-grow space-y-4">
                          <div className="bg-blue-950/30 p-4 rounded-lg max-h-[400px] overflow-auto">
                            <div className="space-y-4">
                              <div className="flex justify-end">
                                <div className="bg-blue-700 text-white p-3 rounded-lg rounded-tr-none max-w-[80%]">
                                  <p className="text-sm">Bonjour, avez-vous reçu mon rapport sur les performances des créateurs?</p>
                                  <span className="text-xs text-blue-300 block text-right mt-1">10:15</span>
                                </div>
                              </div>
                              
                              <div className="flex">
                                <div className="bg-blue-950/50 text-white p-3 rounded-lg rounded-tl-none max-w-[80%]">
                                  <p className="text-sm">Oui, je l'ai bien reçu. J'ai besoin d'aide pour mon créateur qui ne respecte pas les heures.</p>
                                  <span className="text-xs text-blue-400 block mt-1">10:30</span>
                                </div>
                              </div>
                              
                              <div className="flex justify-end">
                                <div className="bg-blue-700 text-white p-3 rounded-lg rounded-tr-none max-w-[80%]">
                                  <p className="text-sm">Je comprends. Pouvez-vous me donner plus de détails sur ce créateur? Combien d'heures manque-t-il?</p>
                                  <span className="text-xs text-blue-300 block text-right mt-1">10:32</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex gap-2">
                            <Input
                              placeholder="Écrivez votre message..."
                              value={messageContent}
                              onChange={(e) => setMessageContent(e.target.value)}
                              className="bg-blue-950/30 border-blue-800/30 text-white placeholder:text-blue-400"
                            />
                            <Button 
                              className="bg-blue-700 hover:bg-blue-600"
                              onClick={handleSendMessage}
                            >
                              Envoyer
                              <ArrowRight className="h-4 w-4 ml-2" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                  
                  <Card className="bg-blue-900/20 border-blue-800/30">
                    <CardHeader>
                      <CardTitle className="text-lg text-white">Documents partagés</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[1, 2, 3].map(item => (
                          <div key={item} className="bg-blue-950/30 p-4 rounded-lg border border-blue-800/30">
                            <div className="flex items-start">
                              <FileText className="h-8 w-8 text-blue-400 mr-3" />
                              <div>
                                <h4 className="font-medium text-white">Rapport performances_{item}.pdf</h4>
                                <p className="text-xs text-blue-400 mt-1">Partagé il y a {item} jour{item > 1 ? 's' : ''}</p>
                              </div>
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="w-full mt-3 border-blue-800 text-blue-300 hover:bg-blue-800/30"
                            >
                              Télécharger
                              <ArrowUpRight className="h-4 w-4 ml-2" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </Card>
        </div>
      </UltraDashboard>
    </SidebarProvider>
  );
};

export default ManagerDashboard;
