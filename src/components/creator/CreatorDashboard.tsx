
import React, { useState, useEffect } from "react";
import { StatCards } from "@/components/dashboard/StatCards";
import { LeaveAgencyDialog } from "@/components/agency/LeaveAgencyDialog";
import { DailyQuote } from "@/components/dashboard/DailyQuote";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserGuide } from "@/components/help/UserGuide";
import { SocialCommunityLinks } from "@/components/layout/SocialCommunityLinks";
import { 
  MessageSquare, AlertTriangle, BarChart4, Calendar, ArrowRight, 
  Clock, Trophy, Diamond, UserCheck, Star, BookOpen
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";

interface CreatorDashboardProps {
  onOpenSponsorshipForm: () => void;
  onOpenSponsorshipList: () => void;
  onCreatePoster: () => void;
  role: string;
}

export const CreatorDashboard = ({ 
  onOpenSponsorshipForm, 
  onOpenSponsorshipList,
  onCreatePoster,
  role
}: CreatorDashboardProps) => {
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [showGuide, setShowGuide] = useState(false);
  const [totalDiamonds, setTotalDiamonds] = useState(0);
  const username = localStorage.getItem('username') || 'Créateur';

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

  // Récupérer les horaires et les diamants du créateur connecté
  const { data: creatorData, isLoading } = useQuery({
    queryKey: ["creator-data"],
    queryFn: async () => {
      try {
        // Récupérer l'ID de l'utilisateur connecté via localStorage
        const username = localStorage.getItem('username');
        const userId = localStorage.getItem('userId');
        
        if (!username || !userId) {
          return { 
            schedule: { hours: 0, days: 0 },
            diamonds: 0
          };
        }
        
        // Récupérer l'horaire de live
        const { data: scheduleData, error: scheduleError } = await supabase
          .from('live_schedules')
          .select('hours, days')
          .eq('creator_id', userId)
          .maybeSingle();

        if (scheduleError) {
          console.error("Error fetching schedule:", scheduleError);
        }

        // Récupérer les diamants
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('total_diamonds')
          .eq('id', userId)
          .maybeSingle();

        if (profileError) {
          console.error("Error fetching profile:", profileError);
        }

        // Récupérer le prochain match
        const now = new Date();
        const { data: matchData, error: matchError } = await supabase
          .from('matches')
          .select('*')
          .eq('creator_id', username)
          .gt('match_date', now.toISOString())
          .order('match_date', { ascending: true })
          .limit(1)
          .maybeSingle();

        if (matchError) {
          console.error("Error fetching match:", matchError);
        }

        return {
          schedule: scheduleData || { hours: 0, days: 0 },
          diamonds: profileData?.total_diamonds || 0,
          nextMatch: matchData || null
        };
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
        toast.error("Impossible de récupérer vos données");
        return { 
          schedule: { hours: 0, days: 0 },
          diamonds: 0,
          nextMatch: null
        };
      }
    }
  });

  useEffect(() => {
    if (creatorData?.diamonds) {
      setTotalDiamonds(creatorData.diamonds);
    }
  }, [creatorData]);

  // Calculer le total d'heures hebdomadaires
  const weeklyHours = creatorData?.schedule ? (creatorData.schedule.hours * creatorData.schedule.days) : 0;
  
  // Objectifs à atteindre
  const targetHours = 15;
  const targetDays = 7;

  // Formater la date du prochain match
  const formatMatchDate = (dateString: string) => {
    if (!dateString) return "Non planifié";
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Quote du jour */}
      <DailyQuote />
      
      {/* Résumé */}
      <Card className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm border border-purple-900/20 rounded-xl shadow-md hover:shadow-lg transition-all">
        <CardHeader className="bg-gradient-to-r from-purple-900/20 to-indigo-900/20 rounded-t-xl border-b border-purple-900/10">
          <CardTitle className="text-xl text-white/90 flex items-center gap-2">
            <BarChart4 className="h-5 w-5 text-purple-400" />
            Tableau de bord
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="text-gray-300 space-y-6">
            <div className="flex gap-4 flex-col md:flex-row">
              <div className="md:w-2/3">
                <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-amber-400" />
                  Bienvenue {username} sur votre tableau de bord! ✨
                </h3>
                
                <p className="text-gray-400 mb-4">
                  Retrouvez ici toutes les informations importantes concernant vos performances, vos objectifs et vos prochains matchs.
                </p>
                
                {/* Performant Utilisateur Section */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-gradient-to-r from-purple-900/20 to-indigo-900/20 rounded-lg border border-purple-800/30 p-4 mb-4"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <UserCheck className="h-5 w-5 text-green-400" />
                    <h4 className="font-medium text-green-300">Créateur performant</h4>
                  </div>
                  <p className="text-gray-400 text-sm">
                    En tant qu'utilisateur performant, vous avez accès à des fonctionnalités exclusives et des récompenses supplémentaires.
                  </p>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <div className="bg-green-900/20 border border-green-800/30 rounded-lg p-2 flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-400" />
                      <span className="text-sm text-green-300">Avantages exclusifs</span>
                    </div>
                    <div className="bg-green-900/20 border border-green-800/30 rounded-lg p-2 flex items-center gap-2">
                      <Diamond className="h-4 w-4 text-blue-400" />
                      <span className="text-sm text-green-300">Bonus de diamants</span>
                    </div>
                  </div>
                </motion.div>
                
                <div className="flex flex-wrap gap-4 mb-6">
                  <Button 
                    onClick={() => navigate('/messages')}
                    variant="outline" 
                    className="bg-indigo-900/40 hover:bg-indigo-800/60 text-indigo-300 border-indigo-700/50 hover:border-indigo-600 flex gap-2 items-center"
                  >
                    <MessageSquare className="h-4 w-4" />
                    Messagerie 💬
                  </Button>
                  
                  <Button 
                    onClick={() => navigate('/creator-rewards')}
                    variant="outline" 
                    className="bg-purple-900/40 hover:bg-purple-800/60 text-purple-300 border-purple-700/50 hover:border-purple-600 flex gap-2 items-center"
                  >
                    <Diamond className="h-4 w-4" />
                    Mes Diamants 💎
                  </Button>
                  
                  <Button
                    onClick={() => navigate('/training')}
                    variant="outline"
                    className="bg-blue-900/40 hover:bg-blue-800/60 text-blue-300 border-blue-700/50 hover:border-blue-600 flex gap-2 items-center"
                  >
                    <BookOpen className="h-4 w-4" />
                    Formations 📚
                  </Button>
                  
                  <Button 
                    onClick={() => setShowGuide(!showGuide)}
                    variant="outline"
                    className="bg-purple-900/40 hover:bg-purple-800/60 text-purple-300 border-purple-700/50 hover:border-purple-600 flex gap-2 items-center"
                  >
                    {showGuide ? "Masquer le guide" : "Voir le guide d'utilisation 📖"}
                  </Button>
                </div>
              </div>
              
              <div className="md:w-1/3 md:border-l border-purple-900/30 md:pl-4">
                <div className="p-4 bg-purple-900/20 border border-purple-700/30 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-purple-300 flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Vos horaires ⏰
                    </h4>
                    <div className="px-2 py-1 bg-purple-800/30 border border-purple-700/30 rounded-md text-xs text-purple-300">
                      Planning
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="bg-purple-800/20 border border-purple-700/20 rounded-md p-2 text-center">
                      <span className="block text-2xl font-bold text-purple-300">
                        {isLoading ? (
                          <span className="h-8 w-16 bg-purple-800/40 animate-pulse rounded inline-block"></span>
                        ) : (
                          creatorData?.schedule?.hours || 0
                        )}
                      </span>
                      <span className="text-xs text-purple-200/70">heures/jour</span>
                    </div>
                    <div className="bg-purple-800/20 border border-purple-700/20 rounded-md p-2 text-center">
                      <span className="block text-2xl font-bold text-purple-300">
                        {isLoading ? (
                          <span className="h-8 w-16 bg-purple-800/40 animate-pulse rounded inline-block"></span>
                        ) : (
                          creatorData?.schedule?.days || 0
                        )}
                      </span>
                      <span className="text-xs text-purple-200/70">jours/semaine</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-purple-300">Total hebdomadaire:</span>
                    <span className="text-lg font-semibold text-purple-300">{weeklyHours}h</span>
                  </div>
                  
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-purple-300">Objectif:</span>
                    <span className="text-sm text-purple-300">{targetHours}h ({targetDays}j)</span>
                  </div>
                  
                  <div className="mt-2 pt-2 border-t border-purple-800/30">
                    <div className="h-2 bg-purple-900/30 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(100, (weeklyHours / targetHours) * 100)}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"
                      ></motion.div>
                    </div>
                    <div className="text-right text-xs text-purple-400 mt-1">
                      {Math.round((weeklyHours / targetHours) * 100)}% de l'objectif
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 p-4 bg-indigo-900/20 border border-indigo-700/30 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-indigo-300 flex items-center gap-2">
                      <Diamond className="h-4 w-4" />
                      Vos diamants 💎
                    </h4>
                  </div>
                  
                  <div className="text-center mb-2">
                    <motion.span 
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.5 }}
                      className="block text-3xl font-bold text-indigo-300"
                    >
                      {isLoading ? (
                        <span className="h-10 w-24 bg-indigo-800/40 animate-pulse rounded inline-block"></span>
                      ) : (
                        totalDiamonds.toLocaleString()
                      )}
                    </motion.span>
                  </div>
                  
                  <Button 
                    variant="ghost" 
                    className="w-full text-indigo-300 hover:text-indigo-100 hover:bg-indigo-700/30 mt-2"
                    onClick={() => navigate('/creator-rewards')}
                  >
                    Voir mes récompenses <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="mt-4 bg-indigo-900/20 border border-indigo-700/30 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="h-5 w-5 text-indigo-400" />
                <div>
                  <p className="text-indigo-300 font-medium">Prochain match prévu 🎮</p>
                  {creatorData?.nextMatch ? (
                    <>
                      <p className="text-indigo-400/80 text-sm">{formatMatchDate(creatorData.nextMatch.match_date)}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <motion.span 
                          className="bg-indigo-900/30 border border-indigo-700/30 rounded-full px-3 py-1 text-indigo-300 font-medium"
                          whileHover={{ scale: 1.05 }}
                        >
                          {username}
                        </motion.span>
                        <span className="text-indigo-400 mx-2">vs</span>
                        <motion.span 
                          className="bg-indigo-900/30 border border-indigo-700/30 rounded-full px-3 py-1 text-indigo-300 font-medium"
                          whileHover={{ scale: 1.05 }}
                        >
                          {creatorData.nextMatch.opponent_id}
                        </motion.span>
                      </div>
                    </>
                  ) : (
                    <p className="text-indigo-400/80 text-sm">Aucun match programmé pour le moment</p>
                  )}
                </div>
              </div>
              <Button 
                variant="ghost" 
                className="w-full mt-2 text-indigo-300 hover:text-indigo-100 hover:bg-indigo-700/30"
                onClick={() => navigate('/matches')}
              >
                Voir tous mes matchs <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Statistiques */}
      <StatCards 
        role={role} 
        onOpenSponsorshipForm={onOpenSponsorshipForm}
        onOpenSponsorshipList={onOpenSponsorshipList}
        onCreatePoster={onCreatePoster}
      />
      
      {/* Social Community Links */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <SocialCommunityLinks />
      </motion.div>
      
      {/* User Guide */}
      {showGuide && (
        <div className="mt-6">
          <UserGuide />
        </div>
      )}
      
      {/* Actions rapides */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Button 
          className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white h-14 shadow-md hover:shadow-lg transition-all duration-300"
          onClick={() => navigate("/messages")}
        >
          <MessageSquare className="h-5 w-5 mr-2" />
          {isMobile ? "Messages 💬" : "Accéder à la messagerie 💬"}
        </Button>
        
        {/* Bouton quitter l'agence avec avertissement */}
        <Button 
          variant="destructive" 
          className="h-14 group relative transition-all duration-300 bg-gradient-to-r from-red-600/80 to-orange-600/80 hover:from-red-700 hover:to-orange-700" 
        >
          <div className="flex items-center justify-center w-full">
            <AlertTriangle className="h-5 w-5 mr-2 group-hover:animate-pulse" />
            Je souhaite quitter l'agence
          </div>
          <LeaveAgencyDialog />
        </Button>
      </div>
    </div>
  );
};
