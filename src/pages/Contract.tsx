
import React, { useState, useEffect } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { UltraSidebar } from "@/components/layout/UltraSidebar";
import { useIndexAuth } from "@/hooks/use-index-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, FileText, Check, Home } from "lucide-react";
import { jsPDF } from "jspdf";
import { useNavigate } from "react-router-dom";
import { MobileMenu } from "@/components/mobile/MobileMenu";
import { useIsMobile } from "@/hooks/use-mobile";
import { MobileNavigation } from "@/components/mobile/MobileNavigation";
import { BackButton } from "@/components/ui/back-button";
import { toast } from "sonner";
import agencyLogo from "../assets/logo.png";

const Contract = () => {
  const { isAuthenticated, username, role, userId, handleLogout, createdAt } = useIndexAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [downloading, setDownloading] = useState(false);
  const [hasApproved, setHasApproved] = useState(false);
  const [approvalDate, setApprovalDate] = useState<string>("");
  
  // Format today's date
  const today = new Date();
  const formattedToday = today.toLocaleDateString('fr-FR');
  
  // Get user creation date if available, otherwise use today
  useEffect(() => {
    if (createdAt) {
      const createDate = new Date(createdAt);
      setApprovalDate(createDate.toLocaleDateString('fr-FR'));
    } else {
      setApprovalDate(formattedToday);
    }
    
    // Check if the user has approved the contract before
    const approvedContract = localStorage.getItem(`contract-approved-${userId}`);
    if (approvedContract === 'true') {
      setHasApproved(true);
    }
  }, [createdAt, userId, formattedToday]);

  if (!isAuthenticated) {
    navigate('/');
    return null;
  }

  const handleApproveContract = () => {
    setHasApproved(true);
    localStorage.setItem(`contract-approved-${userId}`, 'true');
    toast.success("Contrat approuvé avec succès!");
  };

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
      
      // Add the 15 sections
      // Section 1
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
      
      // Section 2
      doc.setFont('helvetica', 'bold');
      doc.text("2. CONDITIONS D'ÉLIGIBILITÉ", 20, 170);
      doc.setFont('helvetica', 'normal');
      doc.text("Pour intégrer Phocéen Agency, les critères suivants doivent être remplis :", 20, 180);
      doc.text("- Âge minimum : 18 ans.", 20, 190);
      doc.text("- Minimum 500 abonnés sur TikTok.", 20, 197);
      doc.text("- Autorisation pour les personnes en situation de handicap.", 20, 204);
      doc.text("- Posséder un téléphone mobile et WhatsApp.", 20, 211);
      doc.text("- Avoir au moins un match off par mois.", 20, 218);
      doc.text("- Présentation correcte et tenue respectueuse.", 20, 225);
      doc.text("- Interdiction de montrer des enfants mineurs sous une apparence inappropriée.", 20, 232);
      
      // Add new page
      doc.addPage();
      
      // Section 3
      doc.setFont('helvetica', 'bold');
      doc.text("3. RÉMUNÉRATION & PROGRAMME DE RÉCOMPENSES", 20, 20);
      doc.setFont('helvetica', 'normal');
      doc.text("La rémunération est basée sur le système \"Ultra\". Les créateurs sont payés selon :", 20, 30);
      doc.text("- Nombre de jours et d'heures de streaming.", 20, 40);
      doc.text("- Respect des objectifs.", 20, 47);
      doc.text("- Nombre de diamants collectés.", 20, 54);
      doc.text("Modalités de paiement :", 20, 64);
      doc.text("- TikTok (commission de 50%)", 20, 74);
      doc.text("- PayPal (48 à 72 heures)", 20, 81);
      doc.text("- Carte cadeau (3 à 7 jours)", 20, 88);
      
      // Section 4
      doc.setFont('helvetica', 'bold');
      doc.text("4. ENGAGEMENTS DU CRÉATEUR", 20, 98);
      doc.setFont('helvetica', 'normal');
      doc.text("Le Créateur s'engage à respecter les règles TikTok, produire du contenu conforme aux valeurs", 20, 108);
      doc.text("de l'Agence et se conformer aux exigences de participation.", 20, 115);
      doc.text("- Respecter les horaires convenus pour les live streams", 20, 125);
      doc.text("- Maintenir une image positive et conforme à l'éthique de l'Agence", 20, 132);
      doc.text("- Promouvoir activement l'Agence et ses partenaires", 20, 139);
      
      // Section 5
      doc.setFont('helvetica', 'bold');
      doc.text("5. RESPONSABILITÉS", 20, 149);
      doc.setFont('helvetica', 'normal');
      doc.text("L'Agence n'est pas responsable en cas de harcèlement. Toute menace doit être signalée aux autorités.", 20, 159);
      doc.text("Le Créateur est seul responsable du contenu qu'il publie et diffuse sur ses plateformes.", 20, 166);
      
      // Section 6
      doc.setFont('helvetica', 'bold');
      doc.text("6. HIÉRARCHIE AU SEIN DE L'AGENCE", 20, 176);
      doc.setFont('helvetica', 'normal');
      doc.text("Évolution possible : Agent > Ambassadeur > Manager > Directeur > Fondateur.", 20, 186);
      doc.text("Chaque niveau hiérarchique implique de nouvelles responsabilités et avantages.", 20, 193);
      
      // Section 7
      doc.setFont('helvetica', 'bold');
      doc.text("7. RÉSILIATION", 20, 203);
      doc.setFont('helvetica', 'normal');
      doc.text("Le contrat peut être résilié par l'Agence ou le Créateur avec notification écrite.", 20, 213);
      doc.text("Délai de 30 jours avant départ officiel.", 20, 220);
      
      // Add new page
      doc.addPage();
      
      // Section 8
      doc.setFont('helvetica', 'bold');
      doc.text("8. CONFIDENTIALITÉ", 20, 20);
      doc.setFont('helvetica', 'normal');
      doc.text("Le Créateur s'engage à maintenir la confidentialité des informations internes de l'Agence,", 20, 30);
      doc.text("y compris les stratégies marketing, les données des autres créateurs et les partenariats.", 20, 37);
      
      // Section 9
      doc.setFont('helvetica', 'bold');
      doc.text("9. PROPRIÉTÉ INTELLECTUELLE", 20, 47);
      doc.setFont('helvetica', 'normal');
      doc.text("Le Créateur conserve ses droits sur son contenu personnel, mais autorise l'Agence à utiliser", 20, 57);
      doc.text("ses performances pour la promotion de l'Agence sur différentes plateformes.", 20, 64);
      
      // Section 10
      doc.setFont('helvetica', 'bold');
      doc.text("10. OBLIGATIONS DE PERFORMANCE", 20, 74);
      doc.setFont('helvetica', 'normal');
      doc.text("Le Créateur s'engage à maintenir un niveau minimal d'activité :", 20, 84);
      doc.text("- Minimum 15 heures de streaming hebdomadaire", 20, 91);
      doc.text("- Participation à au moins 7 jours de stream par semaine", 20, 98);
      doc.text("- Collecte d'un minimum de 20,000 diamants par mois", 20, 105);
      
      // Section 11
      doc.setFont('helvetica', 'bold');
      doc.text("11. FORMATION ET ACCOMPAGNEMENT", 20, 115);
      doc.setFont('helvetica', 'normal');
      doc.text("L'Agence s'engage à fournir au Créateur :", 20, 125);
      doc.text("- Des formations régulières sur les techniques de streaming", 20, 132);
      doc.text("- Un support technique en cas de problèmes", 20, 139);
      doc.text("- Des conseils personnalisés pour améliorer ses performances", 20, 146);
      
      // Section 12
      doc.setFont('helvetica', 'bold');
      doc.text("12. ÉVALUATION DES PERFORMANCES", 20, 156);
      doc.setFont('helvetica', 'normal');
      doc.text("Les performances du Créateur seront évaluées mensuellement selon :", 20, 166);
      doc.text("- Le nombre d'heures streamées", 20, 173);
      doc.text("- Le nombre de jours de présence", 20, 180);
      doc.text("- Le nombre de diamants collectés", 20, 187);
      doc.text("- La qualité du contenu et le respect des valeurs de l'Agence", 20, 194);
      
      // Add new page
      doc.addPage();
      
      // Section 13
      doc.setFont('helvetica', 'bold');
      doc.text("13. SANCTIONS ET PÉNALITÉS", 20, 20);
      doc.setFont('helvetica', 'normal');
      doc.text("En cas de non-respect des obligations contractuelles, des sanctions pourront être appliquées :", 20, 30);
      doc.text("- Avertissement verbal puis écrit", 20, 37);
      doc.text("- Suspension temporaire du statut de créateur", 20, 44);
      doc.text("- Exclusion définitive de l'Agence", 20, 51);
      
      // Section 14
      doc.setFont('helvetica', 'bold');
      doc.text("14. MODIFICATION DU CONTRAT", 20, 61);
      doc.setFont('helvetica', 'normal');
      doc.text("L'Agence se réserve le droit de modifier les termes du présent contrat avec un préavis d'un mois.", 20, 71);
      doc.text("Le Créateur sera informé de tout changement par écrit.", 20, 78);
      
      // Section 15
      doc.setFont('helvetica', 'bold');
      doc.text("15. DROIT APPLICABLE ET LITIGES", 20, 88);
      doc.setFont('helvetica', 'normal');
      doc.text("Le présent contrat est soumis au droit français. Tout litige sera résolu à l'amiable ou,", 20, 98);
      doc.text("à défaut, porté devant les tribunaux compétents de Marseille.", 20, 105);
      
      // Contact
      doc.text("Contact : contact@phoceenagency.fr", 20, 125);
      
      // Signature
      doc.text(`Fait à Marseille, le ${approvalDate}`, 20, 145);
      
      doc.text("Signature du Créateur", 40, 165);
      doc.text("Signature de l'Agence", 140, 165);
      
      if (hasApproved) {
        doc.text(`Approuvé par ${username} le ${formattedToday}`, doc.internal.pageSize.getWidth()/2, 185, { align: 'center' });
      }
      
      // Save the PDF
      doc.save(`Contrat_Phoceen_Agency_${username}.pdf`);
      toast.success("Téléchargement effectué!");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Erreur lors du téléchargement");
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
              <BackButton />
              <h1 className="text-2xl font-bold text-white ml-4">Contrat de Collaboration - Phocéen Agency</h1>
            </div>
            
            <Card className="bg-slate-800/90 backdrop-blur-sm border-purple-900/30 shadow-lg">
              <CardHeader className="border-b border-slate-700/50 bg-gradient-to-r from-slate-800 to-slate-900">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-semibold text-white flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-purple-400" />
                    Contrat
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button 
                      onClick={handleDownloadPDF} 
                      disabled={downloading}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      {downloading ? "Téléchargement..." : "Télécharger PDF"}
                    </Button>
                    
                    <Button 
                      onClick={handleApproveContract}
                      disabled={hasApproved}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Check className="h-4 w-4 mr-2" />
                      {hasApproved ? "Contrat Approuvé" : "J'ai lu et j'approuve"}
                    </Button>
                  </div>
                </div>
                {hasApproved && (
                  <div className="mt-2 text-sm text-green-400 animate-pulse flex items-center">
                    <Check className="h-3 w-3 mr-1" />
                    Contrat approuvé le {formattedToday}
                  </div>
                )}
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
                    <ul className="list-disc pl-6 mt-2 space-y-1">
                      <li>Respecter les horaires convenus pour les live streams</li>
                      <li>Maintenir une image positive et conforme à l'éthique de l'Agence</li>
                      <li>Promouvoir activement l'Agence et ses partenaires</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-bold">5. RESPONSABILITÉS</h3>
                    <p>L'Agence n'est pas responsable en cas de harcèlement. Toute menace doit être signalée aux autorités.</p>
                    <p>Le Créateur est seul responsable du contenu qu'il publie et diffuse sur ses plateformes.</p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-bold">6. HIÉRARCHIE AU SEIN DE L'AGENCE</h3>
                    <p>Évolution possible : Agent {'>'} Ambassadeur {'>'} Manager {'>'} Directeur {'>'} Fondateur.</p>
                    <p>Chaque niveau hiérarchique implique de nouvelles responsabilités et avantages.</p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-bold">7. RÉSILIATION</h3>
                    <p>Le contrat peut être résilié par l'Agence ou le Créateur avec notification écrite. Délai de 30 jours avant départ officiel.</p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-bold">8. CONFIDENTIALITÉ</h3>
                    <p>Le Créateur s'engage à maintenir la confidentialité des informations internes de l'Agence, y compris les stratégies marketing, les données des autres créateurs et les partenariats.</p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-bold">9. PROPRIÉTÉ INTELLECTUELLE</h3>
                    <p>Le Créateur conserve ses droits sur son contenu personnel, mais autorise l'Agence à utiliser ses performances pour la promotion de l'Agence sur différentes plateformes.</p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-bold">10. OBLIGATIONS DE PERFORMANCE</h3>
                    <p>Le Créateur s'engage à maintenir un niveau minimal d'activité :</p>
                    <ul className="list-disc pl-6 mt-2 space-y-1">
                      <li>Minimum 15 heures de streaming hebdomadaire</li>
                      <li>Participation à au moins 7 jours de stream par semaine</li>
                      <li>Collecte d'un minimum de 20,000 diamants par mois</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-bold">11. FORMATION ET ACCOMPAGNEMENT</h3>
                    <p>L'Agence s'engage à fournir au Créateur :</p>
                    <ul className="list-disc pl-6 mt-2 space-y-1">
                      <li>Des formations régulières sur les techniques de streaming</li>
                      <li>Un support technique en cas de problèmes</li>
                      <li>Des conseils personnalisés pour améliorer ses performances</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-bold">12. ÉVALUATION DES PERFORMANCES</h3>
                    <p>Les performances du Créateur seront évaluées mensuellement selon :</p>
                    <ul className="list-disc pl-6 mt-2 space-y-1">
                      <li>Le nombre d'heures streamées</li>
                      <li>Le nombre de jours de présence</li>
                      <li>Le nombre de diamants collectés</li>
                      <li>La qualité du contenu et le respect des valeurs de l'Agence</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-bold">13. SANCTIONS ET PÉNALITÉS</h3>
                    <p>En cas de non-respect des obligations contractuelles, des sanctions pourront être appliquées :</p>
                    <ul className="list-disc pl-6 mt-2 space-y-1">
                      <li>Avertissement verbal puis écrit</li>
                      <li>Suspension temporaire du statut de créateur</li>
                      <li>Exclusion définitive de l'Agence</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-bold">14. MODIFICATION DU CONTRAT</h3>
                    <p>L'Agence se réserve le droit de modifier les termes du présent contrat avec un préavis d'un mois. Le Créateur sera informé de tout changement par écrit.</p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-bold">15. DROIT APPLICABLE ET LITIGES</h3>
                    <p>Le présent contrat est soumis au droit français. Tout litige sera résolu à l'amiable ou, à défaut, porté devant les tribunaux compétents de Marseille.</p>
                  </div>
                  
                  <div className="pt-4">
                    <p>Contact : contact@phoceenagency.fr</p>
                    <p className="mt-4">Fait à Marseille, le {approvalDate}</p>
                    
                    {hasApproved && (
                      <div className="mt-4 p-4 border border-green-500/30 bg-green-500/10 rounded-md">
                        <p className="text-center text-green-400 font-medium">
                          Contrat approuvé par {username} le {formattedToday}
                        </p>
                      </div>
                    )}
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
