
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Home, 
  MessageSquare, 
  Calendar, 
  FileText, 
  AlertTriangle, 
  Users, 
  Award, 
  BarChart4,
  Paperclip,
  Shield,
  HelpCircle,
  Info,
  ArrowRight
} from 'lucide-react';

export const UserGuide = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <Card className="w-full bg-white/10 backdrop-blur-md border-white/10 dark:bg-slate-900/50 dark:border-slate-700/50 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border-b border-white/10 dark:border-slate-700/50">
        <CardTitle className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
          <HelpCircle className="h-5 w-5" />
          Guide d'utilisation Ultra
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full bg-gray-100/50 dark:bg-slate-800/50 p-1 flex flex-wrap justify-start overflow-x-auto">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700">
              <Home className="h-4 w-4 mr-2" /> Tableau de bord
            </TabsTrigger>
            <TabsTrigger value="messages" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700">
              <MessageSquare className="h-4 w-4 mr-2" /> Messagerie
            </TabsTrigger>
            <TabsTrigger value="matches" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700">
              <Calendar className="h-4 w-4 mr-2" /> Matchs
            </TabsTrigger>
            <TabsTrigger value="documents" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700">
              <FileText className="h-4 w-4 mr-2" /> Documents
            </TabsTrigger>
            <TabsTrigger value="penalties" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700">
              <AlertTriangle className="h-4 w-4 mr-2" /> Pénalités
            </TabsTrigger>
          </TabsList>

          {/* Important fix: Move TabsContent components to be direct children of Tabs component */}
          <TabsContent value="dashboard">
            <ScrollArea className="h-[400px]">
              <div className="mt-4 px-2">
                <h3 className="text-lg font-semibold mb-3 text-purple-600 dark:text-purple-400">Tableau de bord</h3>
                <p className="mb-3 text-gray-700 dark:text-gray-300">Le tableau de bord est votre page d'accueil personnalisée qui affiche un résumé de vos informations importantes.</p>
                
                <div className="space-y-4 mt-6">
                  <div className="border-l-2 border-purple-500 pl-4 py-1">
                    <h4 className="font-medium mb-1 flex items-center gap-2 text-gray-800 dark:text-gray-200">
                      <BarChart4 className="h-4 w-4 text-purple-500" /> Statistiques
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Affiche vos statistiques principales comme les matchs, heures de live, jours streamés et objectifs.</p>
                  </div>
                  
                  <div className="border-l-2 border-purple-500 pl-4 py-1">
                    <h4 className="font-medium mb-1 flex items-center gap-2 text-gray-800 dark:text-gray-200">
                      <Calendar className="h-4 w-4 text-purple-500" /> Matchs à venir
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Liste des prochains matchs programmés avec détails et minuteur.</p>
                  </div>
                  
                  <div className="border-l-2 border-purple-500 pl-4 py-1">
                    <h4 className="font-medium mb-1 flex items-center gap-2 text-gray-800 dark:text-gray-200">
                      <Award className="h-4 w-4 text-purple-500" /> Objectifs
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Suivi de vos objectifs de streaming et autres objectifs personnalisés.</p>
                  </div>
                </div>
                
                <div className="mt-6 bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg border border-purple-100 dark:border-purple-800/50">
                  <h4 className="font-medium flex items-center gap-2 text-purple-800 dark:text-purple-300 mb-2">
                    <Info className="h-4 w-4" /> Conseil
                  </h4>
                  <p className="text-sm text-purple-700 dark:text-purple-200">Utilisez le tableau de bord quotidiennement pour garder un œil sur vos performances et les événements à venir.</p>
                </div>
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="messages">
            <ScrollArea className="h-[400px]">
              <div className="mt-4 px-2">
                <h3 className="text-lg font-semibold mb-3 text-purple-600 dark:text-purple-400">Messagerie</h3>
                <p className="mb-3 text-gray-700 dark:text-gray-300">La messagerie vous permet de communiquer avec tous les membres de l'agence de manière directe et privée.</p>
                
                <div className="space-y-4 mt-6">
                  <div className="border-l-2 border-purple-500 pl-4 py-1">
                    <h4 className="font-medium mb-1 flex items-center gap-2 text-gray-800 dark:text-gray-200">
                      <MessageSquare className="h-4 w-4 text-purple-500" /> Conversations
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Accédez à vos conversations existantes dans la liste à gauche. Les conversations avec des messages non lus sont mises en évidence.</p>
                  </div>
                  
                  <div className="border-l-2 border-purple-500 pl-4 py-1">
                    <h4 className="font-medium mb-1 flex items-center gap-2 text-gray-800 dark:text-gray-200">
                      <ArrowRight className="h-4 w-4 text-purple-500" /> Nouvelle conversation
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Cliquez sur le bouton "Nouvelle conversation" pour démarrer une discussion avec un membre de l'agence.</p>
                  </div>
                  
                  <div className="border-l-2 border-purple-500 pl-4 py-1">
                    <h4 className="font-medium mb-1 flex items-center gap-2 text-gray-800 dark:text-gray-200">
                      <Paperclip className="h-4 w-4 text-purple-500" /> Pièces jointes
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Envoyez des fichiers et images en utilisant le bouton trombone ou en glissant-déposant le fichier dans la zone de message.</p>
                  </div>
                </div>
                
                <div className="mt-6 bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg border border-purple-100 dark:border-purple-800/50">
                  <h4 className="font-medium flex items-center gap-2 text-purple-800 dark:text-purple-300 mb-2">
                    <Shield className="h-4 w-4" /> Administration
                  </h4>
                  <p className="text-sm text-purple-700 dark:text-purple-200">Les fondateurs peuvent archiver des conversations qui seront conservées dans l'historique mais ne seront plus accessibles pour les participants.</p>
                </div>
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="matches">
            <ScrollArea className="h-[400px]">
              <div className="mt-4 px-2">
                <h3 className="text-lg font-semibold mb-3 text-purple-600 dark:text-purple-400">Matchs</h3>
                <p className="mb-3 text-gray-700 dark:text-gray-300">La page des matchs permet de gérer et suivre tous les événements sportifs de l'agence.</p>
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="documents">
            <ScrollArea className="h-[400px]">
              <div className="mt-4 px-2">
                <h3 className="text-lg font-semibold mb-3 text-purple-600 dark:text-purple-400">Documents</h3>
                <p className="mb-3 text-gray-700 dark:text-gray-300">La section documents permet d'accéder et de gérer tous les fichiers liés à l'agence.</p>
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="penalties">
            <ScrollArea className="h-[400px]">
              <div className="mt-4 px-2">
                <h3 className="text-lg font-semibold mb-3 text-purple-600 dark:text-purple-400">Pénalités</h3>
                <p className="mb-3 text-gray-700 dark:text-gray-300">La section pénalités vous permet de consulter les infractions aux règles et leurs conséquences.</p>
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
