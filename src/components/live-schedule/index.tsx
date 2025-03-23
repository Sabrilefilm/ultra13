
import React, { useState, useEffect } from "react";
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
import { Download, AlertTriangle } from "lucide-react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { toast } from "sonner";

export const LiveScheduleModal = ({
  isOpen,
  onClose,
  creatorId: initialCreatorId,
}: LiveScheduleModalProps) => {
  const [selectedCreator, setSelectedCreator] = useState(initialCreatorId);
  const userRole = localStorage.getItem('userRole');
  const isFounder = userRole === 'founder';
  
  const { 
    schedules, 
    loading, 
    updateSchedule, 
    handleSave,
    creatorName,
    allCreatorSchedules
  } = useLiveSchedule(isOpen, selectedCreator);

  useEffect(() => {
    if (isOpen && !isFounder) {
      toast.warning("Seul le fondateur peut modifier les horaires de live", {
        duration: 5000,
      });
    }
  }, [isOpen, isFounder]);

  const onSave = async () => {
    if (!isFounder) {
      toast.error("Vous n'avez pas les droits pour modifier les horaires");
      return;
    }
    
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

        {!isFounder && (
          <div className="mb-4 bg-amber-100 dark:bg-amber-900/20 border border-amber-300 dark:border-amber-800/30 rounded-lg p-4 flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            <p className="text-amber-800 dark:text-amber-300 text-sm">
              Seul le fondateur peut modifier les horaires de live. Vous êtes en mode lecture seule.
            </p>
          </div>
        )}

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
                  onUpdate={isFounder ? updateSchedule : () => {}}
                  creatorName={creatorName}
                  disabled={!isFounder}
                />
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={onClose}>
            {isFounder ? 'Annuler' : 'Fermer'}
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
          {isFounder && (
            <Button onClick={onSave} disabled={loading}>
              Enregistrer
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
