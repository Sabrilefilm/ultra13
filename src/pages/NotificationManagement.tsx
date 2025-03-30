
import React, { useState } from "react";
import { useIndexAuth } from "@/hooks/use-index-auth";
import UltraSidebar from "@/components/layout/UltraSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  Bell, 
  Users, 
  MessageSquare, 
  Calendar, 
  Settings, 
  Plus, 
  Trash2, 
  Edit, 
  ChevronDown, 
  Search,
  Send
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

const NotificationManagement = () => {
  const { isAuthenticated, username, role, userId, handleLogout } = useIndexAuth();
  const [currentTab, setCurrentTab] = useState("templates");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  
  // Sample data - would be fetched from API in a real app
  const notificationTemplates = [
    { id: 1, name: "Bienvenue", content: "Bienvenue sur Ultra, {{name}}!", lastModified: "12/05/2023", type: "system" },
    { id: 2, name: "Rappel match", content: "Rappel: Votre match contre {{opponent}} commence demain à {{time}}.", lastModified: "15/06/2023", type: "event" },
    { id: 3, name: "Nouvelle récompense", content: "Félicitations {{name}}! Vous avez gagné {{diamonds}} diamants.", lastModified: "20/06/2023", type: "reward" },
    { id: 4, name: "Pénalité", content: "Attention {{name}}, une pénalité a été appliquée sur votre compte.", lastModified: "22/06/2023", type: "penalty" },
    { id: 5, name: "Nouvelle mission", content: "Une nouvelle mission est disponible: {{mission}}. Récompense: {{reward}}.", lastModified: "25/06/2023", type: "mission" }
  ];

  const filteredTemplates = notificationTemplates.filter(template => 
    template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateTemplate = () => {
    setIsDialogOpen(false);
    toast({
      title: "Succès",
      description: "Modèle de notification créé avec succès",
    });
  };

  const handleDeleteTemplate = (id: number) => {
    toast({
      title: "Succès",
      description: "Modèle de notification supprimé",
    });
  };

  if (!isAuthenticated || !["founder", "manager"].includes(role || "")) {
    window.location.href = '/';
    return null;
  }

  return (
    <SidebarProvider>
      <UltraSidebar
        username={username}
        role={role}
        userId={userId || ''} {/* Added userId prop */}
        onLogout={handleLogout}
        currentPage="notifications"
      >
        <div className="p-6 max-w-7xl mx-auto">
          <Card className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm border border-slate-700/50 rounded-xl shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-2xl font-bold flex items-center">
                <Bell className="mr-2 h-5 w-5 text-amber-400" />
                Gestion des Notifications
              </CardTitle>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Nouveau modèle
              </Button>
            </CardHeader>
            <CardContent>
              <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 mb-4">
                  <TabsTrigger value="templates">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Modèles
                  </TabsTrigger>
                  <TabsTrigger value="scheduled">
                    <Calendar className="h-4 w-4 mr-2" />
                    Programmées
                  </TabsTrigger>
                  <TabsTrigger value="users">
                    <Users className="h-4 w-4 mr-2" />
                    Utilisateurs
                  </TabsTrigger>
                  <TabsTrigger value="settings">
                    <Settings className="h-4 w-4 mr-2" />
                    Paramètres
                  </TabsTrigger>
                </TabsList>
                
                <div className="flex items-center space-x-2 my-4">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Rechercher..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-slate-800/40 border-slate-700/50"
                  />
                </div>
                
                <TabsContent value="templates">
                  <div className="rounded-md border border-slate-700/50 overflow-hidden">
                    <div className="bg-slate-800/60 px-4 py-3 grid grid-cols-12 gap-2 text-sm font-medium text-slate-300">
                      <div className="col-span-1">Type</div>
                      <div className="col-span-3">Nom</div>
                      <div className="col-span-6">Contenu</div>
                      <div className="col-span-1">Dernière modification</div>
                      <div className="col-span-1 text-right">Actions</div>
                    </div>
                    
                    {filteredTemplates.length === 0 ? (
                      <div className="py-12 text-center text-slate-400">
                        <Bell className="h-12 w-12 mx-auto mb-2 opacity-30" />
                        <p>Aucun modèle de notification trouvé</p>
                      </div>
                    ) : (
                      filteredTemplates.map(template => (
                        <div key={template.id} className="px-4 py-3 grid grid-cols-12 gap-2 border-t border-slate-800/60 hover:bg-slate-800/30 transition">
                          <div className="col-span-1">
                            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs 
                              ${template.type === 'system' ? 'bg-blue-900/20 text-blue-400' : 
                                template.type === 'event' ? 'bg-purple-900/20 text-purple-400' : 
                                template.type === 'reward' ? 'bg-amber-900/20 text-amber-400' :
                                template.type === 'penalty' ? 'bg-red-900/20 text-red-400' :
                                'bg-green-900/20 text-green-400'}`}>
                              {template.type}
                            </div>
                          </div>
                          <div className="col-span-3 font-medium">{template.name}</div>
                          <div className="col-span-6 text-slate-400 truncate">{template.content}</div>
                          <div className="col-span-1 text-slate-500 text-sm">{template.lastModified}</div>
                          <div className="col-span-1 text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <ChevronDown className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Modifier
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Send className="h-4 w-4 mr-2" />
                                  Envoyer
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => handleDeleteTemplate(template.id)} className="text-red-500">
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Supprimer
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="scheduled">
                  <div className="py-12 text-center text-slate-400">
                    <Calendar className="h-12 w-12 mx-auto mb-2 opacity-30" />
                    <p>Fonctionnalité en cours de développement</p>
                  </div>
                </TabsContent>
                
                <TabsContent value="users">
                  <div className="py-12 text-center text-slate-400">
                    <Users className="h-12 w-12 mx-auto mb-2 opacity-30" />
                    <p>Fonctionnalité en cours de développement</p>
                  </div>
                </TabsContent>
                
                <TabsContent value="settings">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-3">Préférences générales</h3>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <Checkbox id="auto-send" />
                          <label htmlFor="auto-send" className="text-sm">Envoi automatique des notifications programmées</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="save-draft" defaultChecked />
                          <label htmlFor="save-draft" className="text-sm">Sauvegarder automatiquement les brouillons</label>
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="text-lg font-medium mb-3">Canauxde notification</h3>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <Checkbox id="email" defaultChecked />
                          <label htmlFor="email" className="text-sm">Email</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="in-app" defaultChecked />
                          <label htmlFor="in-app" className="text-sm">Dans l'application</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="push" />
                          <label htmlFor="push" className="text-sm">Notifications push</label>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        {/* Create template dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[550px] bg-slate-800 border-slate-700">
            <DialogHeader>
              <DialogTitle>Créer un modèle de notification</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="template-name" className="text-sm font-medium">Nom du modèle</label>
                <Input id="template-name" placeholder="Nom du modèle..." />
              </div>
              <div className="space-y-2">
                <label htmlFor="template-type" className="text-sm font-medium">Type de notification</label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full justify-between">
                      Sélectionner un type
                      <ChevronDown className="h-4 w-4 ml-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-full">
                    <DropdownMenuItem>Système</DropdownMenuItem>
                    <DropdownMenuItem>Événement</DropdownMenuItem>
                    <DropdownMenuItem>Récompense</DropdownMenuItem>
                    <DropdownMenuItem>Pénalité</DropdownMenuItem>
                    <DropdownMenuItem>Mission</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="space-y-2">
                <label htmlFor="template-content" className="text-sm font-medium">Contenu</label>
                <textarea 
                  id="template-content" 
                  rows={5} 
                  placeholder="Contenu de la notification..."
                  className="w-full p-2 bg-slate-900 border border-slate-700 rounded-md text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent resize-none"
                ></textarea>
                <p className="text-xs text-slate-400">Utilisez {{variable}} pour les champs dynamiques (ex: {{name}}, {{diamonds}}).</p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Annuler</Button>
              <Button onClick={handleCreateTemplate}>Créer</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </UltraSidebar>
    </SidebarProvider>
  );
};

export default NotificationManagement;
