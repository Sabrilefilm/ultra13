
import React, { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { UltraDashboard } from "@/components/dashboard/UltraDashboard";
import { useIndexAuth } from "@/hooks/use-index-auth";
import { usePlatformSettings } from "@/hooks/use-platform-settings";
import { useAccountManagement } from "@/hooks/use-account-management";
import { useInactivityTimer } from "@/hooks/use-inactivity-timer";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, CalendarDays, Users, Clock, Sparkles, Plus } from "lucide-react";
import { useUpcomingMatches } from "@/hooks/use-upcoming-matches";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { MatchCard } from "@/components/dashboard/MatchCard";
import { downloadImage } from "@/utils/download";
import { ScheduleMatchDialog } from "@/components/matches/ScheduleMatchDialog";

const Matches = () => {
  const { toast } = useToast();
  const { isAuthenticated, username, role, userId, handleLogout } = useIndexAuth();
  const { platformSettings, handleUpdateSettings } = usePlatformSettings(role);
  const { handleCreateAccount } = useAccountManagement();
  const [isMatchDialogOpen, setIsMatchDialogOpen] = useState(false);
  
  // Inactivity timer for automatic logout
  const { showWarning, dismissWarning, formattedTime } = useInactivityTimer({
    timeout: 120000, // 2 minutes
    onTimeout: () => {
      handleLogout();
      toast({
        title: "Déconnexion automatique",
        description: "Vous avez été déconnecté en raison d'inactivité.",
      });
    },
    warningTime: 30000,
    onWarning: () => {}
  });

  const [activeTab, setActiveTab] = useState('upcoming');
  const { matches, isLoading, handleDelete, setWinner, clearWinner, updateMatchDetails } = useUpcomingMatches(role || '', userId || '');

  if (!isAuthenticated) {
    window.location.href = '/';
    return null;
  }

  // Restrict access to authorized roles
  if (!['founder', 'manager', 'agent', 'creator'].includes(role || '')) {
    window.location.href = '/dashboard';
    return null;
  }

  const currentDate = new Date();
  const upcomingMatches = matches?.filter(match => new Date(match.match_date) >= currentDate) || [];
  const pastMatches = matches?.filter(match => new Date(match.match_date) < currentDate) || [];

  const formatMatchDate = (dateString: string) => {
    return format(new Date(dateString), "dd MMMM yyyy 'à' HH:mm", { locale: fr });
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <UltraDashboard
        username={username}
        role={role || ''}
        userId={userId || ''}
        onLogout={handleLogout}
        platformSettings={platformSettings}
        handleCreateAccount={handleCreateAccount}
        handleUpdateSettings={handleUpdateSettings}
        showWarning={showWarning}
        dismissWarning={dismissWarning}
        formattedTime={formattedTime}
        currentPage="matches"
      >
        <div className="flex justify-center w-full p-6 md:ml-0 bg-slate-900">
          <div className="w-full max-w-6xl space-y-6">
            <Card className="bg-slate-900/90 shadow-lg border-purple-900/30">
              <CardHeader className="bg-gradient-to-r from-purple-950/50 to-slate-900/50 border-b border-purple-900/20">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-2xl font-bold text-white flex items-center gap-2">
                    <Trophy className="h-6 w-6 text-purple-500" />
                    <span className="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
                      Gestion des Matchs ✨
                    </span>
                  </CardTitle>
                  
                  {['founder', 'manager', 'agent'].includes(role || '') && (
                    <Button 
                      className="bg-purple-600 hover:bg-purple-700 text-white shadow-md"
                      onClick={() => setIsMatchDialogOpen(true)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Nouveau match 🎮
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-6 text-white">
                <div className="flex border-b border-slate-700 mb-6">
                  <Button
                    variant={activeTab === 'upcoming' ? 'default' : 'ghost'}
                    className={`relative rounded-none ${activeTab === 'upcoming' ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white' : 'text-gray-400 hover:text-white'}`}
                    onClick={() => setActiveTab('upcoming')}
                  >
                    <CalendarDays className="mr-2 h-4 w-4" />
                    Matchs à venir ({upcomingMatches.length})
                  </Button>
                  <Button
                    variant={activeTab === 'past' ? 'default' : 'ghost'}
                    className={`relative rounded-none ${activeTab === 'past' ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white' : 'text-gray-400 hover:text-white'}`}
                    onClick={() => setActiveTab('past')}
                  >
                    <Clock className="mr-2 h-4 w-4" />
                    Matchs passés ({pastMatches.length})
                  </Button>
                </div>
                
                {isLoading ? (
                  <div className="flex justify-center p-8">
                    <div className="animate-spin h-8 w-8 border-4 border-purple-500 rounded-full border-t-transparent"></div>
                  </div>
                ) : activeTab === 'upcoming' ? (
                  <div className="space-y-4">
                    {upcomingMatches.length > 0 ? (
                      upcomingMatches.map(match => (
                        <MatchCard 
                          key={match.id} 
                          match={match}
                          canManageMatch={['founder', 'manager', 'agent'].includes(role || '')}
                          canDeleteMatch={['founder', 'manager'].includes(role || '')}
                          role={role || ''}
                          onSetWinner={setWinner}
                          onClearWinner={clearWinner}
                          onDelete={handleDelete}
                          onDownload={downloadImage}
                          onUpdateMatch={updateMatchDetails}
                        />
                      ))
                    ) : (
                      <div className="bg-slate-800/90 backdrop-blur-sm border border-purple-700/20 rounded-xl p-6 text-center">
                        <div className="flex justify-center">
                          <Users className="h-12 w-12 mx-auto mb-3 text-purple-500 opacity-70" />
                          <Sparkles className="h-5 w-5 text-yellow-400 animate-pulse" />
                        </div>
                        <h3 className="text-xl font-medium mb-2 text-white">Aucun match à venir</h3>
                        <p className="text-gray-400">Cliquez sur "Nouveau match" pour en créer un</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pastMatches.length > 0 ? (
                      pastMatches.map(match => (
                        <MatchCard 
                          key={match.id} 
                          match={match}
                          canManageMatch={['founder', 'manager', 'agent'].includes(role || '')}
                          canDeleteMatch={['founder', 'manager'].includes(role || '')}
                          role={role || ''}
                          onSetWinner={setWinner}
                          onClearWinner={clearWinner}
                          onDelete={handleDelete}
                          onDownload={downloadImage}
                          onUpdateMatch={updateMatchDetails}
                        />
                      ))
                    ) : (
                      <div className="bg-slate-800/90 backdrop-blur-sm border border-purple-700/20 rounded-xl p-6 text-center">
                        <div className="flex justify-center">
                          <Clock className="h-12 w-12 mx-auto mb-3 text-purple-500 opacity-70" />
                          <Sparkles className="h-5 w-5 text-yellow-400 animate-pulse" />
                        </div>
                        <h3 className="text-xl font-medium mb-2 text-white">Aucun match passé</h3>
                        <p className="text-gray-400">L'historique des matchs apparaîtra ici.</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
        
        <ScheduleMatchDialog
          isOpen={isMatchDialogOpen}
          onClose={() => setIsMatchDialogOpen(false)}
        />
      </UltraDashboard>
    </SidebarProvider>
  );
};

export default Matches;
