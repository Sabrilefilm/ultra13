
import React from 'react';
import { Progress } from '@/components/ui/progress';

interface DiamondProgressProps {
  total: number;
  goal: number;
}

export function DiamondProgress({ total, goal }: DiamondProgressProps) {
  const progressPercentage = goal > 0 
    ? Math.min(Math.round((total / goal) * 100), 100) 
    : 0;

  return (
    <div className="space-y-1">
      <Progress value={progressPercentage} className="h-2" />
      <p className="text-xs text-right text-gray-500 dark:text-gray-400">
        {total.toLocaleString()} / {goal.toLocaleString()} diamants
      </p>
    </div>
  );
}
