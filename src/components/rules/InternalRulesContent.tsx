import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Download, Clipboard, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { RGPDSection } from "@/components/rules/RGPDSection";

export const InternalRulesContent = () => {
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
      description: "Le règlement intérieur a été téléchargé.",
    });
  };

  return (
    <div className="container mx-auto p-4 max-w-5xl">
      <Card className="bg-[#1e1f2e]/90 backdrop-blur-sm border border-gray-800/50 rounded-xl shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-2xl font-bold text-white">Règlement Intérieur & Code de Conduite</CardTitle>
          <Button variant="outline" onClick={handleDownloadPDF} className="border-purple-600 text-purple-400 hover:bg-purple-600/20">
            <Download className="mr-2 h-4 w-4" />
            Télécharger PDF
          </Button>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-[#12141f]/60 rounded-lg">
              <TabsTrigger value="general" className="data-[state=active]:bg-purple-600/30 data-[state=active]:text-purple-400">Général</TabsTrigger>
              <TabsTrigger value="creators" className="data-[state=active]:bg-purple-600/30 data-[state=active]:text-purple-400">Créateurs</TabsTrigger>
              <TabsTrigger value="managers" className="data-[state=active]:bg-purple-600/30 data-[state=active]:text-purple-400">Managers</TabsTrigger>
              <TabsTrigger value="tiktok" className="data-[state=active]:bg-purple-600/30 data-[state=active]:text-purple-400">TikTok</TabsTrigger>
            </TabsList>
            
            <TabsContent value="general" className="mt-4 space-y-4">
              <div className="relative p-5 bg-[#12141f]/60 rounded-lg">
                <h3 className="text-lg font-semibold text-white mb-3">Principes Fondamentaux</h3>
                <div className="space-y-3 text-gray-300">
                  <p>1. <b>Respect mutuel</b> - Tous les membres de l'agence doivent se traiter avec respect et professionnalisme.</p>
                  <p>2. <b>Confidentialité</b> - Les informations internes de l'agence ne doivent pas être partagées à l'extérieur.</p>
                  <p>3. <b>Communication claire</b> - Toute communication doit être professionnelle, claire et respectueuse.</p>
                  <p>4. <b>Ponctualité</b> - Respecter les horaires de réunions et de rendez-vous est essentiel.</p>
                  <p>5. <b>Engagement</b> - Chaque membre s'engage à représenter l'agence de manière positive.</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="absolute top-2 right-2 h-8 w-8 p-0"
                  onClick={() => handleCopyToClipboard("1. Respect mutuel - Tous les membres de l'agence doivent se traiter avec respect et professionnalisme.\n2. Confidentialité - Les informations internes de l'agence ne doivent pas être partagées à l'extérieur.\n3. Communication claire - Toute communication doit être professionnelle, claire et respectueuse.\n4. Ponctualité - Respecter les horaires de réunions et de rendez-vous est essentiel.\n5. Engagement - Chaque membre s'engage à représenter l'agence de manière positive.", "Principes Fondamentaux")}
                >
                  {copiedSection === "Principes Fondamentaux" ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Clipboard className="h-4 w-4" />}
                </Button>
              </div>
              
              <div className="relative p-5 bg-[#12141f]/60 rounded-lg">
                <h3 className="text-lg font-semibold text-white mb-3">Lutte contre le harcèlement</h3>
                <div className="space-y-3 text-gray-300">
                  <p>1. <b>Tolérance zéro</b> - Notre agence applique une politique de tolérance zéro envers toute forme de harcèlement.</p>
                  <p>2. <b>Signalement</b> - Tout incident doit être immédiatement signalé à votre manager ou à la direction.</p>
                  <p>3. <b>Protection</b> - L'agence s'engage à protéger les personnes qui signalent des cas de harcèlement.</p>
                  <p>4. <b>Conséquences</b> - Des mesures disciplinaires sévères seront prises contre les auteurs de harcèlement.</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="absolute top-2 right-2 h-8 w-8 p-0"
                  onClick={() => handleCopyToClipboard("1. Tolérance zéro - Notre agence applique une politique de tolérance zéro envers toute forme de harcèlement.\n2. Signalement - Tout incident doit être immédiatement signalé à votre manager ou à la direction.\n3. Protection - L'agence s'engage à protéger les personnes qui signalent des cas de harcèlement.\n4. Conséquences - Des mesures disciplinaires sévères seront prises contre les auteurs de harcèlement.", "Lutte contre le harcèlement")}
                >
                  {copiedSection === "Lutte contre le harcèlement" ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Clipboard className="h-4 w-4" />}
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="creators" className="mt-4 space-y-4">
              <div className="relative p-5 bg-[#12141f]/60 rounded-lg">
                <h3 className="text-lg font-semibold text-white mb-3">Obligations des créateurs</h3>
                <div className="space-y-3 text-gray-300">
                  <p>1. <b>Temps de live</b> - Chaque créateur doit assurer un minimum de 7 jours et 15 heures de live par semaine.</p>
                  <p>2. <b>Contenu</b> - Le contenu doit être adapté à l'image de l'agence et respecter la charte de conduite.</p>
                  <p>3. <b>Communication</b> - Maintenir une communication régulière avec votre agent concernant votre planning.</p>
                  <p>4. <b>Ponctualité</b> - Les lives doivent commencer à l'heure prévue dans le planning.</p>
                  <p>5. <b>Matchs</b> - La participation aux matchs programmés est obligatoire sauf en cas de force majeure.</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="absolute top-2 right-2 h-8 w-8 p-0"
                  onClick={() => handleCopyToClipboard("1. Temps de live - Chaque créateur doit assurer un minimum de 7 jours et 15 heures de live par semaine.\n2. Contenu - Le contenu doit être adapté à l'image de l'agence et respecter la charte de conduite.\n3. Communication - Maintenir une communication régulière avec votre agent concernant votre planning.\n4. Ponctualité - Les lives doivent commencer à l'heure prévue dans le planning.\n5. Matchs - La participation aux matchs programmés est obligatoire sauf en cas de force majeure.", "Obligations des créateurs")}
                >
                  {copiedSection === "Obligations des créateurs" ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Clipboard className="h-4 w-4" />}
                </Button>
              </div>
              
              <div className="relative p-5 bg-[#12141f]/60 rounded-lg">
                <h3 className="text-lg font-semibold text-white mb-3">Comportement en live</h3>
                <div className="space-y-3 text-gray-300">
                  <p>1. <b>Langage</b> - Éviter tout langage offensant, discriminatoire ou inapproprié.</p>
                  <p>2. <b>Modération</b> - Assurer une modération active de votre chat pour éviter les comportements toxiques.</p>
                  <p>3. <b>Interactions</b> - Rester professionnel dans les interactions avec les spectateurs et les autres créateurs.</p>
                  <p>4. <b>Conflits</b> - Ne pas participer à des dramas ou des polémiques publiques impliquant d'autres créateurs.</p>
                  <p>5. <b>Sponsorings</b> - Tous les partenariats doivent être préalablement approuvés par l'agence.</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="absolute top-2 right-2 h-8 w-8 p-0"
                  onClick={() => handleCopyToClipboard("1. Langage - Éviter tout langage offensant, discriminatoire ou inapproprié.\n2. Modération - Assurer une modération active de votre chat pour éviter les comportements toxiques.\n3. Interactions - Rester professionnel dans les interactions avec les spectateurs et les autres créateurs.\n4. Conflits - Ne pas participer à des dramas ou des polémiques publiques impliquant d'autres créateurs.\n5. Sponsorings - Tous les partenariats doivent être préalablement approuvés par l'agence.", "Comportement en live")}
                >
                  {copiedSection === "Comportement en live" ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Clipboard className="h-4 w-4" />}
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="managers" className="mt-4 space-y-4">
              <div className="relative p-5 bg-[#12141f]/60 rounded-lg">
                <h3 className="text-lg font-semibold text-white mb-3">Responsabilités des managers</h3>
                <div className="space-y-3 text-gray-300">
                  <p>1. <b>Supervision</b> - Superviser et accompagner les agents sous votre responsabilité.</p>
                  <p>2. <b>Reporting</b> - Produire des rapports hebdomadaires sur les performances de votre équipe.</p>
                  <p>3. <b>Médiation</b> - Gérer les conflits entre agents ou entre agents et créateurs.</p>
                  <p>4. <b>Formation</b> - Assurer la formation continue des nouveaux agents.</p>
                  <p>5. <b>Stratégie</b> - Participer à l'élaboration des stratégies de développement de l'agence.</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="absolute top-2 right-2 h-8 w-8 p-0"
                  onClick={() => handleCopyToClipboard("1. Supervision - Superviser et accompagner les agents sous votre responsabilité.\n2. Reporting - Produire des rapports hebdomadaires sur les performances de votre équipe.\n3. Médiation - Gérer les conflits entre agents ou entre agents et créateurs.\n4. Formation - Assurer la formation continue des nouveaux agents.\n5. Stratégie - Participer à l'élaboration des stratégies de développement de l'agence.", "Responsabilités des managers")}
                >
                  {copiedSection === "Responsabilités des managers" ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Clipboard className="h-4 w-4" />}
                </Button>
              </div>
              
              <div className="relative p-5 bg-[#12141f]/60 rounded-lg">
                <h3 className="text-lg font-semibold text-white mb-3">Relations avec les agents</h3>
                <div className="space-y-3 text-gray-300">
                  <p>1. <b>Communication</b> - Maintenir une communication ouverte et régulière avec tous les agents.</p>
                  <p>2. <b>Évaluation</b> - Effectuer des évaluations trimestrielles des performances des agents.</p>
                  <p>3. <b>Accompagnement</b> - Accompagner les agents dans leur développement professionnel.</p>
                  <p>4. <b>Résolution</b> - Résoudre rapidement les problèmes rencontrés par les agents.</p>
                  <p>5. <b>Équité</b> - Traiter tous les agents de manière équitable et impartiale.</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="absolute top-2 right-2 h-8 w-8 p-0"
                  onClick={() => handleCopyToClipboard("1. Communication - Maintenir une communication ouverte et régulière avec tous les agents.\n2. Évaluation - Effectuer des évaluations trimestrielles des performances des agents.\n3. Accompagnement - Accompagner les agents dans leur développement professionnel.\n4. Résolution - Résoudre rapidement les problèmes rencontrés par les agents.\n5. Équité - Traiter tous les agents de manière équitable et impartiale.", "Relations avec les agents")}
                >
                  {copiedSection === "Relations avec les agents" ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Clipboard className="h-4 w-4" />}
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="tiktok" className="mt-4 space-y-4">
              <div className="relative p-5 bg-[#12141f]/60 rounded-lg">
                <h3 className="text-lg font-semibold text-white mb-3">Règles spécifiques TikTok</h3>
                <div className="space-y-3 text-gray-300">
                  <p>1. <b>Conformité</b> - Respecter strictement les directives communautaires de TikTok.</p>
                  <p>2. <b>Contenu approprié</b> - Créer uniquement du contenu approprié à tous les publics.</p>
                  <p>3. <b>Hashtags</b> - Utiliser les hashtags officiels de l'agence dans chaque publication.</p>
                  <p>4. <b>Format</b> - Privilégier les formats verticaux optimisés pour TikTok.</p>
                  <p>5. <b>Fréquence</b> - Publier au minimum 3 vidéos par semaine pour maintenir l'engagement.</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="absolute top-2 right-2 h-8 w-8 p-0"
                  onClick={() => handleCopyToClipboard("1. Conformité - Respecter strictement les directives communautaires de TikTok.\n2. Contenu approprié - Créer uniquement du contenu approprié à tous les publics.\n3. Hashtags - Utiliser les hashtags officiels de l'agence dans chaque publication.\n4. Format - Privilégier les formats verticaux optimisés pour TikTok.\n5. Fréquence - Publier au minimum 3 vidéos par semaine pour maintenir l'engagement.", "Règles spécifiques TikTok")}
                >
                  {copiedSection === "Règles spécifiques TikTok" ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Clipboard className="h-4 w-4" />}
                </Button>
              </div>
              
              <div className="relative p-5 bg-[#12141f]/60 rounded-lg">
                <h3 className="text-lg font-semibold text-white mb-3">Prévention du harcèlement sur TikTok</h3>
                <div className="space-y-3 text-gray-300">
                  <p>1. <b>Modération active</b> - Modérer attentivement tous les commentaires sur vos vidéos.</p>
                  <p>2. <b>Filtres</b> - Utiliser les filtres de mots-clés pour bloquer les commentaires inappropriés.</p>
                  <p>3. <b>Non-engagement</b> - Ne pas interagir avec les commentaires négatifs ou provocateurs.</p>
                  <p>4. <b>Signalement</b> - Signaler immédiatement tout comportement abusif à la plateforme.</p>
                  <p>5. <b>Protection</b> - Ne jamais partager d'informations personnelles ou sensibles dans vos vidéos.</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="absolute top-2 right-2 h-8 w-8 p-0"
                  onClick={() => handleCopyToClipboard("1. Modération active - Modérer attentivement tous les commentaires sur vos vidéos.\n2. Filtres - Utiliser les filtres de mots-clés pour bloquer les commentaires inappropriés.\n3. Non-engagement - Ne pas interagir avec les commentaires négatifs ou provocateurs.\n4. Signalement - Signaler immédiatement tout comportement abusif à la plateforme.\n5. Protection - Ne jamais partager d'informations personnelles ou sensibles dans vos vidéos.", "Prévention du harcèlement sur TikTok")}
                >
                  {copiedSection === "Prévention du harcèlement sur TikTok" ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Clipboard className="h-4 w-4" />}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <RGPDSection />
    </div>
  );
};
