
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUpcomingMatches } from "@/hooks/use-upcoming-matches";
import { downloadImage } from "@/utils/download";
import { MatchCard } from "./MatchCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const UpcomingMatches = ({ role, creatorId }: { role: string; creatorId: string }) => {
  const { matches, isLoading, handleDelete, setWinner, clearWinner, updateMatchDetails } = useUpcomingMatches(role, creatorId);

  if (isLoading) return <div>Chargement des matchs...</div>;

  const canManageMatch = role === 'founder' || role === 'manager';
  const canDeleteMatch = role === 'founder';
  const canEditMatch = ['agent', 'manager', 'founder'].includes(role);

  console.log("Current role in UpcomingMatches:", role); // Debug log

  // Separate matches into upcoming and past
  const currentDate = new Date();
  const upcomingMatches = matches?.filter(match => new Date(match.match_date) >= currentDate) || [];
  const pastMatches = matches?.filter(match => new Date(match.match_date) < currentDate) || [];
  
  // Sort matches by date (newest first for past matches, oldest first for upcoming)
  upcomingMatches.sort((a, b) => new Date(a.match_date).getTime() - new Date(b.match_date).getTime());
  pastMatches.sort((a, b) => new Date(b.match_date).getTime() - new Date(a.match_date).getTime());

  return (
    <Card className="bg-white text-black">
      <CardHeader>
        <CardTitle>Matchs</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="w-full grid grid-cols-2 mb-4">
            <TabsTrigger value="upcoming">À venir ({upcomingMatches.length})</TabsTrigger>
            <TabsTrigger value="past">Passés ({pastMatches.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upcoming">
            {upcomingMatches.length > 0 ? (
              <div className="space-y-4">
                {upcomingMatches.map((match) => (
                  <MatchCard
                    key={match.id}
                    match={match}
                    canManageMatch={canManageMatch}
                    canDeleteMatch={canDeleteMatch}
                    role={role}
                    onSetWinner={setWinner}
                    onClearWinner={clearWinner}
                    onDelete={handleDelete}
                    onDownload={downloadImage}
                    onUpdateMatch={canEditMatch ? updateMatchDetails : undefined}
                  />
                ))}
              </div>
            ) : (
              <p className="text-gray-600">Aucun match à venir</p>
            )}
          </TabsContent>
          
          <TabsContent value="past">
            {pastMatches.length > 0 ? (
              <div className="space-y-4">
                {pastMatches.map((match) => (
                  <MatchCard
                    key={match.id}
                    match={match}
                    canManageMatch={canManageMatch}
                    canDeleteMatch={canDeleteMatch}
                    role={role}
                    onSetWinner={setWinner}
                    onClearWinner={clearWinner}
                    onDelete={handleDelete}
                    onDownload={downloadImage}
                    onUpdateMatch={canEditMatch ? updateMatchDetails : undefined}
                  />
                ))}
              </div>
            ) : (
              <p className="text-gray-600">Aucun match passé</p>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
