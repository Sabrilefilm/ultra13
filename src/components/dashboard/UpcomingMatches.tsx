
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUpcomingMatches } from "@/hooks/use-upcoming-matches";
import { downloadImage } from "@/utils/download";
import { MatchCard } from "./MatchCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Search, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export const UpcomingMatches = ({ role, creatorId }: { role: string; creatorId: string }) => {
  const { matches, isLoading, handleDelete, setWinner, clearWinner, updateMatchDetails } = useUpcomingMatches(role, creatorId);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAllUpcoming, setShowAllUpcoming] = useState(false);
  const [showAllPast, setShowAllPast] = useState(false);

  if (isLoading) return (
    <Card className="bg-white text-black shadow-md rounded-xl overflow-hidden border-0">
      <CardContent className="p-8 flex justify-center items-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-6 w-32 bg-gray-200 rounded mb-4"></div>
          <div className="h-24 w-full bg-gray-100 rounded"></div>
        </div>
      </CardContent>
    </Card>
  );

  const canManageMatch = role === 'founder' || role === 'manager';
  const canDeleteMatch = role === 'founder';
  const canEditMatch = ['agent', 'manager', 'founder'].includes(role);

  // Separate matches into upcoming and past
  const currentDate = new Date();
  const allMatches = matches || [];
  
  // Filter matches by search query if present
  const filteredMatches = searchQuery.trim() ? 
    allMatches.filter(match => 
      match.creator_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      match.opponent_id.toLowerCase().includes(searchQuery.toLowerCase())
    ) : 
    allMatches;
  
  // Sort and categorize matches
  const upcomingMatches = filteredMatches
    .filter(match => new Date(match.match_date) >= currentDate)
    .sort((a, b) => new Date(a.match_date).getTime() - new Date(b.match_date).getTime());
  
  const pastMatches = filteredMatches
    .filter(match => new Date(match.match_date) < currentDate)
    .sort((a, b) => new Date(b.match_date).getTime() - new Date(a.match_date).getTime());

  // Define how many matches to show by default
  const INITIAL_MATCH_COUNT = 5;
  const upcomingToShow = showAllUpcoming ? upcomingMatches : upcomingMatches.slice(0, INITIAL_MATCH_COUNT);
  const pastToShow = showAllPast ? pastMatches : pastMatches.slice(0, INITIAL_MATCH_COUNT);

  return (
    <Card className="bg-white text-black shadow-md rounded-xl overflow-hidden border-0">
      <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-purple-50 to-white p-6">
        <CardTitle className="text-2xl font-bold text-purple-900">Matchs</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {/* Search bar */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input
            placeholder="Rechercher un match..."
            className="pl-10 bg-gray-50 border-gray-200 focus:border-purple-400 transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="w-full grid grid-cols-2 mb-6 bg-gray-100 p-1 rounded-lg">
            <TabsTrigger 
              value="upcoming" 
              className="data-[state=active]:bg-white data-[state=active]:text-purple-700 data-[state=active]:shadow-sm rounded-md text-gray-600"
            >
              À venir ({upcomingMatches.length})
            </TabsTrigger>
            <TabsTrigger 
              value="past" 
              className="data-[state=active]:bg-white data-[state=active]:text-purple-700 data-[state=active]:shadow-sm rounded-md text-gray-600"
            >
              Passés ({pastMatches.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="upcoming">
            {upcomingMatches.length > 0 ? (
              <div className="space-y-4">
                {upcomingToShow.map((match) => (
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
                
                {upcomingMatches.length > INITIAL_MATCH_COUNT && (
                  <Button 
                    variant="ghost" 
                    onClick={() => setShowAllUpcoming(!showAllUpcoming)}
                    className="w-full mt-4 text-purple-600 hover:text-purple-800 hover:bg-purple-50 flex items-center justify-center"
                  >
                    {showAllUpcoming ? (
                      <>Afficher moins <ChevronUp className="ml-2 h-4 w-4" /></>
                    ) : (
                      <>Afficher plus ({upcomingMatches.length - INITIAL_MATCH_COUNT}) <ChevronDown className="ml-2 h-4 w-4" /></>
                    )}
                  </Button>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-purple-600 text-2xl">📅</span>
                </div>
                <p className="text-gray-600 mb-2">Aucun match à venir</p>
                <p className="text-gray-400 text-sm">Les nouveaux matchs apparaîtront ici</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="past">
            {pastMatches.length > 0 ? (
              <div className="space-y-4">
                {pastToShow.map((match) => (
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
                
                {pastMatches.length > INITIAL_MATCH_COUNT && (
                  <Button 
                    variant="ghost" 
                    onClick={() => setShowAllPast(!showAllPast)}
                    className="w-full mt-4 text-purple-600 hover:text-purple-800 hover:bg-purple-50 flex items-center justify-center"
                  >
                    {showAllPast ? (
                      <>Afficher moins <ChevronUp className="ml-2 h-4 w-4" /></>
                    ) : (
                      <>Afficher plus ({pastMatches.length - INITIAL_MATCH_COUNT}) <ChevronDown className="ml-2 h-4 w-4" /></>
                    )}
                  </Button>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-purple-600 text-2xl">🏆</span>
                </div>
                <p className="text-gray-600 mb-2">Aucun match passé</p>
                <p className="text-gray-400 text-sm">L'historique des matchs apparaîtra ici</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
