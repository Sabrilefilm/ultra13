
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LiveScheduleModalProps } from "./types";
import { useLiveSchedule } from "./use-live-schedule";
import { ScheduleDay } from "./schedule-day";
import { CreatorSelect } from "./creator-select";
import { Download } from "lucide-react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export const LiveScheduleModal = ({
  isOpen,
  onClose,
  creatorId: initialCreatorId,
}: LiveScheduleModalProps) => {
  const [selectedCreator, setSelectedCreator] = useState(initialCreatorId);
  
  const { 
    schedules, 
    loading, 
    updateSchedule, 
    handleSave,
    creatorName,
    allCreatorSchedules
  } = useLiveSchedule(isOpen, selectedCreator);

  const onSave = async () => {
    const success = await handleSave();
    if (success) {
      onClose();
    }
  };
  
  const downloadSchedules = () => {
    try {
      // Create workbook
      const wb = XLSX.utils.book_new();
      
      // Format schedule data for export
      const scheduleData = allCreatorSchedules.map(schedule => ({
        'Créateur': schedule.creator_name || 'Non spécifié',
        'Heures par jour': schedule.hours,
        'Jours par semaine': schedule.days,
        'Total Heures Hebdo': schedule.hours * schedule.days,
        'Statut': schedule.is_active ? 'Actif' : 'Inactif'
      }));
      
      // Create worksheet
      const ws = XLSX.utils.json_to_sheet(scheduleData);
      
      // Set column widths
      const wscols = [
        { wch: 25 }, // Créateur
        { wch: 15 }, // Heures
        { wch: 15 }, // Jours
        { wch: 15 }, // Total
        { wch: 10 }, // Statut
      ];
      ws['!cols'] = wscols;
      
      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(wb, ws, "Horaires");
      
      // Generate Excel file
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      
      // Save file
      saveAs(blob, `Horaires_Créateurs_${new Date().toISOString().split('T')[0]}.xlsx`);
    } catch (error) {
      console.error("Erreur lors de l'export des horaires", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Configuration des Horaires de Live</DialogTitle>
          <DialogDescription>
            Configurez vos horaires de live
          </DialogDescription>
        </DialogHeader>

        <div className="mb-4">
          <CreatorSelect 
            value={selectedCreator} 
            onSelect={setSelectedCreator} 
          />
        </div>

        <div className="space-y-6 py-4">
          {loading ? (
            <div className="flex items-center justify-center p-4">
              <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" />
            </div>
          ) : (
            <div className="space-y-4">
              {schedules.map((schedule) => (
                <ScheduleDay
                  key={schedule.id}
                  schedule={schedule}
                  onUpdate={updateSchedule}
                  creatorName={creatorName}
                />
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          {allCreatorSchedules?.length > 0 && (
            <Button 
              variant="outline" 
              className="border-purple-200 dark:border-purple-800 flex items-center gap-2"
              onClick={downloadSchedules}
            >
              <Download className="h-4 w-4" />
              <span>Télécharger la liste</span>
            </Button>
          )}
          <Button onClick={onSave} disabled={loading}>
            Enregistrer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
