
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { Download, Trash2, Trophy, X, Clock, Calendar, Edit, FilePenLine } from "lucide-react";
import { useState } from "react";
import { EditMatchDialog } from "../matches/EditMatchDialog";
import { Input } from "@/components/ui/input";

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
  const [points, setPoints] = useState(match.points?.toString() || "");
  const isMatchOff = match.status === 'off' || match.status === 'completed_off';
  const showRequirements = ['agent', 'manager', 'creator'].includes(role);
  const canEdit = ['agent', 'manager', 'founder'].includes(role);
  const isPastMatch = new Date(match.match_date) < new Date();
  
  const handlePointsUpdate = () => {
    if (onUpdateMatch && match.winner_id) {
      onUpdateMatch(match.id, { points: parseInt(points) || 0 });
    }
  };

  const matchTime = new Date(match.match_date).toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit'
  });

  // Custom style based on match status
  const getCardStyle = () => {
    if (match.winner_id) {
      return "bg-gradient-to-r from-indigo-50 to-purple-50 border-purple-200";
    }
    if (isMatchOff) {
      return "bg-gray-50 border-gray-200";
    }
    if (isPastMatch && !match.winner_id) {
      return "bg-gray-50 opacity-70 border-gray-200";
    }
    return "bg-white border-gray-200 hover:border-purple-300";
  };

  return (
    <div 
      className={`rounded-xl shadow-sm border transition-all duration-300 hover:shadow-md ${getCardStyle()}`}
    >
      <div className="p-4">
        <div className="mb-2 text-center">
          <h3 className="text-purple-800 text-xs font-medium tracking-wide uppercase">Match de L'agence</h3>
        </div>
        
        {/* Main match info */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          {/* Left section: Main info */}
          <div className="flex items-center gap-4 min-w-0 flex-1">
            <div className="min-w-0">
              <p className="font-bold text-gray-800 text-lg mb-1.5">{match.creator_id} <span className="text-gray-400 mx-1">vs</span> {match.opponent_id}</p>
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1 text-gray-600">
                  <Calendar className="w-3.5 h-3.5 text-purple-500" />
                  <span className="text-sm">{formatDate(match.match_date)}</span>
                </div>
                <div className="flex items-center gap-1 text-gray-600">
                  <Clock className="w-3.5 h-3.5 text-purple-500" />
                  <span className="text-sm">{matchTime}</span>
                </div>
                {isMatchOff ? (
                  <span className="px-2 py-0.5 rounded-full bg-red-50 border border-red-100 text-red-600 text-xs font-medium">
                    SANS BOOST
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full bg-green-50 border border-green-100 text-green-600 text-xs font-medium">
                    AVEC BOOST
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Right section: Actions and winner */}
          <div className="flex flex-col md:flex-row items-end md:items-center gap-3 mt-2 md:mt-0">
            {/* Winner section */}
            {match.winner_id ? (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-100/70 rounded-lg border border-purple-200">
                <Trophy className="w-4 h-4 text-yellow-500" />
                <span className="text-sm text-purple-800 font-medium whitespace-nowrap">
                  {match.winner_id}
                </span>
                {canManageMatch && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-5 w-5 p-0 text-purple-400 hover:text-purple-700 hover:bg-purple-100 rounded-full"
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
                    className="h-7 text-xs bg-white text-purple-700 border-purple-200 hover:bg-purple-50"
                    onClick={() => onSetWinner(match.id, match.creator_id)}
                  >
                    {match.creator_id}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs bg-white text-purple-700 border-purple-200 hover:bg-purple-50"
                    onClick={() => onSetWinner(match.id, match.opponent_id)}
                  >
                    {match.opponent_id}
                  </Button>
                </div>
              )
            )}

            {/* Action buttons */}
            <div className="flex items-center gap-1.5">
              {canEdit && onUpdateMatch && (
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 bg-white text-blue-600 border-blue-200 hover:bg-blue-50"
                  onClick={() => setIsEditDialogOpen(true)}
                >
                  <Edit className="w-3.5 h-3.5" />
                </Button>
              )}
              {match.match_image && (
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
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
                  className="h-7 bg-white text-red-600 border-red-200 hover:bg-red-50"
                  onClick={() => onDelete(match.id)}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Points section for won matches */}
        {match.winner_id && (
          <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-2">
            <div className="flex-1"></div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-700 font-medium">Points:</span>
              <Input
                type="number"
                value={points}
                onChange={(e) => setPoints(e.target.value)}
                className="w-20 h-7 bg-white text-gray-800 border-gray-200 focus:border-purple-400"
              />
              <Button
                variant="outline"
                size="sm"
                className="h-7 bg-white text-green-600 border-green-200 hover:bg-green-50"
                onClick={handlePointsUpdate}
              >
                <FilePenLine className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        )}

        {canEdit && onUpdateMatch && (
          <EditMatchDialog 
            isOpen={isEditDialogOpen}
            onClose={() => setIsEditDialogOpen(false)}
            match={match}
            onUpdate={onUpdateMatch}
          />
        )}
      </div>
    </div>
  );
};
