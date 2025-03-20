
import {
  Trophy,
  Clock,
  Calendar,
  Target,
  Award,
  MessageSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useMediaQuery } from "@/hooks/use-media-query";

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
  const { data: liveSchedule, isLoading } = useQuery({
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

  // Ces valeurs seraient normalement récupérées depuis une API
  const stats = [
    { title: "Matchs", value: 5, icon: <Trophy className="w-5 h-5" /> },
    { 
      title: "Heures de live", 
      value: liveSchedule?.hours || 0, 
      icon: <Clock className="w-5 h-5" /> 
    },
    { 
      title: "Jours streamés", 
      value: liveSchedule?.days || 0, 
      icon: <Calendar className="w-5 h-5" /> 
    },
    { title: "Objectifs", value: 3, icon: <Target className="w-5 h-5" /> },
  ];

  // Bouton de messagerie rapide
  const handleOpenMessages = () => {
    navigate("/messages");
  };

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-[#1e1f2e]/90 backdrop-blur-sm border border-gray-800/50 rounded-xl p-4 flex flex-col items-center justify-center transition-all hover:border-purple-700/30 hover:shadow-lg hover:shadow-purple-900/10 group"
          >
            <div className="mb-2 text-purple-400/80 group-hover:text-purple-400 transition-colors duration-300">
              {stat.icon}
            </div>
            <div className="text-2xl font-bold text-white mb-1 group-hover:text-white/90">
              {isLoading ? (
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
      
      {/* Bouton d'accès rapide à la messagerie */}
      <div className="flex justify-center mt-4">
        <Button
          onClick={handleOpenMessages}
          className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2"
        >
          <MessageSquare className="h-5 w-5" />
          {isMobile ? "Messages" : "Messagerie"}
        </Button>
      </div>
    </>
  );
};
