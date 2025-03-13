
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { Download, Trash2, Trophy, X, Clock, Calendar, Edit, Check, Frown, PartyPopper } from "lucide-react";
import { useState, useEffect } from "react";
import { EditMatchDialog } from "../matches/EditMatchDialog";
import { Input } from "@/components/ui/input";
import { MatchTimer } from "../matches/MatchTimer";

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
  const [isEditingPoints, setIsEditingPoints] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
  
  const isMatchOff = match.status === 'off' || match.status === 'completed_off';
  const showRequirements = ['agent', 'manager', 'creator'].includes(role);
  const canEdit = ['agent', 'manager', 'founder'].includes(role);
  const canEditPoints = ['founder', 'agent'].includes(role);
  
  // Déterminer si c'est un match actuel (dans les 10 minutes autour de l'heure programmée)
  const matchDate = new Date(match.match_date);
  const now = new Date();
  const timeDiff = Math.abs(matchDate.getTime() - now.getTime());
  const isCurrentMatch = timeDiff < 10 * 60 * 1000; // 10 minutes en millisecondes
  
  const isPastMatch = new Date(match.match_date) < new Date();
  const isMainCreatorWinner = match.winner_id === match.creator_id;
  
  useEffect(() => {
    // Afficher automatiquement le chronomètre si le match est en cours
    if (isCurrentMatch && !match.winner_id) {
      setShowTimer(true);
    } else {
      setShowTimer(false);
    }
  }, [isCurrentMatch, match.winner_id]);
  
  const handlePointsUpdate = () => {
    if (onUpdateMatch && match.winner_id && canEditPoints) {
      onUpdateMatch(match.id, { points: parseInt(points) || 0 });
      setIsEditingPoints(false);
    }
  };

  const matchTime = new Date(match.match_date).toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit'
  });

  // Custom style based on match status
  const getCardStyle = () => {
    if (match.winner_id) {
      // Style spécial si notre créateur principal a gagné
      if (isMainCreatorWinner) {
        return "bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 dark:from-green-950/30 dark:to-emerald-950/30 dark:border-green-800/30";
      }
      // Style si un autre créateur a gagné
      return "bg-gradient-to-r from-red-50 to-rose-50 border-red-200 dark:from-red-950/30 dark:to-rose-950/30 dark:border-red-800/30";
    }
    if (isMatchOff) {
      return "bg-gray-50 border-gray-200 dark:bg-gray-900/50 dark:border-gray-700";
    }
    if (isPastMatch && !match.winner_id) {
      return "bg-gray-50 opacity-70 border-gray-200 dark:bg-gray-900/30 dark:border-gray-700";
    }
    if (isCurrentMatch) {
      return "bg-blue-50 border-blue-200 hover:border-blue-300 dark:bg-blue-900/20 dark:border-blue-800/30 dark:hover:border-blue-700/50 shadow-md";
    }
    return "bg-white border-gray-200 hover:border-purple-300 dark:bg-slate-900 dark:border-slate-700 dark:hover:border-purple-700";
  };

  // Fonction pour obtenir le statut du match
  const getMatchStatus = () => {
    if (match.winner_id) {
      return "Terminé";
    }
    if (isCurrentMatch) {
      return "En cours";
    }
    if (isPastMatch) {
      return "Non joué";
    }
    return "En attente";
  };

  return (
    <div 
      className={`rounded-xl shadow-sm border transition-all duration-300 hover:shadow-md ${getCardStyle()}`}
    >
      <div className="p-4">
        <div className="mb-2 text-center">
          <h3 className="text-xs font-medium tracking-wide uppercase dark:text-purple-400 badge-status badge-pending">
            {getMatchStatus()}
          </h3>
        </div>
        
        {/* Main match info */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          {/* Left section: Main info */}
          <div className="flex items-center gap-4 min-w-0 flex-1">
            <div className="min-w-0">
              <p className="font-bold text-gray-800 text-lg mb-1.5 dark:text-gray-200">
                {/* Affichage du premier créateur avec icône de victoire si gagnant */}
                <span className={isMainCreatorWinner ? "text-green-600 dark:text-green-400" : ""}>
                  {match.creator_id} 
                  {isMainCreatorWinner && (
                    <PartyPopper className="inline-block ml-1 w-4 h-4 text-yellow-500" />
                  )}
                </span>
                
                <span className="text-gray-400 mx-1">vs</span>
                
                {/* Affichage du deuxième créateur avec icône de victoire si gagnant */}
                <span className={match.winner_id === match.opponent_id ? "text-red-600 dark:text-red-400" : ""}>
                  {match.opponent_id}
                  {match.winner_id === match.opponent_id && (
                    <Frown className="inline-block ml-1 w-4 h-4 text-red-500" />
                  )}
                </span>
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                  <Calendar className="w-3.5 h-3.5 text-purple-500" />
                  <span className="text-sm">{formatDate(match.match_date)}</span>
                </div>
                <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                  <Clock className="w-3.5 h-3.5 text-purple-500" />
                  <span className="text-sm">{matchTime}</span>
                </div>
                {isMatchOff ? (
                  <span className="px-2 py-0.5 rounded-full bg-red-50 border border-red-100 text-red-600 text-xs font-medium dark:bg-red-900/30 dark:border-red-800/30 dark:text-red-400">
                    SANS BOOST
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full bg-green-50 border border-green-100 text-green-600 text-xs font-medium dark:bg-green-900/30 dark:border-green-800/30 dark:text-green-400">
                    AVEC BOOST
                  </span>
                )}
                
                {/* Badge match en cours */}
                {isCurrentMatch && !match.winner_id && (
                  <span className="px-2 py-0.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-medium animate-pulse dark:bg-blue-900/30 dark:border-blue-800/30 dark:text-blue-400">
                    EN COURS
                  </span>
                )}
                
                {/* Afficher l'agent concerné si disponible */}
                {match.source && (
                  <span className="px-2 py-0.5 rounded-full bg-purple-50 border border-purple-100 text-purple-600 text-xs font-medium dark:bg-purple-900/30 dark:border-purple-800/30 dark:text-purple-400">
                    Agent: {match.source}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Right section: Actions and winner */}
          <div className="flex flex-col md:flex-row items-end md:items-center gap-3 mt-2 md:mt-0">
            {/* Winner section */}
            {match.winner_id ? (
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${
                isMainCreatorWinner 
                  ? "bg-green-100/70 border-green-200 dark:bg-green-900/30 dark:border-green-800/30" 
                  : "bg-red-100/70 border-red-200 dark:bg-red-900/30 dark:border-red-800/30"
              }`}>
                <Trophy className={`w-4 h-4 ${isMainCreatorWinner ? "text-yellow-500" : "text-gray-500"}`} />
                <span className={`text-sm font-medium whitespace-nowrap ${
                  isMainCreatorWinner 
                    ? "text-green-800 dark:text-green-300" 
                    : "text-red-800 dark:text-red-300"
                }`}>
                  {match.winner_id}
                  {isEditingPoints && canEditPoints ? (
                    <div className="inline-flex items-center ml-2">
                      <Input
                        type="number"
                        value={points}
                        onChange={(e) => setPoints(e.target.value)}
                        className="w-16 h-6 bg-white text-gray-800 border-gray-200 focus:border-purple-400 px-1 text-xs dark:bg-slate-800 dark:border-slate-700 dark:text-gray-200"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-6 ml-1 p-0 w-6 bg-white text-green-600 border-green-200 hover:bg-green-50 dark:bg-slate-800 dark:border-green-800 dark:text-green-400 dark:hover:bg-slate-700"
                        onClick={handlePointsUpdate}
                      >
                        <Check className="w-3 h-3" />
                      </Button>
                    </div>
                  ) : (
                    match.points ? (
                      <span className="ml-2 px-2 py-0.5 bg-yellow-100 rounded text-yellow-700 text-xs font-medium dark:bg-yellow-900/40 dark:text-yellow-300">
                        {match.points} pts
                      </span>
                    ) : canEditPoints ? (
                      <Button
                        variant="outline"
                        size="sm"
                        className="ml-2 h-6 px-2 py-0 text-xs bg-white text-purple-600 border-purple-200 hover:bg-purple-50 dark:bg-slate-800 dark:border-purple-800 dark:text-purple-400 dark:hover:bg-slate-700"
                        onClick={() => setIsEditingPoints(true)}
                      >
                        + Points
                      </Button>
                    ) : null
                  )}
                </span>
                {canManageMatch && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-5 w-5 p-0 text-purple-400 hover:text-purple-700 hover:bg-purple-100 rounded-full dark:hover:bg-purple-900/50"
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
                    className="h-7 text-xs bg-white text-green-700 border-green-200 hover:bg-green-50 dark:bg-slate-800 dark:border-green-800 dark:text-green-400 dark:hover:bg-green-800/50"
                    onClick={() => onSetWinner(match.id, match.creator_id)}
                  >
                    {match.creator_id}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs bg-white text-red-700 border-red-200 hover:bg-red-50 dark:bg-slate-800 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-800/50"
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
                  className="h-7 bg-white text-blue-600 border-blue-200 hover:bg-blue-50 dark:bg-slate-800 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-slate-700"
                  onClick={() => setIsEditDialogOpen(true)}
                >
                  <Edit className="w-3.5 h-3.5" />
                </Button>
              )}
              {match.match_image && (
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 bg-white text-gray-600 border-gray-200 hover:bg-gray-50 dark:bg-slate-800 dark:border-slate-700 dark:text-gray-400 dark:hover:bg-slate-700"
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
                  className="h-7 bg-white text-red-600 border-red-200 hover:bg-red-50 dark:bg-slate-800 dark:border-red-800 dark:text-red-400 dark:hover:bg-slate-700"
                  onClick={() => onDelete(match.id)}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              )}
            </div>
          </div>
        </div>
        
        {/* Timer section - only show for current matches */}
        {showTimer && (
          <div className="mt-4">
            <MatchTimer 
              isRunning={true} 
              initialMinutes={8}
              onFinish={() => setShowTimer(false)}
            />
          </div>
        )}

        {canEdit && onUpdateMatch && (
          <EditMatchDialog 
            isOpen={isEditDialogOpen}
            onClose={() => setIsEditDialogOpen(false)}
            match={match}
            onUpdate={onUpdateMatch}
            userRole={role}
          />
        )}
      </div>
    </div>
  );
};
