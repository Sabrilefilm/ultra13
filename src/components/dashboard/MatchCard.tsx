
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
      className={`flex flex-col space-y-3 p-4 border rounded-lg transition-all duration-300 bg-[#333333] shadow-lg hover:shadow-xl ${
        match.winner_id ? 'bg-gradient-to-r from-gray-700 to-gray-800' : ''
      } ${isMatchOff ? 'opacity-75 bg-gray-700' : ''}`}
    >
      {showRequirements && (
        <div className="bg-red-100 border-2 border-red-500 rounded-lg p-3 mb-2 shadow-lg transform hover:scale-[1.02] transition-transform">
          <p className="text-lg font-bold text-red-600 text-center tracking-wide mb-2">
            OBJECTIFS DU MATCH
          </p>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center justify-center space-x-2 bg-red-50 p-2 rounded-lg">
              <Calendar className="w-5 h-5 text-red-500" />
              <span className="text-red-600 font-medium">7 Jours</span>
            </div>
            <div className="flex items-center justify-center space-x-2 bg-red-50 p-2 rounded-lg">
              <Timer className="w-5 h-5 text-red-500" />
              <span className="text-red-600 font-medium">15h Live</span>
            </div>
            <div className="col-span-2 flex items-center justify-center gap-2 bg-red-50 p-2 rounded-lg">
              <span className="text-red-500 font-semibold text-base">💎</span>
              <span className="text-red-600 font-medium">100 Diamants</span>
            </div>
          </div>
        </div>
      )}
      
      <div className="flex flex-col space-y-2">
        <div className="flex justify-between items-start mb-2">
          <div>
            <p className="font-bold text-lg text-white mb-1">{match.creator_id} vs {match.opponent_id}</p>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 bg-gray-700/50 px-2.5 py-1 rounded-full">
                <Calendar className="w-4 h-4 text-purple-400" />
                <span className="text-sm text-gray-300">{formatDate(match.match_date)}</span>
              </div>
              <div className="flex items-center gap-1 bg-gray-700/50 px-2.5 py-1 rounded-full">
                <Clock className="w-4 h-4 text-purple-400" />
                <span className="text-sm text-gray-300">{matchTime}</span>
              </div>
            </div>
          </div>
          {isMatchOff && (
            <div className="px-3 py-1 rounded-full bg-red-500/20 border border-red-500/30 text-red-400 text-sm font-medium">
              Match Off
            </div>
          )}
        </div>

        {match.match_image && (
          <div className="w-full aspect-video relative rounded-lg overflow-hidden">
            <img
              src={match.match_image}
              alt={`${match.creator_id} vs ${match.opponent_id}`}
              className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity" />
          </div>
        )}

        <div className="flex items-center gap-2 mt-2">
          {match.winner_id ? (
            <div className="flex-grow bg-gray-600/50 shadow-lg text-white px-4 py-2 rounded-lg inline-flex items-center gap-2 border border-gray-500/30">
              <Trophy className="w-5 h-5 text-yellow-500" />
              <span className="text-sm text-white font-medium">
                Gagnant : {match.winner_id}
              </span>
              {canManageMatch && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-auto h-6 w-6 p-0 text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-full"
                  onClick={() => onClearWinner(match.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ) : (
            canManageMatch && (
              <div className="flex gap-2 flex-grow">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 bg-gray-600/50 text-white border-gray-500/30 hover:bg-gray-700 hover:text-white"
                  onClick={() => onSetWinner(match.id, match.creator_id)}
                >
                  {match.creator_id} gagne
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 bg-gray-600/50 text-white border-gray-500/30 hover:bg-gray-700 hover:text-white"
                  onClick={() => onSetWinner(match.id, match.opponent_id)}
                >
                  {match.opponent_id} gagne
                </Button>
              </div>
            )
          )}
          
          <div className="flex gap-2">
            {match.match_image && (
              <Button
                variant="outline"
                size="sm"
                className="bg-gray-600/50 text-white border-gray-500/30 hover:bg-gray-700 hover:text-white"
                onClick={() => onDownload(
                  match.match_image,
                  `match_${match.creator_id}_vs_${match.opponent_id}`
                )}
              >
                <Download className="w-4 h-4" />
              </Button>
            )}
            {canDeleteMatch && (
              <Button
                variant="outline"
                size="sm"
                className="bg-gray-600/50 text-red-400 border-red-500/30 hover:bg-red-900/30 hover:text-red-300"
                onClick={() => onDelete(match.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
