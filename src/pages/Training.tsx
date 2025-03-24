
import { useEffect } from "react";
import { UltraDashboard } from "@/components/dashboard/UltraDashboard";
import { useIndexAuth } from "@/hooks/use-index-auth";
import { useAccountManagement } from "@/hooks/use-account-management";
import { usePlatformSettings } from "@/hooks/use-platform-settings";
import { useToast } from "@/hooks/use-toast";
import { useInactivityTimer } from "@/hooks/use-inactivity-timer";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Award, Lightbulb, GraduationCap } from "lucide-react";
import { TrainingCatalog } from "@/components/training/TrainingCatalog";
import { EquipmentRecommendations } from "@/components/rules/EquipmentRecommendations";

const Training = () => {
  const {
    isAuthenticated,
    username,
    role,
    userId,
    handleLogout,
  } = useIndexAuth();

  const { toast } = useToast();
  const { handleCreateAccount } = useAccountManagement();

  // Inactivity timer setup
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
    document.title = "Formations | Ultra";
  }, []);

  // Animation variants
  const fadeInUp = {
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
        staggerChildren: 0.15
      }
    }
  };

  if (!isAuthenticated) {
    return <p>Vous n'êtes pas connecté.</p>;
  }

  return (
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
    >
      <motion.div 
        className="p-6 space-y-6"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={fadeInUp} className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold tracking-tight flex items-center">
              <BookOpen className="h-8 w-8 mr-2 text-blue-500" />
              Centre de Formation
            </h1>
          </div>
          
          <Tabs defaultValue="catalog" className="w-full">
            <TabsList className="bg-slate-100 dark:bg-slate-800 p-0.5 flex mb-6">
              <TabsTrigger value="catalog" className="flex-1">
                <GraduationCap className="h-4 w-4 mr-2" />
                Catalogue
              </TabsTrigger>
              <TabsTrigger value="equipment" className="flex-1">
                <Lightbulb className="h-4 w-4 mr-2" />
                Matériel Recommandé
              </TabsTrigger>
              <TabsTrigger value="certifications" className="flex-1">
                <Award className="h-4 w-4 mr-2" />
                Certifications
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="catalog" className="pt-2 space-y-6">
              <TrainingCatalog role={role || ''} />
            </TabsContent>
            
            <TabsContent value="equipment" className="pt-2 space-y-6">
              <EquipmentRecommendations role={role || ''} />
            </TabsContent>
            
            <TabsContent value="certifications" className="pt-2 space-y-6">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-8 rounded-xl shadow-sm text-center">
                <Award className="h-16 w-16 mx-auto mb-4 text-blue-500" />
                <h3 className="text-xl font-bold mb-2">Certifications Ultra à venir</h3>
                <p className="text-gray-600 dark:text-gray-300 max-w-lg mx-auto">
                  Notre programme de certifications est en cours de développement.
                  Vous pourrez bientôt obtenir des certifications officielles pour 
                  valoriser vos compétences.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </motion.div>
    </UltraDashboard>
  );
};

export default Training;
