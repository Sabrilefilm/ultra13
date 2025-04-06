
import { useEffect } from "react";
import { UltraDashboard } from "@/components/dashboard/UltraDashboard";
import { useIndexAuth } from "@/hooks/use-index-auth";
import { useAccountManagement } from "@/hooks/use-account-management";
import { usePlatformSettings } from "@/hooks/use-platform-settings";
import { useToast } from "@/hooks/use-toast";
import { useInactivityTimer } from "@/hooks/use-inactivity-timer";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Award, Lightbulb, GraduationCap, Sparkles } from "lucide-react";
import { TrainingCatalog } from "@/components/training/TrainingCatalog";
import { EquipmentRecommendations } from "@/components/rules/EquipmentRecommendations";
import { SidebarProvider } from "@/components/ui/sidebar";

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
        currentPage="training"
      >
        <motion.div 
          className="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6 min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={fadeInUp} className="max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent mb-4 sm:mb-0">
                <BookOpen className="h-6 w-6 sm:h-8 sm:w-8 mr-2 sm:mr-3 text-blue-400" />
                Centre de Formation
              </h1>
            </div>
            
            <Tabs defaultValue="catalog" className="w-full">
              <TabsList className="bg-slate-800/80 p-1 sm:p-1.5 flex mb-4 sm:mb-8 rounded-lg border border-indigo-900/30 shadow-md shadow-indigo-900/10 overflow-x-auto">
                <TabsTrigger value="catalog" className="flex-1 text-xs sm:text-sm rounded-md py-2 sm:py-2.5 data-[state=active]:bg-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-md whitespace-nowrap">
                  <GraduationCap className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  Catalogue 📚
                </TabsTrigger>
                <TabsTrigger value="equipment" className="flex-1 text-xs sm:text-sm rounded-md py-2 sm:py-2.5 data-[state=active]:bg-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-md whitespace-nowrap">
                  <Lightbulb className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  Matériel 🔧
                </TabsTrigger>
                <TabsTrigger value="certifications" className="flex-1 text-xs sm:text-sm rounded-md py-2 sm:py-2.5 data-[state=active]:bg-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-md whitespace-nowrap">
                  <Award className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  Certifications 🏆
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="catalog" className="pt-2 space-y-4 sm:space-y-6">
                <TrainingCatalog role={role || ''} />
              </TabsContent>
              
              <TabsContent value="equipment" className="pt-2 space-y-4 sm:space-y-6">
                <EquipmentRecommendations role={role || ''} />
              </TabsContent>
              
              <TabsContent value="certifications" className="pt-2 space-y-4 sm:space-y-6">
                <div className="bg-gradient-to-r from-indigo-900/30 to-blue-900/20 p-4 sm:p-8 rounded-xl shadow-lg border border-indigo-800/30 text-center backdrop-blur-sm">
                  <div className="flex justify-center">
                    <Award className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-3 sm:mb-4 text-indigo-400" />
                    <Sparkles className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-400 animate-pulse" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 bg-gradient-to-r from-purple-300 to-indigo-300 bg-clip-text text-transparent">Certifications Ultra à venir</h3>
                  <p className="text-gray-300 max-w-lg mx-auto text-sm sm:text-base">
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
    </SidebarProvider>
  );
};

export default Training;
