import React, { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { UltraDashboard } from "@/components/dashboard/UltraDashboard";
import { useIndexAuth } from "@/hooks/use-index-auth";
import { usePlatformSettings } from "@/hooks/use-platform-settings";
import { useAccountManagement } from "@/hooks/use-account-management";
import { useInactivityTimer } from "@/hooks/use-inactivity-timer";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, AlertCircle, Check, X, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
const Penalties = () => {
  const {
    toast
  } = useToast();
  const {
    isAuthenticated,
    username,
    role,
    userId,
    handleLogout
  } = useIndexAuth();
  const {
    platformSettings,
    handleUpdateSettings
  } = usePlatformSettings(role);
  const {
    handleCreateAccount
  } = useAccountManagement();
  const [showAddPenaltyDialog, setShowAddPenaltyDialog] = useState(false);

  // Inactivity timer for automatic logout
  const {
    showWarning,
    dismissWarning,
    formattedTime
  } = useInactivityTimer({
    timeout: 120000,
    // 2 minutes
    onTimeout: () => {
      handleLogout();
      toast({
        title: "Déconnexion automatique",
        description: "Vous avez été déconnecté en raison d'inactivité."
      });
    },
    warningTime: 30000,
    onWarning: () => {}
  });

  // Fetch penalties
  const {
    data: penalties,
    isLoading: loadingPenalties
  } = useQuery({
    queryKey: ['penalties', userId, role],
    queryFn: async () => {
      let query;
      if (role === 'founder' || role === 'manager') {
        query = supabase.from('penalties').select(`
            *,
            creator:user_id(id, username),
            agent:issued_by(id, username)
          `).order('created_at', {
          ascending: false
        });
      } else if (role === 'agent') {
        query = supabase.from('penalties').select(`
            *,
            creator:user_id(id, username),
            agent:issued_by(id, username)
          `).eq('issued_by', userId).order('created_at', {
          ascending: false
        });
      } else {
        query = supabase.from('penalties').select(`
            *,
            creator:user_id(id, username),
            agent:issued_by(id, username)
          `).eq('user_id', userId).order('created_at', {
          ascending: false
        });
      }
      const {
        data,
        error
      } = await query;
      if (error) {
        throw error;
      }
      return data || [];
    }
  });
  if (!isAuthenticated) {
    window.location.href = '/';
    return null;
  }
  const canAddPenalty = ['founder', 'manager', 'agent'].includes(role || '');
  const getPenaltyTypeLabel = type => {
    switch (type) {
      case 'absence':
        return 'Absence';
      case 'late':
        return 'Retard';
      case 'behavior':
        return 'Comportement';
      case 'content':
        return 'Contenu inapproprié';
      case 'match_absence':
        return 'Absence match';
      default:
        return type;
    }
  };
  const getPenaltyTypeColor = type => {
    switch (type) {
      case 'absence':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'late':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300';
      case 'behavior':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      case 'content':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'match_absence':
        return 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };
  const getStatusColor = resolved => {
    return resolved ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
  };
  return <SidebarProvider defaultOpen={true}>
      <UltraDashboard username={username} role={role || ''} userId={userId || ''} onLogout={handleLogout} platformSettings={platformSettings} handleCreateAccount={handleCreateAccount} handleUpdateSettings={handleUpdateSettings} showWarning={showWarning} dismissWarning={dismissWarning} formattedTime={formattedTime} currentPage="penalties" />
      
      <div className="p-6 md:ml-64 space-y-6">
        <Card className="bg-white dark:bg-slate-900 shadow-lg border-purple-100 dark:border-purple-900/30">
          <CardHeader className="flex flex-row items-center justify-between pb-2 bg-gradient-to-r from-purple-50 to-white dark:from-purple-950/30 dark:to-slate-950 bg-zinc-950">
            <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <AlertCircle className="h-6 w-6 text-purple-500" />
              Système de Pénalités
            </CardTitle>
            
            {canAddPenalty && <Button onClick={() => setShowAddPenaltyDialog(true)} className="bg-purple-600 hover:bg-purple-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Nouvelle pénalité
              </Button>}
          </CardHeader>
          
          <CardContent className="p-6 rounded-none bg-neutral-50">
            {loadingPenalties ? <div className="flex justify-center items-center py-12">
                <div className="w-8 h-8 border-4 border-t-transparent border-purple-600 rounded-full animate-spin mb-3"></div>
                <p className="text-gray-500 dark:text-gray-400 ml-3">Chargement des pénalités...</p>
              </div> : penalties && penalties.length > 0 ? <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Créateur</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Raison</TableHead>
                    <TableHead>Points</TableHead>
                    <TableHead>Attribué par</TableHead>
                    <TableHead>Statut</TableHead>
                    {(role === 'founder' || role === 'manager') && <TableHead>Actions</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {penalties.map(penalty => <TableRow key={penalty.id}>
                      <TableCell>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 text-purple-500 mr-2" />
                          {format(new Date(penalty.created_at), 'dd MMM yyyy', {
                      locale: fr
                    })}
                        </div>
                      </TableCell>
                      <TableCell>{penalty.creator?.username || 'Inconnu'}</TableCell>
                      <TableCell>
                        <Badge className={`font-normal ${getPenaltyTypeColor(penalty.type)}`}>
                          {getPenaltyTypeLabel(penalty.type)}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">{penalty.reason}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-bold text-purple-600 dark:text-purple-300">
                          {penalty.points} pts
                        </Badge>
                      </TableCell>
                      <TableCell>{penalty.agent?.username || 'Système'}</TableCell>
                      <TableCell>
                        <Badge className={`font-normal ${getStatusColor(penalty.resolved)}`}>
                          {penalty.resolved ? 'Résolu' : 'Actif'}
                        </Badge>
                      </TableCell>
                      {(role === 'founder' || role === 'manager') && <TableCell>
                          <div className="flex space-x-2">
                            {!penalty.resolved && <Button variant="outline" size="sm" className="text-green-600 border-green-600 hover:bg-green-50 dark:hover:bg-green-950">
                                <Check className="h-4 w-4 mr-1" />
                                Résoudre
                              </Button>}
                            <Button variant="outline" size="sm" className="text-gray-600 border-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900">
                              <X className="h-4 w-4 mr-1" />
                              Annuler
                            </Button>
                          </div>
                        </TableCell>}
                    </TableRow>)}
                </TableBody>
              </Table> : <div className="flex flex-col items-center justify-center py-12">
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mb-4">
                  <AlertCircle className="h-8 w-8 text-purple-500 dark:text-purple-400" />
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-2">Aucune pénalité trouvée</p>
                <p className="text-gray-500 dark:text-gray-400 text-sm text-center max-w-md">
                  {role === 'creator' ? "Vous n'avez pas de pénalités actives. Continuez comme ça!" : "Aucune pénalité n'a été attribuée pour le moment."}
                </p>
                
                {canAddPenalty && <Button onClick={() => setShowAddPenaltyDialog(true)} variant="outline" className="mt-4 border-purple-300 dark:border-purple-700 text-slate-50">
                    <Plus className="mr-2 h-4 w-4" />
                    Ajouter une pénalité
                  </Button>}
              </div>}
          </CardContent>
        </Card>
      </div>
      
      {/* Note: La boîte de dialogue d'ajout de pénalité serait implémentée dans un composant séparé */}
    </SidebarProvider>;
};
export default Penalties;