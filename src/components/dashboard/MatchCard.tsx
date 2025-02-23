
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
      className={`flex flex-col h-full aspect-square max-w-md rounded-2xl shadow-lg transition-all duration-300 overflow-hidden ${
        match.winner_id ? 'bg-gradient-to-br from-white to-gray-50' : 'bg-white'
      } ${isMatchOff ? 'opacity-75 bg-gray-100' : ''}`}
    >
      {match.match_image && (
        <div className="w-full h-1/2 relative">
          <img
            src={match.match_image}
            alt={`${match.creator_id} vs ${match.opponent_id}`}
            className="w-full h-full object-cover"
          />
          {isMatchOff && (
            <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-red-100 text-red-600 text-sm font-medium border border-red-200">
              Match Off
            </div>
          )}
        </div>
      )}
      
      <div className="flex flex-col flex-grow p-4 space-y-4">
        {showRequirements && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 shadow-sm">
            <p className="text-base font-semibold text-red-600 text-center mb-2">
              OBJECTIFS DU MATCH
            </p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-2 bg-white p-2 rounded-lg border border-red-100">
                <Calendar className="w-4 h-4 text-red-500" />
                <span className="text-red-600 font-medium">7 Jours</span>
              </div>
              <div className="flex items-center gap-2 bg-white p-2 rounded-lg border border-red-100">
                <Timer className="w-4 h-4 text-red-500" />
                <span className="text-red-600 font-medium">15h Live</span>
              </div>
              <div className="col-span-2 flex items-center justify-center gap-2 bg-white p-2 rounded-lg border border-red-100">
                <span className="text-red-500 font-semibold text-base">💎</span>
                <span className="text-red-600 font-medium">100 Diamants</span>
              </div>
            </div>
          </div>
        )}

        <div className="flex-grow">
          <p className="font-semibold text-lg text-gray-900">{match.creator_id} vs {match.opponent_id}</p>
          <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
            <Calendar className="w-4 h-4" />
            {formatDate(match.match_date)}
            <Clock className="w-4 h-4 ml-2" />
            {matchTime}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 mt-auto">
          {match.winner_id ? (
            <div className="flex-grow bg-white shadow-sm border rounded-lg p-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
                <span className="text-sm font-medium">
                  Gagnant : {match.winner_id}
                </span>
              </div>
              {canManageMatch && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 text-gray-500 hover:text-black hover:bg-gray-100 rounded-full"
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
                  className="flex-1 bg-white text-black border-gray-200 hover:bg-gray-50"
                  onClick={() => onSetWinner(match.id, match.creator_id)}
                >
                  {match.creator_id} gagne
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 bg-white text-black border-gray-200 hover:bg-gray-50"
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
                className="bg-white text-black border-gray-200 hover:bg-gray-50"
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
                className="bg-white text-red-500 border-red-200 hover:bg-red-50"
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
