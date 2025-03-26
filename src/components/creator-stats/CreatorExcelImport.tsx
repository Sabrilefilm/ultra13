
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileSpreadsheet, Upload, Loader2, Check, AlertCircle, Search, AlertTriangle, RefreshCw } from "lucide-react";
import { read, utils } from "xlsx";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export const CreatorExcelImport = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [importResults, setImportResults] = useState<{
    success: number;
    errors: number;
    details: string[];
    totalRows: number;
    currentRow: number;
    notFoundCreators: string[];
    ignoredCreators: string[];
    updatedProfiles: {
      username: string;
      diamonds?: number;
      hours?: number;
      days?: number;
    }[];
  }>({ 
    success: 0, 
    errors: 0, 
    details: [], 
    totalRows: 0, 
    currentRow: 0,
    notFoundCreators: [],
    ignoredCreators: [],
    updatedProfiles: []
  });
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
      setImportResults({ 
        success: 0, 
        errors: 0, 
        details: [], 
        totalRows: 0, 
        currentRow: 0,
        notFoundCreators: [],
        ignoredCreators: [],
        updatedProfiles: []
      });
      
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
      let notFoundCreators: string[] = [];
      let ignoredCreators: string[] = [];
      let updatedProfiles: {
        username: string;
        diamonds?: number;
        hours?: number;
        days?: number;
      }[] = [];
      
      // Identifier les colonnes importantes en utilisant une détection plus flexible
      const usernameColumn = findColumn(headers, ["Nom d'utilisateur du/de la créateur(trice)", "username", "nom d'utilisateur", "utilisateur", "creator", "créateur", "nom", "name"]);
      const diamondsColumn = findColumn(headers, ["Diamants", "diamonds", "total_diamonds", "diamant", "nombre de diamants", "💎"]);
      const hoursColumn = findColumn(headers, ["Durée de LIVE", "Durée de LIVE (en heures)", "hours", "heures", "temps de live", "⏱️"]);
      const daysColumn = findColumn(headers, ["Jours de passage en LIVE", "Jours", "days", "jours", "Jours de passage en LIVE valides", "📅"]);
      
      if (!usernameColumn) {
        toast.error("Aucune colonne pour le nom d'utilisateur du créateur n'a été trouvée");
        setIsProcessing(false);
        return;
      }
      
      setImportResults(prev => ({ ...prev, totalRows: rowsData.length }));

      // Chargement préalable de tous les créateurs pour optimiser la recherche
      const { data: allCreators, error: creatorsError } = await supabase
        .from("user_accounts")
        .select("id, username, role")
        .eq("role", "creator");
        
      if (creatorsError) {
        console.error("Erreur lors de la récupération des créateurs:", creatorsError);
        toast.error("Impossible de récupérer la liste des créateurs");
        setIsProcessing(false);
        return;
      }
      
      const creatorMap = new Map();
      allCreators?.forEach(creator => {
        // Enregistrer à la fois le nom exact et la version en minuscule pour faciliter la recherche
        creatorMap.set(creator.username.toLowerCase(), creator);
      });
      
      console.log(`Nombre de créateurs trouvés dans la base de données: ${creatorMap.size}`);
      
      // Traiter chaque ligne du fichier
      for (let i = 0; i < rowsData.length; i++) {
        const row = rowsData[i];
        setImportResults(prev => ({ ...prev, currentRow: i + 1 }));
        
        // Récupérer les valeurs en fonction des en-têtes identifiés
        const creatorUsername = row[usernameColumn];
        const diamondValue = diamondsColumn && row[diamondsColumn] !== undefined ? Number(row[diamondsColumn]) || 0 : undefined;
        const hoursValue = hoursColumn && row[hoursColumn] !== undefined ? extractNumericValue(row[hoursColumn]) : undefined;
        const daysValue = daysColumn && row[daysColumn] !== undefined ? Number(row[daysColumn]) || 0 : undefined;
        
        if (!creatorUsername) {
          detailsMessages.push(`Ligne ${i + 2}: Nom d'utilisateur manquant`);
          errorCount++;
          continue;
        }
        
        try {
          // Recherche insensible à la casse
          const normalizedUsername = creatorUsername.toLowerCase().trim();
          const creatorData = creatorMap.get(normalizedUsername);
          
          // Essayer également avec des variantes du nom (sans espace, sans caractères spéciaux)
          let alternativeCreatorData = null;
          if (!creatorData) {
            // Essayer de trouver une correspondance approximative
            for (const [storedUsername, data] of creatorMap.entries()) {
              // Normaliser en supprimant les espaces et les caractères spéciaux
              const normalizedStored = storedUsername.toLowerCase()
                .replace(/[\s_.,-]/g, "")
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "");
              
              const normalizedInput = normalizedUsername
                .replace(/[\s_.,-]/g, "")
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "");
              
              if (normalizedStored === normalizedInput) {
                alternativeCreatorData = data;
                detailsMessages.push(`Correspondance approximative trouvée pour "${creatorUsername}" → "${data.username}"`);
                break;
              }
            }
          }
          
          const finalCreatorData = creatorData || alternativeCreatorData;
          
          if (!finalCreatorData) {
            console.error(`Utilisateur non trouvé: ${creatorUsername}`);
            detailsMessages.push(`Erreur: Créateur "${creatorUsername}" non trouvé dans la base de données`);
            if (!notFoundCreators.includes(creatorUsername)) {
              notFoundCreators.push(creatorUsername);
            }
            ignoredCreators.push(creatorUsername);
            errorCount++;
            continue;
          }
          
          // Mise à jour des horaires si présent
          if (hoursValue !== undefined || daysValue !== undefined) {
            // Vérifier si les horaires existent pour ce créateur
            const { data: existingSchedule, error: scheduleError } = await supabase
              .from("live_schedules")
              .select("id")
              .eq("creator_id", finalCreatorData.id)
              .maybeSingle();
              
            if (scheduleError && scheduleError.code !== "PGRST116") {
              console.error(`Erreur lors de la vérification du planning: ${creatorUsername}`, scheduleError);
              detailsMessages.push(`Erreur: Impossible de vérifier le planning pour "${creatorUsername}"`);
              errorCount++;
              continue;
            }
            
            const scheduleData: any = {
              creator_id: finalCreatorData.id,
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
            
            // Ajouter aux profils mis à jour
            updatedProfiles.push({
              username: creatorUsername,
              hours: hoursValue,
              days: daysValue
            });
          }
          
          // Mise à jour des diamants si présent
          if (diamondValue !== undefined) {
            try {
              // Utiliser la fonction RPC pour mettre à jour les diamants (contourne les problèmes de RLS)
              const { error: diamondsError } = await supabase.rpc(
                'create_or_update_profile',
                { 
                  user_id: finalCreatorData.id,
                  user_username: finalCreatorData.username,
                  diamonds_value: diamondValue
                }
              );
                
              if (diamondsError) {
                console.error(`Erreur lors de la mise à jour des diamants via RPC: ${creatorUsername}`, diamondsError);
                
                // Essayer avec une méthode alternative si l'RPC échoue
                try {
                  const { data: profileData, error: profileCheckError } = await supabase
                    .from('profiles')
                    .select('id')
                    .eq('id', finalCreatorData.id)
                    .maybeSingle();
                    
                  if (profileCheckError) {
                    throw profileCheckError;
                  }
                  
                  if (profileData) {
                    // Mettre à jour le profil existant
                    const { error: updateError } = await supabase
                      .from('profiles')
                      .update({ 
                        total_diamonds: diamondValue,
                        updated_at: new Date()
                      })
                      .eq('id', finalCreatorData.id);
                      
                    if (updateError) {
                      throw updateError;
                    }
                  } else {
                    // Créer un nouveau profil
                    const { error: insertError } = await supabase
                      .from('profiles')
                      .insert({
                        id: finalCreatorData.id,
                        username: finalCreatorData.username,
                        role: finalCreatorData.role || 'creator',
                        total_diamonds: diamondValue,
                        created_at: new Date(),
                        updated_at: new Date()
                      });
                      
                    if (insertError) {
                      throw insertError;
                    }
                  }
                } catch (alternativeError) {
                  console.error(`Erreur lors de la tentative alternative de mise à jour des diamants: ${creatorUsername}`, alternativeError);
                  detailsMessages.push(`Erreur: Impossible de mettre à jour les diamants pour "${creatorUsername}"`);
                  errorCount++;
                  continue;
                }
              }
              
              detailsMessages.push(`Diamants mis à jour pour "${creatorUsername}": ${diamondValue} 💎`);
              
              // Ajouter aux profils mis à jour
              const existingProfileIndex = updatedProfiles.findIndex(p => p.username === creatorUsername);
              if (existingProfileIndex >= 0) {
                updatedProfiles[existingProfileIndex].diamonds = diamondValue;
              } else {
                updatedProfiles.push({
                  username: creatorUsername,
                  diamonds: diamondValue
                });
              }
            } catch (error) {
              console.error(`Erreur lors de la mise à jour des diamants: ${creatorUsername}`, error);
              detailsMessages.push(`Erreur: Impossible de mettre à jour les diamants pour "${creatorUsername}"`);
              errorCount++;
              continue;
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
        currentRow: rowsData.length,
        notFoundCreators,
        ignoredCreators,
        updatedProfiles
      });
      setShowResults(true);
      
      if (successCount > 0) {
        toast.success(`${successCount} créateurs mis à jour avec succès`);
      }
      
      if (errorCount > 0) {
        toast.error(`Erreur sur ${errorCount} entrées`);
      }
      
      // Mettre à jour les statistiques globales
      try {
        const { error: statsError } = await supabase.rpc('update_global_stats');
        if (statsError) {
          console.error("Erreur lors de la mise à jour des statistiques globales:", statsError);
        } else {
          console.log("Statistiques globales mises à jour avec succès");
        }
      } catch (error) {
        console.error("Erreur lors de la mise à jour des statistiques:", error);
      }
      
    } catch (error) {
      console.error("Erreur lors du traitement du fichier:", error);
      toast.error("Une erreur est survenue lors du traitement du fichier Excel");
      setImportResults({
        success: 0,
        errors: 1,
        details: [`Erreur globale: ${error instanceof Error ? error.message : String(error)}`],
        totalRows: 0,
        currentRow: 0,
        notFoundCreators: [],
        ignoredCreators: [],
        updatedProfiles: []
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
  const extractNumericValue = (value: string | number): number => {
    if (value === undefined || value === null) return 0;
    
    // Si c'est déjà un nombre
    if (typeof value === 'number') return value;
    
    // Si c'est une chaîne vide
    if (!value) return 0;
    
    // Si c'est une chaîne de caractères représentant un nombre
    if (!isNaN(Number(value))) return Number(value);
    
    // Si c'est une chaîne de caractères représentant un temps
    const hoursMatch = String(value).match(/(\d+)\s*h/i);
    const minsMatch = String(value).match(/(\d+)\s*min/i);
    
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
    if (!headers || !Array.isArray(headers)) return undefined;
    
    // Normaliser les en-têtes (minuscules, sans accents)
    const normalizedHeaders = headers.map(header => 
      header ? header.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") : ''
    );
    
    // Normaliser les mots clés
    const normalizedKeywords = keywords.map(keyword => 
      keyword.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    );
    
    // Chercher une correspondance exacte d'abord
    for (const keyword of normalizedKeywords) {
      const index = normalizedHeaders.findIndex(header => header === keyword);
      if (index !== -1) return headers[index];
    }
    
    // Ensuite chercher une correspondance partielle
    for (const keyword of normalizedKeywords) {
      const index = normalizedHeaders.findIndex(header => header && header.includes(keyword));
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
            {importResults.ignoredCreators.length > 0 && (
              <div className="bg-amber-100 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300 px-3 py-1 rounded-full">
                Ignorés: {importResults.ignoredCreators.length}
              </div>
            )}
          </div>
          
          {importResults.updatedProfiles.length > 0 && (
            <Alert variant="success" className="mb-4">
              <RefreshCw className="h-4 w-4" />
              <AlertTitle>Profils mis à jour avec succès</AlertTitle>
              <AlertDescription>
                <div className="mt-2 text-sm max-h-40 overflow-y-auto bg-green-50/50 dark:bg-green-900/10 rounded-md p-2">
                  {importResults.updatedProfiles.map((profile, index) => (
                    <div key={index} className="flex flex-wrap gap-2 mb-1 items-center">
                      <span className="font-medium">{profile.username}</span>
                      {profile.diamonds !== undefined && (
                        <span className="bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-300 px-2 py-0.5 text-xs rounded-full">
                          💎 {profile.diamonds}
                        </span>
                      )}
                      {profile.hours !== undefined && (
                        <span className="bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 px-2 py-0.5 text-xs rounded-full">
                          ⏱️ {profile.hours}h
                        </span>
                      )}
                      {profile.days !== undefined && (
                        <span className="bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 px-2 py-0.5 text-xs rounded-full">
                          📅 {profile.days}j
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </AlertDescription>
            </Alert>
          )}
          
          {importResults.notFoundCreators.length > 0 && (
            <Alert variant="warning" className="mb-4">
              <Search className="h-4 w-4" />
              <AlertTitle>Créateurs non trouvés et ignorés</AlertTitle>
              <AlertDescription>
                <p className="mb-2">
                  Les créateurs suivants n'existent pas dans la base de données et ont été ignorés:
                </p>
                <ul className="list-disc pl-5 space-y-1 max-h-40 overflow-y-auto">
                  {importResults.notFoundCreators.map((creator, index) => (
                    <li key={index}>{creator}</li>
                  ))}
                </ul>
                <p className="mt-2 text-sm">
                  Ces entrées ont été ignorées car les créateurs ne sont probablement plus affiliés à l'agence.
                </p>
              </AlertDescription>
            </Alert>
          )}
          
          <div className="max-h-60 overflow-y-auto border rounded-md p-2 bg-white dark:bg-gray-900">
            {importResults.details.map((detail, index) => (
              <div 
                key={index} 
                className={`py-1 px-2 text-sm ${
                  detail.startsWith("Erreur") 
                    ? "text-red-600 dark:text-red-400" 
                    : detail.includes("Correspondance approximative") 
                    ? "text-amber-600 dark:text-amber-400"
                    : "text-green-600 dark:text-green-400"
                }`}
              >
                {detail}
              </div>
            ))}
          </div>
          
          <Button 
            variant="outline" 
            className="mt-4 bg-slate-100 dark:bg-slate-800"
            onClick={() => {
              setShowResults(false);
              setImportResults({ 
                success: 0, 
                errors: 0, 
                details: [], 
                totalRows: 0, 
                currentRow: 0,
                notFoundCreators: [],
                ignoredCreators: [],
                updatedProfiles: []
              });
            }}
          >
            Fermer
          </Button>
        </div>
      )}
    </div>
  );
};
