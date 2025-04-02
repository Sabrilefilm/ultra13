
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { UltraSidebar } from "@/components/layout/UltraSidebar";
import { useIndexAuth } from "@/hooks/use-index-auth";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent 
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/lib/supabase";
import { ArrowLeft, Clock, Calendar, Diamond, Mail, Phone, MessageCircle, User, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { MobileMenu } from "@/components/mobile/MobileMenu";
import { MobileNavigation } from "@/components/mobile/MobileNavigation";

interface Creator {
  id: string;
  username: string;
  role: string;
  email: string | null;
  agent_id: string | null;
  live_schedules?: { hours?: number; days?: number }[];
  profiles?: { total_diamonds?: number }[];
  creator_contacts?: {
    phone?: string;
    whatsapp?: string;
    email?: string;
    discord?: string;
    other?: string;
  }[];
}

const CreatorDetails = () => {
  const { creatorId } = useParams<{ creatorId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated, username, role, userId, handleLogout } = useIndexAuth();
  const isMobile = useIsMobile();
  
  const [creator, setCreator] = useState<Creator | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
      return;
    }

    if (!['founder', 'manager', 'agent'].includes(role)) {
      toast({
        title: "Accès refusé",
        description: "Vous n'avez pas les permissions nécessaires pour accéder à cette page.",
        variant: "destructive",
      });
      navigate('/dashboard');
      return;
    }
    
    fetchCreatorDetails();
  }, [isAuthenticated, role, navigate, creatorId]);
  
  const fetchCreatorDetails = async () => {
    if (!creatorId) return;
    
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from("user_accounts")
        .select(`
          id,
          username,
          role,
          email,
          agent_id,
          live_schedules (
            hours,
            days
          ),
          profiles (
            total_diamonds
          ),
          creator_contacts (
            phone,
            whatsapp,
            email,
            discord,
            other
          )
        `)
        .eq("id", creatorId)
        .single();
        
      if (error) throw error;
      
      if (data) {
        setCreator(data as Creator);
      }
    } catch (error) {
      console.error("Error fetching creator details:", error);
      toast({
        title: "Erreur",
        description: "Impossible de récupérer les détails du créateur",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleEditCreator = () => {
    // Naviguer vers la page d'édition du créateur
    navigate(`/edit-creator/${creatorId}`);
  };
  
  // Calcul des objectifs
  const requiredHours = 20;
  const requiredDays = 10;
  
  const hourProgress = creator?.live_schedules?.[0]?.hours ? 
    Math.min(100, (creator.live_schedules[0].hours / requiredHours) * 100) : 0;
    
  const dayProgress = creator?.live_schedules?.[0]?.days ? 
    Math.min(100, (creator.live_schedules[0].days / requiredDays) * 100) : 0;
  
  const getProgressColor = (progress: number) => {
    if (progress < 40) return "text-red-500";
    if (progress < 70) return "text-yellow-500";
    return "text-green-500";
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-slate-900 to-slate-950">
        <div className="animate-spin h-12 w-12 border-4 border-indigo-500 border-t-transparent rounded-full" />
      </div>
    );
  }
  
  if (!creator) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-slate-900 to-slate-950">
        <Card className="max-w-md bg-slate-800/90 border-purple-900/30">
          <CardContent className="p-6 text-center">
            <p className="text-white">Créateur non trouvé</p>
            <Button 
              className="mt-4 bg-purple-600 hover:bg-purple-700"
              onClick={() => navigate("/agency-assignment")}
            >
              Retour
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-950 text-white">
        {isMobile && (
          <MobileMenu 
            username={username}
            role={role}
            currentPage="/creator-details"
            onLogout={handleLogout}
          />
        )}
        
        <div className="flex">
          <UltraSidebar
            username={username}
            role={role}
            userId={userId}
            onLogout={handleLogout}
            currentPage="agency-assignment"
          />
          
          <div className="flex-1 p-4 md:p-6 w-full max-w-full mx-auto">
            <div className="max-w-6xl mx-auto space-y-6">
              <div className="flex items-center gap-4 mb-6">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate("/agency-assignment")}
                  className="h-10 w-10 bg-white/5 hover:bg-white/10 text-white"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                  <User className="h-6 w-6 text-indigo-400" />
                  Détails du créateur
                </h1>
                
                <div className="ml-auto">
                  <Button
                    onClick={handleEditCreator}
                    className="bg-indigo-600 hover:bg-indigo-700"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Modifier
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profil du créateur */}
                <Card className="bg-gradient-to-br from-slate-900 to-slate-950 border-indigo-800/30 shadow-lg overflow-hidden lg:col-span-1">
                  <CardHeader className="bg-gradient-to-r from-indigo-950/50 to-slate-950/70 pb-4 border-b border-indigo-900/20">
                    <CardTitle className="text-xl font-bold text-white">
                      Profil
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center">
                      <div className="h-24 w-24 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold mb-4">
                        {creator.username.charAt(0).toUpperCase()}
                      </div>
                      <h2 className="text-2xl font-bold text-white mb-1">{creator.username}</h2>
                      <p className="text-indigo-400 mb-4">Créateur</p>
                      
                      <div className="w-full mt-6 space-y-4">
                        {creator.creator_contacts && creator.creator_contacts[0]?.email && (
                          <div className="flex items-center bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
                            <Mail className="h-5 w-5 text-indigo-400 mr-3" />
                            <div>
                              <p className="text-sm text-slate-400">Email</p>
                              <p className="text-white">{creator.creator_contacts[0].email}</p>
                            </div>
                          </div>
                        )}
                        
                        {creator.creator_contacts && creator.creator_contacts[0]?.phone && (
                          <div className="flex items-center bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
                            <Phone className="h-5 w-5 text-indigo-400 mr-3" />
                            <div>
                              <p className="text-sm text-slate-400">Téléphone</p>
                              <p className="text-white">{creator.creator_contacts[0].phone}</p>
                            </div>
                          </div>
                        )}
                        
                        {creator.creator_contacts && creator.creator_contacts[0]?.whatsapp && (
                          <div className="flex items-center bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
                            <MessageCircle className="h-5 w-5 text-indigo-400 mr-3" />
                            <div>
                              <p className="text-sm text-slate-400">WhatsApp</p>
                              <p className="text-white">{creator.creator_contacts[0].whatsapp}</p>
                            </div>
                          </div>
                        )}
                        
                        {creator.creator_contacts && creator.creator_contacts[0]?.discord && (
                          <div className="flex items-center bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
                            <MessageCircle className="h-5 w-5 text-indigo-400 mr-3" />
                            <div>
                              <p className="text-sm text-slate-400">Discord</p>
                              <p className="text-white">{creator.creator_contacts[0].discord}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Statistiques du créateur */}
                <Card className="bg-gradient-to-br from-slate-900 to-slate-950 border-indigo-800/30 shadow-lg overflow-hidden lg:col-span-2">
                  <CardHeader className="bg-gradient-to-r from-indigo-950/50 to-slate-950/70 pb-4 border-b border-indigo-900/20">
                    <CardTitle className="text-xl font-bold text-white">
                      Statistiques
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                      <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-blue-900/20 p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-medium text-white">Heures</h3>
                          <Clock className="h-5 w-5 text-blue-400" />
                        </div>
                        <p className="text-3xl font-bold text-white mb-2">
                          {creator.live_schedules?.[0]?.hours || 0}
                          <span className="text-sm text-slate-400 ml-1">/ {requiredHours}</span>
                        </p>
                        <Progress value={hourProgress} className="h-2 bg-slate-700" />
                        <p className={`text-right mt-1 text-sm ${getProgressColor(hourProgress)}`}>
                          {hourProgress.toFixed(0)}%
                        </p>
                      </Card>
                      
                      <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-green-900/20 p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-medium text-white">Jours</h3>
                          <Calendar className="h-5 w-5 text-green-400" />
                        </div>
                        <p className="text-3xl font-bold text-white mb-2">
                          {creator.live_schedules?.[0]?.days || 0}
                          <span className="text-sm text-slate-400 ml-1">/ {requiredDays}</span>
                        </p>
                        <Progress value={dayProgress} className="h-2 bg-slate-700" />
                        <p className={`text-right mt-1 text-sm ${getProgressColor(dayProgress)}`}>
                          {dayProgress.toFixed(0)}%
                        </p>
                      </Card>
                      
                      <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-pink-900/20 p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-medium text-white">Diamants</h3>
                          <Diamond className="h-5 w-5 text-pink-400" />
                        </div>
                        <p className="text-3xl font-bold text-white mb-2">
                          {creator.profiles?.[0]?.total_diamonds || 0}
                        </p>
                        <p className="text-sm text-slate-400 mt-2">
                          Valeur estimée: {((creator.profiles?.[0]?.total_diamonds || 0) * 0.01).toFixed(2)} €
                        </p>
                      </Card>
                    </div>
                    
                    <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/50">
                      <h3 className="text-lg font-medium text-white mb-3">Notes et informations supplémentaires</h3>
                      <p className="text-slate-300">
                        {creator.creator_contacts?.[0]?.other || "Aucune note disponible pour ce créateur."}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
        
        <MobileNavigation 
          role={role}
          currentPage="agency-assignment"
          onOpenMenu={() => {}}
        />
      </div>
    </SidebarProvider>
  );
};

export default CreatorDetails;
