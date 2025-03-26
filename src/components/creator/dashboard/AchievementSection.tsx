
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DiamondIcon, Zap } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface AchievementSectionProps {
  totalDiamonds: number;
}

export const AchievementSection = ({ totalDiamonds }: AchievementSectionProps) => {
  const level = Math.floor(totalDiamonds / 5000) + 1;
  const progress = Math.min(100, Math.round((totalDiamonds % 5000) / 50));
  const nextLevelDiamonds = Math.floor(totalDiamonds / 5000) * 5000 + 5000;

  return (
    <Card className="bg-slate-800/40 border-slate-700/50 backdrop-blur-sm overflow-hidden">
      <div className="bg-gradient-to-r from-purple-900/20 to-indigo-900/20 p-4 border-b border-slate-700/50">
        <div className="flex items-center">
          <Trophy className="h-5 w-5 mr-2 text-yellow-400" />
          <h3 className="text-lg font-medium text-white">Votre Progression</h3>
        </div>
      </div>
      <CardContent className="p-4">
        <div className="space-y-6 mt-2">
          <div className="flex justify-between items-center">
            <div className="text-sm text-slate-300">Niveau actuel</div>
            <Badge className="bg-gradient-to-r from-indigo-600 to-purple-600">
              Créateur Level {level}
            </Badge>
          </div>
          
          <div>
            <div className="flex justify-between text-xs text-slate-400 mb-1">
              <span>Progression</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2 bg-slate-700" />
          </div>
          
          <div className="text-center">
            <div className="text-xs text-slate-400 mb-1">Prochain niveau</div>
            <div className="text-sm text-white flex items-center justify-center gap-1">
              <Zap className="h-4 w-4 text-yellow-400" />
              <span>{nextLevelDiamonds}</span>
              <DiamondIcon className="h-3 w-3 text-purple-400" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

import { Trophy } from "lucide-react";
export default AchievementSection;
