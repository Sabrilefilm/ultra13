
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Download, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const UpcomingMatches = ({ role, creatorId }: { role: string; creatorId: string }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: matches, isLoading } = useQuery({
    queryKey: ['upcoming-matches', creatorId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('upcoming_matches')
        .select('*')
        .eq(role === 'founder' ? 'status' : 'creator_id', role === 'founder' ? 'scheduled' : creatorId)
        .order('match_date', { ascending: true });
      
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

      // Rafraîchir la liste des matchs avec le bon format pour React Query v5
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

  if (isLoading) return <div>Chargement des matchs...</div>;

  const canDeleteMatch = role === 'founder' || role === 'manager';

  return (
    <Card>
      <CardHeader>
        <CardTitle>Matchs à venir</CardTitle>
      </CardHeader>
      <CardContent>
        {matches && matches.length > 0 ? (
          <div className="space-y-4">
            {matches.map((match) => (
              <div key={match.id} className="flex flex-col space-y-4 p-4 border rounded-lg">
                {match.match_image && (
                  <div className="w-full aspect-video relative rounded-lg overflow-hidden">
                    <img
                      src={match.match_image}
                      alt={`${match.creator_id} vs ${match.opponent_id}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{match.creator_id} vs {match.opponent_id}</p>
                    <p className="text-sm text-muted-foreground">{formatDate(match.match_date)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-sm font-medium">{match.platform}</div>
                    {match.match_image && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownload(
                          match.match_image!,
                          `match_${match.creator_id}_vs_${match.opponent_id}`
                        )}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Télécharger
                      </Button>
                    )}
                    {canDeleteMatch && (
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
          <p className="text-muted-foreground">Aucun match à venir</p>
        )}
      </CardContent>
    </Card>
  );
};
