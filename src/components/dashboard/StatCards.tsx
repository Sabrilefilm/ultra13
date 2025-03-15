
import {
  Trophy,
  Clock,
  Calendar,
  Target,
  Award
} from "lucide-react";

interface StatCardsProps {
  role: string;
}

export const StatCards = ({ role }: StatCardsProps) => {
  // Ces valeurs seraient normalement récupérées depuis une API
  const stats = [
    { title: "Matchs", value: 0, icon: <Trophy className="w-6 h-6" /> },
    { title: "Heures de live", value: 0, icon: <Clock className="w-6 h-6" /> },
    { title: "Jours streamés", value: 0, icon: <Calendar className="w-6 h-6" /> },
    { title: "Objectifs", value: 0, icon: <Target className="w-6 h-6" /> },
    { title: "Récompenses", value: 0, icon: <Award className="w-6 h-6" /> }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-gradient-to-br from-[#1e293b]/90 to-[#1e293b]/70 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 flex flex-col items-center justify-center transition-all hover:from-[#1e293b] hover:to-[#1e293b]/90 hover:border-purple-700/30 hover:shadow-lg hover:shadow-purple-900/10 group"
        >
          <div className="mb-2 text-purple-400/80 group-hover:text-purple-400 transition-colors duration-300">
            {stat.icon}
          </div>
          <div className="text-3xl font-bold text-white mb-1 group-hover:text-white/90">{stat.value}</div>
          <div className="text-gray-400 group-hover:text-gray-300 text-sm transition-colors duration-300">
            {stat.title}
          </div>
        </div>
      ))}
    </div>
  );
};
