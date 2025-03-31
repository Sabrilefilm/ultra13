import React, { useState, useEffect } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { UltraDashboard } from "@/components/dashboard/UltraDashboard";
import { useIndexAuth } from "@/hooks/use-index-auth";
import { usePlatformSettings } from "@/hooks/use-platform-settings";
import { useAccountManagement } from "@/hooks/use-account-management";
import { useInactivityTimer } from "@/hooks/use-inactivity-timer";
import { useToast } from "@/hooks/use-toast";
import { LiveScheduleModal } from "@/components/live-schedule";
import { Button } from "@/components/ui/button";
import { Download, Plus, Calendar, Users, CalendarDays, Calendar as CalendarIcon } from "lucide-react";
import { useUpcomingMatches } from "@/hooks/use-upcoming-matches";
import { ScheduleMatchDialog } from "@/components/matches/ScheduleMatchDialog";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { useUserData } from "@/hooks/user-management/use-user-data";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";

const Schedule = () => {
  const { toast: toastHook } = useToast();
  const { isAuthenticated, username, role, userId, handleLogout } = useIndexAuth();
  const { platformSettings, handleUpdateSettings } = usePlatformSettings(role);
  const { handleCreateAccount } = useAccountManagement();
  const { matches, isLoading: isLoadingMatches } = useUpcomingMatches(role || '', username || '');
  const { users: groupedUsers, allUsers, isLoading: isLoadingUsers } = useUserData();
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isMatchDialogOpen, setIsMatchDialogOpen] = useState(false);
  const [selectedCreator, setSelectedCreator] = useState("");
  const [viewMode, setViewMode] = useState<'matches' | 'creators'>('matches');
  
  const { showWarning, dismissWarning, formattedTime } = useInactivityTimer({
    timeout: 120000, // 2 minutes
    onTimeout: () => {
      handleLogout();
      toastHook({
        title: "Déconnexion automatique",
        description: "Vous avez été déconnecté en raison d'inactivité.",
      });
    },
    warningTime: 30000, 
    onWarning: () => {}
  });

  useEffect(() => {
    if (!isAuthenticated) {
      window.location.href = '/';
    }
  }, [isAuthenticated]);

  const openScheduleModal = (creatorId: string) => {
    setSelectedCreator(creatorId);
    setIsScheduleModalOpen(true);
  };

  const openMatchDialog = () => {
    setIsMatchDialogOpen(true);
  };

  const downloadSchedule = () => {
    const wb = XLSX.utils.book_new();
    
    try {
      const scheduleData = matches.map((match, index) => ({
        'ID': index + 1,
        'Créateur 1': match.creator1_name || 'Non spécifié',
        'Créateur 2': match.creator2_name || 'Non spécifié',
        'Date': new Date(match.match_date).toLocaleDateString('fr-FR'),
        'Heure': new Date(match.match_date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        'Boost': match.with_boost ? 'Oui' : 'Non',
        'Agent': match.agent_name || 'Non spécifié',
        'Statut': match.winner ? 'Terminé' : 'À venir'
      }));
      
      const ws = XLSX.utils.json_to_sheet(scheduleData);
      
      const wscols = [
        { wch: 5 },
        { wch: 20 },
        { wch: 20 },
        { wch: 15 },
        { wch: 10 },
        { wch: 8 },
        { wch: 20 },
        { wch: 10 },
      ];
      ws['!cols'] = wscols;
      
      XLSX.utils.book_append_sheet(wb, ws, "Planning");
      
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      
      saveAs(blob, `Planning_Ultra_${new Date().toISOString().split('T')[0]}.xlsx`);
      
      toastHook({
        title: "Téléchargement réussi",
        description: "Le planning a été téléchargé avec succès."
      });
    } catch (error) {
      console.error("Erreur lors de l'export du planning", error);
      toastHook({
        variant: "destructive",
        title: "Échec du téléchargement",
        description: "Une erreur s'est produite lors de l'export du planning."
      });
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'founder':
        return 'bg-red-500';
      case 'manager':
        return 'bg-amber-500';
      case 'agent':
        return 'bg-emerald-500';
      case 'creator':
        return 'bg-blue-500';
      case 'ambassadeur':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getMatchColorClass = (daysUntil: number) => {
    if (daysUntil < 0) return "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-800/50";
    if (daysUntil === 0) return "border-red-200 dark:border-red-900/30 bg-red-50 dark:bg-red-900/10";
    if (daysUntil <= 2) return "border-orange-200 dark:border-orange-900/30 bg-orange-50 dark:bg-orange-900/10";
    if (daysUntil <= 7) return "border-blue-200 dark:border-blue-900/30 bg-blue-50 dark:bg-blue-900/10";
    return "border-purple-200 dark:border-purple-900/30 bg-purple-50 dark:bg-purple-900/10";
  };

  const calculateDaysUntil = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const creatorSchedules = allUsers
    .filter(user => user.role === 'creator')
    .map(creator => {
      const schedule = creator.live_schedules?.[0] || { hours: 0, days: 0 };
      return {
        id: creator.id,
        username: creator.username,
        hours: schedule.hours || 0,
        days: schedule.days || 0,
        totalHours: (schedule.hours || 0) * (schedule.days || 0),
        requiredHours: 15,
      };
    })
    .sort((a, b) => b.totalHours - a.totalHours);

  const canAccessCreatorView = ['founder', 'manager', 'agent'].includes(role || '');
  const canCreateMatch = ['founder', 'manager', 'agent'].includes(role || '');
  const canModifySchedule = role === 'founder';

  const renderMatch = (match: Match) => {
    const winnerValue = match.winner_id || null;
    
    return (
      <div className="border rounded-lg p-4 mb-4">
        <h3 className="text-xl font-bold">{match.match_name || "Match sans titre"}</h3>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-base font-medium">
              {match.title || `Match #${match.id.substring(0, 4)}`}
            </CardTitle>
            <Badge className={winnerValue === null ? "bg-gray-500" : winnerValue === match.creator1_id ? "bg-green-500" : "bg-red-500"}>
              {winnerValue === null ? "À venir" : winnerValue === match.creator1_id ? "Gagnant" : "Perdant"}
            </Badge>
          </div>
          <CardDescription>
            {format(new Date(match.match_date), "EEEE d MMMM yyyy", { locale: fr })} à {format(new Date(match.match_date), "HH:mm", { locale: fr })}
          </CardDescription>
        </div>
        <div className="mt-3 pt-3 border-t border-dashed border-gray-200 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400 flex justify-between">
          <span>
            Agent: {match.agent_name || "Non assigné"}
          </span>
          {match.with_boost && (
            <Badge variant="outline" className="border-yellow-300 dark:border-yellow-700 text-yellow-600 dark:text-yellow-400">
              Boost activé
            </Badge>
          )}
        </div>
      </div>
    );
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
        currentPage="schedule"
      />
      
      <div className="p-6 md:ml-64 space-y-6">
        <Card className="bg-white dark:bg-slate-900 shadow-lg border-purple-100 dark:border-purple-900/30">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                Planning des Matchs et Horaires
              </CardTitle>
              <CardDescription>
                Gérez les matchs à venir et consultez les horaires des créateurs
              </CardDescription>
            </div>
            <div className="flex gap-2">
              {canAccessCreatorView && (
                <div className="flex rounded-md overflow-hidden border border-purple-200 dark:border-purple-800">
                  <Button 
                    variant={viewMode === 'matches' ? 'default' : 'outline'}
                    className={`rounded-none ${viewMode === 'matches' ? 'bg-purple-600' : 'bg-transparent'}`}
                    onClick={() => setViewMode('matches')}
                  >
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Matchs</span>
                  </Button>
                  <Button 
                    variant={viewMode === 'creators' ? 'default' : 'outline'}
                    className={`rounded-none ${viewMode === 'creators' ? 'bg-purple-600' : 'bg-transparent'}`}
                    onClick={() => setViewMode('creators')}
                  >
                    <Users className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Créateurs</span>
                  </Button>
                </div>
              )}
              
              <Button 
                variant="outline" 
                className="border-purple-200 dark:border-purple-800 flex items-center gap-2"
                onClick={downloadSchedule}
              >
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Télécharger</span>
              </Button>
              
              {canCreateMatch && viewMode === 'matches' && (
                <Button 
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                  onClick={openMatchDialog}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  <span>Nouveau match</span>
                </Button>
              )}
              
              {canModifySchedule && viewMode === 'creators' && (
                <Button 
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => openScheduleModal(selectedCreator)}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>Configurer horaires</span>
                </Button>
              )}
            </div>
          </CardHeader>
          
          <CardContent>
            {viewMode === 'matches' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {isLoadingMatches ? (
                  <div className="col-span-full flex justify-center p-8">
                    <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                  </div>
                ) : matches.length === 0 ? (
                  <div className="col-span-full text-center p-8">
                    <CalendarDays className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400">Aucun match planifié</h3>
                    {canCreateMatch && (
                      <Button 
                        className="mt-4 bg-purple-600 hover:bg-purple-700"
                        onClick={openMatchDialog}
                      >
                        Planifier un match
                      </Button>
                    )}
                  </div>
                ) : (
                  matches.map((match) => {
                    const matchDate = new Date(match.match_date);
                    const daysUntil = calculateDaysUntil(match.match_date);
                    const colorClass = getMatchColorClass(daysUntil);
                    
                    return (
                      <Card 
                        key={match.id}
                        className={`overflow-hidden transition-all duration-300 hover:shadow-md ${colorClass}`}
                      >
                        <CardHeader className="p-4 pb-2 space-y-1">
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-base font-medium">
                              {match.title || `Match #${match.id.substring(0, 4)}`}
                            </CardTitle>
                            <Badge className={daysUntil < 0 ? "bg-gray-500" : daysUntil === 0 ? "bg-red-500 animate-pulse" : daysUntil <= 2 ? "bg-orange-500" : "bg-blue-500"}>
                              {daysUntil < 0 ? "Terminé" : daysUntil === 0 ? "Aujourd'hui" : daysUntil === 1 ? "Demain" : `Dans ${daysUntil} jours`}
                            </Badge>
                          </div>
                          <CardDescription>
                            {format(matchDate, "EEEE d MMMM yyyy", { locale: fr })} à {format(matchDate, "HH:mm", { locale: fr })}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-center">
                            <div className="text-center">
                              <Avatar className="h-10 w-10 mx-auto mb-1">
                                <AvatarFallback className="bg-red-500 text-white">
                                  {match.creator1_name?.substring(0, 2).toUpperCase() || "C1"}
                                </AvatarFallback>
                              </Avatar>
                              <p className="text-sm font-medium">{match.creator1_name || "Inconnu"}</p>
                            </div>
                            
                            <div className="text-xl font-bold text-gray-500">VS</div>
                            
                            <div className="text-center">
                              <Avatar className="h-10 w-10 mx-auto mb-1">
                                <AvatarFallback className="bg-blue-500 text-white">
                                  {match.creator2_name?.substring(0, 2).toUpperCase() || "C2"}
                                </AvatarFallback>
                              </Avatar>
                              <p className="text-sm font-medium">{match.creator2_name || "Inconnu"}</p>
                            </div>
                          </div>
                          
                          <div className="mt-3 pt-3 border-t border-dashed border-gray-200 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400 flex justify-between">
                            <span>
                              Agent: {match.agent_name || "Non assigné"}
                            </span>
                            {match.with_boost && (
                              <Badge variant="outline" className="border-yellow-300 dark:border-yellow-700 text-yellow-600 dark:text-yellow-400">
                                Boost activé
                              </Badge>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })
                )}
              </div>
            ) : (
              <div>
                <h3 className="font-medium text-lg mb-4">Horaires des Créateurs</h3>
                <Card className="border border-blue-100 dark:border-blue-900/30">
                  <CardHeader className="p-4 pb-2">
                    <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                      <span className="w-1/3">Créateur</span>
                      <span className="w-1/5 text-center">Heures / jour</span>
                      <span className="w-1/5 text-center">Jours / semaine</span>
                      <span className="w-1/5 text-center">Total hebdo</span>
                      <span className="w-1/5 text-center">Statut</span>
                    </div>
                  </CardHeader>
                  <ScrollArea className="h-[calc(100vh-380px)] min-h-[300px]">
                    <div className="p-3">
                      {isLoadingUsers ? (
                        <div className="flex justify-center p-8">
                          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                        </div>
                      ) : creatorSchedules.length === 0 ? (
                        <div className="text-center p-8">
                          <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                          <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400">Aucun créateur trouvé</h3>
                        </div>
                      ) : (
                        creatorSchedules.map((creator) => {
                          const percentComplete = Math.min(Math.round((creator.totalHours / creator.requiredHours) * 100), 100);
                          const statusColor = percentComplete >= 100 ? "text-green-500" : 
                                             percentComplete >= 70 ? "text-yellow-500" : "text-red-500";
                          
                          return (
                            <div 
                              key={creator.id}
                              className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800/30 rounded-lg transition-colors cursor-pointer mb-2"
                              onClick={() => {
                                if (canModifySchedule) {
                                  openScheduleModal(creator.username);
                                } else {
                                  toast.info("Seul le fondateur peut modifier les horaires");
                                }
                              }}
                            >
                              <div className="w-1/3 flex items-center gap-3">
                                <Avatar className="h-8 w-8">
                                  <AvatarFallback className={`${getRoleColor('creator')} text-white`}>
                                    {creator.username.substring(0, 2).toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="font-medium truncate">{creator.username}</span>
                              </div>
                              <div className="w-1/5 text-center">
                                {creator.hours}h
                              </div>
                              <div className="w-1/5 text-center">
                                {creator.days}j
                              </div>
                              <div className="w-1/5 text-center font-medium">
                                {creator.totalHours}h
                              </div>
                              <div className={`w-1/5 text-center font-medium ${statusColor}`}>
                                {percentComplete}%
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </ScrollArea>
                </Card>
                
                <div className="mt-4 bg-blue-900/20 border border-blue-700/30 rounded-lg p-4 flex items-center gap-3">
                  <Calendar className="h-6 w-6 text-blue-400 animate-pulse" />
                  <p className="text-blue-400/80 text-sm">
                    Les horaires et jours de live sont mis à jour toutes les 24-48 heures. 
                    Seul le fondateur peut modifier ces valeurs.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <LiveScheduleModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        creatorId={selectedCreator}
      />
      
      <ScheduleMatchDialog
        isOpen={isMatchDialogOpen}
        onClose={() => setIsMatchDialogOpen(false)}
      />
    </SidebarProvider>
  );
};

export default Schedule;
