
import React, { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { UltraDashboard } from "@/components/dashboard/UltraDashboard";
import { useIndexAuth } from "@/hooks/use-index-auth";
import { usePlatformSettings } from "@/hooks/use-platform-settings";
import { useAccountManagement } from "@/hooks/use-account-management";
import { useInactivityTimer } from "@/hooks/use-inactivity-timer";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, BarChart3, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AgentAssignment } from "@/components/dashboard/AgentAssignment";

const TeamManagement = () => {
  const { toast } = useToast();
  const { isAuthenticated, username, role, userId, handleLogout } = useIndexAuth();
  const { platformSettings, handleUpdateSettings } = usePlatformSettings(role);
  const { handleCreateAccount } = useAccountManagement();
  const [activeTab, setActiveTab] = useState("members");
  
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

  if (!isAuthenticated) {
    window.location.href = '/';
    return null;
  }

  // Restrict access to authorized roles
  if (!['founder', 'manager', 'agent'].includes(role || '')) {
    window.location.href = '/';
    return null;
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <UltraDashboard
        username={username}
        role={role || ''}
        userId={userId || ''}
        onLogout={handleLogout}
        platformSettings={platformSettings}
        handleCreateAccount={handleCreateAccount}
        handleUpdateSettings={handleUpdateSettings}
        showWarning={showWarning}
        dismissWarning={dismissWarning}
        formattedTime={formattedTime}
        currentPage="team"
      />
      
      <div className="flex justify-center w-full p-6 md:ml-64">
        <div className="w-full max-w-6xl space-y-6">
          <Card className="bg-white dark:bg-slate-900 shadow-lg border-purple-100 dark:border-purple-900/30">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-white dark:from-purple-950/30 dark:to-slate-950">
              <div className="flex justify-between items-center">
                <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Users className="h-6 w-6 text-purple-500" />
                  Gestion d'Équipe
                </CardTitle>
                
                {(role === 'founder' || role === 'manager') && (
                  <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Ajouter un membre
                  </Button>
                )}
              </div>
              
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mt-4">
                <TabsList className="grid grid-cols-2 bg-purple-100 dark:bg-purple-900/30">
                  <TabsTrigger value="members" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                    <Users className="h-4 w-4 mr-2" />
                    Membres
                  </TabsTrigger>
                  <TabsTrigger value="performance" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Performance
                  </TabsTrigger>
                </TabsList>
              
                <TabsContent value="members" className="mt-4">
                  <ScrollArea className="h-[600px]">
                    <div className="p-6">
                      <div className="flex justify-center items-center h-64">
                        <div className="text-center">
                          <Users className="h-16 w-16 text-purple-300 dark:text-purple-800 mx-auto mb-4" />
                          <p className="text-gray-500 dark:text-gray-400">
                            Module des membres de l'équipe en cours de développement
                          </p>
                        </div>
                      </div>
                      
                      {role === 'founder' && (
                        <div className="mt-8">
                          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">Attribution d'agents aux managers</h3>
                          <AgentAssignment />
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </TabsContent>
                  
                <TabsContent value="performance" className="mt-4">
                  <ScrollArea className="h-[600px]">
                    <div className="p-6">
                      <div className="flex justify-center items-center h-64">
                        <div className="text-center">
                          <BarChart3 className="h-16 w-16 text-purple-300 dark:text-purple-800 mx-auto mb-4" />
                          <p className="text-gray-500 dark:text-gray-400">
                            Module de performance d'équipe en cours de développement
                          </p>
                        </div>
                      </div>
                    </div>
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            </CardHeader>
          </Card>
        </div>
      </div>
    </SidebarProvider>
  );
}

export default TeamManagement;
