
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { UltraDashboard } from "@/components/dashboard/UltraDashboard";
import { useIndexAuth } from "@/hooks/use-index-auth";
import { usePlatformSettings } from "@/hooks/use-platform-settings";
import { useAccountManagement } from "@/hooks/use-account-management";
import { useInactivityTimer } from "@/hooks/use-inactivity-timer";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { 
  Play, Youtube, Book, Lightbulb, CheckCircle, VideoIcon, 
  ListChecks, PlusCircle, X, Pencil, Save, BookOpen, ArrowLeft
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { TRAINING_TYPES } from "@/components/live-schedule/constants";
import { useIsMobile } from "@/hooks/use-mobile";

// Type définition pour une formation
interface Training {
  id: string;
  title: string;
  description: string;
  video_url: string;
  type: string;
  created_at: string;
  order_index: number;
}

const Training = () => {
  const { toast: toastHook } = useToast();
  const { isAuthenticated, username, role, userId, handleLogout } = useIndexAuth();
  const { platformSettings, handleUpdateSettings } = usePlatformSettings(role);
  const { handleCreateAccount } = useAccountManagement();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  // États pour les formations
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [selectedType, setSelectedType] = useState("app");
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedTraining, setSelectedTraining] = useState<Training | null>(null);
  
  // États pour le formulaire
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [trainingType, setTrainingType] = useState("app");
  
  // Inactivity timer for automatic logout
  const { showWarning, dismissWarning, formattedTime } = useInactivityTimer({
    timeout: 120000, // 2 minutes
    onTimeout: () => {
      handleLogout();
      toastHook({
        title: "Déconnexion automatique",
        description: "Vous avez été déconnecté en raison d'inactivité.",
      });
    },
    warningTime: 30000, 
    onWarning: () => {}
  });
  
  // Charger les formations
  useEffect(() => {
    if (!isAuthenticated) {
      window.location.href = '/';
      return;
    }
    
    fetchTrainings();
  }, [isAuthenticated, selectedType]);
  
  // Fonction pour récupérer les formations depuis Supabase
  const fetchTrainings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('trainings')
        .select('*')
        .eq('type', selectedType)
        .order('order_index', { ascending: true });
      
      if (error) {
        throw error;
      }
      
      setTrainings(data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des formations:', error);
      toast.error('Erreur lors du chargement des formations');
    } finally {
      setLoading(false);
    }
  };
  
  // Fonction pour extraire l'ID de la vidéo YouTube
  const getYoutubeVideoId = (url: string) => {
    if (!url) return null;
    
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    
    return (match && match[2].length === 11)
      ? match[2]
      : null;
  };
  
  // Ajouter une nouvelle formation
  const handleAddTraining = async () => {
    if (!title || !videoUrl) {
      toast.warning('Veuillez remplir tous les champs obligatoires');
      return;
    }
    
    try {
      // Vérifier que l'URL est valide pour YouTube
      const videoId = getYoutubeVideoId(videoUrl);
      if (!videoId) {
        toast.error('URL YouTube invalide');
        return;
      }
      
      // Déterminer l'ordre d'index (dernier + 1)
      const maxOrderIndex = trainings.length > 0 
        ? Math.max(...trainings.map(t => t.order_index || 0)) 
        : 0;
      
      const { data, error } = await supabase
        .from('trainings')
        .insert([
          {
            title,
            description,
            video_url: videoUrl,
            type: trainingType,
            order_index: maxOrderIndex + 1
          }
        ])
        .select();
      
      if (error) {
        throw error;
      }
      
      toast.success('Formation ajoutée avec succès');
      fetchTrainings();
      resetForm();
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la formation:', error);
      toast.error('Erreur lors de l\'ajout de la formation');
    }
  };
  
  // Mettre à jour une formation
  const handleUpdateTraining = async () => {
    if (!selectedTraining || !title || !videoUrl) {
      toast.warning('Veuillez remplir tous les champs obligatoires');
      return;
    }
    
    try {
      // Vérifier que l'URL est valide pour YouTube
      const videoId = getYoutubeVideoId(videoUrl);
      if (!videoId) {
        toast.error('URL YouTube invalide');
        return;
      }
      
      const { error } = await supabase
        .from('trainings')
        .update({
          title,
          description,
          video_url: videoUrl
        })
        .eq('id', selectedTraining.id);
      
      if (error) {
        throw error;
      }
      
      toast.success('Formation mise à jour avec succès');
      fetchTrainings();
      resetForm();
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la formation:', error);
      toast.error('Erreur lors de la mise à jour de la formation');
    }
  };
  
  // Supprimer une formation
  const handleDeleteTraining = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette formation ?')) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('trainings')
        .delete()
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      toast.success('Formation supprimée avec succès');
      fetchTrainings();
    } catch (error) {
      console.error('Erreur lors de la suppression de la formation:', error);
      toast.error('Erreur lors de la suppression de la formation');
    }
  };
  
  // Réinitialiser le formulaire
  const resetForm = () => {
    setTitle("");
    setDescription("");
    setVideoUrl("");
    setTrainingType(selectedType);
    setSelectedTraining(null);
  };
  
  // Ouvrir le formulaire d'édition
  const openEditDialog = (training: Training) => {
    setSelectedTraining(training);
    setTitle(training.title);
    setDescription(training.description || "");
    setVideoUrl(training.video_url);
    setTrainingType(training.type);
    setIsEditDialogOpen(true);
  };
  
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
        currentPage="training"
      />
      
      <div className="p-4 md:p-6 md:ml-64 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
          <div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/")}
              className="mb-2"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour au tableau de bord
            </Button>
            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
              Nos Formations
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Apprenez à utiliser la plateforme et à développer votre présence en ligne
            </p>
          </div>
          
          {role === 'founder' && (
            <Button 
              onClick={() => {
                resetForm();
                setTrainingType(selectedType);
                setIsAddDialogOpen(true);
              }}
              className="bg-purple-600 hover:bg-purple-700 flex items-center gap-2"
            >
              <PlusCircle className="h-4 w-4" />
              Ajouter une formation
            </Button>
          )}
        </div>
        
        <Card className="bg-white dark:bg-slate-900 shadow-lg border-purple-100 dark:border-purple-900/30">
          <CardHeader className="pb-2">
            <CardTitle>Centre de formation</CardTitle>
            <CardDescription>
              Explorez nos formations pour développer vos compétences
            </CardDescription>
          </CardHeader>
          
          <Tabs defaultValue="app" value={selectedType} onValueChange={setSelectedType}>
            <div className="px-6">
              <TabsList className="grid grid-cols-2 md:grid-cols-5 mb-4 w-full">
                <TabsTrigger value="app" className="flex items-center gap-2">
                  <Book className="h-4 w-4" />
                  <span className={isMobile ? "hidden" : ""}>Application</span>
                </TabsTrigger>
                <TabsTrigger value="live" className="flex items-center gap-2">
                  <Play className="h-4 w-4" />
                  <span className={isMobile ? "hidden" : ""}>Techniques de live</span>
                </TabsTrigger>
                <TabsTrigger value="content" className="flex items-center gap-2">
                  <VideoIcon className="h-4 w-4" />
                  <span className={isMobile ? "hidden" : ""}>Création de contenu</span>
                </TabsTrigger>
                <TabsTrigger value="growth" className="flex items-center gap-2">
                  <Lightbulb className="h-4 w-4" />
                  <span className={isMobile ? "hidden" : ""}>Croissance</span>
                </TabsTrigger>
                <TabsTrigger value="monetization" className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  <span className={isMobile ? "hidden" : ""}>Monétisation</span>
                </TabsTrigger>
              </TabsList>
            </div>
            
            {Object.keys(TRAINING_TYPES).map((type) => (
              <TabsContent key={type} value={type} className="pt-2">
                <CardContent>
                  {loading ? (
                    <div className="flex justify-center py-12">
                      <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                    </div>
                  ) : trainings.length === 0 ? (
                    <div className="text-center py-12">
                      <BookOpen className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400">
                        Aucune formation disponible
                      </h3>
                      {role === 'founder' && (
                        <Button 
                          onClick={() => {
                            resetForm();
                            setTrainingType(type);
                            setIsAddDialogOpen(true);
                          }}
                          className="mt-4"
                        >
                          Ajouter une formation
                        </Button>
                      )}
                    </div>
                  ) : (
                    <ScrollArea className="h-[calc(100vh-340px)] min-h-[400px] pr-4">
                      <div className="grid grid-cols-1 gap-6">
                        {trainings.map((training) => (
                          <Card 
                            key={training.id} 
                            className="overflow-hidden border border-gray-200 dark:border-gray-700"
                          >
                            <div className="aspect-video bg-gray-100 dark:bg-gray-800">
                              <iframe
                                width="100%"
                                height="100%"
                                src={`https://www.youtube.com/embed/${getYoutubeVideoId(training.video_url)}`}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                title={training.title}
                              ></iframe>
                            </div>
                            <CardContent className="pt-4">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="text-lg font-semibold mb-2">
                                    {training.title}
                                  </h3>
                                  {training.description && (
                                    <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
                                      {training.description}
                                    </p>
                                  )}
                                </div>
                                
                                {role === 'founder' && (
                                  <div className="flex gap-2">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => openEditDialog(training)}
                                    >
                                      <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="text-red-500 hover:text-red-600"
                                      onClick={() => handleDeleteTraining(training.id)}
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </div>
                                )}
                              </div>
                              
                              <div className="mt-2 pt-2 border-t border-dashed border-gray-200 dark:border-gray-700">
                                <a 
                                  href={training.video_url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-blue-500 hover:underline text-sm flex items-center gap-1"
                                >
                                  <Youtube className="h-4 w-4" />
                                  Voir sur YouTube
                                </a>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </ScrollArea>
                  )}
                </CardContent>
              </TabsContent>
            ))}
          </Tabs>
        </Card>
        
        {/* Dialogue pour ajouter une formation */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Ajouter une formation</DialogTitle>
              <DialogDescription>
                Créez une nouvelle formation avec contenu vidéo YouTube
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Titre*</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Le titre de la formation"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Une description courte (optionnelle)"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="video_url">URL YouTube*</Label>
                <Input
                  id="video_url"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                />
                <p className="text-xs text-gray-500">Format: URL YouTube standard ou embed</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="type">Catégorie</Label>
                <select
                  id="type"
                  value={trainingType}
                  onChange={(e) => setTrainingType(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  {Object.entries(TRAINING_TYPES).map(([key, value]) => (
                    <option key={key} value={key}>
                      {value}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Annuler
              </Button>
              <Button onClick={handleAddTraining}>
                Ajouter
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Dialogue pour modifier une formation */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Modifier la formation</DialogTitle>
              <DialogDescription>
                Mettez à jour les informations de la formation
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Titre*</Label>
                <Input
                  id="edit-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Input
                  id="edit-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-video_url">URL YouTube*</Label>
                <Input
                  id="edit-video_url"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Annuler
              </Button>
              <Button onClick={handleUpdateTraining}>
                Enregistrer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
      </div>
    </SidebarProvider>
  );
};

export default Training;
