
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileSpreadsheet, Upload, Loader2 } from "lucide-react";
import { read, utils } from "xlsx";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export const ScheduleExcelImport = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
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
      
      // Read the Excel file
      const data = await file.arrayBuffer();
      const workbook = read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = utils.sheet_to_json<any>(worksheet);
      
      setIsUploading(false);
      setIsProcessing(true);
      
      console.log("Excel data:", jsonData);
      
      // Process each row
      if (jsonData.length === 0) {
        toast.error("Le fichier Excel ne contient aucune donnée");
        setIsProcessing(false);
        return;
      }
      
      let successCount = 0;
      let errorCount = 0;
      
      for (const row of jsonData) {
        // Skip rows without username or hours/days
        if (!row.username || (row.hours === undefined && row.days === undefined)) {
          errorCount++;
          continue;
        }
        
        try {
          // Find the creator by username
          const { data: user, error: userError } = await supabase
            .from("user_accounts")
            .select("id")
            .eq("username", row.username)
            .eq("role", "creator")
            .single();
            
          if (userError) {
            console.error(`Utilisateur non trouvé: ${row.username}`, userError);
            errorCount++;
            continue;
          }
          
          // Check if schedule exists for this creator
          const { data: existingSchedule, error: scheduleError } = await supabase
            .from("live_schedules")
            .select("id")
            .eq("creator_id", user.id)
            .maybeSingle();
            
          if (scheduleError && scheduleError.code !== "PGRST116") {
            console.error(`Erreur lors de la vérification du planning: ${row.username}`, scheduleError);
            errorCount++;
            continue;
          }
          
          // Prepare schedule data
          const scheduleData = {
            hours: typeof row.hours === 'number' ? row.hours : 0,
            days: typeof row.days === 'number' ? row.days : 0,
            is_active: true
          };
          
          if (existingSchedule) {
            // Update existing schedule
            const { error: updateError } = await supabase
              .from("live_schedules")
              .update(scheduleData)
              .eq("id", existingSchedule.id);
              
            if (updateError) {
              console.error(`Erreur lors de la mise à jour du planning: ${row.username}`, updateError);
              errorCount++;
              continue;
            }
          } else {
            // Create new schedule
            const { error: insertError } = await supabase
              .from("live_schedules")
              .insert({
                ...scheduleData,
                creator_id: user.id
              });
              
            if (insertError) {
              console.error(`Erreur lors de la création du planning: ${row.username}`, insertError);
              errorCount++;
              continue;
            }
          }
          
          successCount++;
        } catch (error) {
          console.error(`Erreur de traitement pour ${row.username}:`, error);
          errorCount++;
        }
      }
      
      // Show results
      if (successCount > 0) {
        toast.success(`${successCount} plannings mis à jour avec succès`);
      }
      
      if (errorCount > 0) {
        toast.error(`Erreur sur ${errorCount} entrées`);
      }
      
    } catch (error) {
      console.error("Erreur lors du traitement du fichier:", error);
      toast.error("Une erreur est survenue lors du traitement du fichier Excel");
    } finally {
      setIsUploading(false);
      setIsProcessing(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <>
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
            Traitement des horaires...
          </>
        ) : (
          <>
            <FileSpreadsheet className="h-4 w-4" />
            Importer horaires depuis Excel
          </>
        )}
      </Button>
    </>
  );
};
