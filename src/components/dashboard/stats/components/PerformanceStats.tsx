
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Award, Clock, Calendar, Diamond, TrendingUp } from "lucide-react";

interface PerformanceStatsProps {
  performanceMetrics: {
    hoursCompletion: number;
    daysCompletion: number;
    diamondsRating: string;
    overallScore: number;
  };
  totalDiamonds: number;
  requiredHours: number;
  requiredDays: number;
  currentHours: number;
  currentDays: number;
}

export const PerformanceStats = ({ 
  performanceMetrics, 
  totalDiamonds, 
  requiredHours, 
  requiredDays,
  currentHours,
  currentDays 
}: PerformanceStatsProps) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    if (score >= 40) return "text-orange-500";
    return "text-red-500";
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return "bg-green-500";
    if (percentage >= 60) return "bg-yellow-500";
    if (percentage >= 40) return "bg-orange-500";
    return "bg-red-500";
  };

  return (
    <Card className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm border border-purple-900/20 rounded-xl shadow-md hover:shadow-lg transition-all">
      <CardHeader className="bg-gradient-to-r from-purple-900/20 to-indigo-900/20 rounded-t-xl border-b border-purple-900/10">
        <CardTitle className="text-xl text-white/90 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-purple-400" />
          Tableau de Performance
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Award className="h-6 w-6 text-indigo-400" />
              <div>
                <p className="text-gray-400 text-sm">Score global</p>
                <p className={`text-2xl font-bold ${getScoreColor(performanceMetrics.overallScore)}`}>
                  {performanceMetrics.overallScore}%
                </p>
              </div>
            </div>
            <div className="w-32 h-32 rounded-full border-8 border-slate-700 flex items-center justify-center relative">
              <div 
                className="absolute inset-0 rounded-full overflow-hidden" 
                style={{ 
                  clipPath: `polygon(50% 50%, 50% 0%, ${performanceMetrics.overallScore <= 25 ? '50% 0%' : 
                    performanceMetrics.overallScore <= 50 ? '100% 0%' : 
                    performanceMetrics.overallScore <= 75 ? '100% 100%' : 
                    '0% 100%'
                  }`
                }}
              >
                <div className={`absolute inset-0 ${getProgressColor(performanceMetrics.overallScore)} opacity-30`}></div>
              </div>
              <div className="text-3xl font-bold text-white">{performanceMetrics.overallScore}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-400" />
                  <div>
                    <p className="text-gray-400 text-sm">Heures</p>
                    <p className="text-white font-medium">
                      {currentHours} / {requiredHours}h
                    </p>
                  </div>
                </div>
                <span className={`text-xl font-bold ${getScoreColor(performanceMetrics.hoursCompletion)}`}>
                  {performanceMetrics.hoursCompletion}%
                </span>
              </div>
              <Progress 
                value={performanceMetrics.hoursCompletion} 
                className="h-2"
                indicatorClassName={getProgressColor(performanceMetrics.hoursCompletion)}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-green-400" />
                  <div>
                    <p className="text-gray-400 text-sm">Jours</p>
                    <p className="text-white font-medium">
                      {currentDays} / {requiredDays}j
                    </p>
                  </div>
                </div>
                <span className={`text-xl font-bold ${getScoreColor(performanceMetrics.daysCompletion)}`}>
                  {performanceMetrics.daysCompletion}%
                </span>
              </div>
              <Progress 
                value={performanceMetrics.daysCompletion} 
                className="h-2"
                indicatorClassName={getProgressColor(performanceMetrics.daysCompletion)}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Diamond className="h-5 w-5 text-purple-400" />
                  <div>
                    <p className="text-gray-400 text-sm">Diamants</p>
                    <p className="text-white font-medium">
                      {totalDiamonds.toLocaleString()}
                    </p>
                  </div>
                </div>
                <span className={`text-xl font-bold ${
                  performanceMetrics.diamondsRating === "Excellent" ? "text-green-500" :
                  performanceMetrics.diamondsRating === "Très Bon" ? "text-blue-500" :
                  performanceMetrics.diamondsRating === "Bon" ? "text-yellow-500" :
                  performanceMetrics.diamondsRating === "Moyen" ? "text-orange-500" :
                  "text-red-500"
                }`}>
                  {performanceMetrics.diamondsRating}
                </span>
              </div>
              <div className="flex gap-1 mt-1">
                <div className={`h-2 rounded-l-full flex-1 ${totalDiamonds >= 200 ? 'bg-red-500' : 'bg-slate-700'}`}></div>
                <div className={`h-2 flex-1 ${totalDiamonds >= 500 ? 'bg-orange-500' : 'bg-slate-700'}`}></div>
                <div className={`h-2 flex-1 ${totalDiamonds >= 1000 ? 'bg-yellow-500' : 'bg-slate-700'}`}></div>
                <div className={`h-2 flex-1 ${totalDiamonds >= 2000 ? 'bg-blue-500' : 'bg-slate-700'}`}></div>
                <div className={`h-2 rounded-r-full flex-1 ${totalDiamonds >= 5000 ? 'bg-green-500' : 'bg-slate-700'}`}></div>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-700/50 pt-4 mt-2">
            <p className="text-gray-400 text-sm">
              <strong className="text-white">Analyse :</strong> {
                performanceMetrics.overallScore >= 80 
                  ? "Performance excellente, vous êtes sur la bonne voie pour maximiser vos récompenses!" 
                : performanceMetrics.overallScore >= 60 
                  ? "Bonne performance, continuez à améliorer vos heures et jours de live." 
                : performanceMetrics.overallScore >= 40 
                  ? "Performance moyenne, essayez d'augmenter vos heures de live et votre régularité." 
                : "Performance insuffisante, contactez votre agent pour discuter d'un plan d'amélioration."
              }
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
