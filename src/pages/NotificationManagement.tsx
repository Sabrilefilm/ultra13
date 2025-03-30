
import React, { useState } from "react";
import { useIndexAuth } from "@/hooks/use-index-auth";
import UltraSidebar from "@/components/layout/UltraSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, Send } from "lucide-react";
import { toast } from "sonner";

const NotificationManagement = () => {
  const { isAuthenticated, username, role, userId, handleLogout } = useIndexAuth();
  const [message, setMessage] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(false);

  if (!isAuthenticated || !["founder", "manager"].includes(role || "")) {
    window.location.href = '/';
    return null;
  }

  const handleSendNotification = async () => {
    if (!message.trim()) {
      toast.error("Le message ne peut pas être vide");
      return;
    }

    setIsLoading(true);

    try {
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success(`Notification envoyée avec succès aux utilisateurs ${selectedRole}`);
      setMessage("");
    } catch (error) {
      toast.error("Erreur lors de l'envoi de la notification");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SidebarProvider>
      <UltraSidebar
        username={username}
        role={role}
        userId={userId || ''}
        onLogout={handleLogout}
        currentPage="notifications"
      >
        <div className="p-6 max-w-4xl mx-auto">
          <Card className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm border border-slate-700/50 rounded-xl shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                <Bell className="h-6 w-6 text-indigo-400" />
                Gestion des Notifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="send">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="send">Envoyer une notification</TabsTrigger>
                  <TabsTrigger value="history">Historique</TabsTrigger>
                </TabsList>
                
                <TabsContent value="send" className="space-y-4">
                  <div className="grid gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">
                        Destinataires
                      </label>
                      <select 
                        className="w-full bg-slate-800 border border-slate-700 text-white p-2 rounded-md focus:ring-2 focus:ring-indigo-500"
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value)}
                      >
                        <option value="all">Tous les utilisateurs</option>
                        <option value="creator">Créateurs</option>
                        <option value="agent">Agents</option>
                        <option value="ambassadeur">Ambassadeurs</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-1 block">
                        Message
                      </label>
                      <textarea 
                        className="w-full bg-slate-800 border border-slate-700 text-white p-2 rounded-md min-h-[120px] focus:ring-2 focus:ring-indigo-500"
                        placeholder="Tapez votre message ici..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                      />
                    </div>
                    
                    <Button 
                      className="w-full bg-indigo-600 hover:bg-indigo-700 mt-2"
                      onClick={handleSendNotification}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
                          Envoi en cours...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Envoyer la notification
                        </>
                      )}
                    </Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="history">
                  <div className="bg-slate-800/50 border border-slate-700/50 p-6 rounded-lg text-center">
                    <p className="text-slate-400">L'historique des notifications sera disponible prochainement.</p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </UltraSidebar>
    </SidebarProvider>
  );
};

export default NotificationManagement;
