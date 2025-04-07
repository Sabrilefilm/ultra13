
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UltraSidebar } from "@/components/layout/UltraSidebar";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HomeIcon, FileSpreadsheet, TrendingUp, CheckCircle2, PanelRightOpen } from "lucide-react";
import { CreatorExcelImport } from "@/components/creator-stats/CreatorExcelImport";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Footer } from "@/components/layout/Footer";

const CreatorImportDashboard = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [lastLogin, setLastLogin] = useState<string | null>(null);
  
  useEffect(() => {
    // Récupérer les informations utilisateur depuis localStorage
    const storedUsername = localStorage.getItem("username");
    const storedRole = localStorage.getItem("userRole");
    const storedUserId = localStorage.getItem("userId");
    const storedLastLogin = localStorage.getItem("lastLogin");
    
    setUsername(storedUsername);
    setRole(storedRole);
    setUserId(storedUserId);
    setLastLogin(storedLastLogin);
    
    // Rediriger si l'utilisateur n'est pas fondateur
    if (storedRole !== "founder") {
      navigate("/");
    }
  }, [navigate]);
  
  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };
  
  if (!username || !role || role !== "founder") {
    return null; // Attendre le chargement ou rediriger
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950 text-gray-100">
        <UltraSidebar 
          username={username}
          role={role}
          userId={userId || ''}
          onLogout={handleLogout}
          currentPage="creator-import"
          lastLogin={lastLogin}
        />
        
        <div className="flex-1 p-4 md:p-6 overflow-y-auto">
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-white to-purple-100 bg-clip-text text-transparent">
                Importation de Données Créateurs
              </h1>
              
              <Button 
                variant="outline" 
                onClick={() => navigate("/")}
                className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white border-white/10 hover:border-white/20"
              >
                <HomeIcon className="h-4 w-4" />
                Retour au tableau de bord
              </Button>
            </div>
            
            <Card className="md:col-span-2 bg-slate-800/40 border-slate-700/50 backdrop-blur-sm shadow-xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-purple-900/20 to-indigo-900/20 border-b border-slate-700/50">
                <CardTitle className="flex items-center gap-2 text-white">
                  <FileSpreadsheet className="h-6 w-6 text-purple-400" />
                  Importation depuis Excel
                </CardTitle>
                <CardDescription className="text-slate-300">
                  Importez des données de créateurs depuis un fichier Excel pour mettre à jour les informations dans la base de données.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                <div className="bg-gradient-to-r from-amber-900/20 to-orange-900/20 border border-amber-800/30 p-4 rounded-md">
                  <h3 className="font-medium text-amber-300 mb-2 flex items-center gap-2">
                    <PanelRightOpen className="h-5 w-5" />
                    Instructions d'importation
                  </h3>
                  <ul className="list-disc pl-5 text-amber-300/80 space-y-1">
                    <li>L'outil détecte automatiquement les colonnes du fichier Excel</li>
                    <li>Colonnes reconnues : nom d'utilisateur du créateur, diamants, heures et jours de live</li>
                    <li>L'outil identifie les colonnes même si elles n'ont pas exactement le même nom</li>
                    <li>Les créateurs doivent déjà exister dans la base de données</li>
                    <li>Seules les informations présentes dans le fichier seront mises à jour</li>
                  </ul>
                </div>
                
                <CreatorExcelImport />
                
                <div className="bg-gradient-to-r from-indigo-900/20 to-blue-900/20 border border-blue-800/30 p-4 rounded-md mt-6">
                  <h3 className="font-medium text-blue-300 mb-2 flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5" />
                    Aperçu des modifications
                  </h3>
                  <p className="text-blue-300/80">
                    Après l'importation, vous verrez un résumé des modifications effectuées. 
                    Les erreurs seront également affichées pour vous aider à résoudre les problèmes potentiels.
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-purple-900/30 to-indigo-900/30 border-purple-800/30 shadow-xl overflow-hidden">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-purple-400" />
                  Statistiques d'import
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="bg-white/5 p-4 rounded-lg">
                    <div className="text-sm text-slate-400 mb-1">Diamants mis à jour</div>
                    <div className="text-2xl font-bold text-white flex items-center gap-2">
                      <span>💎</span> 124,568
                    </div>
                  </div>
                  
                  <div className="bg-white/5 p-4 rounded-lg">
                    <div className="text-sm text-slate-400 mb-1">Créateurs actualisés</div>
                    <div className="text-2xl font-bold text-white flex items-center gap-2">
                      <span>👤</span> 54
                    </div>
                  </div>
                  
                  <div className="bg-white/5 p-4 rounded-lg">
                    <div className="text-sm text-slate-400 mb-1">Plannings modifiés</div>
                    <div className="text-2xl font-bold text-white flex items-center gap-2">
                      <span>📅</span> 32
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Footer role={role} />
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default CreatorImportDashboard;
