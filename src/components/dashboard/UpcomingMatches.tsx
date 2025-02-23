
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";

export const UpcomingMatches = ({ role, creatorId }: { role: string; creatorId: string }) => {
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

  if (isLoading) return <div>Chargement des matchs...</div>;

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
                  <div className="text-sm font-medium">{match.platform}</div>
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
