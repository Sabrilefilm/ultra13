
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Diamond } from "lucide-react";
import { RewardsPanel } from "@/components/RewardsPanel";
import { Footer } from "@/components/layout/Footer";
import { useIndexAuth } from "@/hooks/use-index-auth";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BackButton } from "@/components/ui/back-button";

const RewardsManagement = () => {
  const navigate = useNavigate();
  const { role, username, userId } = useIndexAuth();

  // Create username watermark with multiple small instances
  const usernameWatermark = (
    <div className="fixed inset-0 pointer-events-none select-none z-0 overflow-hidden">
      {Array.from({ length: 500 }).map((_, index) => (
        <div 
          key={index} 
          className="absolute text-[8px] font-bold text-slate-200/10" 
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            transform: `rotate(${Math.random() * 360}deg)`
          }}
        >
          {username ? username.toUpperCase() : 'USER'}
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-950 p-4">
      {/* Username watermark */}
      {usernameWatermark}
      
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <BackButton />
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Diamond className="h-6 w-6 text-purple-400" />
            Programme de Récompenses
          </h1>
        </div>

        <Tabs defaultValue="rewards" className="w-full">
          <TabsList className="w-full mb-6 bg-slate-800/70 border border-purple-900/20">
            <TabsTrigger value="rewards" className="flex-1">
              Gestion des Récompenses
            </TabsTrigger>
            <TabsTrigger value="stats" className="flex-1">
              Statistiques
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="rewards">
            <RewardsPanel role={role || 'founder'} userId={userId || 'founder'} />
          </TabsContent>
          
          <TabsContent value="stats">
            <Card className="bg-slate-800 border-purple-900/30">
              <CardHeader>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Diamond className="h-5 w-5 text-purple-400" />
                  Statistiques des Récompenses
                </h2>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-purple-900/20 border border-purple-700/30 rounded-lg p-4">
                    <div className="text-sm text-purple-300 mb-1">Total des diamants distribués</div>
                    <div className="text-2xl font-bold text-white">12,450 💎</div>
                  </div>
                  <div className="bg-blue-900/20 border border-blue-700/30 rounded-lg p-4">
                    <div className="text-sm text-blue-300 mb-1">Valeur totale distribuée</div>
                    <div className="text-2xl font-bold text-white">€6,225</div>
                  </div>
                  <div className="bg-green-900/20 border border-green-700/30 rounded-lg p-4">
                    <div className="text-sm text-green-300 mb-1">Récompenses ce mois</div>
                    <div className="text-2xl font-bold text-white">1,280 💎</div>
                  </div>
                </div>
                
                <div className="bg-slate-700/50 border border-slate-600/30 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-white mb-3">Top Créateurs</h3>
                  <div className="space-y-2">
                    {[1, 2, 3, 4, 5].map((idx) => (
                      <div key={idx} className="flex justify-between items-center p-2 bg-slate-800/50 border border-slate-700/50 rounded-md">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold">
                            {idx}
                          </div>
                          <div>
                            <div className="font-medium text-white">Créateur {idx}</div>
                            <div className="text-xs text-slate-400">@creator{idx}</div>
                          </div>
                        </div>
                        <div className="text-purple-300 font-bold">{1000 - idx * 150} 💎</div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <Footer role={role} version="1.5" />
      </div>
    </div>
  );
};

export default RewardsManagement;
