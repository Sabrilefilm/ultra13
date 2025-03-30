
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RotateCcw, RefreshCcw, Diamond, Clock } from "lucide-react";
import { toast } from "sonner";

interface ResetActionsCardProps {
  onResetSchedules: () => Promise<void>;
  onResetDiamonds: () => Promise<void>;
}

export const ResetActionsCard: React.FC<ResetActionsCardProps> = ({
  onResetSchedules,
  onResetDiamonds
}) => {
  const handleResetSchedules = async () => {
    if (!confirm("Êtes-vous sûr de vouloir réinitialiser tous les horaires à zéro?")) {
      return;
    }
    
    try {
      await onResetSchedules();
      toast.success("Tous les horaires ont été réinitialisés à zéro");
    } catch (error) {
      console.error("Error resetting schedules:", error);
      toast.error("Une erreur est survenue lors de la réinitialisation des horaires");
    }
  };

  const handleResetDiamonds = async () => {
    if (!confirm("ATTENTION! Êtes-vous sûr de vouloir réinitialiser tous les diamants à zéro? Cette action est irréversible!")) {
      return;
    }
    
    if (!confirm("DERNIÈRE CONFIRMATION: Cette action va SUPPRIMER tous les diamants et NE PEUT PAS être annulée!")) {
      return;
    }
    
    try {
      await onResetDiamonds();
      toast.success("Tous les diamants ont été réinitialisés à zéro");
    } catch (error) {
      console.error("Error resetting diamonds:", error);
      toast.error("Une erreur est survenue lors de la réinitialisation des diamants");
    }
  };

  return (
    <Card className="border-red-100 bg-red-50">
      <CardHeader>
        <CardTitle className="text-red-700 flex items-center gap-2">
          <RotateCcw className="h-5 w-5" />
          Actions de réinitialisation
        </CardTitle>
        <CardDescription className="text-red-600">
          Attention: Ces actions sont irréversibles
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col md:flex-row gap-4">
        <Button 
          variant="outline" 
          className="border-amber-500 text-amber-700 hover:bg-amber-100"
          onClick={handleResetSchedules}
        >
          <Clock className="mr-2 h-4 w-4" />
          Réinitialiser tous les horaires
        </Button>
        
        <Button 
          variant="outline" 
          className="border-red-500 text-red-700 hover:bg-red-100"
          onClick={handleResetDiamonds}
        >
          <Diamond className="mr-2 h-4 w-4" />
          Réinitialiser tous les diamants
        </Button>
      </CardContent>
    </Card>
  );
};
