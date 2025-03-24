
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Gift, Diamond, Calendar, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UltraSidebar } from "@/components/layout/UltraSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { RewardProgramTables } from "@/components/rewards/RewardProgramTables";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const CreatorRewards = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>('');
  const [role, setRole] = useState<string>('');
  const [userId, setUserId] = useState<string>('');
  const [selectedTab, setSelectedTab] = useState<string>('info');

  useEffect(() => {
    // Récupérer l'information utilisateur depuis localStorage
    const storedUsername = localStorage.getItem('username') || '';
    const storedRole = localStorage.getItem('userRole') || '';
    const storedUserId = localStorage.getItem('userId') || '';
    
    setUsername(storedUsername);
    setRole(storedRole);
    setUserId(storedUserId);
  }, []);

  const handleLogout = async () => {
    try {
      localStorage.clear();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const isFounder = role === 'founder';

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex">
        <UltraSidebar 
          username={username}
          role={role}
          userId={userId}
          onLogout={handleLogout}
          currentPage="recompenses"
        />
        
        <div className="flex-1 flex flex-col">
          <div className="py-4 px-6 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 flex items-center justify-between sticky top-0 z-10">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(-1)}
                className="h-10 w-10"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-2xl font-bold">Programme de Récompenses des Créateurs</h1>
            </div>
          </div>
          
          <div className="flex-1 p-6 overflow-auto">
            <div className="max-w-7xl mx-auto space-y-6">
              
              {isFounder && (
                <Alert className="bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800/30">
                  <Gift className="h-5 w-5 text-amber-500 dark:text-amber-400" />
                  <AlertTitle className="text-amber-700 dark:text-amber-300">Mode Administrateur</AlertTitle>
                  <AlertDescription className="text-amber-600 dark:text-amber-400">
                    En tant que fondateur, vous pouvez modifier les tableaux de récompenses. Utilisez l'onglet "Gestion des récompenses".
                  </AlertDescription>
                </Alert>
              )}
              
              <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
                <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto">
                  <TabsTrigger value="info">Informations</TabsTrigger>
                  {isFounder && (
                    <TabsTrigger value="management">Gestion des récompenses</TabsTrigger>
                  )}
                </TabsList>
                
                <TabsContent value="info" className="space-y-6">
                  {/* Bannière d'information */}
                  <Card className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-none shadow-xl">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="space-y-2">
                          <h2 className="text-2xl font-bold">Programme de Diamants</h2>
                          <p className="text-purple-100">
                            Chez Phocéen Agency, nous croyons au potentiel de chaque créateur. 
                            Notre bonus agence est conçu pour motiver les créateurs à persévérer et à évoluer.
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <Clock className="h-5 w-5" />
                            <span className="text-sm font-medium">Les mises à jour des paliers sont effectuées tous les trois mois</span>
                          </div>
                        </div>
                        <Diamond className="h-24 w-24 text-white opacity-80" />
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Explication du système */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="bg-white dark:bg-gray-800 border border-purple-100 dark:border-purple-900/20 shadow-md overflow-hidden">
                      <div className="h-2 bg-gradient-to-r from-purple-500 to-indigo-500"></div>
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="bg-purple-100 dark:bg-purple-900/20 p-2 rounded-full">
                            <Diamond className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                          </div>
                          <h3 className="text-lg font-semibold">Collectez des Diamants</h3>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300">
                          Les diamants sont gagnés lors de vos lives TikTok. Plus vous en accumulez,
                          plus vos récompenses seront importantes.
                        </p>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-white dark:bg-gray-800 border border-purple-100 dark:border-purple-900/20 shadow-md overflow-hidden">
                      <div className="h-2 bg-gradient-to-r from-green-500 to-emerald-500"></div>
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="bg-green-100 dark:bg-green-900/20 p-2 rounded-full">
                            <Clock className="h-6 w-6 text-green-600 dark:text-green-400" />
                          </div>
                          <h3 className="text-lg font-semibold">Horaires Minimums</h3>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300">
                          Pour recevoir vos récompenses, vous devez effectuer 15 heures de live par mois 
                          réparties sur au moins 7 jours différents.
                        </p>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-white dark:bg-gray-800 border border-purple-100 dark:border-purple-900/20 shadow-md overflow-hidden">
                      <div className="h-2 bg-gradient-to-r from-amber-500 to-orange-500"></div>
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="bg-amber-100 dark:bg-amber-900/20 p-2 rounded-full">
                            <Gift className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                          </div>
                          <h3 className="text-lg font-semibold">Modes de Récompense</h3>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300">
                          Choisissez comment recevoir vos récompenses : PayPal, TikTok Live ou carte cadeau.
                          Les paiements sont traités dans les 24 à 72 heures.
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  {/* Tableaux de récompenses */}
                  <RewardProgramTables canEdit={false} />
                  
                  {/* Notes et modes de paiement */}
                  <Card className="bg-white dark:bg-gray-800 border border-purple-100 dark:border-purple-900/20">
                    <CardContent className="p-6">
                      <div className="italic text-center text-gray-600 dark:text-gray-300 mb-8">
                        C'est TikTok et non l'agence qui détermine si vous êtes créateur débutant ou non-débutant 
                        en se basant sur vos diamants accumulés au cours des six derniers mois.
                      </div>
                      
                      <h3 className="text-xl font-bold text-center mb-6 bg-gradient-to-r from-black to-gray-700 dark:from-white dark:to-gray-300 inline-block text-transparent bg-clip-text mx-auto">
                        MODES DE RÉMUNÉRATION
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="border border-purple-200 dark:border-purple-800 rounded-lg p-4 text-center">
                          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-blue-600">
                              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-6h2v2h-2v-2zm0-8h2v6h-2V6z" />
                            </svg>
                          </div>
                          <h4 className="font-semibold mb-2">PayPal</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            Vous percevez la totalité de votre récompense sur votre compte PayPal dans les délais de 24h/48h.
                          </p>
                        </div>
                        
                        <div className="border border-purple-200 dark:border-purple-800 rounded-lg p-4 text-center">
                          <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-2">
                            <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-purple-600">
                              <path d="M16.6 5.82s.51.5 0 1.41-1.28 1.92-1.28 1.92s.56.56 0 1.4-.69 1.8-.69 1.8.48.97-.38 1.32c-.42.17-.95.36-1.23.44.18 2.5 7.48 11.28 7.48 11.28s-8.26-.22-9.14-.98c-.88-.76-2.54-3.47-2.85-5.64-.22-1.54-.05-3.83.16-4.14.2-.3 1.29-.52 1.8-.69.51-.17.73-.94.26-1.22-.48-.27-.76-.8-.4-1.87.37-1.07.88-1.63 1.2-2.05.33-.42.38-1.13-.05-1.2-.43-.08-.79-.51-.56-1.65.36-1.54.92-2.28 1.1-2.85.17-.58.2-1.29-.32-1.31-.52-.02-1.57 1.54-1.97 2.09C8.4 4.43 8.71 5.3 8.91 6c.2.7-.29 1.06-.63.87-.34-.19-.58-.53-.57-1.35 0-.83-.35-2.21-.35-2.21s-1.61 1.05-1.8 3.67c-.19 2.63.89 4.61 1.76 6.58.86 1.97 0 2.83-.53 2.83-.53 0-1.43-2.5-2.23-5.71-.8-3.2-1.54-5.88-1.97-6.94-.43-1.06-1.16-2.28-1.16-2.28s-1.5 3.26-.44 6.45c1.07 3.19 2.38 6.78 2.23 8.61-.15 1.83-.84 2.28-.84 2.28s2.36 1.24 3.01 1.93c.65.69 1.28 2.05 1.55 3.76.27 1.71.36 2.62.22 3.11-.14.49-1.21 1.31-1.21 1.31s4.65.11 7.56.11c2.91 0 7.75-.39 7.75-.39s-2.8-1.99-3.93-4.54c-1.13-2.55-1.5-4.95-1.1-6.35.4-1.4.28-2.04-.12-2.12M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0z" />
                            </svg>
                          </div>
                          <h4 className="font-semibold mb-2">TikTok Live</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            Sous forme de cadeaux envoyés directement sur votre live TikTok appliquée de 50% (taux prélevé par la plateforme).
                          </p>
                        </div>
                        
                        <div className="border border-purple-200 dark:border-purple-800 rounded-lg p-4 text-center">
                          <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-2">
                            <Gift className="w-6 h-6 text-red-600" />
                          </div>
                          <h4 className="font-semibold mb-2">Carte Cadeau</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            Vous percevez la totalité de votre récompense sur votre compte PayPal dans les délais de 24h/72h.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Contact */}
                  <Card className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 shadow-md">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row justify-between items-center">
                        <div>
                          <h3 className="text-xl font-bold mb-2">Agency Phocéen</h3>
                          <p className="text-gray-600 dark:text-gray-300">Là où votre projet prend vie</p>
                          <p className="text-gray-600 dark:text-gray-300 mt-2">180 Avenue du Prado 13008 Marseille</p>
                          <p className="text-gray-600 dark:text-gray-300">07 58 95 93 12</p>
                          <p className="text-gray-600 dark:text-gray-300">contact@phoceenagency.fr</p>
                        </div>
                        <div className="mt-4 md:mt-0">
                          <p className="text-xs text-gray-500 dark:text-gray-400">PRC - Documents 18/02/2025</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                {isFounder && (
                  <TabsContent value="management">
                    <Card className="bg-white dark:bg-gray-800 shadow-md border border-gray-200 dark:border-gray-700">
                      <CardHeader>
                        <CardTitle>Gestion des tableaux de récompenses</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <RewardProgramTables canEdit={true} />
                      </CardContent>
                    </Card>
                  </TabsContent>
                )}
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default CreatorRewards;
