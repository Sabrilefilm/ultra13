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
  return <Card className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
      
    </Card>;
};