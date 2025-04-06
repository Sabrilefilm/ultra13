
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
        <div className="flex justify-center w-full p-2 sm:p-4 md:p-6 md:ml-0 bg-slate-900">
          <div className="w-full max-w-6xl space-y-4 sm:space-y-6">
            <Card className="bg-slate-900/90 shadow-lg border-purple-900/30">
              <CardHeader className="bg-gradient-to-r from-purple-950/50 to-slate-900/50 border-b border-purple-900/20 p-3 sm:p-4 md:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <CardTitle className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                    <Trophy className="h-5 w-5 sm:h-6 sm:w-6 text-purple-500" />
                    <span className="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
                      Gestion des Matchs
                    </span>
                  </CardTitle>
                  
                  {['founder', 'manager', 'agent'].includes(role || '') && (
                    <Button 
                      className="bg-purple-600 hover:bg-purple-700 text-white shadow-md w-full sm:w-auto"
                      onClick={() => setIsMatchDialogOpen(true)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Nouveau match
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-3 sm:p-4 md:p-6 text-white">
                <div className="flex overflow-x-auto border-b border-slate-700 mb-4 sm:mb-6">
                  <Button
                    variant={activeTab === 'upcoming' ? 'default' : 'ghost'}
                    className={`relative rounded-none flex-1 px-2 sm:px-4 ${activeTab === 'upcoming' ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white' : 'text-gray-400 hover:text-white'}`}
                    onClick={() => setActiveTab('upcoming')}
                  >
                    <CalendarDays className="mr-1 sm:mr-2 h-4 w-4" />
                    <span className="text-xs sm:text-sm">À venir ({upcomingMatches.length})</span>
                  </Button>
                  <Button
                    variant={activeTab === 'past' ? 'default' : 'ghost'}
                    className={`relative rounded-none flex-1 px-2 sm:px-4 ${activeTab === 'past' ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white' : 'text-gray-400 hover:text-white'}`}
                    onClick={() => setActiveTab('past')}
                  >
                    <Clock className="mr-1 sm:mr-2 h-4 w-4" />
                    <span className="text-xs sm:text-sm">Passés ({pastMatches.length})</span>
                  </Button>
                </div>
                
                {isLoading ? (
                  <div className="flex justify-center p-8">
                    <div className="animate-spin h-8 w-8 border-4 border-purple-500 rounded-full border-t-transparent"></div>
                  </div>
                ) : activeTab === 'upcoming' ? (
                  <div className="space-y-3 sm:space-y-4">
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
                      <div className="bg-slate-800/90 backdrop-blur-sm border border-purple-700/20 rounded-xl p-4 sm:p-6 text-center">
                        <div className="flex justify-center">
                          <Users className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-2 sm:mb-3 text-purple-500 opacity-70" />
                          <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400 animate-pulse" />
                        </div>
                        <h3 className="text-lg sm:text-xl font-medium mb-1 sm:mb-2 text-white">Aucun match à venir</h3>
                        <p className="text-gray-400 text-sm">Cliquez sur "Nouveau match" pour en créer un</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3 sm:space-y-4">
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
                      <div className="bg-slate-800/90 backdrop-blur-sm border border-purple-700/20 rounded-xl p-4 sm:p-6 text-center">
                        <div className="flex justify-center">
                          <Clock className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-2 sm:mb-3 text-purple-500 opacity-70" />
                          <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400 animate-pulse" />
                        </div>
                        <h3 className="text-lg sm:text-xl font-medium mb-1 sm:mb-2 text-white">Aucun match passé</h3>
                        <p className="text-gray-400 text-sm">L'historique des matchs apparaîtra ici.</p>
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
