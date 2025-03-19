
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
  
  // Ces valeurs seraient normalement récupérées depuis une API
  const stats = [
    { title: "Matchs", value: 5, icon: <Trophy className="w-5 h-5" /> },
    { title: "Heures de live", value: 42, icon: <Clock className="w-5 h-5" /> },
    { title: "Jours streamés", value: 7, icon: <Calendar className="w-5 h-5" /> },
    { title: "Objectifs", value: 3, icon: <Target className="w-5 h-5" /> },
  ];

  // Bouton de messagerie rapide
  const handleOpenMessages = () => {
    navigate("/messages");
  };

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-[#1e1f2e]/90 backdrop-blur-sm border border-gray-800/50 rounded-xl p-4 flex flex-col items-center justify-center transition-all hover:border-purple-700/30 hover:shadow-lg hover:shadow-purple-900/10 group"
          >
            <div className="mb-2 text-purple-400/80 group-hover:text-purple-400 transition-colors duration-300">
              {stat.icon}
            </div>
            <div className="text-2xl font-bold text-white mb-1 group-hover:text-white/90">{stat.value}</div>
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
          Messagerie
        </Button>
      </div>
    </>
  );
};
