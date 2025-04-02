
import React from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { UltraSidebar } from "@/components/layout/UltraSidebar";
import { useIndexAuth } from "@/hooks/use-index-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shell, Download, FileText, Diamond, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { generateContractPDF } from "@/utils/contract-utils";
import { toast } from "@/hooks/use-toast";
import { BackButton } from "@/components/ui/back-button";

const Contract = () => {
  const {
    isAuthenticated,
    username,
    role,
    userId,
    handleLogout
  } = useIndexAuth();
  
  if (!isAuthenticated) {
    window.location.href = '/';
    return null;
  }
  
  const roleText = () => {
    switch (role) {
      case 'creator':
        return "Créateur";
      case 'agent':
        return "Agent";
      case 'manager':
        return "Manager";
      case 'ambassadeur':
        return "Ambassadeur";
      default:
        return "Utilisateur";
    }
  };
  
  const handleDownloadContract = () => {
    try {
      generateContractPDF({
        username: username || '',
        role: roleText(),
        userId: userId || ''
      });
      toast({
        title: "Téléchargement du contrat",
        description: "Votre contrat a été généré avec succès",
      });
    } catch (error) {
      console.error("Erreur lors du téléchargement:", error);
      toast({
        variant: "destructive",
        title: "Erreur de téléchargement",
        description: "Une erreur est survenue lors de la génération du contrat",
      });
    }
  };
  
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 to-slate-950 text-white">
        <div className="flex w-full">
          <UltraSidebar 
            username={username} 
            role={role || ''} 
            userId={userId || ''} 
            onLogout={handleLogout} 
            currentPage="contract" 
          >
            <div className="w-full max-w-4xl mx-auto p-4 md:p-6">
              <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
                <div className="flex items-center">
                  <BackButton className="mr-4" />
                  <h1 className="text-2xl font-bold text-white flex items-center">
                    <Shell className="h-6 w-6 mr-2 text-purple-400" />
                    Mon Contrat
                  </h1>
                </div>
                <Button 
                  variant="outline" 
                  onClick={handleDownloadContract} 
                  className="flex items-center gap-2 bg-slate-800/80 border-slate-700/50 hover:bg-slate-700 text-white"
                >
                  <Download className="h-4 w-4" />
                  Télécharger le contrat
                </Button>
              </div>
              
              <Card className="bg-slate-800/90 border-purple-500/20 w-full">
                <CardHeader className="bg-gradient-to-r from-purple-900/30 to-indigo-900/30">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <CardTitle className="flex items-center">
                      <FileText className="h-5 w-5 text-purple-400 mr-2" />
                      CONTRAT DE CRÉATEUR PHOCÉEN AGENCY
                    </CardTitle>
                    <img 
                      src="https://phoceenagency.fr/wp-content/uploads/2023/12/logo-PA-blanc.png" 
                      alt="Phocéen Agency Logo" 
                      className="h-12 object-contain"
                    />
                  </div>
                </CardHeader>
                <CardContent className="p-4 md:p-6">
                  <div className="space-y-6 text-sm md:text-base">
                    <div className="text-center mb-6">
                      <p className="text-slate-300">Entre :</p>
                      <p className="text-slate-300">Phocéen Agency, ci-après dénommée "l'Agence", et</p>
                      <p className="text-slate-300">[{username}], ci-après dénommé "le Créateur",</p>
                      <p className="text-slate-300">Il a été convenu ce qui suit :</p>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold border-b border-slate-700 pb-2">1. OBJET DU CONTRAT</h3>
                      <p className="text-slate-300">
                        Phocéen Agency propose un programme d'accompagnement destiné aux créateurs de contenu sur les réseaux sociaux.
                      </p>
                      <p className="text-slate-300">Cet accompagnement inclut :</p>
                      <ul className="space-y-1 pl-5 list-disc text-slate-300">
                        <li>La formation à la création de contenu en direct (live streaming).</li>
                        <li>L'aide au développement de l'audience.</li>
                        <li>L'accompagnement pour le placement de produits.</li>
                        <li>Un programme de récompense basé sur les performances.</li>
                      </ul>
                      <p className="text-slate-300">
                        Ce contrat ne constitue ni un CDD, ni un CDI, ni tout autre type de contrat de travail. Il s'agit d'une collaboration basée
                        sur des objectifs et des performances.
                      </p>
                      
                      <h3 className="text-lg font-semibold border-b border-slate-700 pb-2 mt-6">2. CONDITIONS D'ÉLIGIBILITÉ</h3>
                      <p className="text-slate-300">
                        Pour intégrer Phocéen Agency, les critères suivants doivent être remplis :
                      </p>
                      <ul className="space-y-1 pl-5 list-disc text-slate-300">
                        <li>Âge minimum : 18 ans.</li>
                        <li>Minimum 500 abonnés sur TikTok.</li>
                        <li>Autorisation pour les personnes en situation de handicap.</li>
                        <li>Posséder un téléphone mobile et WhatsApp.</li>
                        <li>Avoir au moins un match off par mois.</li>
                        <li>Présentation correcte et tenue respectueuse.</li>
                        <li>Interdiction de montrer des enfants mineurs sous une apparence inappropriée.</li>
                      </ul>
                      
                      <h3 className="text-lg font-semibold border-b border-slate-700 pb-2 mt-6">3. RÉMUNÉRATION & PROGRAMME DE RÉCOMPENSES</h3>
                      <p className="text-slate-300">
                        La rémunération est basée sur le système "Ultra". Les créateurs sont payés selon :
                      </p>
                      <ul className="space-y-1 pl-5 list-disc text-slate-300">
                        <li>Nombre de jours et d'heures de streaming.</li>
                        <li>Respect des objectifs.</li>
                        <li>Nombre de diamants collectés.</li>
                      </ul>
                      <p className="text-slate-300">Modalités de paiement :</p>
                      <ul className="space-y-1 pl-5 list-disc text-slate-300">
                        <li>TikTok (commission de 50%)</li>
                        <li>PayPal (48 à 72 heures)</li>
                        <li>Carte cadeau (3 à 7 jours)</li>
                      </ul>
                      
                      <h3 className="text-lg font-semibold border-b border-slate-700 pb-2 mt-6">4. ENGAGEMENTS DU CRÉATEUR</h3>
                      <p className="text-slate-300">
                        Le Créateur s'engage à respecter les règles TikTok, produire du contenu conforme aux valeurs de l'Agence et se
                        conformer aux exigences de participation.
                      </p>
                      
                      <h3 className="text-lg font-semibold border-b border-slate-700 pb-2 mt-6">5. RESPONSABILITÉS</h3>
                      <p className="text-slate-300">
                        L'Agence n'est pas responsable en cas de harcèlement. Toute menace doit être signalée aux autorités.
                      </p>
                      
                      <h3 className="text-lg font-semibold border-b border-slate-700 pb-2 mt-6">6. HIÉRARCHIE AU SEIN DE L'AGENCE</h3>
                      <p className="text-slate-300">
                        Évolution possible : Agent > Ambassadeur > Manager > Directeur > Fondateur.
                      </p>
                      
                      <h3 className="text-lg font-semibold border-b border-slate-700 pb-2 mt-6">7. RÉSILIATION</h3>
                      <p className="text-slate-300">
                        Le contrat peut être résilié par l'Agence ou le Créateur avec notification écrite. Délai de 30 jours avant départ officiel.
                      </p>
                      <p className="text-slate-300 mt-4">
                        Contact : contact@phoceenagency.fr
                      </p>
                      
                      <div className="mt-6 pt-6 border-t border-slate-700/50 flex flex-wrap justify-between gap-4">
                        <div>
                          <p className="text-slate-300">Fait à ______________, le __/__/____</p>
                        </div>
                        <div className="flex flex-col gap-6">
                          <div className="text-slate-300">
                            <p>Signature Phocéen Agency</p>
                            <div className="h-16 w-40 border border-slate-600 rounded-md mt-2"></div>
                          </div>
                          <div className="text-slate-300">
                            <p>Signature {username}</p>
                            <div className="h-16 w-40 border border-slate-600 rounded-md mt-2"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-6 mt-8 border-t border-slate-700/50">
                      <div className="italic text-slate-400 text-sm">
                        Ce document est une version simplifiée du contrat. Pour obtenir le contrat complet, veuillez utiliser
                        le bouton "Télécharger le contrat".
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </UltraSidebar>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Contract;
