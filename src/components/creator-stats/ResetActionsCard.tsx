
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, RotateCcw, Diamond } from "lucide-react";

interface ResetActionsCardProps {
  onResetSchedules: () => Promise<void>;
  onResetDiamonds: () => Promise<void>;
}

export const ResetActionsCard: React.FC<ResetActionsCardProps> = ({
  onResetSchedules,
  onResetDiamonds
}) => {
  return (
    <Card className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
      <CardContent className="flex flex-col gap-2 p-3">
        <Button 
          variant="outline" 
          className="w-full justify-start text-sm"
          onClick={onResetSchedules}
        >
          <RotateCcw className="w-4 h-4 mr-2 text-purple-600 dark:text-purple-400" />
          Reset all schedules
        </Button>
        <Button 
          variant="outline" 
          className="w-full justify-start text-sm"
          onClick={onResetDiamonds}
        >
          <Diamond className="w-4 h-4 mr-2 text-purple-600 dark:text-purple-400" />
          Reset all diamonds
        </Button>
      </CardContent>
    </Card>
  );
};
