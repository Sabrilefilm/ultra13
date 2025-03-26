
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileSpreadsheet, Upload, Loader2, Check, AlertCircle } from "lucide-react";
import { read, utils } from "xlsx";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";

export const CreatorExcelImport = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [importResults, setImportResults] = useState<{
    success: number;
    errors: number;
    details: string[];
    totalRows: number;
    currentRow: number;
  }>({ success: 0, errors: 0, details: [], totalRows: 0, currentRow: 0 });
  const [showResults, setShowResults] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [fileHeaders, setFileHeaders] = useState<string[]>([]);
  const [filePreview, setFilePreview] = useState<any[]>([]);

  const handleFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Animation 3D d'Excel
  const renderExcelAnimation = () => {
    return (
      <div className="flex items-center justify-center py-4">
        <div className="relative w-24 h-24">
          <div className="absolute inset-0 bg-green-500/20 rounded-lg animate-pulse"></div>
          <FileSpreadsheet className="w-24 h-24 text-green-500 animate-float relative z-10" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs font-bold text-white bg-green-600 px-1 rounded">
            XLSX
          </div>
        </div>
      </div>
    );
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setShowResults(false);
      setImportResults({ success: 0, errors: 0, details: [], totalRows: 0, currentRow: 0 });
      
      // Lire le fichier Excel
      const data = await file.arrayBuffer();
      const workbook = read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = utils.sheet_to_json<any>(worksheet, { header: 1 });
      
      // Récupérer les en-têtes (première ligne)
      if (jsonData.length === 0 || !Array.isArray(jsonData[0])) {
        toast.error("Le fichier Excel ne contient aucune donnée valide");
        setIsUploading(false);
        return;
      }

      const headers = jsonData[0] as string[];
      setFileHeaders(headers);
      
      // Convertir les données en format objet à partir de la ligne 2
      const rowsData = utils.sheet_to_json<any>(worksheet);
      setFilePreview(rowsData.slice(0, 3)); // Aperçu des 3 premières lignes
      
      console.log("En-têtes du fichier Excel:", headers);
      console.log("Aperçu des données:", rowsData.slice(0, 3));
      
      setIsUploading(false);
      setIsProcessing(true);
      
      // Vérifier si le fichier contient des données
      if (rowsData.length === 0) {
        toast.error("Le fichier Excel ne contient aucune donnée après la ligne d'en-tête");
        setIsProcessing(false);
        return;
      }
      
      let successCount = 0;
      let errorCount = 0;
      let detailsMessages: string[] = [];
      
      // Identifier les colonnes importantes
      const usernameColumn = findColumn(headers, ["Nom d'utilisateur du/de la créateur(trice)", "username", "nom d'utilisateur", "utilisateur", "creator", "créateur"]);
      const diamondsColumn = findColumn(headers, ["Diamants", "diamonds", "total_diamonds", "diamant", "nombre de diamants"]);
      const hoursColumn = findColumn(headers, ["Durée de LIVE", "Durée de LIVE (en heures)", "hours", "heures", "temps de live"]);
      const daysColumn = findColumn(headers, ["Jours de passage en LIVE", "Jours", "days", "jours"]);
      
      if (!usernameColumn) {
        toast.error("Aucune colonne pour le nom d'utilisateur du créateur n'a été trouvée");
        setIsProcessing(false);
        return;
      }
      
      setImportResults(prev => ({ ...prev, totalRows: rowsData.length }));
      
      // Traiter chaque ligne du fichier
      for (let i = 0; i < rowsData.length; i++) {
        const row = rowsData[i];
        setImportResults(prev => ({ ...prev, currentRow: i + 1 }));
        
        // Récupérer les valeurs en fonction des en-têtes identifiés
        const creatorUsername = row[usernameColumn];
        const diamondValue = diamondsColumn ? Number(row[diamondsColumn]) || 0 : undefined;
        const hoursValue = hoursColumn ? extractNumericValue(row[hoursColumn]) : undefined;
        const daysValue = daysColumn ? Number(row[daysColumn]) || 0 : undefined;
        
        if (!creatorUsername) {
          detailsMessages.push(`Ligne ${i + 2}: Nom d'utilisateur manquant`);
          errorCount++;
          continue;
        }
        
        try {
          // Rechercher le créateur par nom d'utilisateur
          const { data: user, error: userError } = await supabase
            .from("user_accounts")
            .select("id, username")
            .eq("username", creatorUsername)
            .eq("role", "creator")
            .single();
            
          if (userError) {
            console.error(`Utilisateur non trouvé: ${creatorUsername}`, userError);
            detailsMessages.push(`Erreur: Créateur "${creatorUsername}" non trouvé dans la base de données`);
            errorCount++;
            continue;
          }
          
          // Mise à jour des horaires si présent
          if (hoursValue !== undefined || daysValue !== undefined) {
            // Vérifier si les horaires existent pour ce créateur
            const { data: existingSchedule, error: scheduleError } = await supabase
              .from("live_schedules")
              .select("id")
              .eq("creator_id", user.id)
              .maybeSingle();
              
            if (scheduleError && scheduleError.code !== "PGRST116") {
              console.error(`Erreur lors de la vérification du planning: ${creatorUsername}`, scheduleError);
              detailsMessages.push(`Erreur: Impossible de vérifier le planning pour "${creatorUsername}"`);
              errorCount++;
              continue;
            }
            
            const scheduleData: any = {
              creator_id: user.id,
              is_active: true
            };
            
            if (hoursValue !== undefined) scheduleData.hours = hoursValue;
            if (daysValue !== undefined) scheduleData.days = daysValue;
            
            if (existingSchedule) {
              // Mettre à jour les horaires existants
              const { error: updateError } = await supabase
                .from("live_schedules")
                .update(scheduleData)
                .eq("id", existingSchedule.id);
                
              if (updateError) {
                console.error(`Erreur lors de la mise à jour du planning: ${creatorUsername}`, updateError);
                detailsMessages.push(`Erreur: Impossible de mettre à jour le planning pour "${creatorUsername}"`);
                errorCount++;
                continue;
              }
              
              let updateMessage = `Planning mis à jour pour "${creatorUsername}"`;
              if (hoursValue !== undefined) updateMessage += `, heures: ${hoursValue}h`;
              if (daysValue !== undefined) updateMessage += `, jours: ${daysValue}j`;
              detailsMessages.push(updateMessage);
            } else {
              // Créer un nouveau planning
              const { error: insertError } = await supabase
                .from("live_schedules")
                .insert(scheduleData);
                
              if (insertError) {
                console.error(`Erreur lors de la création du planning: ${creatorUsername}`, insertError);
                detailsMessages.push(`Erreur: Impossible de créer le planning pour "${creatorUsername}"`);
                errorCount++;
                continue;
              }
              
              let creationMessage = `Nouveau planning créé pour "${creatorUsername}"`;
              if (hoursValue !== undefined) creationMessage += `, heures: ${hoursValue}h`;
              if (daysValue !== undefined) creationMessage += `, jours: ${daysValue}j`;
              detailsMessages.push(creationMessage);
            }
          }
          
          // Mise à jour des diamants si présent
          if (diamondValue !== undefined) {
            // Vérifier si le profil existe pour ce créateur
            const { data: existingProfile, error: profileError } = await supabase
              .from("profiles")
              .select("id, total_diamonds")
              .eq("id", user.id)
              .maybeSingle();
              
            if (profileError && profileError.code !== "PGRST116") {
              console.error(`Erreur lors de la vérification du profil: ${creatorUsername}`, profileError);
              detailsMessages.push(`Erreur: Impossible de vérifier le profil pour "${creatorUsername}"`);
              errorCount++;
              continue;
            }
            
            if (existingProfile) {
              // Mettre à jour le profil existant
              const { error: updateError } = await supabase
                .from("profiles")
                .update({
                  total_diamonds: diamondValue,
                  updated_at: new Date()
                })
                .eq("id", user.id);
                
              if (updateError) {
                console.error(`Erreur lors de la mise à jour des diamants: ${creatorUsername}`, updateError);
                detailsMessages.push(`Erreur: Impossible de mettre à jour les diamants pour "${creatorUsername}"`);
                errorCount++;
                continue;
              }
              
              detailsMessages.push(`Diamants mis à jour pour "${creatorUsername}": ${diamondValue} 💎`);
            } else {
              // Créer un nouveau profil
              const { error: insertError } = await supabase
                .from("profiles")
                .insert({
                  id: user.id,
                  username: user.username,
                  total_diamonds: diamondValue,
                  created_at: new Date(),
                  updated_at: new Date()
                });
                
              if (insertError) {
                console.error(`Erreur lors de la création du profil: ${creatorUsername}`, insertError);
                detailsMessages.push(`Erreur: Impossible de créer le profil pour "${creatorUsername}"`);
                errorCount++;
                continue;
              }
              
              detailsMessages.push(`Nouveau profil créé pour "${creatorUsername}" avec ${diamondValue} 💎`);
            }
          }
          
          successCount++;
        } catch (error) {
          console.error(`Erreur lors du traitement pour ${creatorUsername}:`, error);
          detailsMessages.push(`Erreur générale pour "${creatorUsername}": ${error instanceof Error ? error.message : String(error)}`);
          errorCount++;
        }
      }
      
      // Afficher les résultats
      setImportResults({
        success: successCount,
        errors: errorCount,
        details: detailsMessages,
        totalRows: rowsData.length,
        currentRow: rowsData.length
      });
      setShowResults(true);
      
      if (successCount > 0) {
        toast.success(`${successCount} créateurs mis à jour avec succès`);
      }
      
      if (errorCount > 0) {
        toast.error(`Erreur sur ${errorCount} entrées`);
      }
      
    } catch (error) {
      console.error("Erreur lors du traitement du fichier:", error);
      toast.error("Une erreur est survenue lors du traitement du fichier Excel");
      setImportResults({
        success: 0,
        errors: 1,
        details: [`Erreur globale: ${error instanceof Error ? error.message : String(error)}`],
        totalRows: 0,
        currentRow: 0
      });
      setShowResults(true);
    } finally {
      setIsUploading(false);
      setIsProcessing(false);
      // Réinitialiser l'input de fichier
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // Fonction pour extraire une valeur numérique d'une durée (format: "10h 20min" -> 10.33)
  const extractNumericValue = (value: string): number => {
    if (!value) return 0;
    
    // Si c'est déjà un nombre
    if (!isNaN(Number(value))) return Number(value);
    
    // Si c'est une chaîne de caractères représentant un temps
    const hoursMatch = value.match(/(\d+)\s*h/i);
    const minsMatch = value.match(/(\d+)\s*min/i);
    
    let hours = 0;
    if (hoursMatch && hoursMatch[1]) {
      hours = parseInt(hoursMatch[1], 10);
    }
    
    let minutes = 0;
    if (minsMatch && minsMatch[1]) {
      minutes = parseInt(minsMatch[1], 10);
    }
    
    return hours + (minutes / 60);
  };

  // Fonction pour trouver une colonne basée sur des mots clés potentiels
  const findColumn = (headers: string[], keywords: string[]): string | undefined => {
    // Normaliser les en-têtes (minuscules, sans accents)
    const normalizedHeaders = headers.map(header => header?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""));
    
    // Normaliser les mots clés
    const normalizedKeywords = keywords.map(keyword => keyword.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""));
    
    // Chercher une correspondance exacte d'abord
    for (const keyword of normalizedKeywords) {
      const index = normalizedHeaders.findIndex(header => header === keyword);
      if (index !== -1) return headers[index];
    }
    
    // Ensuite chercher une correspondance partielle
    for (const keyword of normalizedKeywords) {
      const index = normalizedHeaders.findIndex(header => header?.includes(keyword));
      if (index !== -1) return headers[index];
    }
    
    return undefined;
  };

  return (
    <div className="space-y-6">
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept=".xlsx,.xls"
        onChange={handleFileChange}
      />
      
      {renderExcelAnimation()}
      
      <div className="flex justify-center">
        <Button
          onClick={handleFileUpload}
          disabled={isUploading || isProcessing}
          variant="outline"
          className="flex items-center gap-2 py-6 px-8 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-green-200 dark:border-green-800/30 text-green-700 dark:text-green-400 hover:border-green-300 hover:bg-green-100 dark:hover:bg-green-900/20 transition-all shadow-sm"
        >
          {isUploading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Chargement du fichier...
            </>
          ) : isProcessing ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Traitement des données... ({importResults.currentRow}/{importResults.totalRows})
            </>
          ) : (
            <>
              <FileSpreadsheet className="h-5 w-5" />
              Importer données depuis Excel
            </>
          )}
        </Button>
      </div>
      
      {isProcessing && importResults.totalRows > 0 && (
        <div className="mt-4">
          <Progress value={(importResults.currentRow / importResults.totalRows) * 100} className="h-2 bg-slate-200 dark:bg-slate-700" />
          <p className="text-center text-sm mt-2 text-slate-500 dark:text-slate-400">
            {importResults.currentRow} / {importResults.totalRows} lignes traitées
          </p>
        </div>
      )}
      
      {fileHeaders.length > 0 && filePreview.length > 0 && !showResults && (
        <Card className="p-4 border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-50 dark:bg-slate-900/50 shadow-sm overflow-x-auto">
          <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5 text-green-600 dark:text-green-500" />
            Aperçu des données Excel
          </h3>
          
          <div className="text-sm text-slate-600 dark:text-slate-300 mb-3">
            <p>Colonnes détectées:</p>
            <div className="flex flex-wrap gap-2 mt-1">
              {fileHeaders.map((header, index) => (
                <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-800/30">
                  {header}
                </span>
              ))}
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr>
                  {fileHeaders.slice(0, 5).map((header, index) => (
                    <th key={index} className="border border-slate-200 dark:border-slate-700 px-2 py-1 bg-slate-100 dark:bg-slate-800 text-left">
                      {header}
                    </th>
                  ))}
                  {fileHeaders.length > 5 && (
                    <th className="border border-slate-200 dark:border-slate-700 px-2 py-1 bg-slate-100 dark:bg-slate-800 text-left">
                      ...et {fileHeaders.length - 5} autres colonnes
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {filePreview.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {fileHeaders.slice(0, 5).map((header, colIndex) => (
                      <td key={colIndex} className="border border-slate-200 dark:border-slate-700 px-2 py-1 truncate max-w-[150px]">
                        {row[header] !== undefined ? String(row[header]) : '-'}
                      </td>
                    ))}
                    {fileHeaders.length > 5 && (
                      <td className="border border-slate-200 dark:border-slate-700 px-2 py-1 truncate italic text-slate-400">
                        ...
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <p className="mt-3 text-xs text-slate-500 dark:text-slate-400 italic">
            Affichage de {filePreview.length} lignes sur {importResults.totalRows} au total
          </p>
        </Card>
      )}
      
      {showResults && (
        <div className="mt-4 border rounded-md p-4 bg-white dark:bg-gray-800 shadow-sm">
          <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
            {importResults.success > 0 && importResults.errors === 0 ? (
              <Check className="h-5 w-5 text-green-500" />
            ) : importResults.errors > 0 && importResults.success === 0 ? (
              <AlertCircle className="h-5 w-5 text-red-500" />
            ) : (
              <AlertCircle className="h-5 w-5 text-amber-500" />
            )}
            Résultats de l'importation
          </h3>
          
          <div className="flex gap-4 mb-4">
            <div className="bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 px-3 py-1 rounded-full">
              Succès: {importResults.success}
            </div>
            {importResults.errors > 0 && (
              <div className="bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300 px-3 py-1 rounded-full">
                Erreurs: {importResults.errors}
              </div>
            )}
          </div>
          
          <div className="max-h-60 overflow-y-auto border rounded-md p-2 bg-white dark:bg-gray-900">
            {importResults.details.map((detail, index) => (
              <div 
                key={index} 
                className={`py-1 px-2 text-sm ${
                  detail.startsWith("Erreur") 
                    ? "text-red-600 dark:text-red-400" 
                    : "text-green-600 dark:text-green-400"
                }`}
              >
                {detail}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
