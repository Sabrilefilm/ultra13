
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
import { SocialCommunityLinks } from "@/components/layout/SocialCommunityLinks";
import { Button } from "@/components/ui/button";

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
        staggerChildren: 0.2
      }
    }
  };

  // Auto-animating button
  const pulseAnimation = {
    scale: [1, 1.05, 1],
    boxShadow: [
      "0 0 0 0 rgba(134, 46, 255, 0)",
      "0 0 0 10px rgba(134, 46, 255, 0.3)",
      "0 0 0 0 rgba(134, 46, 255, 0)"
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
      repeatType: "loop" as const
    }
  };

  if (!isAuthenticated) {
    return (
      <>
        {username && <UsernameWatermark username={username} />}
        <p>Vous n'êtes pas connecté.</p>
      </>
    );
  }

  return (
    <>
      {username && <UsernameWatermark username={username} />}
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
      />

      <motion.div 
        className="p-6 md:ml-64 space-y-6"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={fadeInUp}>
          <Card className="bg-white dark:bg-slate-900 shadow-lg border-purple-100 dark:border-purple-900/30">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-white dark:from-purple-950/30 dark:to-slate-950 bg-slate-950">
              <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Shield className="h-6 w-6 text-purple-500" />
                Règles des Créateurs
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 bg-gray-950">
              <Tabs defaultValue="general" className="w-full">
                <TabsList className="grid grid-cols-3 mb-6 bg-indigo-950">
                  <TabsTrigger value="general" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                    Règles Générales
                  </TabsTrigger>
                  <TabsTrigger value="content" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                    Contenu
                  </TabsTrigger>
                  <TabsTrigger value="equipment" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white flex items-center gap-1">
                    <Lightbulb className="h-4 w-4" />
                    Équipement
                  </TabsTrigger>
                </TabsList>
                
                <ScrollArea className="h-[600px] rounded-md border border-purple-100 dark:border-purple-900/30 p-4">
                  <TabsContent value="general" className="space-y-4">
                    <div className="space-y-6">
                      <h3 className="text-xl font-semibold text-purple-700 dark:text-purple-300 border-b border-purple-100 dark:border-purple-800 pb-2">Règles Générales pour les Créateurs</h3>
                      
                      <div className="space-y-4">
                        <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border-l-4 border-purple-500">
                          <h4 className="font-medium mb-2 text-purple-800 dark:text-purple-200">1. Respect des Horaires</h4>
                          <p className="text-gray-700 dark:text-gray-300">Les créateurs doivent respecter leurs horaires de live programmés et signaler tout changement au moins 24h à l'avance.</p>
                        </div>
                        
                        <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border-l-4 border-purple-500">
                          <h4 className="font-medium mb-2 text-purple-800 dark:text-purple-200">2. Communication</h4>
                          <p className="text-gray-700 dark:text-gray-300">La communication avec les agents doit être régulière et transparente.</p>
                        </div>
                        
                        <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border-l-4 border-purple-500">
                          <h4 className="font-medium mb-2 text-purple-800 dark:text-purple-200">3. Participation aux Matchs</h4>
                          <p className="text-gray-700 dark:text-gray-300">Les créateurs doivent participer aux matchs programmés par leur agent. En cas d'impossibilité, ils doivent en informer leur agent au moins 48h à l'avance.</p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="content" className="space-y-4">
                    <div className="space-y-6">
                      <h3 className="text-xl font-semibold text-purple-700 dark:text-purple-300 border-b border-purple-100 dark:border-purple-800 pb-2">Règles de Contenu</h3>
                      
                      <div className="space-y-4">
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border-l-4 border-blue-500">
                          <h4 className="font-medium mb-2 text-blue-800 dark:text-blue-200">1. Qualité du Contenu</h4>
                          <p className="text-gray-700 dark:text-gray-300">Le contenu doit être de haute qualité et respecter les valeurs de l'agence.</p>
                        </div>
                        
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border-l-4 border-blue-500">
                          <h4 className="font-medium mb-2 text-blue-800 dark:text-blue-200">2. Respect des Directives TikTok</h4>
                          <p className="text-gray-700 dark:text-gray-300">Le contenu doit être approprié et conforme aux règles de la plateforme TikTok.</p>
                        </div>
                        
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border-l-4 border-blue-500">
                          <h4 className="font-medium mb-2 text-blue-800 dark:text-blue-200">3. Représentation de l'Agence</h4>
                          <p className="text-gray-700 dark:text-gray-300">En tant que créateur de Ultra, vous représentez l'agence lors de vos lives et dans votre contenu.</p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="equipment" className="space-y-4">
                    <EquipmentRecommendations role={role || ''} />
                  </TabsContent>
                </ScrollArea>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div variants={fadeInUp} className="mt-6">
          <SocialCommunityLinks />
        </motion.div>
        
        <motion.div variants={fadeInUp} className="flex justify-center mt-6">
          <motion.div animate={pulseAnimation}>
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
              onClick={() => window.location.href = '/training'}
            >
              <BookOpen className="mr-2 h-5 w-5" />
              Accéder aux Formations
            </Button>
          </motion.div>
        </motion.div>
        
        <motion.div variants={fadeInUp} className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
          <p className="text-center">Les règles des créateurs sont sujettes à modification. Dernière mise à jour: {new Date().toLocaleDateString('fr-FR')}</p>
        </motion.div>
      </motion.div>
    </>
  );
};

export default CreatorRules;
