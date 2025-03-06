
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { Download, Trash2, Trophy, X, Clock, Calendar, Edit } from "lucide-react";
import { useState } from "react";
import { EditMatchDialog } from "../matches/EditMatchDialog";

interface MatchCardProps {
  match: any;
  canManageMatch: boolean;
  canDeleteMatch: boolean;
  role: string;
  onSetWinner: (matchId: string, winnerId: string) => void;
  onClearWinner: (matchId: string) => void;
  onDelete: (matchId: string) => void;
  onDownload: (imageUrl: string, fileName: string) => void;
  onUpdateMatch?: (matchId: string, updatedData: any) => Promise<void>;
}

export const MatchCard = ({
  match,
  canManageMatch,
  canDeleteMatch,
  role,
  onSetWinner,
  onClearWinner,
  onDelete,
  onDownload,
  onUpdateMatch
}: MatchCardProps) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const isMatchOff = match.status === 'off' || match.status === 'completed_off';
  const showRequirements = ['agent', 'manager', 'creator'].includes(role);
  const isFounder = role === 'founder';

  const matchTime = new Date(match.match_date).toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div 
      className={`p-3 border rounded-lg transition-all duration-300 bg-[#333333] shadow-lg hover:shadow-xl ${
        match.winner_id ? 'bg-gradient-to-r from-gray-700 to-gray-800' : ''
      } ${isMatchOff ? 'opacity-75 bg-gray-700' : ''}`}
    >
      <div className="mb-2 text-center">
        <h3 className="text-white text-sm">Match de L'agence pour tout le monde</h3>
      </div>
      <div className="flex items-center justify-between gap-4">
        {/* Section gauche: Infos principales */}
        <div className="flex items-center gap-4 min-w-0 flex-1">
          <div className="min-w-0">
            <p className="font-bold text-white truncate">{match.creator_id} vs {match.opponent_id}</p>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-purple-400" />
                <span className="text-xs text-gray-300">{formatDate(match.match_date)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-purple-400" />
                <span className="text-xs text-gray-300">{matchTime}</span>
              </div>
              {isMatchOff ? (
                <span className="px-2 py-0.5 rounded-full bg-red-500/20 border border-red-500/30 text-white text-xs">
                  SANS BOOST
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full bg-green-500/20 border border-green-500/30 text-white text-xs">
                  AVEC BOOST
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Section centrale: Gestion du gagnant */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {match.winner_id ? (
            <div className="flex items-center gap-2 px-3 py-1 bg-gray-600/50 rounded-lg border border-gray-500/30">
              <Trophy className="w-4 h-4 text-yellow-500" />
              <span className="text-sm text-white font-medium whitespace-nowrap">
                {match.winner_id}
              </span>
              {canManageMatch && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-5 w-5 p-0 text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-full"
                  onClick={() => onClearWinner(match.id)}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
          ) : (
            canManageMatch && (
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs bg-gray-600/50 text-white border-gray-500/30 hover:bg-gray-700"
                  onClick={() => onSetWinner(match.id, match.creator_id)}
                >
                  {match.creator_id}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs bg-gray-600/50 text-white border-gray-500/30 hover:bg-gray-700"
                  onClick={() => onSetWinner(match.id, match.opponent_id)}
                >
                  {match.opponent_id}
                </Button>
              </div>
            )
          )}
        </div>

        {/* Section droite: Actions */}
        <div className="flex items-center gap-1 flex-shrink-0">
          {isFounder && onUpdateMatch && (
            <Button
              variant="outline"
              size="sm"
              className="h-7 bg-gray-600/50 text-blue-400 border-blue-500/30 hover:bg-blue-900/30"
              onClick={() => setIsEditDialogOpen(true)}
            >
              <Edit className="w-3.5 h-3.5" />
            </Button>
          )}
          {match.match_image && (
            <Button
              variant="outline"
              size="sm"
              className="h-7 bg-gray-600/50 text-white border-gray-500/30 hover:bg-gray-700"
              onClick={() => onDownload(
                match.match_image,
                `match_${match.creator_id}_vs_${match.opponent_id}`
              )}
            >
              <Download className="w-3.5 h-3.5" />
            </Button>
          )}
          {canDeleteMatch && (
            <Button
              variant="outline"
              size="sm"
              className="h-7 bg-gray-600/50 text-red-400 border-red-500/30 hover:bg-red-900/30"
              onClick={() => onDelete(match.id)}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          )}
        </div>
      </div>

      {isFounder && onUpdateMatch && (
        <EditMatchDialog 
          isOpen={isEditDialogOpen}
          onClose={() => setIsEditDialogOpen(false)}
          match={match}
          onUpdate={onUpdateMatch}
        />
      )}
    </div>
  );
};
