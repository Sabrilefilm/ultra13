
import React, { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { UltraDashboard } from "@/components/dashboard/UltraDashboard";
import { useIndexAuth } from "@/hooks/use-index-auth";
import { usePlatformSettings } from "@/hooks/use-platform-settings";
import { useAccountManagement } from "@/hooks/use-account-management";
import { useInactivityTimer } from "@/hooks/use-inactivity-timer";
import { useToast } from "@/hooks/use-toast";
import { LiveScheduleModal } from "@/components/live-schedule";
import { Button } from "@/components/ui/button";
import { Download, Plus } from "lucide-react";
import { useUpcomingMatches } from "@/hooks/use-upcoming-matches";
import { ScheduleMatchDialog } from "@/components/matches/ScheduleMatchDialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const Schedule = () => {
  const { toast } = useToast();
  const { isAuthenticated, username, role, handleLogout } = useIndexAuth();
  const { platformSettings, handleUpdateSettings } = usePlatformSettings(role);
  const { handleCreateAccount } = useAccountManagement();
  const { matches, isLoading } = useUpcomingMatches(role || '', username || '');
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isMatchDialogOpen, setIsMatchDialogOpen] = useState(false);
  const [selectedCreator, setSelectedCreator] = useState("");
  
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

  if (!isAuthenticated) {
    window.location.href = '/';
    return null;
  }

  // Restrict access to authorized roles
  if (!['founder', 'manager', 'agent'].includes(role || '')) {
    window.location.href = '/';
    return null;
  }

  const openScheduleModal = (creatorId: string) => {
    setSelectedCreator(creatorId);
    setIsScheduleModalOpen(true);
  };

  const openMatchDialog = () => {
    setIsMatchDialogOpen(true);
  };

  const downloadSchedule = () => {
    // Create the workbook
    const wb = XLSX.utils.book_new();
    
    try {
      // Format the matches data for export
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
      
      // Create worksheet
      const ws = XLSX.utils.json_to_sheet(scheduleData);
      
      // Set column widths
      const wscols = [
        { wch: 5 }, // ID
        { wch: 20 }, // Créateur 1
        { wch: 20 }, // Créateur 2
        { wch: 15 }, // Date
        { wch: 10 }, // Heure
        { wch: 8 }, // Boost
        { wch: 20 }, // Agent
        { wch: 10 }, // Statut
      ];
      ws['!cols'] = wscols;
      
      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(wb, ws, "Planning");
      
      // Generate the Excel file
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      
      // Save the file
      saveAs(blob, `Planning_Ultra_${new Date().toISOString().split('T')[0]}.xlsx`);
      
      toast({
        title: "Téléchargement réussi",
        description: "Le planning a été téléchargé avec succès."
      });
    } catch (error) {
      console.error("Erreur lors de l'export du planning", error);
      toast({
        variant: "destructive",
        title: "Échec du téléchargement",
        description: "Une erreur s'est produite lors de l'export du planning."
      });
    }
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <UltraDashboard
        username={username}
        role={role || ''}
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
            <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white">
              Planning des Matchs et Horaires
            </CardTitle>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="border-purple-200 dark:border-purple-800 flex items-center gap-2"
                onClick={downloadSchedule}
              >
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Télécharger</span>
              </Button>
              <Button 
                className="bg-purple-600 hover:bg-purple-700 text-white"
                onClick={openMatchDialog}
              >
                <Plus className="h-4 w-4 mr-2" />
                <span>Nouveau match</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {['founder', 'manager', 'agent'].includes(role || '') && (
                <Button
                  variant="outline"
                  className="h-auto p-6 border-dashed border-2 border-purple-200 dark:border-purple-800 hover:border-purple-400 dark:hover:border-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-200"
                  onClick={() => openScheduleModal(username || '')}
                >
                  <div className="flex flex-col items-center text-center">
                    <Calendar className="h-8 w-8 mb-2 text-purple-500 dark:text-purple-400" />
                    <h3 className="text-lg font-medium text-slate-900 dark:text-white">Configurer mes Horaires de Live</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                      Définir les heures et jours de live de la semaine
                    </p>
                  </div>
                </Button>
              )}
            </div>
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
}

export default Schedule;
