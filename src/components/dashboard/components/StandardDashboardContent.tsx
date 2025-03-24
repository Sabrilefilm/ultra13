
import React, { useState } from 'react';
import { ProfileHeader } from "@/components/ProfileHeader";
import { StatCards } from "@/components/dashboard/StatCards";
import { UserGuide } from "@/components/help/UserGuide";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HelpCircle, BookOpen, Shield, BarChart4, ArrowRight } from "lucide-react";
import { RoleStats } from "@/components/dashboard/RoleStats";
import { SocialCommunityLinks } from "@/components/layout/SocialCommunityLinks";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

interface StandardDashboardContentProps {
  username: string;
  role: string;
  onAction: (action: string, data?: any) => void;
}

export const StandardDashboardContent: React.FC<StandardDashboardContentProps> = ({
  username,
  role,
  onAction
}) => {
  const [showGuide, setShowGuide] = useState(false);
  const navigate = useNavigate();

  // Animation variants
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

  return (
    <motion.div 
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div variants={fadeIn}>
        <ProfileHeader 
          username={username}
          handle={`@${role === 'founder' ? 'Fondateur' : role}`}
        />
      </motion.div>
      
      <motion.div variants={fadeIn}>
        <Card className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm border border-purple-900/20 rounded-xl">
          <CardHeader className="bg-gradient-to-r from-purple-900/20 to-indigo-900/20 rounded-t-xl border-b border-purple-700/10">
            <CardTitle className="text-xl flex items-center gap-2">
              <BarChart4 className="h-5 w-5 text-purple-400" />
              Tableau de bord
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="md:w-2/3">
                  <h3 className="text-lg font-medium mb-3">Bienvenue {username}</h3>
                  <p className="text-gray-400 mb-4">
                    En tant que {role}, vous avez accès à toutes les fonctionnalités nécessaires pour gérer votre équipe et suivre les performances des créateurs.
                  </p>
                  
                  <div className="flex flex-wrap gap-2">
                    <Button 
                      onClick={() => setShowGuide(!showGuide)}
                      variant="outline"
                      className="bg-purple-900/40 hover:bg-purple-800/60 text-purple-300 border-purple-700/50 hover:border-purple-600"
                    >
                      {showGuide ? "Masquer le guide" : "Voir le guide d'utilisation"}
                    </Button>
                    
                    <Button
                      onClick={() => navigate('/training')}
                      variant="outline"
                      className="bg-blue-900/40 hover:bg-blue-800/60 text-blue-300 border-blue-700/50 hover:border-blue-600 flex gap-2 items-center"
                    >
                      <BookOpen className="h-4 w-4" />
                      Formations
                    </Button>
                  </div>
                </div>
                
                <div className="md:w-1/3 md:border-l border-purple-900/30 md:pl-4">
                  <div className="flex flex-col gap-3">
                    <motion.div 
                      className="flex items-center gap-2 bg-indigo-900/20 p-3 rounded-lg border border-indigo-700/30"
                      whileHover={{ scale: 1.03 }}
                      transition={{ type: "spring", stiffness: 300, damping: 10 }}
                    >
                      <BookOpen className="h-5 w-5 text-indigo-400" />
                      <div>
                        <h4 className="font-medium text-indigo-300">Règlement</h4>
                        <p className="text-xs text-indigo-400/80">Consultez les règles internes</p>
                      </div>
                    </motion.div>
                    
                    <motion.div 
                      className="flex items-center gap-2 bg-purple-900/20 p-3 rounded-lg border border-purple-700/30"
                      whileHover={{ scale: 1.03 }}
                      transition={{ type: "spring", stiffness: 300, damping: 10 }}
                    >
                      <Shield className="h-5 w-5 text-purple-400" />
                      <div>
                        <h4 className="font-medium text-purple-300">Administration</h4>
                        <p className="text-xs text-purple-400/80">Gérez les permissions</p>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-800/50">
                <h4 className="font-medium text-gray-300 mb-3">Statistiques principales</h4>
                <StatCards 
                  role={role} 
                  onOpenSponsorshipForm={() => onAction('openSponsorshipForm')}
                  onOpenSponsorshipList={() => onAction('openSponsorshipList')}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      
      {/* Social Community Links */}
      <motion.div variants={fadeIn} transition={{ delay: 0.3 }}>
        <SocialCommunityLinks />
      </motion.div>
      
      {showGuide && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-6 overflow-hidden"
        >
          <UserGuide />
        </motion.div>
      )}
    </motion.div>
  );
};
