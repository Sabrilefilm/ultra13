
import React from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { UltraSidebar } from "@/components/layout/UltraSidebar";
import { useIndexAuth } from "@/hooks/use-index-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shell, Download, FileText, Diamond, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { generateContractPDF } from "@/utils/contract-utils";
import { toast } from "@/hooks/use-toast";

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
          />
          
          <div className="flex-1 flex flex-col items-center justify-center p-6">
            <div className="w-full max-w-4xl mx-auto">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-white flex items-center">
                  <Shell className="h-6 w-6 mr-2 text-purple-400" />
                  Mon Contrat
                </h1>
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
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center">
                      <FileText className="h-5 w-5 text-purple-400 mr-2" />
                      Contrat de Collaboration - Ultra Agency
                    </CardTitle>
                    <img 
                      src="https://phoceenagency.fr/wp-content/uploads/2023/12/logo-PA-blanc.png" 
                      alt="Phocéen Agency Logo" 
                      className="h-12 object-contain"
                    />
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div className="text-center mb-6">
                      <h2 className="text-xl font-bold">CONTRAT DE COLLABORATION</h2>
                      <p className="text-slate-300">Entre Ultra Agency et {username} ({roleText()})</p>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold border-b border-slate-700 pb-2">Article 1 - Objet du Contrat</h3>
                      <p className="text-slate-300">
                        Ce contrat définit les conditions de collaboration entre Ultra Agency et le {roleText().toLowerCase()}.
                        Cette collaboration vise à promouvoir le développement professionnel du {roleText().toLowerCase()} sur
                        la plateforme TikTok tout en respectant les directives et objectifs fixés par Ultra Agency.
                      </p>
                      
                      <h3 className="text-lg font-semibold border-b border-slate-700 pb-2 mt-6">Article 2 - Rémunération</h3>
                      <p className="text-slate-300">
                        Le {roleText().toLowerCase()} sera rémunéré selon le programme de récompenses basé sur les diamants.
                        Le paiement sera effectué une fois le seuil minimum atteint, conformément au Programme de Récompenses
                        en vigueur.
                      </p>
                      
                      <div className="bg-slate-700/30 rounded-lg p-4 my-4">
                        <h4 className="font-semibold flex items-center text-purple-300 mb-2">
                          <Diamond className="h-4 w-4 mr-2" />
                          Programme de Récompenses
                        </h4>
                        <ul className="space-y-2">
                          <li className="flex items-center">
                            <Check className="h-4 w-4 text-green-400 mr-2" />
                            <span>36,000 diamants = 10€ de récompense</span>
                          </li>
                          <li className="flex items-center">
                            <Check className="h-4 w-4 text-green-400 mr-2" />
                            <span>100,000 diamants = 30€ de récompense</span>
                          </li>
                          <li className="flex items-center">
                            <Check className="h-4 w-4 text-green-400 mr-2" />
                            <span>300,000 diamants = 100€ de récompense</span>
                          </li>
                        </ul>
                      </div>
                      
                      <h3 className="text-lg font-semibold border-b border-slate-700 pb-2 mt-6">Article 3 - Obligations</h3>
                      <p className="text-slate-300 mb-2">
                        Le {roleText().toLowerCase()} s'engage à :
                      </p>
                      <ul className="space-y-2 pl-6 list-disc text-slate-300">
                        <li>Effectuer 7 jours et 15 heures de live par semaine</li>
                        <li>Respecter le règlement intérieur d'Ultra Agency</li>
                        <li>Maintenir une image professionnelle sur la plateforme</li>
                        <li>Participer aux événements organisés par Ultra Agency</li>
                        <li>Informer l'agence de tout problème ou difficulté</li>
                      </ul>
                      
                      <h3 className="text-lg font-semibold border-b border-slate-700 pb-2 mt-6">Article 4 - Durée</h3>
                      <p className="text-slate-300">
                        Ce contrat est conclu pour une durée indéterminée, avec possibilité de résiliation par l'une ou
                        l'autre des parties moyennant un préavis d'une semaine.
                      </p>
                      
                      <h3 className="text-lg font-semibold border-b border-slate-700 pb-2 mt-6">Article 5 - Informations de l'Agence</h3>
                      <p className="text-slate-300">
                        <strong>Phocéen Agency</strong><br/>
                        Adresse: 16 Rue Fort Notre Dame, 13001 Marseille<br/>
                        Email: contact@phoceenagency.fr<br/>
                        Site web: https://phoceenagency.fr<br/>
                      </p>
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
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Contract;
