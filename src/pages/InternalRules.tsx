
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { UltraSidebar } from "@/components/layout/UltraSidebar";
import { useIndexAuth } from "@/hooks/use-index-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Shield, BookOpen, ClipboardList } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

interface Rule {
  id: string;
  title: string;
  description: string;
  rule_type: string;
}

const InternalRules = () => {
  const navigate = useNavigate();
  const { isAuthenticated, username, role, userId, handleLogout } = useIndexAuth();
  const [activeTab, setActiveTab] = useState("general");

  const { data: rules, isLoading } = useQuery({
    queryKey: ["internal-rules"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("creator_rules")
        .select("*")
        .order("rule_type", { ascending: true });

      if (error) throw error;
      return data as Rule[];
    },
  });

  if (!isAuthenticated) {
    window.location.href = '/';
    return null;
  }

  // Only founder, manager, agent can view internal rules
  if (role !== "founder" && role !== "manager" && role !== "agent" && role !== "ambassadeur") {
    window.location.href = '/';
    return null;
  }

  const generalRules = rules?.filter(r => r.rule_type === "general") || [];
  const disciplinaryRules = rules?.filter(r => r.rule_type === "disciplinary") || [];
  const comportementRules = rules?.filter(r => r.rule_type === "comportement") || [];

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex bg-gradient-to-br from-slate-900 to-slate-950 text-white">
        <UltraSidebar
          username={username}
          role={role || ''}
          userId={userId || ''}
          onLogout={handleLogout}
          currentPage="internal-rules"
        />
        
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate("/")}
                  className="h-10 w-10 bg-white/5 hover:bg-white/10 text-white"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <h1 className="text-2xl font-bold text-white flex items-center">
                  <Shield className="h-6 w-6 mr-2 text-purple-400" />
                  Règlement Interne
                </h1>
              </div>
            </div>

            <Card className="bg-slate-800/90 backdrop-blur-sm border-purple-500/20 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-purple-900/30 to-indigo-900/30 pb-2">
                <CardTitle className="text-xl text-white flex items-center">
                  <BookOpen className="h-5 w-5 mr-2 text-purple-400" />
                  Règlement d'Ultra Agency
                </CardTitle>
              </CardHeader>
              
              <CardContent className="p-0">
                <Tabs defaultValue="general" value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="w-full justify-start bg-slate-800/50 border-b border-slate-700/50 rounded-none p-0">
                    <TabsTrigger 
                      value="general" 
                      className="data-[state=active]:bg-slate-700 rounded-none border-r border-slate-700/30 py-3 flex-1"
                    >
                      Règles Générales
                    </TabsTrigger>
                    <TabsTrigger 
                      value="disciplinary" 
                      className="data-[state=active]:bg-slate-700 rounded-none border-r border-slate-700/30 py-3 flex-1"
                    >
                      Règles Disciplinaires
                    </TabsTrigger>
                    <TabsTrigger 
                      value="comportement" 
                      className="data-[state=active]:bg-slate-700 rounded-none py-3 flex-1"
                    >
                      Comportement
                    </TabsTrigger>
                  </TabsList>
                  
                  <div className="p-6">
                    <TabsContent value="general" className="mt-0">
                      {isLoading ? (
                        <div className="flex justify-center py-8">
                          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
                        </div>
                      ) : generalRules.length > 0 ? (
                        <div className="space-y-6">
                          {generalRules.map((rule) => (
                            <div key={rule.id} className="border-b border-slate-700/30 pb-4 last:border-none">
                              <h3 className="text-lg font-semibold mb-2 text-white">{rule.title}</h3>
                              <p className="text-slate-300 whitespace-pre-line">{rule.description}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-slate-400">
                          <ClipboardList className="h-12 w-12 mx-auto mb-4 text-slate-500" />
                          <p>Aucune règle générale n'a été définie.</p>
                        </div>
                      )}
                    </TabsContent>
                    
                    <TabsContent value="disciplinary" className="mt-0">
                      {isLoading ? (
                        <div className="flex justify-center py-8">
                          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
                        </div>
                      ) : disciplinaryRules.length > 0 ? (
                        <div className="space-y-6">
                          {disciplinaryRules.map((rule) => (
                            <div key={rule.id} className="border-b border-slate-700/30 pb-4 last:border-none">
                              <h3 className="text-lg font-semibold mb-2 text-white">{rule.title}</h3>
                              <p className="text-slate-300 whitespace-pre-line">{rule.description}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-slate-400">
                          <ClipboardList className="h-12 w-12 mx-auto mb-4 text-slate-500" />
                          <p>Aucune règle disciplinaire n'a été définie.</p>
                        </div>
                      )}
                    </TabsContent>
                    
                    <TabsContent value="comportement" className="mt-0">
                      {isLoading ? (
                        <div className="flex justify-center py-8">
                          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
                        </div>
                      ) : comportementRules.length > 0 ? (
                        <div className="space-y-6">
                          {comportementRules.map((rule) => (
                            <div key={rule.id} className="border-b border-slate-700/30 pb-4 last:border-none">
                              <h3 className="text-lg font-semibold mb-2 text-white">{rule.title}</h3>
                              <p className="text-slate-300 whitespace-pre-line">{rule.description}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-slate-400">
                          <ClipboardList className="h-12 w-12 mx-auto mb-4 text-slate-500" />
                          <p>Aucune règle de comportement n'a été définie.</p>
                        </div>
                      )}
                    </TabsContent>
                  </div>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default InternalRules;
