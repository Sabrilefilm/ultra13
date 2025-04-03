
import React, { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { UltraSidebar } from "@/components/layout/UltraSidebar";
import { useIndexAuth } from "@/hooks/use-index-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, FileText } from "lucide-react";
import { jsPDF } from "jspdf";
import { useNavigate } from "react-router-dom";
import { MobileMenu } from "@/components/mobile/MobileMenu";
import { useIsMobile } from "@/hooks/use-mobile";
import { MobileNavigation } from "@/components/mobile/MobileNavigation";
import agencyLogo from "/public/logo.png";

const Contract = () => {
  const { isAuthenticated, username, role, userId, handleLogout } = useIndexAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [downloading, setDownloading] = useState(false);

  if (!isAuthenticated) {
    navigate('/');
    return null;
  }

  const handleDownloadPDF = () => {
    setDownloading(true);
    
    try {
      const doc = new jsPDF();
      
      // Add logo
      const imgWidth = 30;
      const imgHeight = 15;
      doc.addImage(agencyLogo, 'PNG', (doc.internal.pageSize.getWidth() - imgWidth) / 2, 10, imgWidth, imgHeight);
      
      // Title
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text("CONTRAT DE CRÉATEUR PHOCÉEN AGENCY", doc.internal.pageSize.getWidth() / 2, 35, { align: 'center' });
      
      // Parties
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text("Entre :", 20, 45);
      doc.text("Phocéen Agency, ci-après dénommée \"l'Agence\", et", 20, 55);
      doc.text(`${username}, ci-après dénommé "le Créateur",`, 20, 65);
      doc.text("Il a été convenu ce qui suit :", 20, 75);
      
      // Sections
      doc.setFont('helvetica', 'bold');
      doc.text("1. OBJET DU CONTRAT", 20, 85);
      doc.setFont('helvetica', 'normal');
      doc.text("Phocéen Agency propose un programme d'accompagnement destiné aux créateurs de contenu sur", 20, 95);
      doc.text("les réseaux sociaux.", 20, 102);
      doc.text("Cet accompagnement inclut :", 20, 112);
      doc.text("- La formation à la création de contenu en direct (live streaming).", 20, 122);
      doc.text("- L'aide au développement de l'audience.", 20, 129);
      doc.text("- L'accompagnement pour le placement de produits.", 20, 136);
      doc.text("- Un programme de récompense basé sur les performances.", 20, 143);
      doc.text("Ce contrat ne constitue ni un CDD, ni un CDI, ni tout autre type de contrat de travail. Il s'agit d'une", 20, 153);
      doc.text("collaboration basée sur des objectifs et des performances.", 20, 160);
      
      // More sections would follow with similar formatting...
      doc.setFont('helvetica', 'bold');
      doc.text("2. CONDITIONS D'ÉLIGIBILITÉ", 20, 170);
      doc.setFont('helvetica', 'normal');
      doc.text("Pour intégrer Phocéen Agency, les critères suivants doivent être remplis :", 20, 180);
      doc.text("- Âge minimum : 18 ans.", 20, 190);
      doc.text("- Minimum 500 abonnés sur TikTok.", 20, 197);
      doc.text("- Autorisation pour les personnes en situation de handicap.", 20, 204);
      doc.text("- Posséder un téléphone mobile et WhatsApp.", 20, 211);
      
      // Add a second page
      doc.addPage();
      
      // Continue with remaining sections
      doc.text("- Avoir au moins un match off par mois.", 20, 20);
      doc.text("- Présentation correcte et tenue respectueuse.", 20, 27);
      doc.text("- Interdiction de montrer des enfants mineurs sous une apparence inappropriée.", 20, 34);
      
      doc.setFont('helvetica', 'bold');
      doc.text("3. RÉMUNÉRATION & PROGRAMME DE RÉCOMPENSES", 20, 45);
      doc.setFont('helvetica', 'normal');
      doc.text("La rémunération est basée sur le système \"Ultra\". Les créateurs sont payés selon :", 20, 55);
      doc.text("- Nombre de jours et d'heures de streaming.", 20, 65);
      doc.text("- Respect des objectifs.", 20, 72);
      doc.text("- Nombre de diamants collectés.", 20, 79);
      doc.text("Modalités de paiement :", 20, 89);
      doc.text("- TikTok (commission de 50%)", 20, 99);
      doc.text("- PayPal (48 à 72 heures)", 20, 106);
      doc.text("- Carte cadeau (3 à 7 jours)", 20, 113);
      
      doc.setFont('helvetica', 'bold');
      doc.text("4. ENGAGEMENTS DU CRÉATEUR", 20, 124);
      doc.setFont('helvetica', 'normal');
      doc.text("Le Créateur s'engage à respecter les règles TikTok, produire du contenu conforme aux valeurs", 20, 134);
      doc.text("de l'Agence et se conformer aux exigences de participation.", 20, 141);
      
      doc.setFont('helvetica', 'bold');
      doc.text("5. RESPONSABILITÉS", 20, 152);
      doc.setFont('helvetica', 'normal');
      doc.text("L'Agence n'est pas responsable en cas de harcèlement. Toute menace doit être signalée aux autorités.", 20, 162);
      
      doc.setFont('helvetica', 'bold');
      doc.text("6. HIÉRARCHIE AU SEIN DE L'AGENCE", 20, 173);
      doc.setFont('helvetica', 'normal');
      doc.text("Évolution possible : Agent > Ambassadeur > Manager > Directeur > Fondateur.", 20, 183);
      
      doc.setFont('helvetica', 'bold');
      doc.text("7. RÉSILIATION", 20, 194);
      doc.setFont('helvetica', 'normal');
      doc.text("Le contrat peut être résilié par l'Agence ou le Créateur avec notification écrite.", 20, 204);
      doc.text("Délai de 30 jours avant départ officiel.", 20, 211);
      
      doc.text("Contact : contact@phoceenagency.fr", 20, 225);
      
      // Signature
      doc.text(`Fait à ______________, le __/__/____`, 20, 240);
      
      doc.text("Signature du Créateur", 40, 260);
      doc.text("Signature de l'Agence", 140, 260);
      
      // Save the PDF
      doc.save(`Contrat_Phoceen_Agency_${username}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 text-white">
        {isMobile && (
          <MobileMenu 
            username={username}
            role={role}
            currentPage="/contract"
            onLogout={handleLogout}
          />
        )}
        
        <div className="flex h-full">
          <UltraSidebar
            username={username}
            role={role}
            userId={userId}
            onLogout={handleLogout}
            currentPage="contract"
          />
          
          <div className="flex-1 w-full max-w-5xl mx-auto p-4 md:p-6">
            <div className="mb-6 flex items-center">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/")}
                className="h-10 w-10 mr-4"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-2xl font-bold text-white">Contrat de Collaboration - Phocéen Agency</h1>
            </div>
            
            <Card className="bg-slate-800/90 backdrop-blur-sm border-purple-900/30 shadow-lg">
              <CardHeader className="border-b border-slate-700/50 bg-gradient-to-r from-slate-800 to-slate-900">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-semibold text-white flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-purple-400" />
                    Contrat
                  </CardTitle>
                  <Button 
                    onClick={handleDownloadPDF} 
                    disabled={downloading}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    {downloading ? "Téléchargement..." : "Télécharger PDF"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex justify-center mb-6">
                  <img src={agencyLogo} alt="Phocéen Agency Logo" className="h-16" />
                </div>
                
                <div className="space-y-6 text-slate-200">
                  <h2 className="text-xl font-bold text-center">CONTRAT DE CRÉATEUR PHOCÉEN AGENCY</h2>
                  
                  <p>Entre :</p>
                  <p>Phocéen Agency, ci-après dénommée "l'Agence", et</p>
                  <p>{username}, ci-après dénommé "le Créateur",</p>
                  <p>Il a été convenu ce qui suit :</p>
                  
                  <div>
                    <h3 className="text-lg font-bold">1. OBJET DU CONTRAT</h3>
                    <p>Phocéen Agency propose un programme d'accompagnement destiné aux créateurs de contenu sur les réseaux sociaux.</p>
                    <p>Cet accompagnement inclut :</p>
                    <ul className="list-disc pl-6 mt-2 space-y-1">
                      <li>La formation à la création de contenu en direct (live streaming).</li>
                      <li>L'aide au développement de l'audience.</li>
                      <li>L'accompagnement pour le placement de produits.</li>
                      <li>Un programme de récompense basé sur les performances.</li>
                    </ul>
                    <p className="mt-2">Ce contrat ne constitue ni un CDD, ni un CDI, ni tout autre type de contrat de travail. Il s'agit d'une collaboration basée sur des objectifs et des performances.</p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-bold">2. CONDITIONS D'ÉLIGIBILITÉ</h3>
                    <p>Pour intégrer Phocéen Agency, les critères suivants doivent être remplis :</p>
                    <ul className="list-disc pl-6 mt-2 space-y-1">
                      <li>Âge minimum : 18 ans.</li>
                      <li>Minimum 500 abonnés sur TikTok.</li>
                      <li>Autorisation pour les personnes en situation de handicap.</li>
                      <li>Posséder un téléphone mobile et WhatsApp.</li>
                      <li>Avoir au moins un match off par mois.</li>
                      <li>Présentation correcte et tenue respectueuse.</li>
                      <li>Interdiction de montrer des enfants mineurs sous une apparence inappropriée.</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-bold">3. RÉMUNÉRATION & PROGRAMME DE RÉCOMPENSES</h3>
                    <p>La rémunération est basée sur le système "Ultra". Les créateurs sont payés selon :</p>
                    <ul className="list-disc pl-6 mt-2 space-y-1">
                      <li>Nombre de jours et d'heures de streaming.</li>
                      <li>Respect des objectifs.</li>
                      <li>Nombre de diamants collectés.</li>
                    </ul>
                    <p className="mt-2">Modalités de paiement :</p>
                    <ul className="list-disc pl-6 mt-2 space-y-1">
                      <li>TikTok (commission de 50%)</li>
                      <li>PayPal (48 à 72 heures)</li>
                      <li>Carte cadeau (3 à 7 jours)</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-bold">4. ENGAGEMENTS DU CRÉATEUR</h3>
                    <p>Le Créateur s'engage à respecter les règles TikTok, produire du contenu conforme aux valeurs de l'Agence et se conformer aux exigences de participation.</p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-bold">5. RESPONSABILITÉS</h3>
                    <p>L'Agence n'est pas responsable en cas de harcèlement. Toute menace doit être signalée aux autorités.</p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-bold">6. HIÉRARCHIE AU SEIN DE L'AGENCE</h3>
                    <p>Évolution possible : Agent {'>'} Ambassadeur {'>'} Manager {'>'} Directeur {'>'} Fondateur.</p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-bold">7. RÉSILIATION</h3>
                    <p>Le contrat peut être résilié par l'Agence ou le Créateur avec notification écrite. Délai de 30 jours avant départ officiel.</p>
                  </div>
                  
                  <div className="pt-4">
                    <p>Contact : contact@phoceenagency.fr</p>
                    <p className="mt-4">Fait à ______________, le __/__/____</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <MobileNavigation 
          role={role}
          currentPage="contract"
          onOpenMenu={() => {}}
        />
      </div>
    </SidebarProvider>
  );
};

export default Contract;
