
import { Button } from "@/components/ui/button";
import { Download, Trash2, Trophy, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MatchCardButtonsProps {
  match: {
    id: string;
    creator_id: string;
    opponent_id: string;
    winner_id: string | null;
    match_image?: string;
  };
  canManageMatch: boolean;
  canDeleteMatch: boolean;
  onSetWinner: (matchId: string, winnerId: string) => void;
  onClearWinner: (matchId: string) => void;
  onDelete: (matchId: string) => void;
  onDownload: (imageUrl: string, fileName: string) => void;
}

export const MatchCardButtons = ({
  match,
  canManageMatch,
  canDeleteMatch,
  onSetWinner,
  onClearWinner,
  onDelete,
  onDownload,
}: MatchCardButtonsProps) => {
  const { toast } = useToast();

  const handleSetWinner = (matchId: string, winnerId: string) => {
    console.log("Setting winner:", { matchId, winnerId });
    onSetWinner(matchId, winnerId);
    toast({
      title: "Gagnant défini",
      description: `${winnerId} a été défini comme gagnant du match`,
      duration: 10000,
    });
  };

  const handleClearWinner = (matchId: string) => {
    console.log("Clearing winner:", matchId);
    onClearWinner(matchId);
    toast({
      title: "Gagnant effacé",
      description: "Le gagnant du match a été effacé",
      duration: 10000,
    });
  };

  const handleDelete = (matchId: string) => {
    console.log("Deleting match:", matchId);
    onDelete(matchId);
    toast({
      title: "Match supprimé",
      description: "Le match a été supprimé avec succès",
      duration: 10000,
    });
  };

  return (
    <div className="flex flex-wrap justify-between items-center gap-2 mt-2">
      {match.winner_id ? (
        <div className="flex-grow bg-purple-900/30 shadow-lg border border-purple-500/30 rounded-md p-1.5 flex items-center justify-between backdrop-blur-sm">
          <div className="flex items-center gap-1.5">
            <Trophy className="w-4 h-4 text-yellow-500" />
            <span className="text-xs font-medium text-purple-100 truncate">
              Gagnant : {match.winner_id}
            </span>
          </div>
          {canManageMatch && (
            <Button
              variant="ghost"
              size="sm"
              className="h-5 w-5 p-0 text-purple-300 hover:text-white hover:bg-purple-800/50 rounded-full"
              onClick={() => handleClearWinner(match.id)}
              type="button"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
      ) : (
        canManageMatch && (
          <div className="flex gap-1.5 flex-grow">
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-xs flex-1 bg-gray-800/50 text-white border-gray-700/50 hover:bg-purple-900/50 hover:border-purple-500/50 backdrop-blur-sm transition-colors"
              onClick={() => handleSetWinner(match.id, match.creator_id)}
              type="button"
            >
              {match.creator_id} gagne
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-xs flex-1 bg-gray-800/50 text-white border-gray-700/50 hover:bg-purple-900/50 hover:border-purple-500/50 backdrop-blur-sm transition-colors"
              onClick={() => handleSetWinner(match.id, match.opponent_id)}
              type="button"
            >
              {match.opponent_id} gagne
            </Button>
          </div>
        )
      )}
      <div className="flex gap-1.5">
        {match.match_image && (
          <Button
            variant="outline"
            size="sm"
            className="h-7 bg-gray-800/50 text-white border-gray-700/50 hover:bg-purple-900/50 hover:border-purple-500/50 backdrop-blur-sm transition-colors"
            onClick={() => onDownload(
              match.match_image!,
              `match_${match.creator_id}_vs_${match.opponent_id}`
            )}
            type="button"
          >
            <Download className="w-3 h-3" />
          </Button>
        )}
        {canDeleteMatch && (
          <Button
            variant="outline"
            size="sm"
            className="h-7 w-7 flex items-center justify-center bg-gray-800/50 text-red-400 border-red-900/50 hover:bg-red-900/30 hover:border-red-500/50 backdrop-blur-sm transition-colors"
            onClick={() => handleDelete(match.id)}
            type="button"
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        )}
      </div>
    </div>
  );
};
