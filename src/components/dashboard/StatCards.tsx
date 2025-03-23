
import {
  Trophy,
  Clock,
  Calendar,
  Target,
  Award,
  MessageSquare,
  Diamond,
  TrendingUp,
  TrendingDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useMediaQuery } from "@/hooks/use-media-query";
import { MONTHS } from "@/components/live-schedule/constants";

interface StatCardsProps {
  role: string;
  onOpenSponsorshipForm?: () => void;
  onOpenSponsorshipList?: () => void;
  onCreatePoster?: () => void;
}

export const StatCards = ({ 
  role, 
  onOpenSponsorshipForm, 
  onOpenSponsorshipList, 
  onCreatePoster 
}: StatCardsProps) => {
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  // Récupérer les horaires du créateur connecté
  const { data: liveSchedule, isLoading: isLoadingSchedule } = useQuery({
    queryKey: ["creator-stats-schedule"],
    queryFn: async () => {
      try {
        // Récupérer l'ID de l'utilisateur connecté
        const { data: session } = await supabase.auth.getSession();
        const userId = session?.session?.user?.id;
        
        if (!userId) {
          // Si pas connecté, essayer d'utiliser l'username stocké en localStorage
          const username = localStorage.getItem('username');
          if (!username) return { hours: 0, days: 0 };
          
          // Récupérer l'user_id à partir du username
          const { data: userData, error: userError } = await supabase
            .from('user_accounts')
            .select('id')
            .eq('username', username)
            .maybeSingle();
            
          if (userError || !userData) {
            console.error('Erreur lors de la récupération de l\'ID utilisateur:', userError);
            return { hours: 0, days: 0 };
          }
          
          // Récupérer l'horaire de live avec l'user_id trouvé
          const { data: scheduleData, error } = await supabase
            .from('live_schedules')
            .select('hours, days')
            .eq('creator_id', userData.id)
            .maybeSingle();
            
          if (error) {
            console.error('Erreur lors de la récupération des horaires:', error);
            return { hours: 0, days: 0 };
          }
          
          return scheduleData || { hours: 0, days: 0 };
        }
        
        // Si connecté avec Supabase Auth, utiliser directement l'userId
        const { data: scheduleData, error } = await supabase
          .from('live_schedules')
          .select('hours, days')
          .eq('creator_id', userId)
          .maybeSingle();

        if (error) {
          console.error('Erreur lors de la récupération des horaires:', error);
          return { hours: 0, days: 0 };
        }

        return scheduleData || { hours: 0, days: 0 };
      } catch (error) {
        console.error("Erreur lors de la récupération des horaires:", error);
        toast.error("Impossible de récupérer vos horaires de live");
        return { hours: 0, days: 0 };
      }
    }
  });

  // Récupérer les diamants du créateur pour ce mois-ci et le mois dernier
  const { data: diamondsData, isLoading: isLoadingDiamonds } = useQuery({
    queryKey: ["creator-diamonds"],
    queryFn: async () => {
      try {
        const username = localStorage.getItem('username');
        if (!username) return { currentMonth: 0, previousMonth: 0 };
        
        const now = new Date();
        const currentMonth = now.getMonth() + 1; // 1-12
        const currentYear = now.getFullYear();
        const previousMonth = currentMonth === 1 ? 12 : currentMonth - 1;
        const previousYear = currentMonth === 1 ? currentYear - 1 : currentYear;
        
        // Récupérer les diamants pour le mois actuel
        const { data: currentMonthData, error: currentError } = await supabase
          .from('creator_rewards')
          .select('diamonds_count')
          .eq('creator_id', username)
          .gte('created_at', `${currentYear}-${String(currentMonth).padStart(2, '0')}-01`)
          .lt('created_at', currentMonth === 12 
            ? `${currentYear + 1}-01-01` 
            : `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-01`);
        
        // Récupérer les diamants pour le mois précédent
        const { data: previousMonthData, error: previousError } = await supabase
          .from('creator_rewards')
          .select('diamonds_count')
          .eq('creator_id', username)
          .gte('created_at', `${previousYear}-${String(previousMonth).padStart(2, '0')}-01`)
          .lt('created_at', previousMonth === 12 
            ? `${previousYear + 1}-01-01` 
            : `${previousYear}-${String(previousMonth + 1).padStart(2, '0')}-01`);
        
        if (currentError || previousError) {
          console.error('Erreur lors de la récupération des diamants:', currentError || previousError);
          return { currentMonth: 0, previousMonth: 0, currentMonthName: MONTHS[currentMonth - 1], previousMonthName: MONTHS[previousMonth - 1] };
        }
        
        // Calculer le total des diamants pour chaque mois
        const currentMonthTotal = currentMonthData?.reduce((sum, item) => sum + (item.diamonds_count || 0), 0) || 0;
        const previousMonthTotal = previousMonthData?.reduce((sum, item) => sum + (item.diamonds_count || 0), 0) || 0;
        
        return { 
          currentMonth: currentMonthTotal, 
          previousMonth: previousMonthTotal,
          currentMonthName: MONTHS[currentMonth - 1],
          previousMonthName: MONTHS[previousMonth - 1] 
        };
      } catch (error) {
        console.error("Erreur lors de la récupération des diamants:", error);
        return { currentMonth: 0, previousMonth: 0, currentMonthName: '', previousMonthName: '' };
      }
    },
    enabled: role === 'creator' // Activer uniquement pour les créateurs
  });

  // Ces valeurs seraient normalement récupérées depuis une API
  const stats = [
    { title: "Matchs", value: 5, icon: <Trophy className="w-5 h-5" /> },
    { 
      title: "Heures/jour", 
      value: liveSchedule?.hours || 0, 
      icon: <Clock className="w-5 h-5" /> 
    },
    { 
      title: "Jours/semaine", 
      value: liveSchedule?.days || 0, 
      icon: <Calendar className="w-5 h-5" /> 
    },
    { title: "Objectifs", value: 3, icon: <Target className="w-5 h-5" /> },
  ];

  // Bouton de messagerie rapide
  const handleOpenMessages = () => {
    navigate("/messages");
  };

  // Bouton pour accéder aux formations
  const handleOpenTraining = () => {
    navigate("/training");
  };

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm border border-purple-900/20 rounded-xl p-4 flex flex-col items-center justify-center transition-all hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-900/10 group"
          >
            <div className="mb-2 text-purple-400/80 group-hover:text-purple-400 transition-colors duration-300">
              {stat.icon}
            </div>
            <div className="text-2xl font-bold text-white mb-1 group-hover:text-white/90">
              {isLoadingSchedule ? (
                <div className="h-6 w-8 bg-gray-800 animate-pulse rounded"></div>
              ) : (
                stat.value
              )}
            </div>
            <div className="text-gray-400 group-hover:text-gray-300 text-xs transition-colors duration-300">
              {stat.title}
            </div>
          </div>
        ))}
      </div>
      
      {/* Affichage des diamants pour les créateurs */}
      {role === 'creator' && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-indigo-900/80 to-purple-900/80 backdrop-blur-sm border border-indigo-500/20 rounded-xl p-4 flex items-center justify-between">
            <div className="flex flex-col">
              <div className="text-gray-400 text-xs mb-1">Vos diamants en {diamondsData?.currentMonthName}</div>
              <div className="text-2xl font-bold text-white flex items-center gap-2">
                {isLoadingDiamonds ? (
                  <div className="h-6 w-16 bg-indigo-800/50 animate-pulse rounded"></div>
                ) : (
                  <>
                    <Diamond className="h-5 w-5 text-indigo-400" />
                    {diamondsData?.currentMonth.toLocaleString()}
                  </>
                )}
              </div>
            </div>
            <div className="flex items-center">
              {(diamondsData?.previousMonth || 0) < (diamondsData?.currentMonth || 0) ? (
                <TrendingUp className="h-8 w-8 text-green-400" />
              ) : (
                <TrendingDown className="h-8 w-8 text-amber-400" />
              )}
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-violet-900/80 to-blue-900/80 backdrop-blur-sm border border-violet-500/20 rounded-xl p-4 flex items-center justify-between">
            <div className="flex flex-col">
              <div className="text-gray-400 text-xs mb-1">Vos diamants en {diamondsData?.previousMonthName}</div>
              <div className="text-2xl font-bold text-white flex items-center gap-2">
                {isLoadingDiamonds ? (
                  <div className="h-6 w-16 bg-violet-800/50 animate-pulse rounded"></div>
                ) : (
                  <>
                    <Diamond className="h-5 w-5 text-violet-400" />
                    {diamondsData?.previousMonth.toLocaleString()}
                  </>
                )}
              </div>
            </div>
            <div className="p-2 rounded-full bg-violet-800/30">
              <Award className="h-6 w-6 text-violet-300" />
            </div>
          </div>
        </div>
      )}
      
      {/* Boutons d'accès rapide */}
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        <Button
          onClick={handleOpenMessages}
          className="bg-indigo-700 hover:bg-indigo-800 text-white flex items-center gap-2 px-6 py-2 rounded-lg transition-all duration-300 shadow-md hover:shadow-indigo-700/20"
        >
          <MessageSquare className="h-5 w-5" />
          {isMobile ? "Messages" : "Accéder à la messagerie"}
        </Button>
        
        <Button
          onClick={handleOpenTraining}
          className="bg-purple-700 hover:bg-purple-800 text-white flex items-center gap-2 px-6 py-2 rounded-lg transition-all duration-300 shadow-md hover:shadow-purple-700/20"
        >
          <BookOpen className="h-5 w-5" />
          {isMobile ? "Formations" : "Nos formations"}
        </Button>
      </div>
    </>
  );
};
