
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Loader2, FileSpreadsheet } from "lucide-react";
import { read, utils } from "xlsx";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export const ExcelImportButton = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const fileData = await file.arrayBuffer();
      const workbook = read(fileData);
      
      // Assuming first sheet contains creator data
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = utils.sheet_to_json<any>(worksheet);
      
      setIsUploading(false);
      setIsProcessing(true);
      
      // Log data for debugging
      console.log("Excel data loaded:", jsonData);
      
      if (jsonData.length === 0) {
        toast.error("Le fichier Excel ne contient aucune donnée");
        setIsProcessing(false);
        return;
      }
      
      let successCount = 0;
      let errorCount = 0;
      
      // Process each row in the Excel file
      for (const row of jsonData) {
        if (!row.username) {
          errorCount++;
          continue;
        }
        
        try {
          // Check if user exists
          const { data: existingUser, error: userCheckError } = await supabase
            .from("user_accounts")
            .select("id")
            .eq("username", row.username)
            .single();
            
          if (userCheckError && userCheckError.code !== "PGRST116") {
            console.error("Error checking user:", userCheckError);
            errorCount++;
            continue;
          }
          
          if (existingUser) {
            // Update existing user
            const { error: updateError } = await supabase
              .from("user_accounts")
              .update({
                role: row.role || "creator",
                password: row.password || existingUser.password,
                agent_id: row.agent_id || null
              })
              .eq("id", existingUser.id);
              
            if (updateError) {
              console.error("Error updating user:", updateError);
              errorCount++;
              continue;
            }
            
            successCount++;
          } else if (row.username && row.password) {
            // Create new user
            const { error: createError } = await supabase
              .from("user_accounts")
              .insert({
                username: row.username,
                password: row.password,
                role: row.role || "creator",
                agent_id: row.agent_id || null
              });
              
            if (createError) {
              console.error("Error creating user:", createError);
              errorCount++;
              continue;
            }
            
            successCount++;
          } else {
            errorCount++;
          }
        } catch (error) {
          console.error("Error processing row:", error);
          errorCount++;
        }
      }
      
      // Show results
      if (successCount > 0) {
        toast.success(`${successCount} utilisateurs mis à jour avec succès`);
      }
      
      if (errorCount > 0) {
        toast.error(`Erreur sur ${errorCount} entrées`);
      }
      
    } catch (error) {
      console.error("Error processing Excel file:", error);
      toast.error("Erreur lors du traitement du fichier Excel");
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
        onChange={handleFileChange}
        accept=".xlsx,.xls"
        className="hidden"
      />
      <Button
        onClick={handleClick}
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
            Importer depuis Excel
          </>
        )}
      </Button>
    </>
  );
};
