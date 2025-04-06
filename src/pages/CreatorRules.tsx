
import { useEffect } from "react";
import { UltraDashboard } from "@/components/dashboard/UltraDashboard";
import { useIndexAuth } from "@/hooks/use-index-auth";
import { useAccountManagement } from "@/hooks/use-account-management";
import { usePlatformSettings } from "@/hooks/use-platform-settings";
import { useToast } from "@/hooks/use-toast";
import { useInactivityTimer } from "@/hooks/use-inactivity-timer";
import { UsernameWatermark } from "@/components/layout/UsernameWatermark";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Shield, BookOpen, Lightbulb } from "lucide-react";
import { EquipmentRecommendations } from "@/components/rules/EquipmentRecommendations";
import { Button } from "@/components/ui/button";
import { SidebarProvider } from "@/components/ui/sidebar";

const CreatorRules = () => {
  const {
    isAuthenticated,
    username,
    role,
    userId,
    handleLogout,
  } = useIndexAuth();

  const { toast } = useToast();

  // Add the missing handleCreateAccount
  const { handleCreateAccount } = useAccountManagement();

  // Setup properly configured inactivity timer with required parameters
  const { showWarning, dismissWarning, formattedTime } = useInactivityTimer({
    timeout: 120000, // 2 minutes
    onTimeout: () => {
      handleLogout();
      toast({
        title: "Déconnexion automatique",
        description: "Vous avez été déconnecté en raison d'inactivité.",
      });
    },
    warningTime: 30000, // Show warning 30 seconds before timeout
    onWarning: () => {
      // Warning is handled by the hook and displayed via showWarning
    }
  });

  const { platformSettings, handleUpdateSettings } = usePlatformSettings(role);

  useEffect(() => {
    document.title = "Règles des Créateurs | Ultra";
  }, []);

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };
  
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  if (!isAuthenticated) {
    return <p>Vous n'êtes pas connecté.</p>;
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
        currentPage="creator-rules"
      >
        <motion.div 
          className="p-6 space-y-6 min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={fadeInUp} className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-bold tracking-tight flex items-center bg-gradient-to-r from-purple-400 to-indigo-300 bg-clip-text text-transparent">
                <Shield className="h-8 w-8 mr-3 text-purple-400" />
                Règles des Créateurs ✨
              </h1>
            </div>
            
            <Tabs defaultValue="general" className="w-full">
              <TabsList className="bg-slate-800/80 p-1.5 flex mb-8 rounded-lg border border-purple-900/30 shadow-md shadow-purple-900/10">
                <TabsTrigger value="general" className="flex-1 rounded-md py-2.5 data-[state=active]:bg-purple-600 data-[state=active]:text-white data-[state=active]:shadow-md">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Règles Générales 📝
                </TabsTrigger>
                <TabsTrigger value="equipment" className="flex-1 rounded-md py-2.5 data-[state=active]:bg-purple-600 data-[state=active]:text-white data-[state=active]:shadow-md">
                  <Lightbulb className="h-4 w-4 mr-2" />
                  Matériel Recommandé 🔧
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="general" className="pt-2 space-y-6">
                <Card className="bg-gradient-to-r from-slate-800 to-slate-900 border-purple-800/30">
                  <CardHeader>
                    <CardTitle className="text-xl text-white">Règles Générales pour les Créateurs</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[500px] pr-4">
                      <div className="space-y-6">
                        <div className="p-4 bg-purple-900/20 border border-purple-800/30 rounded-lg">
                          <h3 className="text-lg font-semibold mb-2 text-white">1. Qualité des Contenus</h3>
                          <p className="text-slate-300">
                            Veillez à ce que tous vos contenus soient de haute qualité, tant sur le plan technique 
                            (vidéo, audio) que sur le fond. Évitez les contenus flous, mal éclairés ou avec un son 
                            de mauvaise qualité.
                          </p>
                        </div>
                        
                        <div className="p-4 bg-purple-900/20 border border-purple-800/30 rounded-lg">
                          <h3 className="text-lg font-semibold mb-2 text-white">2. Régularité</h3>
                          <p className="text-slate-300">
                            Maintenez un calendrier de publication régulier. Vos abonnés apprécient la constance et 
                            s'attendent à voir vos contenus à des moments précis.
                          </p>
                        </div>
                        
                        <div className="p-4 bg-purple-900/20 border border-purple-800/30 rounded-lg">
                          <h3 className="text-lg font-semibold mb-2 text-white">3. Respect de la Communauté</h3>
                          <p className="text-slate-300">
                            Traitez votre audience avec respect. Évitez les propos discriminatoires, offensants ou 
                            inappropriés. Soyez constructif dans vos interactions.
                          </p>
                        </div>
                        
                        <div className="p-4 bg-purple-900/20 border border-purple-800/30 rounded-lg">
                          <h3 className="text-lg font-semibold mb-2 text-white">4. Droits d'Auteur</h3>
                          <p className="text-slate-300">
                            Respectez scrupuleusement les droits d'auteur. N'utilisez pas de contenus (musiques, 
                            images, vidéos) sans autorisation. Utilisez des ressources libres de droits ou obtenez 
                            les autorisations nécessaires.
                          </p>
                        </div>
                        
                        <div className="p-4 bg-purple-900/20 border border-purple-800/30 rounded-lg">
                          <h3 className="text-lg font-semibold mb-2 text-white">5. Communication avec l'Agence</h3>
                          <p className="text-slate-300">
                            Maintenez une communication claire et régulière avec votre agent. Informez-le de 
                            vos projets, de vos difficultés éventuelles et de vos succès.
                          </p>
                        </div>
                        
                        <div className="p-4 bg-purple-900/20 border border-purple-800/30 rounded-lg">
                          <h3 className="text-lg font-semibold mb-2 text-white">6. Utilisation de la Marque Ultra</h3>
                          <p className="text-slate-300">
                            Lorsque vous représentez Ultra Agency, assurez-vous d'utiliser correctement 
                            les éléments de marque (logo, couleurs, typographie). En cas de doute, consultez 
                            votre agent.
                          </p>
                        </div>
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="equipment" className="pt-2 space-y-6">
                <EquipmentRecommendations role={role || ''} />
              </TabsContent>
            </Tabs>
          </motion.div>
        </motion.div>
      </UltraDashboard>
    </SidebarProvider>
  );
};

export default CreatorRules;
