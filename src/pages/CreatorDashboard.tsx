
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { UltraSidebar } from "@/components/layout/UltraSidebar";
import { Footer } from "@/components/layout/Footer";
import useCreatorData from "@/components/creator/dashboard/useCreatorData";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DiamondIcon, Calendar, Clock3, AlertTriangle, Trophy, TrendingUp, Zap } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { DiamondsSection } from "@/components/creator/dashboard/DiamondsSection";
import { CreatorSchedule } from "@/components/creator/dashboard/CreatorSchedule";
import { WelcomeSection } from "@/components/creator/dashboard/WelcomeSection";
import { UpdatesInfo } from "@/components/creator/dashboard/UpdatesInfo";
import { NextMatchSection } from "@/components/creator/dashboard/NextMatchSection";

const CreatorDashboard = () => {
  const {
    creatorData,
    isLoading,
    totalDiamonds,
    username,
    weeklyHours,
    targetHours,
    targetDays,
    formatMatchDate
  } = useCreatorData();
  
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [showAnimation, setShowAnimation] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    const storedRole = localStorage.getItem("userRole");
    
    setUserId(storedUserId);
    setRole(storedRole);
    
    // Rediriger si l'utilisateur n'est pas créateur
    if (storedRole !== "creator") {
      navigate("/");
    }
    
    // Animation d'entrée
    const timer = setTimeout(() => {
      setShowAnimation(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [navigate]);

  if (isLoading || !creatorData) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-slate-900">
        <div className="animate-spin h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  const hoursProgress = Math.min(100, Math.round((weeklyHours / targetHours) * 100));
  const daysProgress = Math.min(100, Math.round((creatorData.schedule?.days || 0) / targetDays * 100));
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950 flex">
      <UltraSidebar
        username={username || ""}
        role={role || ""}
        userId={userId || ""}
        onLogout={() => {
          localStorage.clear();
          navigate("/");
        }}
        currentPage="dashboard"
      />
      
      <div className="flex-1 p-4 overflow-y-auto">
        <div 
          className={`max-w-6xl mx-auto space-y-6 transition-all duration-500 ${
            showAnimation ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <WelcomeSection 
            username={username} 
            totalDiamonds={totalDiamonds} 
            isLoading={isLoading} 
            onShowGuide={() => setShowGuide(!showGuide)} 
            showGuide={showGuide} 
          />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="col-span-1 md:col-span-2 bg-slate-800/40 border-slate-700/50 backdrop-blur-sm">
              <CardHeader className="border-b border-slate-700/50">
                <CardTitle className="text-xl flex items-center text-white">
                  <TrendingUp className="mr-2 h-5 w-5 text-indigo-400" />
                  Statistiques de LIVE
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Clock3 className="h-5 w-5 mr-2 text-blue-400" />
                        <span className="text-white">Heures de LIVE</span>
                      </div>
                      <Badge variant="outline" className="bg-blue-500/10 text-blue-300 border-blue-500/30">
                        {creatorData.schedule?.hours || 0}h / {targetHours}h
                      </Badge>
                    </div>
                    <Progress value={hoursProgress} className="h-2 bg-slate-700" />
                    
                    {hoursProgress < 75 && (
                      <Alert variant="warning" className="mt-2 py-2">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription className="text-xs">
                          Vous n'avez pas encore atteint votre quota d'heures de live
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Calendar className="h-5 w-5 mr-2 text-emerald-400" />
                        <span className="text-white">Jours streamés</span>
                      </div>
                      <Badge variant="outline" className="bg-emerald-500/10 text-emerald-300 border-emerald-500/30">
                        {creatorData.schedule?.days || 0}j / {targetDays}j
                      </Badge>
                    </div>
                    <Progress value={daysProgress} className="h-2 bg-slate-700" />
                    
                    {daysProgress < 75 && (
                      <Alert variant="warning" className="mt-2 py-2">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription className="text-xs">
                          Augmentez votre nombre de jours de live pour débloquer plus de récompenses
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                </div>
                
                <DiamondsSection totalDiamonds={totalDiamonds} isLoading={isLoading} />
              </CardContent>
            </Card>
            
            <div className="col-span-1 space-y-6">
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
                        Créateur Level {Math.floor(totalDiamonds / 5000) + 1}
                      </Badge>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-xs text-slate-400 mb-1">
                        <span>Progression</span>
                        <span>{Math.min(100, Math.round((totalDiamonds % 5000) / 50))}%</span>
                      </div>
                      <Progress value={Math.min(100, (totalDiamonds % 5000) / 50)} className="h-2 bg-slate-700" />
                    </div>
                    
                    <div className="text-center">
                      <div className="text-xs text-slate-400 mb-1">Prochain niveau</div>
                      <div className="text-sm text-white flex items-center justify-center gap-1">
                        <Zap className="h-4 w-4 text-yellow-400" />
                        <span>{Math.floor(totalDiamonds / 5000) * 5000 + 5000}</span>
                        <DiamondIcon className="h-3 w-3 text-purple-400" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <NextMatchSection 
                nextMatch={creatorData.nextMatch} 
                formatMatchDate={formatMatchDate} 
                username={username} 
              />
              
              <UpdatesInfo />
            </div>
          </div>
          
          <Tabs defaultValue="schedule" className="w-full">
            <TabsList className="bg-slate-800/40 border border-slate-700/50 w-full mb-4">
              <TabsTrigger value="schedule" className="flex-1">
                <Calendar className="h-4 w-4 mr-2" /> Planning
              </TabsTrigger>
              <TabsTrigger value="rewards" className="flex-1">
                <Trophy className="h-4 w-4 mr-2" /> Récompenses
              </TabsTrigger>
            </TabsList>
            <TabsContent value="schedule">
              <CreatorSchedule 
                isLoading={isLoading}
                hours={creatorData.schedule?.hours || 0}
                days={creatorData.schedule?.days || 0}
                weeklyHours={weeklyHours}
                targetHours={targetHours}
                targetDays={targetDays}
              />
            </TabsContent>
            <TabsContent value="rewards">
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
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          <Footer role={role} version="2.0" className="pt-6" />
        </div>
      </div>
    </div>
  );
};

export default CreatorDashboard;
