
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
import { Progress } from "@/components/ui/progress";
import { 
  Play, Youtube, Book, Lightbulb, CheckCircle, VideoIcon, 
  ListChecks, PlusCircle, X, Pencil, Save, BookOpen, ArrowLeft
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { TRAINING_TYPES } from "@/components/live-schedule/constants";
import { useIsMobile } from "@/hooks/use-mobile";
import { Footer } from "@/components/layout/Footer";
import { getYoutubeVideoId } from "@/utils/videoHelpers";
import { SocialCommunityLinks } from "@/components/layout/SocialCommunityLinks";
import { motion } from "framer-motion";
import { YoutubePlayer } from "@/components/ui/youtube-player";

interface Training {
  id: string;
  title: string;
  description: string;
  video_url: string;
  type: string;
  created_at: string;
  order_index: number;
}

interface WatchedVideo {
  id: string;
  user_id: string;
  training_id: string;
  watched_at: string;
  progress: number;
}

const Training = () => {
  const { toast: toastHook } = useToast();
  const { isAuthenticated, username, role, userId, handleLogout } = useIndexAuth();
  const { platformSettings, handleUpdateSettings } = usePlatformSettings(role);
  const { handleCreateAccount } = useAccountManagement();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [selectedType, setSelectedType] = useState("app");
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedTraining, setSelectedTraining] = useState<Training | null>(null);
  const [watchedVideos, setWatchedVideos] = useState<WatchedVideo[]>([]);
  const [isWatching, setIsWatching] = useState(false);
  const [currentVideo, setCurrentVideo] = useState<Training | null>(null);
  const [featuredVideo, setFeaturedVideo] = useState<Training | null>(null);
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [trainingType, setTrainingType] = useState("app");
  const [catalogName, setCatalogName] = useState("");
  const [isAddCatalogOpen, setIsAddCatalogOpen] = useState(false);
  
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
  
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        ease: "easeOut" 
      }
    }
  };
  
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  useEffect(() => {
    if (!isAuthenticated) {
      window.location.href = '/';
      return;
    }
    
    fetchTrainings();
    if (userId) {
      fetchWatchedVideos();
    }
  }, [isAuthenticated, selectedType, userId]);
  
  useEffect(() => {
    // Set a featured video for the header section
    if (trainings.length > 0 && !featuredVideo) {
      // Get the first unwatched video, or the first video if all are watched
      const unwatchedVideos = trainings.filter(
        training => !watchedVideos.some(wv => wv.training_id === training.id && wv.progress === 100)
      );
      
      setFeaturedVideo(unwatchedVideos.length > 0 ? unwatchedVideos[0] : trainings[0]);
    }
  }, [trainings, watchedVideos, featuredVideo]);
  
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
  
  const fetchWatchedVideos = async () => {
    try {
      const { error: tableError } = await supabase
        .from('watched_videos')
        .select('id')
        .limit(1)
        .single();
        
      if (tableError && tableError.code === '42P01') {
        console.log('La table watched_videos n\'existe pas encore, elle sera créée ultérieurement');
        return;
      }
      
      const { data, error } = await supabase
        .from('watched_videos')
        .select('*')
        .eq('user_id', userId);
      
      if (error) {
        console.error('Erreur lors du chargement des vidéos visionnées:', error);
        return;
      }
      
      setWatchedVideos(data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des vidéos visionnées:', error);
    }
  };
  
  const markVideoAsWatched = async (trainingId: string) => {
    if (!userId) return;
    
    try {
      const existingWatch = watchedVideos.find(
        (wv) => wv.training_id === trainingId && wv.user_id === userId
      );
      
      if (existingWatch) {
        const { error } = await supabase
          .from('watched_videos')
          .update({ progress: 100 })
          .eq('id', existingWatch.id);
          
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('watched_videos')
          .insert([
            {
              user_id: userId,
              training_id: trainingId,
              progress: 100,
              watched_at: new Date().toISOString()
            }
          ]);
          
        if (error) throw error;
      }
      
      fetchWatchedVideos();
      toast.success('Vidéo marquée comme visionnée');
    } catch (error) {
      console.error('Erreur lors du marquage de la vidéo:', error);
      toast.error('Erreur lors du marquage de la vidéo');
    }
  };
  
  const generateWatermarkGrid = () => {
    let watermarkDivs = [];
    const rows = 15;
    const cols = 15;
    
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        watermarkDivs.push(
          <div 
            key={`${i}-${j}`} 
            className="absolute text-slate-200/10 text-[8px] font-bold whitespace-nowrap rotate-[-30deg]"
            style={{
              top: `${(i * 100) / rows}%`,
              left: `${(j * 100) / cols}%`,
              transform: 'translate(-50%, -50%) rotate(-30deg)'
            }}
          >
            {username?.toUpperCase()}
          </div>
        );
      }
    }
    
    return watermarkDivs;
  };
  
  const calculateCategoryProgress = (type: string) => {
    const categoryVideos = trainings.filter(t => t.type === type);
    if (categoryVideos.length === 0) return 0;
    
    const watchedCount = categoryVideos.filter(training => 
      watchedVideos.some(wv => wv.training_id === training.id && wv.progress === 100)
    ).length;
    
    return Math.round((watchedCount / categoryVideos.length) * 100);
  };
  
  const isVideoWatched = (trainingId: string) => {
    return watchedVideos.some(wv => wv.training_id === trainingId && wv.progress === 100);
  };
  
  const handleAddTraining = async () => {
    if (!title || !videoUrl) {
      toast.warning('Veuillez remplir tous les champs obligatoires');
      return;
    }
    
    try {
      const videoId = getYoutubeVideoId(videoUrl);
      if (!videoId) {
        toast.error('URL YouTube invalide');
        return;
      }
      
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
  
  const handleUpdateTraining = async () => {
    if (!selectedTraining || !title || !videoUrl) {
      toast.warning('Veuillez remplir tous les champs obligatoires');
      return;
    }
    
    try {
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
  
  const handleAddCatalog = async () => {
    if (!catalogName) {
      toast.warning('Veuillez entrer un nom pour le catalogue');
      return;
    }
    
    try {
      if (Object.values(TRAINING_TYPES).includes(catalogName)) {
        toast.error('Ce catalogue existe déjà');
        return;
      }
      
      toast.success('Catalogue ajouté avec succès');
      setCatalogName("");
      setIsAddCatalogOpen(false);
      
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error('Erreur lors de l\'ajout du catalogue:', error);
      toast.error('Erreur lors de l\'ajout du catalogue');
    }
  };
  
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
  
  const resetForm = () => {
    setTitle("");
    setDescription("");
    setVideoUrl("");
    setTrainingType(selectedType);
    setSelectedTraining(null);
  };
  
  const openEditDialog = (training: Training) => {
    setSelectedTraining(training);
    setTitle(training.title);
    setDescription(training.description || "");
    setVideoUrl(training.video_url);
    setTrainingType(training.type);
    setIsEditDialogOpen(true);
  };
  
  const openVideoViewer = (training: Training) => {
    setCurrentVideo(training);
    setIsWatching(true);
  };
  
  const closeVideoViewer = (markAsWatched = false) => {
    if (markAsWatched && currentVideo) {
      markVideoAsWatched(currentVideo.id);
    }
    setIsWatching(false);
    setCurrentVideo(null);
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
      
      <div className="fixed inset-0 pointer-events-none select-none z-0 overflow-hidden">
        {generateWatermarkGrid()}
      </div>
      
      <div className="p-4 md:p-6 md:ml-64 max-w-7xl mx-auto">
        <motion.div 
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 bg-gradient-to-r from-purple-900/10 to-indigo-900/10 p-4 rounded-xl border border-purple-900/20"
        >
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
              Centre de Formations
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Apprenez à utiliser la plateforme et à développer votre présence en ligne
            </p>
          </div>
          
          <div className="flex gap-2">
            {role === 'founder' && (
              <>
                <Button 
                  onClick={() => setIsAddCatalogOpen(true)}
                  variant="outline" 
                  className="flex items-center gap-2"
                >
                  <PlusCircle className="h-4 w-4" />
                  Ajouter un catalogue
                </Button>
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
              </>
            )}
          </div>
        </motion.div>
        
        {/* Featured Video Section */}
        <motion.div
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              {featuredVideo ? (
                <YoutubePlayer 
                  videoUrl={featuredVideo.video_url} 
                  title={featuredVideo.title}
                  description={featuredVideo.description}
                  onComplete={() => markVideoAsWatched(featuredVideo.id)}
                />
              ) : (
                <Card className="aspect-video flex items-center justify-center">
                  <CardContent className="p-6 text-center">
                    <BookOpen className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400">
                      Aucune formation disponible
                    </h3>
                  </CardContent>
                </Card>
              )}
            </div>
            
            <div>
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    Votre progression
                  </CardTitle>
                  <CardDescription>
                    Suivez votre progression dans les différents catalogues
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <motion.div 
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                    className="space-y-4"
                  >
                    {Object.entries(TRAINING_TYPES).map(([type, label], index) => (
                      <motion.div 
                        key={type} 
                        variants={fadeIn}
                        custom={index}
                        className="space-y-2"
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">{label}</span>
                          <span className="text-sm font-bold">{calculateCategoryProgress(type)}%</span>
                        </div>
                        <Progress value={calculateCategoryProgress(type)} className="h-2" />
                      </motion.div>
                    ))}
                  </motion.div>
                  
                  <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-800">
                    <h4 className="text-sm font-medium mb-2">Formations récentes</h4>
                    <div className="space-y-2">
                      {watchedVideos.slice(0, 3).map((watchedVideo) => {
                        const training = trainings.find(t => t.id === watchedVideo.training_id);
                        if (!training) return null;
                        
                        return (
                          <div 
                            key={watchedVideo.id}
                            className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                            onClick={() => openVideoViewer(training)}
                          >
                            <div className="relative flex-shrink-0 w-10 h-10 rounded overflow-hidden">
                              <img 
                                src={`https://img.youtube.com/vi/${getYoutubeVideoId(training.video_url)}/mqdefault.jpg`} 
                                alt={training.title}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                <Play className="h-4 w-4 text-white" />
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{training.title}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {new Date(watchedVideo.watched_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
        
        <motion.div
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-white dark:bg-slate-900 shadow-lg border-purple-100 dark:border-purple-900/30 mb-8">
            <CardHeader className="pb-2">
              <CardTitle>Catalogue de formations</CardTitle>
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
                      <ScrollArea className="h-[400px] pr-4">
                        <motion.div
                          variants={staggerContainer}
                          initial="hidden"
                          animate="visible"
                          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        >
                          {trainings.map((training, index) => (
                            <motion.div
                              key={training.id}
                              variants={fadeIn}
                              custom={index}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <Card 
                                className={`overflow-hidden border ${
                                  isVideoWatched(training.id) 
                                    ? "border-green-300 dark:border-green-700" 
                                    : "border-gray-200 dark:border-gray-700"
                                } transition-all hover:shadow-md`}
                              >
                                <div 
                                  className="aspect-video bg-gray-100 dark:bg-gray-800 relative cursor-pointer group"
                                  onClick={() => openVideoViewer(training)}
                                >
                                  <img 
                                    src={`https://img.youtube.com/vi/${getYoutubeVideoId(training.video_url)}/mqdefault.jpg`}
                                    alt={training.title}
                                    className="w-full h-full object-cover"
                                  />
                                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <motion.div
                                      whileHover={{ scale: 1.2, rotate: 5 }}
                                      transition={{ duration: 0.2 }}
                                    >
                                      <Play className="h-16 w-16 text-white" />
                                    </motion.div>
                                  </div>
                                  {isVideoWatched(training.id) && (
                                    <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                                      Visionné
                                    </div>
                                  )}
                                </div>
                                <CardContent className="pt-4">
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <h3 className="text-lg font-semibold mb-2">
                                        {training.title}
                                      </h3>
                                      {training.description && (
                                        <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                                          {training.description}
                                        </p>
                                      )}
                                    </div>
                                    
                                    {role === 'founder' && (
                                      <div className="flex gap-2">
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            openEditDialog(training);
                                          }}
                                        >
                                          <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          className="text-red-500 hover:text-red-600"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteTraining(training.id);
                                          }}
                                        >
                                          <X className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    )}
                                  </div>
                                  
                                  <div className="mt-2 pt-2 border-t border-dashed border-gray-200 dark:border-gray-700 flex justify-between items-center">
                                    <a 
                                      href={training.video_url} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="text-blue-500 hover:underline text-sm flex items-center gap-1"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <Youtube className="h-4 w-4" />
                                      Voir sur YouTube
                                    </a>
                                    
                                    <Button 
                                      size="sm" 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        openVideoViewer(training);
                                      }}
                                      className="bg-purple-600 hover:bg-purple-700"
                                    >
                                      Visionner
                                    </Button>
                                  </div>
                                </CardContent>
                              </Card>
                            </motion.div>
                          ))}
                        </motion.div>
                      </ScrollArea>
                    )}
                  </CardContent>
                </TabsContent>
              ))}
            </Tabs>
          </Card>
        </motion.div>
        
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
                <Label htmlFor="type">Catalogue</Label>
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
        
        <Dialog open={isAddCatalogOpen} onOpenChange={setIsAddCatalogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Ajouter un catalogue</DialogTitle>
              <DialogDescription>
                Créez un nouveau catalogue de formations
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="catalog-name">Nom du catalogue*</Label>
                <Input
                  id="catalog-name"
                  value={catalogName}
                  onChange={(e) => setCatalogName(e.target.value)}
                  placeholder="Ex: Édition Vidéo"
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddCatalogOpen(false)}>
                Annuler
              </Button>
              <Button onClick={handleAddCatalog}>
                Créer le catalogue
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        <Dialog open={isWatching} onOpenChange={(open) => !open && closeVideoViewer()}>
          <DialogContent className="sm:max-w-5xl h-[80vh] flex flex-col p-0">
            {currentVideo && (
              <YoutubePlayer 
                videoUrl={currentVideo.video_url}
                title={currentVideo.title}
                description={currentVideo.description || ""}
                autoplay={true}
                onComplete={() => closeVideoViewer(true)}
                className="h-full flex flex-col"
              />
            )}
          </DialogContent>
        </Dialog>
        
        <Footer className="mt-10" />
      </div>
    </SidebarProvider>
  );
};

export default Training;
