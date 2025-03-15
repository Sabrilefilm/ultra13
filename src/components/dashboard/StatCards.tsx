
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
    { title: "Matchs", value: 5, icon: <Trophy className="w-5 h-5" /> },
    { title: "Heures de live", value: 42, icon: <Clock className="w-5 h-5" /> },
    { title: "Jours streamés", value: 7, icon: <Calendar className="w-5 h-5" /> },
    { title: "Objectifs", value: 3, icon: <Target className="w-5 h-5" /> },
    { title: "Récompenses", value: 2, icon: <Award className="w-5 h-5" /> }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
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
  );
};
