
import React from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { UltraSidebar } from "@/components/layout/UltraSidebar";
import { useIndexAuth } from "@/hooks/use-index-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Diamond, Clock, Calendar, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Ambassador = () => {
  const { isAuthenticated, username, role, userId, handleLogout } = useIndexAuth();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    window.location.href = '/';
    return null;
  }

  if (role !== 'founder' && role !== 'ambassadeur') {
    window.location.href = '/dashboard';
    return null;
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex bg-gradient-to-br from-slate-900 to-slate-950 text-white">
        <UltraSidebar
          username={username}
          role={role || ''}
          userId={userId || ''}
          onLogout={handleLogout}
          currentPage="ambassador"
        />

        <div className="flex-1 p-4 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-white">Espace Ambassadeur 🏆</h1>
              <Button
                variant="outline"
                onClick={() => navigate("/")}
                className="flex items-center gap-2 bg-slate-800/80 border-slate-700/50 hover:bg-slate-700 text-white"
              >
                Retour au tableau de bord
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card className="bg-slate-800/90 border-violet-500/20">
                <CardHeader className="bg-slate-800/90 pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <Diamond className="h-5 w-5 text-violet-400 mr-2" />
                    Diamants Récoltés
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">0</div>
                  <p className="text-slate-400 text-sm">Objectif: 20,000 💎</p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/90 border-blue-500/20">
                <CardHeader className="bg-slate-800/90 pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <Clock className="h-5 w-5 text-blue-400 mr-2" />
                    Heures de Live
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">0h / 15h</div>
                  <p className="text-slate-400 text-sm">Heures requises: 15h</p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/90 border-teal-500/20">
                <CardHeader className="bg-slate-800/90 pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <Calendar className="h-5 w-5 text-teal-400 mr-2" />
                    Jours de Stream
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">0j / 7j</div>
                  <p className="text-slate-400 text-sm">Jours requis: 7j</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800/90 border-purple-500/20">
                <CardHeader className="bg-gradient-to-r from-purple-900/30 to-indigo-900/30">
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 text-purple-400 mr-2" />
                    Créateurs Parrainés
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="text-center py-12">
                    <Award className="h-16 w-16 text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-400">
                      Vous n'avez pas encore parrainé de créateurs.
                    </p>
                    <Button className="mt-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
                      Parrainer un créateur
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/90 border-purple-500/20">
                <CardHeader className="bg-gradient-to-r from-indigo-900/30 to-purple-900/30">
                  <CardTitle className="flex items-center">
                    <Award className="h-5 w-5 text-indigo-400 mr-2" />
                    Programme d'Ambassadeur
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <p className="text-slate-300">
                      En tant qu'ambassadeur, vous devez faire:
                    </p>
                    <ul className="space-y-2 text-slate-300">
                      <li className="flex items-center">
                        <Clock className="h-4 w-4 text-blue-400 mr-2" />
                        <span>15 heures de live par semaine</span>
                      </li>
                      <li className="flex items-center">
                        <Calendar className="h-4 w-4 text-teal-400 mr-2" />
                        <span>7 jours de stream par semaine</span>
                      </li>
                      <li className="flex items-center">
                        <Diamond className="h-4 w-4 text-violet-400 mr-2" />
                        <span>Collecter au moins 20,000 diamants</span>
                      </li>
                      <li className="flex items-center">
                        <Users className="h-4 w-4 text-purple-400 mr-2" />
                        <span>Parrainer de nouveaux créateurs</span>
                      </li>
                    </ul>
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

export default Ambassador;
