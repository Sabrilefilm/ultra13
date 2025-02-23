
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { Download, Trash2, Trophy, X, Timer, Clock, Calendar } from "lucide-react";

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

  return (
    <div 
      className={`flex flex-col h-[280px] w-full max-w-[240px] rounded-xl shadow-lg transition-all duration-300 overflow-hidden ${
        match.winner_id ? 'bg-gradient-to-br from-black to-gray-900' : 'bg-black'
      } ${isMatchOff ? 'opacity-75' : ''}`}
    >
      <div className="flex items-center justify-between p-2 bg-gray-900/50">
        {match.winner_id ? (
          <div className="flex items-center gap-1 flex-grow">
            <Trophy className="w-4 h-4 text-yellow-500" />
            <span className="text-xs font-medium text-white truncate">
              Gagnant : {match.winner_id}
            </span>
            {canManageMatch && (
              <Button
                variant="ghost"
                size="sm"
                className="h-5 w-5 p-0 ml-1 text-gray-400 hover:text-white hover:bg-gray-800 rounded-full"
                onClick={() => onClearWinner(match.id)}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        ) : (
          canManageMatch && (
            <div className="flex gap-1 flex-grow">
              <Button
                variant="outline"
                size="sm"
                className="h-6 text-xs flex-1 bg-gray-900 text-white border-gray-700 hover:bg-gray-800"
                onClick={() => onSetWinner(match.id, match.creator_id)}
              >
                {match.creator_id} gagne
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-6 text-xs flex-1 bg-gray-900 text-white border-gray-700 hover:bg-gray-800"
                onClick={() => onSetWinner(match.id, match.opponent_id)}
              >
                {match.opponent_id} gagne
              </Button>
            </div>
          )
        )}
        <div className="flex gap-1 ml-1">
          {match.match_image && (
            <Button
              variant="outline"
              size="sm"
              className="h-6 bg-gray-900 text-white border-gray-700 hover:bg-gray-800"
              onClick={() => onDownload(
                match.match_image,
                `match_${match.creator_id}_vs_${match.opponent_id}`
              )}
            >
              <Download className="w-3 h-3" />
            </Button>
          )}
          {canDeleteMatch && (
            <Button
              variant="outline"
              size="sm"
              className="h-6 bg-gray-900 text-red-400 border-red-900/50 hover:bg-red-950/50"
              onClick={() => onDelete(match.id)}
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          )}
        </div>
      </div>

      {match.match_image && (
        <div className="w-full h-[120px] relative">
          <img
            src={match.match_image}
            alt={`${match.creator_id} vs ${match.opponent_id}`}
            className="w-full h-full object-cover"
          />
          {isMatchOff && (
            <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-red-900/80 text-red-100 text-xs font-medium border border-red-700">
              Match Off
            </div>
          )}
        </div>
      )}
      
      <div className="flex flex-col flex-grow p-3 space-y-2">
        {showRequirements && (
          <div className="bg-red-900/30 border border-red-800 rounded-lg p-2">
            <p className="text-sm font-semibold text-red-100 text-center mb-1">
              OBJECTIFS DU MATCH
            </p>
            <div className="grid grid-cols-2 gap-1 text-xs">
              <div className="flex items-center gap-1 bg-red-950/50 p-1.5 rounded-md border border-red-800">
                <Calendar className="w-3 h-3 text-red-400" />
                <span className="text-red-100 font-medium">7 Jours</span>
              </div>
              <div className="flex items-center gap-1 bg-red-950/50 p-1.5 rounded-md border border-red-800">
                <Timer className="w-3 h-3 text-red-400" />
                <span className="text-red-100 font-medium">15h Live</span>
              </div>
              <div className="col-span-2 flex items-center justify-center gap-1 bg-red-950/50 p-1.5 rounded-md border border-red-800">
                <span className="text-red-400 font-semibold text-xs">💎</span>
                <span className="text-red-100 font-medium">100 Diamants</span>
              </div>
            </div>
          </div>
        )}

        <div className="flex-grow min-h-0">
          <p className="font-semibold text-base text-white truncate">{match.creator_id} vs {match.opponent_id}</p>
          <div className="flex items-center gap-1 text-xs text-gray-300 mt-0.5">
            <Calendar className="w-3 h-3" />
            {formatDate(match.match_date)}
            <Clock className="w-3 h-3 ml-1" />
            {matchTime}
          </div>
        </div>
      </div>
    </div>
  );
};
