
import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { UltraDashboard } from "@/components/dashboard/UltraDashboard";
import { useInactivityTimer } from "@/hooks/use-inactivity-timer";
import { usePlatformSettings } from "@/hooks/use-platform-settings";
import { useIndexAuth } from "@/hooks/use-index-auth";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardFooter,
  CardDescription 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { 
  PlayCircle, 
  Clock, 
  BookOpen, 
  Camera, 
  Video, 
  BellRing, 
  Lightbulb,
  Instagram,
  TwitchIcon,
  YoutubeIcon,
  MessageCircle,
  UserPlus,
  Settings,
  Heart,
  ChevronRight,
  PanelRight
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { RedesignedDashContent } from "@/components/dashboard/RedesignedDashContent";

interface Training {
  id: string;
  title: string;
  description: string | null;
  video_url: string;
  type: string;
  order_index: number;
  created_at: string;
}

const Training = () => {
  // User authentication and session management
  const { username, role, userId, handleLogout } = useIndexAuth();
  const { platformSettings } = usePlatformSettings(role);
  const { toast } = useToast();
  
  // State for trainings and UI interactions
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeVideoUrl, setActiveVideoUrl] = useState<string | null>(null);
  const [activeVideoTitle, setActiveVideoTitle] = useState<string>("");
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [communityDialogOpen, setCommunityDialogOpen] = useState(false);
  const [equipmentDialogOpen, setEquipmentDialogOpen] = useState(false);
  const [toolsDialogOpen, setToolsDialogOpen] = useState(false);
  
  // Configure inactivity timer with the correct prop structure
  const { showWarning, dismissWarning, formattedTime } = useInactivityTimer({
    timeout: 120000, // 2 minutes
    onTimeout: () => {
      handleLogout();
      toast({
        title: "Déconnexion automatique",
        description: "Vous avez été déconnecté en raison d'inactivité.",
      });
    },
    warningTime: 30000, // Afficher l'avertissement 30 secondes avant
  });

  // Fetch trainings from the database
  useEffect(() => {
    const fetchTrainings = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('trainings')
          .select('*')
          .order('order_index', { ascending: true });
        
        if (error) throw error;
        setTrainings(data || []);
      } catch (error) {
        console.error('Error fetching trainings:', error);
        toast({
          title: 'Erreur',
          description: 'Impossible de charger les formations',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchTrainings();
  }, []);

  // Handle create account function that returns a Promise
  const handleCreateAccount = async (role: 'creator' | 'manager' | 'agent', username: string, password: string) => {
    // This is a placeholder function to match the expected signature
    return Promise.resolve();
  };

  // Open the video modal
  const handleOpenVideo = (url: string, title: string) => {
    setActiveVideoUrl(url);
    setActiveVideoTitle(title);
    setIsVideoModalOpen(true);
  };

  // Filter trainings by type
  const filteredTrainings = activeTab === 'all' 
    ? trainings 
    : trainings.filter(training => training.type.toLowerCase() === activeTab);

  // Get YouTube video ID from URL
  const getYoutubeVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  // Group trainings by type
  const trainingsByType = trainings.reduce((acc, training) => {
    const type = training.type.toLowerCase();
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(training);
    return acc;
  }, {} as Record<string, Training[]>);

  // Animation variants for cards
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut"
      }
    })
  };

  // Custom content handler for the UltraDashboard
  const renderTrainingContent = () => {
    return (
      <>
        <div className="container mx-auto px-4 py-8 max-w-5xl">
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-4">Nos Formations</h1>
            <p className="text-gray-300 max-w-3xl">
              Bienvenue dans l'espace de formation de Phocéen Agency. Nous avons préparé des ressources pour vous aider à
              développer vos compétences et à améliorer votre présence en ligne.
            </p>
          </div>

          {/* Main Content Container */}
          <div className="grid grid-cols-1 gap-8">
            {/* Quick Access Panels */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              {/* Community Panel */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Card 
                  className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 border-purple-700/30 hover:border-purple-500/50 cursor-pointer transition-all duration-300 overflow-hidden"
                  onClick={() => setCommunityDialogOpen(true)}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-purple-300">
                      <UserPlus className="h-5 w-5" />
                      <span>Rejoindre Notre Communauté</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-purple-200/80">
                      Connectez-vous avec d'autres créateurs et bénéficiez d'un soutien supplémentaire.
                    </p>
                  </CardContent>
                  <div className="absolute bottom-2 right-2">
                    <ChevronRight className="h-5 w-5 text-purple-300/50" />
                  </div>
                </Card>
              </motion.div>

              {/* Equipment Panel */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Card 
                  className="bg-gradient-to-br from-blue-900/40 to-teal-900/40 border-blue-700/30 hover:border-blue-500/50 cursor-pointer transition-all duration-300 overflow-hidden"
                  onClick={() => setEquipmentDialogOpen(true)}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-blue-300">
                      <Camera className="h-5 w-5" />
                      <span>Recommandations Matériel</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-blue-200/80">
                      Découvrez notre sélection de matériel recommandé pour améliorer vos lives.
                    </p>
                  </CardContent>
                  <div className="absolute bottom-2 right-2">
                    <ChevronRight className="h-5 w-5 text-blue-300/50" />
                  </div>
                </Card>
              </motion.div>

              {/* Tools Panel */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Card 
                  className="bg-gradient-to-br from-amber-900/40 to-red-900/40 border-amber-700/30 hover:border-amber-500/50 cursor-pointer transition-all duration-300 overflow-hidden"
                  onClick={() => setToolsDialogOpen(true)}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-amber-300">
                      <Settings className="h-5 w-5" />
                      <span>Outils et Logiciels</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-amber-200/80">
                      Les meilleurs outils pour optimiser vos diffusions et votre contenu.
                    </p>
                  </CardContent>
                  <div className="absolute bottom-2 right-2">
                    <ChevronRight className="h-5 w-5 text-amber-300/50" />
                  </div>
                </Card>
              </motion.div>
            </div>

            {/* Training Tabs */}
            <Card className="bg-slate-900/60 border-slate-700/50 backdrop-blur-sm shadow-xl">
              <CardHeader>
                <CardTitle className="text-white">Formations Disponibles</CardTitle>
                <CardDescription className="text-gray-400">
                  Sélectionnez une catégorie pour filtrer les formations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 mb-6">
                    <TabsTrigger value="all">Tous</TabsTrigger>
                    {Object.keys(trainingsByType).map((type) => (
                      <TabsTrigger key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  <TabsContent value="all" className="space-y-6">
                    {/* All Trainings */}
                    {loading ? (
                      <div className="flex items-center justify-center h-40">
                        <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {trainings.map((training, i) => (
                          <motion.div
                            key={training.id}
                            custom={i}
                            initial="hidden"
                            animate="visible"
                            variants={cardVariants}
                          >
                            <Card className="bg-slate-800/70 border-slate-700/50 overflow-hidden hover:border-blue-600/50 transition-all duration-300">
                              <div className="flex flex-col md:flex-row">
                                <div 
                                  className="relative w-full md:w-48 h-36 bg-slate-700 cursor-pointer"
                                  onClick={() => handleOpenVideo(training.video_url, training.title)}
                                >
                                  {training.video_url && (
                                    <div className="absolute inset-0 flex items-center justify-center group">
                                      <img 
                                        src={`https://img.youtube.com/vi/${getYoutubeVideoId(training.video_url)}/mqdefault.jpg`} 
                                        alt={training.title}
                                        className="w-full h-full object-cover opacity-80"
                                      />
                                      <div className="absolute inset-0 flex items-center justify-center">
                                        <PlayCircle className="h-12 w-12 text-white opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300" />
                                      </div>
                                    </div>
                                  )}
                                </div>
                                <div className="p-4 flex-1">
                                  <div className="flex justify-between items-start flex-wrap gap-2">
                                    <h3 className="text-lg font-semibold text-white">{training.title}</h3>
                                    <Badge 
                                      variant="outline" 
                                      className={
                                        training.type === 'video' ? 'bg-blue-900/30 text-blue-400 border-blue-700/50' :
                                        training.type === 'technique' ? 'bg-green-900/30 text-green-400 border-green-700/50' :
                                        training.type === 'guide' ? 'bg-purple-900/30 text-purple-400 border-purple-700/50' :
                                        'bg-amber-900/30 text-amber-400 border-amber-700/50'
                                      }
                                    >
                                      {training.type}
                                    </Badge>
                                  </div>
                                  <p className="text-gray-300 text-sm mt-2">{training.description}</p>
                                  <div className="mt-4 flex justify-between items-center">
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      className="border-blue-600 text-blue-400 hover:bg-blue-900/20"
                                      onClick={() => handleOpenVideo(training.video_url, training.title)}
                                    >
                                      <PlayCircle className="h-4 w-4 mr-2" />
                                      Regarder
                                    </Button>
                                    <div className="flex items-center text-gray-400 text-xs">
                                      <Clock className="h-3 w-3 mr-1" />
                                      <span>{new Date(training.created_at).toLocaleDateString('fr-FR')}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </Card>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </TabsContent>

                  {/* Category Tabs */}
                  {Object.entries(trainingsByType).map(([type, typeTrainings]) => (
                    <TabsContent key={type} value={type} className="space-y-6">
                      <div className="space-y-4">
                        {typeTrainings.map((training, i) => (
                          <motion.div
                            key={training.id}
                            custom={i}
                            initial="hidden"
                            animate="visible"
                            variants={cardVariants}
                          >
                            <Card className="bg-slate-800/70 border-slate-700/50 overflow-hidden hover:border-blue-600/50 transition-all duration-300">
                              <div className="flex flex-col md:flex-row">
                                <div 
                                  className="relative w-full md:w-48 h-36 bg-slate-700 cursor-pointer"
                                  onClick={() => handleOpenVideo(training.video_url, training.title)}
                                >
                                  {training.video_url && (
                                    <div className="absolute inset-0 flex items-center justify-center group">
                                      <img 
                                        src={`https://img.youtube.com/vi/${getYoutubeVideoId(training.video_url)}/mqdefault.jpg`} 
                                        alt={training.title}
                                        className="w-full h-full object-cover opacity-80"
                                      />
                                      <div className="absolute inset-0 flex items-center justify-center">
                                        <PlayCircle className="h-12 w-12 text-white opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300" />
                                      </div>
                                    </div>
                                  )}
                                </div>
                                <div className="p-4 flex-1">
                                  <div className="flex justify-between items-start flex-wrap gap-2">
                                    <h3 className="text-lg font-semibold text-white">{training.title}</h3>
                                    <Badge 
                                      variant="outline" 
                                      className={
                                        training.type === 'video' ? 'bg-blue-900/30 text-blue-400 border-blue-700/50' :
                                        training.type === 'technique' ? 'bg-green-900/30 text-green-400 border-green-700/50' :
                                        training.type === 'guide' ? 'bg-purple-900/30 text-purple-400 border-purple-700/50' :
                                        'bg-amber-900/30 text-amber-400 border-amber-700/50'
                                      }
                                    >
                                      {training.type}
                                    </Badge>
                                  </div>
                                  <p className="text-gray-300 text-sm mt-2">{training.description}</p>
                                  <div className="mt-4 flex justify-between items-center">
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      className="border-blue-600 text-blue-400 hover:bg-blue-900/20"
                                      onClick={() => handleOpenVideo(training.video_url, training.title)}
                                    >
                                      <PlayCircle className="h-4 w-4 mr-2" />
                                      Regarder
                                    </Button>
                                    <div className="flex items-center text-gray-400 text-xs">
                                      <Clock className="h-3 w-3 mr-1" />
                                      <span>{new Date(training.created_at).toLocaleDateString('fr-FR')}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </Card>
                          </motion.div>
                        ))}
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Video Player Modal */}
          <Dialog open={isVideoModalOpen} onOpenChange={setIsVideoModalOpen}>
            <DialogContent className="sm:max-w-3xl h-auto">
              <DialogHeader>
                <DialogTitle className="text-white">{activeVideoTitle}</DialogTitle>
              </DialogHeader>
              {activeVideoUrl && getYoutubeVideoId(activeVideoUrl) && (
                <div className="aspect-video">
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${getYoutubeVideoId(activeVideoUrl)}`}
                    title={activeVideoTitle}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="rounded-md overflow-hidden"
                  ></iframe>
                </div>
              )}
            </DialogContent>
          </Dialog>

          {/* Community Dialog */}
          <Dialog open={communityDialogOpen} onOpenChange={setCommunityDialogOpen}>
            <DialogContent className="sm:max-w-xl">
              <DialogHeader>
                <DialogTitle className="text-center text-xl font-bold text-white mb-2">
                  Rejoignez Notre Communauté
                </DialogTitle>
                <DialogDescription className="text-center text-gray-400">
                  Connectez-vous avec d'autres créateurs et l'équipe de Phocéen Agency
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                <Card className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 border-purple-700/30 hover:border-purple-500/50 transition-all duration-300 overflow-hidden">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-purple-300 text-lg">
                      <Instagram className="h-5 w-5" />
                      <span>Instagram</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <p className="text-sm text-purple-200/80">
                      Suivez-nous sur Instagram pour les dernières nouvelles et annonces
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                      onClick={() => window.open('https://www.instagram.com/phoceen.agency', '_blank')}
                    >
                      <Instagram className="h-4 w-4 mr-2" />
                      Rejoindre
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card className="bg-gradient-to-br from-purple-900/20 to-indigo-900/20 border-purple-700/30 hover:border-purple-500/50 transition-all duration-300 overflow-hidden">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-purple-300 text-lg">
                      <TwitchIcon className="h-5 w-5" />
                      <span>Twitch</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <p className="text-sm text-purple-200/80">
                      Rejoignez nos streams en direct et participez aux discussions
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full bg-[#6441a5] hover:bg-[#7550ba]"
                      onClick={() => window.open('https://www.twitch.tv/phoceen_agency', '_blank')}
                    >
                      <TwitchIcon className="h-4 w-4 mr-2" />
                      Suivre
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card className="bg-gradient-to-br from-red-900/20 to-amber-900/20 border-red-700/30 hover:border-red-500/50 transition-all duration-300 overflow-hidden">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-red-300 text-lg">
                      <YoutubeIcon className="h-5 w-5" />
                      <span>YouTube</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <p className="text-sm text-red-200/80">
                      Abonnez-vous à notre chaîne pour des tutoriels et des highlights
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full bg-red-600 hover:bg-red-700"
                      onClick={() => window.open('https://www.youtube.com/channel/phoceen_agency', '_blank')}
                    >
                      <YoutubeIcon className="h-4 w-4 mr-2" />
                      S'abonner
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card className="bg-gradient-to-br from-blue-900/20 to-cyan-900/20 border-blue-700/30 hover:border-blue-500/50 transition-all duration-300 overflow-hidden">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-blue-300 text-lg">
                      <MessageCircle className="h-5 w-5" />
                      <span>Discord</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <p className="text-sm text-blue-200/80">
                      Rejoignez notre serveur Discord pour échanger avec la communauté
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full bg-[#5865f2] hover:bg-[#4752c4]"
                      onClick={() => window.open('https://discord.gg/phoceen-agency', '_blank')}
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Rejoindre
                    </Button>
                  </CardFooter>
                </Card>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setCommunityDialogOpen(false)}>
                  Fermer
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          {/* Equipment Recommendations Dialog */}
          <Dialog open={equipmentDialogOpen} onOpenChange={setEquipmentDialogOpen}>
            <DialogContent className="sm:max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-center text-xl font-bold text-white mb-2">
                  Recommandations Matériel
                </DialogTitle>
                <DialogDescription className="text-center text-gray-400">
                  Notre sélection d'équipements recommandés pour améliorer la qualité de vos lives
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6 py-4">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-blue-400 flex items-center">
                    <Camera className="h-5 w-5 mr-2" />
                    Caméras
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="bg-slate-800/60 border-slate-700/50">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Logitech StreamCam</CardTitle>
                        <CardDescription>Prix: ~159€</CardDescription>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <p className="text-sm text-gray-300">
                          Caméra 1080p 60fps, idéale pour les streamers débutants et intermédiaires.
                        </p>
                      </CardContent>
                      <CardFooter>
                        <Button 
                          variant="outline" 
                          className="w-full text-blue-400 border-blue-700/50 hover:bg-blue-900/20"
                          onClick={() => window.open('https://www.amazon.fr/Logitech-StreamCam-Streaming-Verticales-Authentification/dp/B07W4DHNBF', '_blank')}
                        >
                          Voir le produit
                        </Button>
                      </CardFooter>
                    </Card>
                    
                    <Card className="bg-slate-800/60 border-slate-700/50">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Sony ZV-1</CardTitle>
                        <CardDescription>Prix: ~699€</CardDescription>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <p className="text-sm text-gray-300">
                          Appareil photo compact optimisé pour les créateurs de contenu avec excellent suivi du visage.
                        </p>
                      </CardContent>
                      <CardFooter>
                        <Button 
                          variant="outline" 
                          className="w-full text-blue-400 border-blue-700/50 hover:bg-blue-900/20"
                          onClick={() => window.open('https://www.amazon.fr/Sony-Appareil-Numérique-Compact-pour/dp/B088XTJG8R', '_blank')}
                        >
                          Voir le produit
                        </Button>
                      </CardFooter>
                    </Card>
                  </div>
                </div>
                
                <Separator className="bg-slate-700/50" />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-green-400 flex items-center">
                    <BellRing className="h-5 w-5 mr-2" />
                    Microphones
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="bg-slate-800/60 border-slate-700/50">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">HyperX QuadCast</CardTitle>
                        <CardDescription>Prix: ~129€</CardDescription>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <p className="text-sm text-gray-300">
                          Microphone USB à condensateur avec excellente qualité audio et filtre anti-pop intégré.
                        </p>
                      </CardContent>
                      <CardFooter>
                        <Button 
                          variant="outline" 
                          className="w-full text-green-400 border-green-700/50 hover:bg-green-900/20"
                          onClick={() => window.open('https://www.amazon.fr/HyperX-QuadCast-Microphone-Condensateur-Autonome/dp/B07NZZZ746', '_blank')}
                        >
                          Voir le produit
                        </Button>
                      </CardFooter>
                    </Card>
                    
                    <Card className="bg-slate-800/60 border-slate-700/50">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Blue Yeti X</CardTitle>
                        <CardDescription>Prix: ~169€</CardDescription>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <p className="text-sm text-gray-300">
                          Microphone USB professionnel avec 4 modes de captation et contrôle LED.
                        </p>
                      </CardContent>
                      <CardFooter>
                        <Button 
                          variant="outline" 
                          className="w-full text-green-400 border-green-700/50 hover:bg-green-900/20"
                          onClick={() => window.open('https://www.amazon.fr/Blue-Microphones-Microphone-Condensateur-Professionnel/dp/B07YD2LHH6', '_blank')}
                        >
                          Voir le produit
                        </Button>
                      </CardFooter>
                    </Card>
                  </div>
                </div>
                
                <Separator className="bg-slate-700/50" />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-amber-400 flex items-center">
                    <Lightbulb className="h-5 w-5 mr-2" />
                    Éclairage
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="bg-slate-800/60 border-slate-700/50">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Elgato Key Light Air</CardTitle>
                        <CardDescription>Prix: ~129€</CardDescription>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <p className="text-sm text-gray-300">
                          Lampe LED professionnelle avec température de couleur ajustable et contrôle via application.
                        </p>
                      </CardContent>
                      <CardFooter>
                        <Button 
                          variant="outline" 
                          className="w-full text-amber-400 border-amber-700/50 hover:bg-amber-900/20"
                          onClick={() => window.open('https://www.amazon.fr/Elgato-Light-Air-professionnelle-température/dp/B082QHRZFW', '_blank')}
                        >
                          Voir le produit
                        </Button>
                      </CardFooter>
                    </Card>
                    
                    <Card className="bg-slate-800/60 border-slate-700/50">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Neewer Ring Light</CardTitle>
                        <CardDescription>Prix: ~89€</CardDescription>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <p className="text-sm text-gray-300">
                          Anneau lumineux 18" avec support pour smartphone, idéal pour les créateurs débutants.
                        </p>
                      </CardContent>
                      <CardFooter>
                        <Button 
                          variant="outline" 
                          className="w-full text-amber-400 border-amber-700/50 hover:bg-amber-900/20"
                          onClick={() => window.open('https://www.amazon.fr/Neewer-Extérieur-dEclairage-dAlimentation-Smartphone/dp/B07G379ZBH', '_blank')}
                        >
                          Voir le produit
                        </Button>
                      </CardFooter>
                    </Card>
                  </div>
                </div>
                
                <Separator className="bg-slate-700/50" />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-purple-400 flex items-center">
                    <Heart className="h-5 w-5 mr-2" />
                    Recommandation Spéciale Founder
                  </h3>
                  <Card className="bg-gradient-to-br from-purple-900/30 to-indigo-900/30 border-purple-700/50">
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center justify-between">
                        <span>Pack Streamer Elite</span>
                        <Badge variant="outline" className="bg-purple-900/40 text-purple-300 border-purple-700/50">
                          Premium
                        </Badge>
                      </CardTitle>
                      <CardDescription>Prix: ~999€</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-4">
                      <p className="text-sm text-gray-300 mb-3">
                        Notre pack recommandé pour les créateurs professionnels comprenant:
                      </p>
                      <ul className="text-sm text-gray-300 space-y-1 list-disc pl-5">
                        <li>Sony Alpha 6400 (Caméra)</li>
                        <li>Shure SM7B (Microphone)</li>
                        <li>GoXLR Mini (Interface audio)</li>
                        <li>Elgato Stream Deck (Contrôleur)</li>
                        <li>Set d'éclairage LED premium</li>
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                        onClick={() => window.open('https://www.phoceen-agency.com/equipement-premium', '_blank')}
                      >
                        Découvrir le pack
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setEquipmentDialogOpen(false)}>
                  Fermer
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          {/* Tools and Software Dialog */}
          <Dialog open={toolsDialogOpen} onOpenChange={setToolsDialogOpen}>
            <DialogContent className="sm:max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-center text-xl font-bold text-white mb-2">
                  Outils et Logiciels Recommandés
                </DialogTitle>
                <DialogDescription className="text-center text-gray-400">
                  Les meilleurs logiciels pour optimiser vos diffusions et votre contenu
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6 py-4">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-blue-400 flex items-center">
                    <Video className="h-5 w-5 mr-2" />
                    Streaming
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="bg-slate-800/60 border-slate-700/50">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">OBS Studio</CardTitle>
                        <CardDescription>Prix: Gratuit</CardDescription>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <p className="text-sm text-gray-300">
                          Logiciel de streaming et d'enregistrement Open Source, puissant et personnalisable.
                        </p>
                      </CardContent>
                      <CardFooter>
                        <Button 
                          variant="outline" 
                          className="w-full text-blue-400 border-blue-700/50 hover:bg-blue-900/20"
                          onClick={() => window.open('https://obsproject.com/', '_blank')}
                        >
                          Télécharger
                        </Button>
                      </CardFooter>
                    </Card>
                    
                    <Card className="bg-slate-800/60 border-slate-700/50">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Streamlabs</CardTitle>
                        <CardDescription>Prix: Gratuit / Premium</CardDescription>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <p className="text-sm text-gray-300">
                          Solution tout-en-un pour le streaming avec une interface conviviale et des outils intégrés.
                        </p>
                      </CardContent>
                      <CardFooter>
                        <Button 
                          variant="outline" 
                          className="w-full text-blue-400 border-blue-700/50 hover:bg-blue-900/20"
                          onClick={() => window.open('https://streamlabs.com/', '_blank')}
                        >
                          Télécharger
                        </Button>
                      </CardFooter>
                    </Card>
                  </div>
                </div>
                
                <Separator className="bg-slate-700/50" />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-green-400 flex items-center">
                    <BookOpen className="h-5 w-5 mr-2" />
                    Édition Vidéo
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="bg-slate-800/60 border-slate-700/50">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">DaVinci Resolve</CardTitle>
                        <CardDescription>Prix: Gratuit / Studio 299€</CardDescription>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <p className="text-sm text-gray-300">
                          Logiciel d'édition vidéo professionnel avec version gratuite puissante.
                        </p>
                      </CardContent>
                      <CardFooter>
                        <Button 
                          variant="outline" 
                          className="w-full text-green-400 border-green-700/50 hover:bg-green-900/20"
                          onClick={() => window.open('https://www.blackmagicdesign.com/products/davinciresolve/', '_blank')}
                        >
                          Télécharger
                        </Button>
                      </CardFooter>
                    </Card>
                    
                    <Card className="bg-slate-800/60 border-slate-700/50">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Adobe Premiere Pro</CardTitle>
                        <CardDescription>Prix: Abonnement ~20€/mois</CardDescription>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <p className="text-sm text-gray-300">
                          Solution professionnelle d'édition vidéo avec intégration complète à la suite Adobe.
                        </p>
                      </CardContent>
                      <CardFooter>
                        <Button 
                          variant="outline" 
                          className="w-full text-green-400 border-green-700/50 hover:bg-green-900/20"
                          onClick={() => window.open('https://www.adobe.com/fr/products/premiere.html', '_blank')}
                        >
                          S'abonner
                        </Button>
                      </CardFooter>
                    </Card>
                  </div>
                </div>
                
                <Separator className="bg-slate-700/50" />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-indigo-400 flex items-center">
                    <Settings className="h-5 w-5 mr-2" />
                    Utilitaires
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="bg-slate-800/60 border-slate-700/50">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">VoiceMeeter Banana</CardTitle>
                        <CardDescription>Prix: Gratuit (donationware)</CardDescription>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <p className="text-sm text-gray-300">
                          Table de mixage audio virtuelle pour gérer plusieurs entrées et sorties audio.
                        </p>
                      </CardContent>
                      <CardFooter>
                        <Button 
                          variant="outline" 
                          className="w-full text-indigo-400 border-indigo-700/50 hover:bg-indigo-900/20"
                          onClick={() => window.open('https://vb-audio.com/Voicemeeter/banana.htm', '_blank')}
                        >
                          Télécharger
                        </Button>
                      </CardFooter>
                    </Card>
                    
                    <Card className="bg-slate-800/60 border-slate-700/50">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">StreamElements</CardTitle>
                        <CardDescription>Prix: Gratuit</CardDescription>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <p className="text-sm text-gray-300">
                          Plateforme cloud pour gérer overlays, alertes, bots et autres outils pour streamers.
                        </p>
                      </CardContent>
                      <CardFooter>
                        <Button 
                          variant="outline" 
                          className="w-full text-indigo-400 border-indigo-700/50 hover:bg-indigo-900/20"
                          onClick={() => window.open('https://streamelements.com/', '_blank')}
                        >
                          S'inscrire
                        </Button>
                      </CardFooter>
                    </Card>
                  </div>
                </div>
                
                <Separator className="bg-slate-700/50" />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-purple-400 flex items-center">
                    <PanelRight className="h-5 w-5 mr-2" />
                    Extensions et Overlays
                  </h3>
                  <Card className="bg-gradient-to-br from-purple-900/30 to-indigo-900/30 border-purple-700/50">
                    <CardHeader className="pb-2">
                      <CardTitle>Pack Exclusif Phocéen Agency</CardTitle>
                      <CardDescription>Prix: Gratuit pour nos créateurs</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-4">
                      <p className="text-sm text-gray-300 mb-3">
                        Notre pack exclusif pour créateurs comprenant:
                      </p>
                      <ul className="text-sm text-gray-300 space-y-1 list-disc pl-5">
                        <li>Overlays personnalisés pour TikTok et Twitch</li>
                        <li>Alertes animées pour les nouveaux followers et dons</li>
                        <li>Écrans de démarrage, pause et fin de stream</li>
                        <li>Templates pour réseaux sociaux</li>
                        <li>Accès à notre Discord exclusif pour créateurs</li>
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                        onClick={() => window.open('https://www.phoceen-agency.com/overlay-pack', '_blank')}
                      >
                        Accéder au pack
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setToolsDialogOpen(false)}>
                  Fermer
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </>
    );
  };

  // Update the custom training content in the UltraDashboard component
  const onAction = (action: string, data?: any) => {
    // Handle actions here if needed
  };

  return (
    <UltraDashboard
      username={username}
      role={role}
      userId={userId}
      onLogout={handleLogout}
      platformSettings={platformSettings}
      handleCreateAccount={handleCreateAccount}
      handleUpdateSettings={() => Promise.resolve()}
      showWarning={showWarning}
      dismissWarning={dismissWarning}
      formattedTime={formattedTime}
      currentPage="training"
    >
      {renderTrainingContent()}
    </UltraDashboard>
  );
};

export default Training;
