
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, HomeIcon, MessageCircle } from "lucide-react";
import { useIndexAuth } from "@/hooks/use-index-auth";
import { CreatorPerformanceRanking } from "@/components/creators/CreatorPerformanceRanking";
import { Footer } from "@/components/layout/Footer";
import { SidebarProvider } from "@/components/ui/sidebar";
import { UltraSidebar } from "@/components/layout/UltraSidebar";
import { UsernameWatermark } from "@/components/layout/UsernameWatermark";
import { SocialCommunityLinks } from "@/components/layout/SocialCommunityLinks";
import { motion } from "framer-motion";

const CreatorRankings = () => {
  const navigate = useNavigate();
  const { role, username, userId, handleLogout } = useIndexAuth();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <motion.div 
        className="min-h-screen flex bg-gradient-to-br from-indigo-50/50 via-white to-blue-50/50 dark:from-indigo-950/30 dark:via-slate-950 dark:to-blue-950/30"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {username && <UsernameWatermark username={username} />}
        
        <UltraSidebar 
          username={username || ''}
          role={role || ''}
          userId={userId || ''}
          onLogout={handleLogout}
          currentPage="creator-rankings"
        />
        
        <div className="flex-1 p-6">
          <div className="max-w-7xl mx-auto space-y-8">
            <motion.div 
              className="flex items-center justify-between"
              variants={itemVariants}
            >
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate("/")}
                  className="h-10 w-10 rounded-full bg-white/80 dark:bg-slate-800/80 shadow-md hover:shadow-lg transition-all"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
                  Classement des Créateurs 🏆
                </h1>
              </div>
              
              <div className="flex items-center gap-3">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="outline"
                    onClick={() => navigate("/messages")}
                    className="flex items-center gap-2 rounded-full px-5 py-6 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/40 dark:to-purple-900/40 border-indigo-200 dark:border-indigo-800/50 hover:shadow-md transition-all"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>Messagerie</span>
                  </Button>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="outline"
                    onClick={() => navigate("/")}
                    className="flex items-center gap-2 rounded-full px-5 py-6 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40 border-blue-200 dark:border-blue-800/50 hover:shadow-md transition-all"
                  >
                    <HomeIcon className="h-4 w-4" />
                    Retour au tableau de bord
                  </Button>
                </motion.div>
              </div>
            </motion.div>
            
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
              variants={itemVariants}
            >
              <div className="md:col-span-2">
                <CreatorPerformanceRanking role={role || ''} />
              </div>
              
              <div className="space-y-6">
                <SocialCommunityLinks className="animate-fade-in" />
              </div>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <Footer role={role} />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </SidebarProvider>
  );
};

export default CreatorRankings;
