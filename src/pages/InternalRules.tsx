
import React from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { UltraDashboard } from "@/components/dashboard/UltraDashboard";
import { useIndexAuth } from "@/hooks/use-index-auth";
import { usePlatformSettings } from "@/hooks/use-platform-settings";
import { useAccountManagement } from "@/hooks/use-account-management";
import { useInactivityTimer } from "@/hooks/use-inactivity-timer";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, Shield, UserCheck } from "lucide-react";

const InternalRules = () => {
  const { toast } = useToast();
  const { isAuthenticated, username, role, userId, handleLogout } = useIndexAuth();
  const { platformSettings, handleUpdateSettings } = usePlatformSettings(role);
  const { handleCreateAccount } = useAccountManagement();
  
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
        currentPage="internal-rules"
      />
      
      <div className="p-6 md:ml-64 space-y-6">
        <Card className="bg-white dark:bg-slate-900 shadow-lg border-purple-100 dark:border-purple-900/30">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-white dark:from-purple-950/30 dark:to-slate-950">
            <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Shield className="h-6 w-6 text-purple-500" />
              Règlement Interne Ultra
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <Tabs defaultValue="general" className="w-full">
              <TabsList className="grid grid-cols-3 mb-6 bg-purple-100 dark:bg-purple-900/30">
                <TabsTrigger value="general" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                  Règles Générales
                </TabsTrigger>
                <TabsTrigger value="creators" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                  Créateurs
                </TabsTrigger>
                <TabsTrigger value="staff" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                  Staff
                </TabsTrigger>
              </TabsList>
              
              <ScrollArea className="h-[600px] rounded-md border border-purple-100 dark:border-purple-900/30 p-4">
                <TabsContent value="general" className="space-y-4">
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-purple-700 dark:text-purple-300 border-b border-purple-100 dark:border-purple-800 pb-2">Règles Générales pour Tous les Membres</h3>
                    
                    <div className="space-y-4">
                      <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border-l-4 border-purple-500">
                        <h4 className="font-medium mb-2 text-purple-800 dark:text-purple-200">1. Respect Mutuel</h4>
                        <p className="text-gray-700 dark:text-gray-300">Tous les membres de l'agence Ultra doivent se traiter avec respect, indépendamment de leur rôle ou de leur statut.</p>
                      </div>
                      
                      <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border-l-4 border-purple-500">
                        <h4 className="font-medium mb-2 text-purple-800 dark:text-purple-200">2. Communication</h4>
                        <p className="text-gray-700 dark:text-gray-300">La communication doit rester professionnelle et constructive dans tous les canaux officiels.</p>
                      </div>
                      
                      <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border-l-4 border-purple-500">
                        <h4 className="font-medium mb-2 text-purple-800 dark:text-purple-200">3. Confidentialité</h4>
                        <p className="text-gray-700 dark:text-gray-300">Les informations internes de l'agence ne doivent pas être partagées avec des personnes extérieures.</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="creators" className="space-y-4">
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-purple-700 dark:text-purple-300 border-b border-purple-100 dark:border-purple-800 pb-2">Règles pour les Créateurs</h3>
                    
                    <div className="space-y-4">
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border-l-4 border-blue-500">
                        <h4 className="font-medium mb-2 text-blue-800 dark:text-blue-200">1. Horaires de Live</h4>
                        <p className="text-gray-700 dark:text-gray-300">Les créateurs doivent respecter leurs horaires de live programmés et signaler tout changement au moins 24h à l'avance.</p>
                      </div>
                      
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border-l-4 border-blue-500">
                        <h4 className="font-medium mb-2 text-blue-800 dark:text-blue-200">2. Contenu</h4>
                        <p className="text-gray-700 dark:text-gray-300">Le contenu doit être approprié et conforme aux règles de la plateforme TikTok.</p>
                      </div>
                      
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border-l-4 border-blue-500">
                        <h4 className="font-medium mb-2 text-blue-800 dark:text-blue-200">3. Matchs</h4>
                        <p className="text-gray-700 dark:text-gray-300">Les créateurs doivent participer aux matchs programmés par leur agent. En cas d'impossibilité, ils doivent en informer leur agent au moins 48h à l'avance.</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="staff" className="space-y-4">
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-purple-700 dark:text-purple-300 border-b border-purple-100 dark:border-purple-800 pb-2">Règles pour le Staff (Agents et Managers)</h3>
                    
                    <div className="space-y-4">
                      <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border-l-4 border-green-500">
                        <h4 className="font-medium mb-2 text-green-800 dark:text-green-200">1. Encadrement</h4>
                        <p className="text-gray-700 dark:text-gray-300">Les agents doivent assurer un suivi régulier de leurs créateurs et les accompagner dans leur progression.</p>
                      </div>
                      
                      <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border-l-4 border-green-500">
                        <h4 className="font-medium mb-2 text-green-800 dark:text-green-200">2. Organisation</h4>
                        <p className="text-gray-700 dark:text-gray-300">Les matchs doivent être planifiés au moins une semaine à l'avance et correctement communiqués aux créateurs concernés.</p>
                      </div>
                      
                      <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border-l-4 border-green-500">
                        <h4 className="font-medium mb-2 text-green-800 dark:text-green-200">3. Rapports</h4>
                        <p className="text-gray-700 dark:text-gray-300">Les agents doivent soumettre un rapport hebdomadaire sur les performances de leurs créateurs et les activités réalisées.</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </ScrollArea>
            </Tabs>
          </CardContent>
        </Card>
        
        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
          <p>Le règlement interne est sujet à modification. Dernière mise à jour: {new Date().toLocaleDateString('fr-FR')}</p>
        </div>
      </div>
    </SidebarProvider>
  );
}

export default InternalRules;
