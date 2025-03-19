
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Download, Clipboard, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const CreatorRulesContent = () => {
  const { toast } = useToast();
  const [copiedSection, setCopiedSection] = useState("");

  const handleCopyToClipboard = (text: string, section: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(section);
    toast({
      title: "Copié",
      description: `${section} a été copié dans le presse-papier.`,
    });
    
    setTimeout(() => {
      setCopiedSection("");
    }, 2000);
  };

  const handleDownloadPDF = () => {
    toast({
      title: "Téléchargement",
      description: "Les règles des créateurs ont été téléchargées.",
    });
  };

  return (
    <div className="container mx-auto p-4 max-w-5xl">
      <Card className="bg-[#1e1f2e]/90 backdrop-blur-sm border border-gray-800/50 rounded-xl shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-2xl font-bold text-white">Règles des Créateurs</CardTitle>
          <Button variant="outline" onClick={handleDownloadPDF} className="border-purple-600 text-purple-400 hover:bg-purple-600/20">
            <Download className="mr-2 h-4 w-4" />
            Télécharger PDF
          </Button>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="obligations" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-[#12141f]/60 rounded-lg">
              <TabsTrigger value="obligations" className="data-[state=active]:bg-purple-600/30 data-[state=active]:text-purple-400">Obligations</TabsTrigger>
              <TabsTrigger value="comportement" className="data-[state=active]:bg-purple-600/30 data-[state=active]:text-purple-400">Comportement</TabsTrigger>
              <TabsTrigger value="sanctions" className="data-[state=active]:bg-purple-600/30 data-[state=active]:text-purple-400">Sanctions</TabsTrigger>
            </TabsList>
            
            <TabsContent value="obligations" className="mt-4 space-y-4">
              <div className="relative p-5 bg-[#12141f]/60 rounded-lg">
                <h3 className="text-lg font-semibold text-white mb-3">Temps de présence</h3>
                <div className="space-y-3 text-gray-300">
                  <p>1. <b>Durée minimale</b> - Chaque créateur doit assurer un minimum de 7 jours et 15 heures de live par semaine.</p>
                  <p>2. <b>Planification</b> - Les horaires de live doivent être communiqués à l'agent au moins 48h à l'avance.</p>
                  <p>3. <b>Ponctualité</b> - Les lives doivent commencer à l'heure indiquée dans le planning.</p>
                  <p>4. <b>Assiduité</b> - Toute impossibilité de diffuser doit être signalée au moins 24h à l'avance.</p>
                  <p>5. <b>Exceptions</b> - Seules des raisons médicales ou de force majeure peuvent justifier une absence non planifiée.</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="absolute top-2 right-2 h-8 w-8 p-0"
                  onClick={() => handleCopyToClipboard("1. Durée minimale - Chaque créateur doit assurer un minimum de 7 jours et 15 heures de live par semaine.\n2. Planification - Les horaires de live doivent être communiqués à l'agent au moins 48h à l'avance.\n3. Ponctualité - Les lives doivent commencer à l'heure indiquée dans le planning.\n4. Assiduité - Toute impossibilité de diffuser doit être signalée au moins 24h à l'avance.\n5. Exceptions - Seules des raisons médicales ou de force majeure peuvent justifier une absence non planifiée.", "Temps de présence")}
                >
                  {copiedSection === "Temps de présence" ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Clipboard className="h-4 w-4" />}
                </Button>
              </div>
              
              <div className="relative p-5 bg-[#12141f]/60 rounded-lg">
                <h3 className="text-lg font-semibold text-white mb-3">Participation aux matchs</h3>
                <div className="space-y-3 text-gray-300">
                  <p>1. <b>Priorité</b> - Les matchs organisés par l'agence sont prioritaires sur tout autre contenu.</p>
                  <p>2. <b>Préparation</b> - Le créateur doit être disponible 30 minutes avant le début d'un match.</p>
                  <p>3. <b>Notification</b> - Les matchs vous seront communiqués au moins 72h à l'avance.</p>
                  <p>4. <b>Absence</b> - Toute impossibilité de participer à un match doit être justifiée et communiquée dès que possible.</p>
                  <p>5. <b>Équipement</b> - Le créateur doit s'assurer que son équipement est fonctionnel avant les matchs.</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="absolute top-2 right-2 h-8 w-8 p-0"
                  onClick={() => handleCopyToClipboard("1. Priorité - Les matchs organisés par l'agence sont prioritaires sur tout autre contenu.\n2. Préparation - Le créateur doit être disponible 30 minutes avant le début d'un match.\n3. Notification - Les matchs vous seront communiqués au moins 72h à l'avance.\n4. Absence - Toute impossibilité de participer à un match doit être justifiée et communiquée dès que possible.\n5. Équipement - Le créateur doit s'assurer que son équipement est fonctionnel avant les matchs.", "Participation aux matchs")}
                >
                  {copiedSection === "Participation aux matchs" ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Clipboard className="h-4 w-4" />}
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="comportement" className="mt-4 space-y-4">
              <div className="relative p-5 bg-[#12141f]/60 rounded-lg">
                <h3 className="text-lg font-semibold text-white mb-3">Communication</h3>
                <div className="space-y-3 text-gray-300">
                  <p>1. <b>Langage</b> - Éviter tout langage offensant, discriminatoire ou inapproprié.</p>
                  <p>2. <b>Modération</b> - Assurer une modération active de votre chat pour éviter les comportements toxiques.</p>
                  <p>3. <b>Respect</b> - Traiter les spectateurs et autres créateurs avec respect et professionnalisme.</p>
                  <p>4. <b>Image</b> - Représenter l'agence de manière positive dans vos communications publiques.</p>
                  <p>5. <b>Réactivité</b> - Répondre aux communications de votre agent dans un délai de 24h maximum.</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="absolute top-2 right-2 h-8 w-8 p-0"
                  onClick={() => handleCopyToClipboard("1. Langage - Éviter tout langage offensant, discriminatoire ou inapproprié.\n2. Modération - Assurer une modération active de votre chat pour éviter les comportements toxiques.\n3. Respect - Traiter les spectateurs et autres créateurs avec respect et professionnalisme.\n4. Image - Représenter l'agence de manière positive dans vos communications publiques.\n5. Réactivité - Répondre aux communications de votre agent dans un délai de 24h maximum.", "Communication")}
                >
                  {copiedSection === "Communication" ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Clipboard className="h-4 w-4" />}
                </Button>
              </div>
              
              <div className="relative p-5 bg-[#12141f]/60 rounded-lg">
                <h3 className="text-lg font-semibold text-white mb-3">Contenu et partenariats</h3>
                <div className="space-y-3 text-gray-300">
                  <p>1. <b>Approbation</b> - Tous les partenariats doivent être préalablement approuvés par l'agence.</p>
                  <p>2. <b>Contenu original</b> - Privilégier un contenu original et créatif lors des lives.</p>
                  <p>3. <b>Conflits</b> - Ne pas participer à des dramas ou des polémiques publiques impliquant d'autres créateurs.</p>
                  <p>4. <b>Marque</b> - Respecter l'image de l'agence dans tous les contenus publiés.</p>
                  <p>5. <b>Diversité</b> - Varier les formats de contenu pour maintenir l'engagement des spectateurs.</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="absolute top-2 right-2 h-8 w-8 p-0"
                  onClick={() => handleCopyToClipboard("1. Approbation - Tous les partenariats doivent être préalablement approuvés par l'agence.\n2. Contenu original - Privilégier un contenu original et créatif lors des lives.\n3. Conflits - Ne pas participer à des dramas ou des polémiques publiques impliquant d'autres créateurs.\n4. Marque - Respecter l'image de l'agence dans tous les contenus publiés.\n5. Diversité - Varier les formats de contenu pour maintenir l'engagement des spectateurs.", "Contenu et partenariats")}
                >
                  {copiedSection === "Contenu et partenariats" ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Clipboard className="h-4 w-4" />}
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="sanctions" className="mt-4 space-y-4">
              <div className="relative p-5 bg-[#12141f]/60 rounded-lg">
                <h3 className="text-lg font-semibold text-white mb-3">Barème de sanctions</h3>
                <div className="space-y-3 text-gray-300">
                  <p>1. <b>Niveau 1: Avertissement</b> - Premier manquement mineur aux règles, notification verbale.</p>
                  <p>2. <b>Niveau 2: Pénalité financière</b> - Manquements répétés ou sérieux, réduction de la rémunération.</p>
                  <p>3. <b>Niveau 3: Suspension</b> - Infractions graves, suspension temporaire des activités avec l'agence.</p>
                  <p>4. <b>Niveau 4: Résiliation</b> - Infractions majeures ou répétées, fin de la collaboration avec l'agence.</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="absolute top-2 right-2 h-8 w-8 p-0"
                  onClick={() => handleCopyToClipboard("1. Niveau 1: Avertissement - Premier manquement mineur aux règles, notification verbale.\n2. Niveau 2: Pénalité financière - Manquements répétés ou sérieux, réduction de la rémunération.\n3. Niveau 3: Suspension - Infractions graves, suspension temporaire des activités avec l'agence.\n4. Niveau 4: Résiliation - Infractions majeures ou répétées, fin de la collaboration avec l'agence.", "Barème de sanctions")}
                >
                  {copiedSection === "Barème de sanctions" ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Clipboard className="h-4 w-4" />}
                </Button>
              </div>
              
              <div className="relative p-5 bg-[#12141f]/60 rounded-lg">
                <h3 className="text-lg font-semibold text-white mb-3">Procédure disciplinaire</h3>
                <div className="space-y-3 text-gray-300">
                  <p>1. <b>Notification</b> - Le créateur sera informé par écrit de tout manquement constaté.</p>
                  <p>2. <b>Droit de réponse</b> - Un délai de 48h est accordé pour fournir des explications.</p>
                  <p>3. <b>Décision</b> - La direction prendra une décision après examen des explications fournies.</p>
                  <p>4. <b>Appel</b> - Le créateur peut faire appel de la décision dans un délai de 7 jours.</p>
                  <p>5. <b>Réhabilitation</b> - Un système de réhabilitation progressive est prévu pour les sanctions de niveaux 1 à 3.</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="absolute top-2 right-2 h-8 w-8 p-0"
                  onClick={() => handleCopyToClipboard("1. Notification - Le créateur sera informé par écrit de tout manquement constaté.\n2. Droit de réponse - Un délai de 48h est accordé pour fournir des explications.\n3. Décision - La direction prendra une décision après examen des explications fournies.\n4. Appel - Le créateur peut faire appel de la décision dans un délai de 7 jours.\n5. Réhabilitation - Un système de réhabilitation progressive est prévu pour les sanctions de niveaux 1 à 3.", "Procédure disciplinaire")}
                >
                  {copiedSection === "Procédure disciplinaire" ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Clipboard className="h-4 w-4" />}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
