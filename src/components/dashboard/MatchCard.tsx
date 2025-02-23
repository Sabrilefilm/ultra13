
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

  // Format de l'heure
  const matchTime = new Date(match.match_date).toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div 
      className={`flex flex-col space-y-4 p-4 border rounded-lg transition-all duration-300 ${
        match.winner_id ? 'bg-gradient-to-r from-gray-50 to-white' : ''
      } ${isMatchOff ? 'opacity-75 bg-gray-100' : ''}`}
    >
      {showRequirements && (
        <div className="animate-bounce bg-red-100 border-2 border-red-500 rounded-lg p-4 mb-4 shadow-lg">
          <p className="text-lg font-bold text-red-600 text-center tracking-wide">
            OBJECTIFS DU MATCH
          </p>
          <div className="flex flex-col items-center mt-2 space-y-3">
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-red-500" />
                <span className="text-red-600 font-medium">7 Jours</span>
              </div>
              <div className="flex items-center space-x-2">
                <Timer className="w-5 h-5 text-red-500" />
                <span className="text-red-600 font-medium">15 Heures de Live</span>
                <Clock className="w-4 h-4 text-red-400 animate-pulse" />
              </div>
            </div>
            <div className="flex items-center gap-2 bg-red-200 px-4 py-2 rounded-full">
              <span className="text-red-500 font-semibold text-base">💎</span>
              <span className="text-red-600 font-medium">100 Diamants</span>
            </div>
          </div>
        </div>
      )}
      {match.match_image && (
        <div className="w-full aspect-video relative rounded-lg overflow-hidden">
          <img
            src={match.match_image}
            alt={`${match.creator_id} vs ${match.opponent_id}`}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="flex flex-col space-y-2">
        {isMatchOff && (
          <div className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-red-100 text-red-600 text-sm font-medium">
            Match Off
          </div>
        )}
      </div>
      <div className="mt-auto">
        <div className="flex justify-between items-end">
          <div>
            <p className="font-medium text-black">{match.creator_id} vs {match.opponent_id}</p>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4" />
              {formatDate(match.match_date)}
              <Clock className="w-4 h-4 ml-2" />
              {matchTime}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {match.winner_id ? (
              <div className="animate-fade-in bg-white shadow-lg border text-black px-4 py-2 rounded-full inline-flex items-center gap-2 font-bold">
                <Trophy className="w-5 h-5 text-yellow-500" />
                <span className="text-sm text-black">
                  Gagnant : {match.winner_id}
                </span>
                {canManageMatch && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-2 h-6 w-6 p-0 text-gray-600 hover:text-black hover:bg-gray-100"
                    onClick={() => onClearWinner(match.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ) : (
              canManageMatch && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-white text-black border-gray-200 hover:bg-gray-100 hover:text-black"
                    onClick={() => onSetWinner(match.id, match.creator_id)}
                  >
                    {match.creator_id} gagne
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-white text-black border-gray-200 hover:bg-gray-100 hover:text-black"
                    onClick={() => onSetWinner(match.id, match.opponent_id)}
                  >
                    {match.opponent_id} gagne
                  </Button>
                </div>
              )
            )}
            {match.match_image && (
              <Button
                variant="outline"
                size="sm"
                className="bg-white text-black border-gray-200 hover:bg-gray-100 hover:text-black"
                onClick={() => onDownload(
                  match.match_image,
                  `match_${match.creator_id}_vs_${match.opponent_id}`
                )}
              >
                <Download className="w-4 h-4 mr-2" />
                Télécharger
              </Button>
            )}
            {canDeleteMatch && (
              <Button
                variant="outline"
                size="sm"
                className="bg-white text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
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
