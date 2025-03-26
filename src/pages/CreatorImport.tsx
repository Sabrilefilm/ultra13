
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UltraSidebar } from "@/components/layout/UltraSidebar";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HomeIcon, ArrowLeft } from "lucide-react";
import { CreatorExcelImport } from "@/components/creator-stats/CreatorExcelImport";

const CreatorImport = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  
  useEffect(() => {
    // Récupérer les informations utilisateur depuis localStorage
    const storedUsername = localStorage.getItem("username");
    const storedRole = localStorage.getItem("userRole");
    const storedUserId = localStorage.getItem("userId");
    
    setUsername(storedUsername);
    setRole(storedRole);
    setUserId(storedUserId);
    
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex">
      <UltraSidebar 
        username={username}
        role={role}
        userId={userId || ''}
        onLogout={handleLogout}
        currentPage="creator-import"
      />
      
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/")}
                className="mr-2"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-2xl font-bold">Importation de Données Créateurs</h1>
            </div>
            
            <Button 
              variant="outline" 
              onClick={() => navigate("/")}
              className="flex items-center gap-2"
            >
              <HomeIcon className="h-4 w-4" />
              Retour au tableau de bord
            </Button>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Importation depuis Excel</CardTitle>
              <CardDescription>
                Importez des données de créateurs depuis un fichier Excel pour mettre à jour les informations dans la base de données.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/30 p-4 rounded-md">
                <h3 className="font-medium text-amber-800 dark:text-amber-300 mb-2">Instructions d'importation</h3>
                <ul className="list-disc pl-5 text-amber-700 dark:text-amber-400 space-y-1">
                  <li>Le fichier Excel doit contenir une colonne "Nom d'utilisateur du/de la créateur(trice)" obligatoire</li>
                  <li>Colonnes optionnelles pour les horaires: "hours" (heures) et "days" (jours)</li>
                  <li>Colonnes optionnelles pour les diamants: "diamonds" ou "total_diamonds"</li>
                  <li>Les créateurs doivent déjà exister dans la base de données</li>
                  <li>Seules les informations présentes dans le fichier seront mises à jour</li>
                </ul>
              </div>
              
              <CreatorExcelImport />
              
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/30 p-4 rounded-md mt-6">
                <h3 className="font-medium text-blue-800 dark:text-blue-300 mb-2">Aperçu des modifications</h3>
                <p className="text-blue-700 dark:text-blue-400">
                  Après l'importation, vous verrez un résumé des modifications effectuées. 
                  Les erreurs seront également affichées pour vous aider à résoudre les problèmes potentiels.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CreatorImport;
