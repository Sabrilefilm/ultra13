
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Trophy, DiamondIcon } from "lucide-react";

interface RewardsTabProps {
  totalDiamonds: number;
}

export const RewardsTab = ({ totalDiamonds }: RewardsTabProps) => {
  return (
    <Card className="bg-slate-800/40 border-slate-700/50 backdrop-blur-sm">
      <CardHeader className="border-b border-slate-700/50">
        <CardTitle className="text-xl flex items-center text-white">
          <Trophy className="mr-2 h-5 w-5 text-yellow-400" />
          Mes Récompenses
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-gradient-to-br from-amber-900/10 to-amber-700/10 border-amber-700/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-amber-600/20 rounded-full">
                  <DiamondIcon className="h-8 w-8 text-amber-400" />
                </div>
                <div>
                  <div className="text-xl font-bold text-white">Bronze</div>
                  <div className="text-sm text-amber-300">5,000 - 10,000 diamants</div>
                </div>
              </div>
              <Progress value={Math.min(100, (totalDiamonds / 10000) * 100)} className="h-2 bg-slate-700" />
              <div className="mt-4 text-sm text-slate-300">
                {totalDiamonds >= 5000 
                  ? "Niveau débloqué ! 🎉" 
                  : `${5000 - totalDiamonds} diamants restants pour débloquer`}
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-slate-600/10 to-slate-400/10 border-slate-500/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-slate-500/20 rounded-full">
                  <DiamondIcon className="h-8 w-8 text-slate-300" />
                </div>
                <div>
                  <div className="text-xl font-bold text-white">Argent</div>
                  <div className="text-sm text-slate-300">10,000 - 25,000 diamants</div>
                </div>
              </div>
              <Progress value={Math.min(100, (totalDiamonds / 25000) * 100)} className="h-2 bg-slate-700" />
              <div className="mt-4 text-sm text-slate-300">
                {totalDiamonds >= 10000 
                  ? "Niveau débloqué ! 🎉" 
                  : `${10000 - totalDiamonds} diamants restants pour débloquer`}
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-yellow-600/10 to-yellow-400/10 border-yellow-500/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-yellow-500/20 rounded-full">
                  <DiamondIcon className="h-8 w-8 text-yellow-300" />
                </div>
                <div>
                  <div className="text-xl font-bold text-white">Or</div>
                  <div className="text-sm text-yellow-300">25,000 - 50,000 diamants</div>
                </div>
              </div>
              <Progress value={Math.min(100, (totalDiamonds / 50000) * 100)} className="h-2 bg-slate-700" />
              <div className="mt-4 text-sm text-slate-300">
                {totalDiamonds >= 25000 
                  ? "Niveau débloqué ! 🎉" 
                  : `${25000 - totalDiamonds} diamants restants pour débloquer`}
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-blue-600/10 to-blue-400/10 border-blue-500/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-blue-500/20 rounded-full">
                  <DiamondIcon className="h-8 w-8 text-blue-300" />
                </div>
                <div>
                  <div className="text-xl font-bold text-white">Diamant</div>
                  <div className="text-sm text-blue-300">50,000+ diamants</div>
                </div>
              </div>
              <Progress value={Math.min(100, (totalDiamonds / 100000) * 100)} className="h-2 bg-slate-700" />
              <div className="mt-4 text-sm text-slate-300">
                {totalDiamonds >= 50000 
                  ? "Niveau débloqué ! 🎉" 
                  : `${50000 - totalDiamonds} diamants restants pour débloquer`}
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};

export default RewardsTab;
