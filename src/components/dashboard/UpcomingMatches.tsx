
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUpcomingMatches } from "@/hooks/use-upcoming-matches";
import { downloadImage } from "@/utils/download";
import { MatchCard } from "./MatchCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Search, ChevronDown, ChevronUp, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { toast } from "sonner";
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Loading } from "@/components/ui/loading";

export const UpcomingMatches = ({ role, creatorId }: { role: string; creatorId: string }) => {
  const { matches, isLoading, handleDelete, setWinner, clearWinner, updateMatchDetails } = useUpcomingMatches(role, creatorId);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAllUpcoming, setShowAllUpcoming] = useState(false);
  const [showAllPast, setShowAllPast] = useState(false);
  const [generatingPdf, setGeneratingPdf] = useState(false);

  const canManageMatch = ['agent', 'manager', 'founder'].includes(role);
  const canDeleteMatch = ['founder', 'manager'].includes(role);
  const canEditMatch = ['agent', 'manager', 'founder'].includes(role);

  const generatePDF = () => {
    try {
      setGeneratingPdf(true);
      
      const doc = new jsPDF();
      
      // Ajouter une entête élégante
      doc.setFillColor(155, 135, 245);
      doc.rect(0, 0, 210, 20, 'F');
      
      doc.setFont("helvetica", "bold");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(18);
      doc.text('Agency Phocéen', 14, 14);
      
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(0, 0, 0);
      doc.text('Liste des Matchs', 14, 30);
      
      const today = format(new Date(), 'dd MMMM yyyy', { locale: fr });
      doc.setFontSize(10);
      doc.text(`Généré le: ${today}`, 14, 38);

      // Préparation des données
      const currentDate = new Date();
      const matchesData = matches || [];
      
      // Séparer les matchs par statut
      const pendingMatches = matchesData.filter(match => 
        (!match.winner_id && new Date(match.match_date) >= currentDate)
      );
      
      const winMatches = matchesData.filter(match => 
        (match.winner_id === match.creator_id)
      );
      
      const lostMatches = matchesData.filter(match => 
        (match.winner_id && match.winner_id !== match.creator_id)
      );

      // Section des matchs en attente
      doc.setFontSize(12);
      doc.setTextColor(100, 100, 100);
      doc.text('Matchs en attente', 14, 50);
      
      if (pendingMatches.length > 0) {
        const pendingData = pendingMatches.map(match => [
          format(new Date(match.match_date), 'dd/MM/yyyy'),
          format(new Date(match.match_date), 'HH:mm'),
          match.creator_id,
          match.opponent_id,
          match.status === 'off' ? 'Sans Boost' : 'Avec Boost',
          match.source || '-'
        ]);
  
        (doc as any).autoTable({
          head: [['Date', 'Heure', 'Créateur', 'Adversaire', 'Type', 'Source']],
          body: pendingData,
          startY: 55,
          styles: { fontSize: 8 },
          headStyles: { fillColor: [155, 135, 245] },
          theme: 'striped',
        });
      } else {
        doc.text('Aucun match en attente', 14, 55);
      }

      // Section des matchs gagnés
      let y = (doc as any).lastAutoTable?.finalY || 55;
      y += 15;
      
      doc.setFontSize(12);
      doc.setTextColor(20, 150, 20);
      doc.text('Matchs gagnés', 14, y);
      
      if (winMatches.length > 0) {
        const winData = winMatches.map(match => [
          format(new Date(match.match_date), 'dd/MM/yyyy'),
          format(new Date(match.match_date), 'HH:mm'),
          match.creator_id,
          match.opponent_id,
          match.points || '-',
          match.source || '-'
        ]);
  
        (doc as any).autoTable({
          head: [['Date', 'Heure', 'Créateur', 'Adversaire', 'Points', 'Source']],
          body: winData,
          startY: y + 5,
          styles: { fontSize: 8 },
          headStyles: { fillColor: [75, 181, 67] },
          theme: 'striped',
        });
      } else {
        doc.text('Aucun match gagné', 14, y + 5);
      }

      // Section des matchs perdus
      y = (doc as any).lastAutoTable?.finalY || y + 10;
      y += 15;
      
      doc.setFontSize(12);
      doc.setTextColor(181, 75, 67);
      doc.text('Matchs perdus', 14, y);
      
      if (lostMatches.length > 0) {
        const lostData = lostMatches.map(match => [
          format(new Date(match.match_date), 'dd/MM/yyyy'),
          format(new Date(match.match_date), 'HH:mm'),
          match.creator_id,
          match.opponent_id,
          match.winner_id,
          match.source || '-'
        ]);
  
        (doc as any).autoTable({
          head: [['Date', 'Heure', 'Créateur', 'Adversaire', 'Gagnant', 'Source']],
          body: lostData,
          startY: y + 5,
          styles: { fontSize: 8 },
          headStyles: { fillColor: [181, 75, 67] },
          theme: 'striped',
        });
      } else {
        doc.text('Aucun match perdu', 14, y + 5);
      }

      // Pied de page
      y = (doc as any).lastAutoTable?.finalY || y + 10;
      y += 15;
      
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text('Agency Phocéen - Confidentiel', 14, y);
      doc.text(`Total: ${matches?.length || 0} match(s)`, 14, y + 5);

      doc.save('agency-phoceen-matchs.pdf');
      
      toast.success("PDF généré avec succès");
    } catch (error) {
      console.error("Erreur lors de la génération du PDF:", error);
      toast.error("Erreur lors de la génération du PDF");
    } finally {
      setGeneratingPdf(false);
    }
  };

  if (isLoading) return (
    <Card className="elegant-card">
      <CardContent className="p-8">
        <Loading size="large" text="Chargement des matchs..." />
      </CardContent>
    </Card>
  );

  const currentDate = new Date();
  const allMatches = matches || [];
  
  const filteredMatches = searchQuery.trim() ? 
    allMatches.filter(match => 
      match.creator_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      match.opponent_id.toLowerCase().includes(searchQuery.toLowerCase())
    ) : 
    allMatches;
  
  const upcomingMatches = filteredMatches
    .filter(match => new Date(match.match_date) >= currentDate)
    .sort((a, b) => new Date(a.match_date).getTime() - new Date(b.match_date).getTime());
  
  const pastMatches = filteredMatches
    .filter(match => new Date(match.match_date) < currentDate)
    .sort((a, b) => new Date(b.match_date).getTime() - new Date(a.match_date).getTime());

  const INITIAL_MATCH_COUNT = 5;
  const upcomingToShow = showAllUpcoming ? upcomingMatches : upcomingMatches.slice(0, INITIAL_MATCH_COUNT);
  const pastToShow = showAllPast ? pastMatches : pastMatches.slice(0, INITIAL_MATCH_COUNT);

  return (
    <Card className="elegant-card">
      <CardHeader className="elegant-header">
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-indigo-600 dark:from-purple-400 dark:to-indigo-300">
            Matchs
          </CardTitle>
          <Button 
            onClick={generatePDF} 
            variant="outline" 
            className="gap-2 bg-white hover:bg-gray-50 dark:bg-slate-800 dark:hover:bg-slate-700 border-purple-200 dark:border-purple-800"
            disabled={generatingPdf}
          >
            {generatingPdf ? (
              <>
                <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                Génération...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Télécharger PDF
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
          <Input
            placeholder="Rechercher un match..."
            className="pl-10 elegant-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="w-full grid grid-cols-2 mb-6 bg-gray-100 dark:bg-slate-800 p-1 rounded-lg">
            <TabsTrigger 
              value="upcoming" 
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:text-purple-700 dark:data-[state=active]:text-purple-300 data-[state=active]:shadow-sm rounded-md text-gray-600 dark:text-gray-300"
            >
              À venir ({upcomingMatches.length})
            </TabsTrigger>
            <TabsTrigger 
              value="past" 
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:text-purple-700 dark:data-[state=active]:text-purple-300 data-[state=active]:shadow-sm rounded-md text-gray-600 dark:text-gray-300"
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
                    className="w-full mt-4 text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/30 flex items-center justify-center"
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
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mb-4">
                  <span className="text-purple-600 dark:text-purple-400 text-2xl">📅</span>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-2">Aucun match à venir</p>
                <p className="text-gray-400 dark:text-gray-500 text-sm">Les nouveaux matchs apparaîtront ici</p>
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
                    className="w-full mt-4 text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/30 flex items-center justify-center"
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
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mb-4">
                  <span className="text-purple-600 dark:text-purple-400 text-2xl">🏆</span>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-2">Aucun match passé</p>
                <p className="text-gray-400 dark:text-gray-500 text-sm">L'historique des matchs apparaîtra ici</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
