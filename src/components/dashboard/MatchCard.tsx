
import { formatDate } from "@/lib/utils";
import { Timer, Clock, Calendar } from "lucide-react";
import { MatchCardButtons } from "./MatchCardButtons";

interface MatchCardProps {
  match: any;
  canManageMatch: boolean;
  canDeleteMatch: boolean;
  role: string;
  onSetWinner: (matchId: string, winnerId: string) => void;
  onClearWinner: (matchId: string) => void;
  onDelete: (matchId: string) => void;
  onDownload: (imageUrl: string, fileName: string) => void;
}

export const MatchCard = ({
  match,
  canManageMatch,
  canDeleteMatch,
  role,
  onSetWinner,
  onClearWinner,
  onDelete,
  onDownload
}: MatchCardProps) => {
  const isMatchOff = match.status === 'off';
  const showRequirements = ['agent', 'manager', 'creator'].includes(role);

  const matchTime = new Date(match.match_date).toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit'
  });

  const getNeonStyle = () => {
    if (isMatchOff) return 'border-[3px] border-red-500/70 shadow-[0_0_20px_rgba(239,68,68,0.5)]';
    if (match.winner_id) return 'border-[3px] border-green-500/70 shadow-[0_0_20px_rgba(34,197,94,0.5)]';
    
    const hour = new Date(match.match_date).getHours();
    if (hour >= 22 || hour === 0) {
      return `
        border-[3px] 
        animate-[neon-pulse_4s_ease-in-out_infinite]
        before:absolute before:inset-0 before:border-[3px] before:rounded-xl
        before:animate-[neon-night_4s_ease-in-out_infinite]
        after:absolute after:inset-0 after:border-[3px] after:rounded-xl
        after:animate-[neon-night-2_4s_ease-in-out_infinite]
      `;
    }
    if (hour >= 12 && hour < 19) {
      return `
        border-[3px]
        animate-[neon-pulse_4s_ease-in-out_infinite]
        before:absolute before:inset-0 before:border-[3px] before:rounded-xl
        before:animate-[neon-day_4s_ease-in-out_infinite]
        after:absolute after:inset-0 after:border-[3px] after:rounded-xl
        after:animate-[neon-day-2_4s_ease-in-out_infinite]
      `;
    }
    return 'border-[3px] border-purple-500/70 shadow-[0_0_20px_rgba(139,92,246,0.5)]';
  };

  const getHoverStyle = () => {
    if (isMatchOff) return 'hover:shadow-[0_0_30px_rgba(239,68,68,0.6)] hover:border-red-400/80';
    if (match.winner_id) return 'hover:shadow-[0_0_30px_rgba(34,197,94,0.6)] hover:border-green-400/80';
    
    const hour = new Date(match.match_date).getHours();
    if (hour >= 22 || hour === 0) return 'hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] hover:border-blue-400/80';
    if (hour >= 12 && hour < 19) return 'hover:shadow-[0_0_30px_rgba(14,165,233,0.6)] hover:border-sky-400/80';
    return 'hover:shadow-[0_0_30px_rgba(139,92,246,0.6)] hover:border-purple-400/80';
  };

  return (
    <div 
      className={`group relative flex flex-col h-[280px] w-full max-w-[240px] rounded-xl transition-all duration-300 overflow-hidden backdrop-blur-sm bg-gradient-to-br from-gray-900/95 to-gray-950/95 ${getNeonStyle()} ${
        isMatchOff ? 'opacity-75 grayscale' : ''
      } ${getHoverStyle()} hover:scale-[1.02]`}
    >
      {match.match_image && (
        <div className="w-full h-[120px] relative overflow-hidden">
          <img
            src={match.match_image}
            alt={`${match.creator_id} vs ${match.opponent_id}`}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
          {isMatchOff && (
            <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-red-500/90 text-white text-xs font-medium border border-red-400 shadow-lg backdrop-blur-sm">
              Match Off
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-50" />
        </div>
      )}
      
      <div className="flex flex-col flex-grow p-3 space-y-2">
        {showRequirements && (
          <div className="bg-gradient-to-r from-red-900/40 to-red-800/30 backdrop-blur-sm border border-red-800/50 rounded-lg p-2 shadow-inner">
            <p className="text-sm font-semibold text-red-100 text-center mb-1 tracking-wide">
              OBJECTIFS DU MATCH
            </p>
            <div className="grid grid-cols-2 gap-1 text-xs">
              <div className="flex items-center gap-1.5 bg-red-950/50 p-1.5 rounded-md border border-red-800/50 backdrop-blur-sm">
                <Calendar className="w-3 h-3 text-red-400" />
                <span className="text-red-100 font-medium">7 Jours</span>
              </div>
              <div className="flex items-center gap-1.5 bg-red-950/50 p-1.5 rounded-md border border-red-800/50 backdrop-blur-sm">
                <Timer className="w-3 h-3 text-red-400" />
                <span className="text-red-100 font-medium">15h Live</span>
              </div>
              <div className="col-span-2 flex items-center justify-center gap-1.5 bg-red-950/50 p-1.5 rounded-md border border-red-800/50 backdrop-blur-sm">
                <span className="text-red-400 font-bold text-base">💎</span>
                <span className="text-red-100 font-medium">100 Diamants</span>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col flex-grow justify-between min-h-0">
          <div>
            <p className="font-bold text-base text-white truncate tracking-wide">
              {match.creator_id} vs {match.opponent_id}
            </p>
            <div className="flex items-center gap-1.5 text-xs text-gray-300/90 mt-1">
              <div className="flex items-center gap-1 bg-gray-800/50 px-2 py-1 rounded-full">
                <Calendar className="w-3 h-3 text-purple-400" />
                <span>{formatDate(match.match_date)}</span>
              </div>
              <div className="flex items-center gap-1 bg-gray-800/50 px-2 py-1 rounded-full">
                <Clock className="w-3 h-3 text-purple-400" />
                <span>{matchTime}</span>
              </div>
            </div>
          </div>

          <MatchCardButtons
            match={match}
            canManageMatch={canManageMatch}
            canDeleteMatch={canDeleteMatch}
            onSetWinner={onSetWinner}
            onClearWinner={onClearWinner}
            onDelete={onDelete}
            onDownload={onDownload}
          />
        </div>
      </div>
    </div>
  );
};
