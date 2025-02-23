
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Download, Trash2, Trophy, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import confetti from 'canvas-confetti';

export const UpcomingMatches = ({ role, creatorId }: { role: string; creatorId: string }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: matches, isLoading } = useQuery({
    queryKey: ['upcoming-matches', creatorId],
    queryFn: async () => {
      let query = supabase
        .from('upcoming_matches')
        .select('*')
        .order('match_date', { ascending: true });

      if (role !== 'founder') {
        query = query.eq('creator_id', creatorId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data;
    }
  });

  const handleDownload = async (imageUrl: string, fileName: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${fileName}.png`;
      
      document.body.appendChild(link);
      link.click();
      
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Erreur lors du téléchargement:", error);
    }
  };

  const handleDelete = async (matchId: string) => {
    try {
      const { error } = await supabase
        .from('upcoming_matches')
        .delete()
        .eq('id', matchId);

      if (error) throw error;

      toast({
        title: "Match supprimé",
        description: "Le match a été supprimé avec succès",
      });

      queryClient.invalidateQueries({ queryKey: ['upcoming-matches', creatorId] });
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression du match",
        variant: "destructive",
      });
    }
  };

  const setWinner = async (matchId: string, winnerId: string) => {
    try {
      const { error } = await supabase
        .from('upcoming_matches')
        .update({
          winner_id: winnerId,
          status: 'completed'
        })
        .eq('id', matchId);

      if (error) throw error;

      // Animation continue de confettis
      const duration = 15 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      function randomInRange(min: number, max: number) {
        return Math.random() * (max - min) + min;
      }

      const interval = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
        });
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
        });
      }, 250);

      toast({
        title: "Gagnant défini",
        description: "Le gagnant du match a été enregistré avec succès",
      });

      queryClient.invalidateQueries({ queryKey: ['upcoming-matches', creatorId] });
    } catch (error) {
      console.error("Erreur lors de la définition du gagnant:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la définition du gagnant",
        variant: "destructive",
      });
    }
  };

  const clearWinner = async (matchId: string) => {
    try {
      const { error } = await supabase
        .from('upcoming_matches')
        .update({
          winner_id: null,
          status: 'scheduled'
        })
        .eq('id', matchId);

      if (error) throw error;

      toast({
        title: "Gagnant effacé",
        description: "Le gagnant du match a été effacé avec succès",
      });

      queryClient.invalidateQueries({ queryKey: ['upcoming-matches', creatorId] });
    } catch (error) {
      console.error("Erreur lors de l'effacement du gagnant:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'effacement du gagnant",
        variant: "destructive",
      });
    }
  };

  if (isLoading) return <div>Chargement des matchs...</div>;

  const canManageMatch = role === 'founder' || role === 'manager';

  return (
    <Card className="bg-white text-black">
      <CardHeader>
        <CardTitle>Matchs à venir</CardTitle>
      </CardHeader>
      <CardContent>
        {matches && matches.length > 0 ? (
          <div className="space-y-4">
            {matches.map((match) => (
              <div 
                key={match.id} 
                className={`flex flex-col space-y-4 p-4 border rounded-lg transition-all duration-300 ${
                  match.winner_id ? 'bg-gradient-to-r from-gray-50 to-white' : ''
                }`}
              >
                {match.match_image && (
                  <div className="w-full aspect-video relative rounded-lg overflow-hidden">
                    <img
                      src={match.match_image}
                      alt={`${match.creator_id} vs ${match.opponent_id}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex justify-between items-center relative">
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="font-medium text-black">{match.creator_id} vs {match.opponent_id}</p>
                      <p className="text-sm text-gray-600">
                        {formatDate(match.match_date)}
                      </p>
                    </div>
                    {match.winner_id && (
                      <div className="animate-fade-in bg-white shadow-lg border text-black px-4 py-2 rounded-full inline-flex items-center gap-2 font-bold">
                        <Trophy className="w-5 h-5 text-yellow-500" />
                        <span className="text-sm text-black">
                          Gagnant : {match.winner_id}
                        </span>
                        {canManageMatch && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="ml-2 h-6 w-6 p-0 text-gray-600 hover:text-black"
                            onClick={() => clearWinner(match.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-sm font-medium text-black">{match.platform}</div>
                    {!match.winner_id && canManageMatch && (
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-black border-gray-300 hover:bg-gray-100 hover:text-black"
                          onClick={() => setWinner(match.id, match.creator_id)}
                        >
                          {match.creator_id} gagne
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-black border-gray-300 hover:bg-gray-100 hover:text-black"
                          onClick={() => setWinner(match.id, match.opponent_id)}
                        >
                          {match.opponent_id} gagne
                        </Button>
                      </div>
                    )}
                    {match.match_image && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-black border-gray-300 hover:bg-gray-100 hover:text-black"
                        onClick={() => handleDownload(
                          match.match_image!,
                          `match_${match.creator_id}_vs_${match.opponent_id}`
                        )}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Télécharger
                      </Button>
                    )}
                    {role === 'founder' && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(match.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">Aucun match à venir</p>
        )}
      </CardContent>
    </Card>
  );
};
