
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, RotateCcw, Diamond } from "lucide-react";
interface ResetActionsCardProps {
  onResetSchedules: () => Promise<void>;
  onResetDiamonds: () => Promise<void>;
  onReset?: () => Promise<void>; // Added for compatibility
  role?: string; // Added for compatibility
}
export const ResetActionsCard: React.FC<ResetActionsCardProps> = ({
  onResetSchedules,
  onResetDiamonds,
  onReset,
  role
}) => {
  // Use the appropriate reset handler based on what's provided
  const handleResetSchedules = onReset || onResetSchedules;
  const handleResetDiamonds = onReset || onResetDiamonds;
  
  const isFounder = role === 'founder';
  
  return <Card className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
      <CardContent className="p-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-amber-500 mb-2">
            <AlertCircle className="h-5 w-5" />
            <p className="text-sm font-semibold">Actions de réinitialisation</p>
          </div>
          
          <div className="space-y-2">
            {isFounder && (
              <>
                <Button 
                  onClick={handleResetSchedules}
                  variant="outline" 
                  size="sm"
                  className="w-full flex items-center justify-start gap-2"
                >
                  <RotateCcw className="h-4 w-4" />
                  Réinitialiser tous les horaires
                </Button>
                
                <Button 
                  onClick={handleResetDiamonds}
                  variant="outline" 
                  size="sm"
                  className="w-full flex items-center justify-start gap-2"
                >
                  <Diamond className="h-4 w-4" />
                  Réinitialiser tous les diamants
                </Button>
              </>
            )}
            
            {!isFounder && (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Les actions de réinitialisation sont disponibles uniquement pour les fondateurs.
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>;
};
