
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUpcomingMatches } from "@/hooks/use-upcoming-matches";
import { downloadImage } from "@/utils/download";
import { MatchCard } from "./MatchCard";

export const UpcomingMatches = ({ role, creatorId }: { role: string; creatorId: string }) => {
  const { matches, isLoading, handleDelete, setWinner, clearWinner } = useUpcomingMatches(role, creatorId);

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
              <MatchCard
                key={match.id}
                match={match}
                canManageMatch={canManageMatch}
                role={role}
                onSetWinner={setWinner}
                onClearWinner={clearWinner}
                onDelete={handleDelete}
                onDownload={downloadImage}
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-600">Aucun match à venir</p>
        )}
      </CardContent>
    </Card>
  );
};
