
import React, { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { UltraSidebar } from "@/components/layout/UltraSidebar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Plus, FileDown } from "lucide-react";
import { Loading } from "@/components/ui/loading";
import { useNavigate } from "react-router-dom";
import { useIndexAuth } from "@/hooks/use-index-auth";
import { useUpcomingMatches } from "@/hooks/use-upcoming-matches";
import { UpcomingMatches } from "@/components/dashboard/UpcomingMatches";
import { ScheduleMatchDialog } from "@/components/matches/ScheduleMatchDialog";
import { MatchCalendar } from "@/components/dashboard/MatchCalendar";
import { useInactivityTimer } from "@/hooks/use-inactivity-timer";
import { useToast } from "@/hooks/use-toast";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { UsernameWatermark } from "@/components/layout/UsernameWatermark";

const Matches = () => {
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  const {
    isAuthenticated,
    username,
    role,
    userId,
    handleLogout
  } = useIndexAuth();
  const {
    matches,
    isLoading
  } = useUpcomingMatches(role || '', username || '');
  const [isMatchDialogOpen, setIsMatchDialogOpen] = useState(false);

  // Inactivity timer for automatic logout
  const {
    showWarning,
    dismissWarning,
    formattedTime
  } = useInactivityTimer({
    timeout: 120000,
    // 2 minutes
    onTimeout: () => {
      handleLogout();
      toast({
        title: "Déconnexion automatique",
        description: "Vous avez été déconnecté en raison d'inactivité."
      });
    },
    warningTime: 30000,
    onWarning: () => {}
  });
  
  if (!isAuthenticated) {
    window.location.href = '/';
    return null;
  }
  
  const canScheduleMatch = ['agent', 'manager', 'founder'].includes(role || '');
  
  const exportMatchesToPDF = () => {
    if (!matches || matches.length === 0) {
      toast({
        title: "Aucun match à exporter",
        description: "Il n'y a pas de matchs à exporter actuellement.",
        variant: "destructive"
      });
      return;
    }
    try {
      const doc = new jsPDF();

      // Add title
      doc.setFontSize(20);
      doc.text("Liste des matchs TikTok", 14, 22);

      // Add date
      doc.setFontSize(11);
      doc.setTextColor(100, 100, 100);
      doc.text(`Exporté le ${format(new Date(), "dd MMMM yyyy à HH:mm", {
        locale: fr
      })}`, 14, 30);

      // Prepare data for table
      const tableColumn = ["Date", "Créateur", "Adversaire", "Statut", "Points", "Plateforme", "Type"];
      const tableRows = matches.map(match => {
        const matchDate = new Date(match.match_date);
        const formattedDate = format(matchDate, "dd/MM/yyyy HH:mm", {
          locale: fr
        });

        // Map status to French
        let status = "Programmé";
        if (match.status === "completed") status = "Terminé";
        if (match.status === "cancelled") status = "Annulé";
        if (match.status === "off") status = "Hors boost";
        if (match.status === "completed_off") status = "Terminé (hors boost)";

        // Add match type (with boost or without)
        const matchType = match.with_boost ? "Avec boost" : "Sans boost";
        return [formattedDate, match.creator_id || match.creator1_name || "N/A", match.opponent_id || match.creator2_name || "N/A", status, match.points?.toString() || "N/A", match.platform || "TikTok", matchType];
      });

      // Generate the table
      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 40,
        theme: 'grid',
        styles: {
          fontSize: 9,
          cellPadding: 3
        },
        headStyles: {
          fillColor: [155, 135, 245],
          textColor: [255, 255, 255]
        },
        alternateRowStyles: {
          fillColor: [240, 236, 250]
        }
      });

      // Footer
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(`Ultra TikTok Agency - Page ${i} sur ${pageCount}`, doc.internal.pageSize.getWidth() / 2, doc.internal.pageSize.getHeight() - 10, {
          align: "center"
        });
      }

      // Save the PDF
      doc.save("ultra-matches.pdf");
      toast({
        title: "Export réussi",
        description: "Le fichier PDF a été généré avec succès."
      });
    } catch (error) {
      console.error("Erreur lors de l'export PDF:", error);
      toast({
        title: "Erreur d'export",
        description: "Une erreur est survenue lors de la génération du PDF.",
        variant: "destructive"
      });
    }
  };
  
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex">
        {/* Add username watermark */}
        {username && <UsernameWatermark username={username} />}
        
        <UltraSidebar username={username || ''} role={role || ''} onLogout={handleLogout} currentPage="matches" />
        
        <div className="flex-1 flex flex-col">
          <div className="border-b border-gray-200 dark:border-gray-800 p-4 flex items-center justify-between shadow-sm bg-primary-hover">
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" onClick={() => navigate("/")} className="bg-blue-950 hover:bg-blue-800 text-slate-50">
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-xl font-bold text-slate-50">Matchs TikTok</h1>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button onClick={exportMatchesToPDF} variant="outline" className="flex items-center gap-2 border-purple-300 dark:border-purple-800 text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-950/30">
                <FileDown className="h-4 w-4" />
                Exporter en PDF
              </Button>
              
              {canScheduleMatch && <Button onClick={() => setIsMatchDialogOpen(true)} className="bg-purple-600 hover:bg-purple-700 text-white">
                  <Plus className="mr-2 h-4 w-4" />
                  Programmer un match
                </Button>}
            </div>
          </div>
          
          <div className="flex-1 p-4 md:p-6 overflow-y-auto bg-indigo-950">
            {isLoading ? <Loading size="large" text="Chargement des matchs..." /> : <div className="max-w-7xl mx-auto space-y-6">
                <MatchCalendar matches={matches || []} role={role || ''} isLoading={isLoading} creatorId={username || ''} />
                
                <UpcomingMatches role={role || ''} creatorId={username || ''} />
              </div>}
          </div>
        </div>
        
        {canScheduleMatch && <ScheduleMatchDialog isOpen={isMatchDialogOpen} onClose={() => setIsMatchDialogOpen(false)} />}
      </div>
    </SidebarProvider>
  );
};

export default Matches;
