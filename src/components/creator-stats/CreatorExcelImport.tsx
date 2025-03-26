
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileSpreadsheet, Upload, Loader2 } from "lucide-react";
import { read, utils } from "xlsx";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export const CreatorExcelImport = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [importResults, setImportResults] = useState<{
    success: number;
    errors: number;
    details: string[];
  }>({ success: 0, errors: 0, details: [] });
  const [showResults, setShowResults] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setShowResults(false);
      setImportResults({ success: 0, errors: 0, details: [] });
      
      // Lire le fichier Excel
      const data = await file.arrayBuffer();
      const workbook = read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = utils.sheet_to_json<any>(worksheet);
      
      setIsUploading(false);
      setIsProcessing(true);
      
      console.log("Données Excel:", jsonData);
      
      // Vérifier si le fichier contient des données
      if (jsonData.length === 0) {
        toast.error("Le fichier Excel ne contient aucune donnée");
        setIsProcessing(false);
        return;
      }
      
      let successCount = 0;
      let errorCount = 0;
      let detailsMessages: string[] = [];
      
      // Traiter chaque ligne du fichier
      for (const row of jsonData) {
        // Vérifier si la ligne contient le nom d'utilisateur du créateur
        if (!row["Nom d'utilisateur du/de la créateur(trice)"]) {
          detailsMessages.push(`Ligne ignorée: Nom d'utilisateur manquant`);
          errorCount++;
          continue;
        }
        
        const creatorUsername = row["Nom d'utilisateur du/de la créateur(trice)"];
        
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
          if (row.hours !== undefined || row.days !== undefined) {
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
            
            const scheduleData = {
              hours: row.hours !== undefined ? Number(row.hours) : 0,
              days: row.days !== undefined ? Number(row.days) : 0,
              creator_id: user.id,
              is_active: true
            };
            
            if (existingSchedule) {
              // Mettre à jour les horaires existants
              const { error: updateError } = await supabase
                .from("live_schedules")
                .update({
                  hours: scheduleData.hours,
                  days: scheduleData.days
                })
                .eq("id", existingSchedule.id);
                
              if (updateError) {
                console.error(`Erreur lors de la mise à jour du planning: ${creatorUsername}`, updateError);
                detailsMessages.push(`Erreur: Impossible de mettre à jour le planning pour "${creatorUsername}"`);
                errorCount++;
                continue;
              }
              
              detailsMessages.push(`Planning mis à jour pour "${creatorUsername}": ${scheduleData.hours}h / ${scheduleData.days}j`);
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
              
              detailsMessages.push(`Nouveau planning créé pour "${creatorUsername}": ${scheduleData.hours}h / ${scheduleData.days}j`);
            }
          }
          
          // Mise à jour des diamants si présent
          if (row.diamonds !== undefined || row.total_diamonds !== undefined) {
            const diamondValue = row.diamonds !== undefined ? Number(row.diamonds) : 
                                row.total_diamonds !== undefined ? Number(row.total_diamonds) : 0;
            
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
        details: detailsMessages
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
        details: [`Erreur globale: ${error instanceof Error ? error.message : String(error)}`]
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

  return (
    <div className="space-y-4">
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept=".xlsx,.xls"
        onChange={handleFileChange}
      />
      <Button
        onClick={handleFileUpload}
        disabled={isUploading || isProcessing}
        variant="outline"
        className="flex items-center gap-2"
      >
        {isUploading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Chargement du fichier...
          </>
        ) : isProcessing ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Traitement des données...
          </>
        ) : (
          <>
            <FileSpreadsheet className="h-4 w-4" />
            Importer données créateurs depuis Excel
          </>
        )}
      </Button>
      
      {showResults && (
        <div className="mt-4 border rounded-md p-4 bg-gray-50 dark:bg-gray-800">
          <h3 className="text-lg font-medium mb-2">Résultats de l'importation</h3>
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
