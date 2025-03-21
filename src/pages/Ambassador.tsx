
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Users, Award, UserPlus, Gift, Calendar, Star } from "lucide-react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { UltraSidebar } from "@/components/layout/UltraSidebar";
import { useIndexAuth } from "@/hooks/use-index-auth";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useQueryClient } from "@tanstack/react-query";
import { Loading } from "@/components/ui/loading";

const Ambassador = () => {
  const navigate = useNavigate();
  const { isAuthenticated, role, username, userId, handleLogout } = useIndexAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(true);
  const [recruitments, setRecruitments] = useState<any[]>([]);
  const [referredCreators, setReferredCreators] = useState<any[]>([]);
  const [inviteCode, setInviteCode] = useState("");
  const [newReferral, setNewReferral] = useState({
    name: "",
    tiktokHandle: "",
    email: "",
    phone: "",
    notes: ""
  });
  const [ambassadorStats, setAmbassadorStats] = useState({
    totalReferred: 0,
    totalAccepted: 0,
    totalPending: 0,
    totalRewards: 0
  });
  const [currentTab, setCurrentTab] = useState("overview");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
      return;
    }

    fetchAmbassadorData();
    generateInviteCodeIfNeeded();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, userId, role]);

  const fetchAmbassadorData = async () => {
    setIsLoading(true);
    try {
      // Fetch referrals data
      const { data: referralsData, error: referralsError } = await supabase
        .from('ambassadors_referrals')
        .select('*, referred_creator_id(*)')
        .eq('ambassador_id', userId);
      
      if (referralsError) throw referralsError;
      
      // Fetch recruits data
      const { data: recruitsData, error: recruitsError } = await supabase
        .from('ambassador_recruits')
        .select('*')
        .eq('ambassador_id', userId);
      
      if (recruitsError) throw recruitsError;
      
      setRecruitments(recruitsData || []);
      setReferredCreators(referralsData || []);
      
      // Calculate stats
      const accepted = referralsData?.filter(ref => ref.status === 'accepted').length || 0;
      const pending = referralsData?.filter(ref => ref.status === 'pending').length || 0;
      
      // Get rewards total
      const { data: rewardsData, error: rewardsError } = await supabase
        .from('ambassador_rewards')
        .select('amount')
        .eq('ambassador_id', userId);
      
      if (rewardsError) throw rewardsError;
      
      const totalRewards = rewardsData?.reduce((sum, reward) => sum + reward.amount, 0) || 0;
      
      setAmbassadorStats({
        totalReferred: referralsData?.length || 0,
        totalAccepted: accepted,
        totalPending: pending,
        totalRewards: totalRewards
      });
    } catch (error) {
      console.error('Error fetching ambassador data:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les données d'ambassadeur",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateInviteCodeIfNeeded = async () => {
    try {
      // Check if user already has an invite code
      const { data, error } = await supabase
        .from('ambassador_invites')
        .select('code')
        .eq('user_id', userId)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      
      if (data?.code) {
        setInviteCode(data.code);
        return;
      }
      
      // Generate new invite code if needed
      const newCode = `${username?.toUpperCase().slice(0, 4) || 'ULTRA'}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      
      const { error: insertError } = await supabase
        .from('ambassador_invites')
        .insert({
          user_id: userId,
          code: newCode,
          used_count: 0
        });
      
      if (insertError) throw insertError;
      
      setInviteCode(newCode);
    } catch (error) {
      console.error('Error generating invite code:', error);
    }
  };

  const handleAddReferral = async () => {
    try {
      if (!newReferral.name || !newReferral.tiktokHandle) {
        toast({
          title: "Informations manquantes",
          description: "Veuillez saisir au moins le nom et le pseudo TikTok",
          variant: "destructive"
        });
        return;
      }
      
      const { error } = await supabase
        .from('ambassador_recruits')
        .insert({
          ambassador_id: userId,
          name: newReferral.name,
          tiktok_handle: newReferral.tiktokHandle,
          email: newReferral.email || null,
          phone: newReferral.phone || null,
          notes: newReferral.notes || null,
          status: 'pending'
        });
      
      if (error) throw error;
      
      toast({
        title: "Recommandation ajoutée",
        description: "La personne a été ajoutée à votre liste de recommandations"
      });
      
      setNewReferral({
        name: "",
        tiktokHandle: "",
        email: "",
        phone: "",
        notes: ""
      });
      
      fetchAmbassadorData();
    } catch (error) {
      console.error('Error adding referral:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter la recommandation",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'accepted':
        return <Badge className="bg-green-600">Accepté</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Refusé</Badge>;
      case 'pending':
        return <Badge className="bg-amber-500">En attente</Badge>;
      default:
        return <Badge variant="outline">Inconnu</Badge>;
    }
  };

  const copyInviteCode = () => {
    navigator.clipboard.writeText(inviteCode);
    toast({
      title: "Code d'invitation copié",
      description: "Le code d'invitation a été copié dans le presse-papier"
    });
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex">
        <UltraSidebar 
          username={username || ''} 
          role={role || ''} 
          onLogout={handleLogout}
          currentPage="ambassador"
        />
        
        <div className="flex-1 p-4 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex items-center gap-4 mb-6">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/")}
                className="h-10 w-10"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Programme Ambassadeur</h1>
                <p className="text-gray-500 dark:text-gray-400">
                  Recommandez des créateurs et gagnez des récompenses
                </p>
              </div>
            </div>
            
            {isLoading ? (
              <Loading size="large" text="Chargement des données d'ambassadeur..." />
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-100 dark:from-purple-950/30 dark:to-indigo-950/30 dark:border-purple-900/20">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Users className="h-5 w-5 text-purple-500" />
                        Recommandations
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                        {ambassadorStats.totalReferred}
                      </p>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">
                        {ambassadorStats.totalAccepted} accepté(s)
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-100 dark:from-blue-950/30 dark:to-cyan-950/30 dark:border-blue-900/20">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Award className="h-5 w-5 text-blue-500" />
                        Récompenses gagnées
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                        {ambassadorStats.totalRewards}€
                      </p>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">
                        10€ par créateur accepté
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-100 dark:from-green-950/30 dark:to-emerald-950/30 dark:border-green-900/20 col-span-1 md:col-span-2">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <UserPlus className="h-5 w-5 text-green-500" />
                        Votre code d'invitation
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2">
                        <p className="bg-green-100 dark:bg-green-900/40 px-4 py-2 rounded-md text-xl font-bold text-green-700 dark:text-green-400 tracking-wider flex-1 text-center">
                          {inviteCode || "Génération du code..."}
                        </p>
                        <Button 
                          onClick={copyInviteCode} 
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Copier
                        </Button>
                      </div>
                      <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
                        Partagez ce code avec les créateurs pour qu'ils rejoignent l'agence
                      </p>
                    </CardContent>
                  </Card>
                </div>
                
                <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-4">
                  <TabsList className="grid grid-cols-3 max-w-md mx-auto">
                    <TabsTrigger value="overview">Aperçu</TabsTrigger>
                    <TabsTrigger value="referrals">Recommandations</TabsTrigger>
                    <TabsTrigger value="rewards">Récompenses</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="overview" className="space-y-4">
                    <Card className="bg-white dark:bg-slate-900 border-gray-200 dark:border-gray-800">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Star className="h-5 w-5 text-amber-500" />
                          Comment fonctionne le programme ambassadeur ?
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex gap-4 items-start">
                          <div className="bg-purple-100 dark:bg-purple-900/30 rounded-full w-8 h-8 flex items-center justify-center text-purple-600 dark:text-purple-400 font-bold shrink-0">
                            1
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">Invitez des créateurs</h3>
                            <p className="text-gray-600 dark:text-gray-400">
                              Partagez votre code d'invitation avec des créateurs TikTok talentueux
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex gap-4 items-start">
                          <div className="bg-purple-100 dark:bg-purple-900/30 rounded-full w-8 h-8 flex items-center justify-center text-purple-600 dark:text-purple-400 font-bold shrink-0">
                            2
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">Accompagnez-les</h3>
                            <p className="text-gray-600 dark:text-gray-400">
                              Aidez-les à comprendre le fonctionnement de l'agence et les avantages
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex gap-4 items-start">
                          <div className="bg-purple-100 dark:bg-purple-900/30 rounded-full w-8 h-8 flex items-center justify-center text-purple-600 dark:text-purple-400 font-bold shrink-0">
                            3
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">Recevez des récompenses</h3>
                            <p className="text-gray-600 dark:text-gray-400">
                              Gagnez 10€ pour chaque créateur qui rejoint l'agence grâce à votre invitation
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-white dark:bg-slate-900 border-gray-200 dark:border-gray-800">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Gift className="h-5 w-5 text-red-500" />
                          Vos récompenses récentes
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {referredCreators.length > 0 ? (
                          <div className="overflow-x-auto">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Créateur</TableHead>
                                  <TableHead>Date</TableHead>
                                  <TableHead>Statut</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {referredCreators.slice(0, 5).map((referral) => (
                                  <TableRow key={referral.id}>
                                    <TableCell className="font-medium">
                                      {referral.referred_creator_id?.username || referral.referral_code}
                                    </TableCell>
                                    <TableCell>
                                      {format(new Date(referral.created_at), 'dd MMM yyyy', { locale: fr })}
                                    </TableCell>
                                    <TableCell>
                                      {getStatusBadge(referral.status)}
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        ) : (
                          <div className="text-center py-8">
                            <p className="text-gray-500 dark:text-gray-400">
                              Vous n'avez pas encore recommandé de créateurs.
                            </p>
                            <Button 
                              onClick={() => setCurrentTab("referrals")} 
                              variant="link" 
                              className="mt-2"
                            >
                              Commencer à recommander
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="referrals" className="space-y-4">
                    <Card className="bg-white dark:bg-slate-900 border-gray-200 dark:border-gray-800">
                      <CardHeader>
                        <CardTitle>Recommander un nouveau créateur</CardTitle>
                        <CardDescription>
                          Ajoutez les informations d'un créateur que vous souhaitez recommander
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Nom complet *</label>
                            <Input 
                              value={newReferral.name}
                              onChange={(e) => setNewReferral({...newReferral, name: e.target.value})}
                              placeholder="Nom et prénom du créateur"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Pseudo TikTok *</label>
                            <Input 
                              value={newReferral.tiktokHandle}
                              onChange={(e) => setNewReferral({...newReferral, tiktokHandle: e.target.value})}
                              placeholder="@pseudo"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Email</label>
                            <Input 
                              type="email"
                              value={newReferral.email}
                              onChange={(e) => setNewReferral({...newReferral, email: e.target.value})}
                              placeholder="email@exemple.com"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Téléphone</label>
                            <Input 
                              value={newReferral.phone}
                              onChange={(e) => setNewReferral({...newReferral, phone: e.target.value})}
                              placeholder="Numéro de téléphone"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Notes supplémentaires</label>
                          <Textarea 
                            value={newReferral.notes}
                            onChange={(e) => setNewReferral({...newReferral, notes: e.target.value})}
                            placeholder="Informations complémentaires sur le créateur"
                            rows={3}
                          />
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-end">
                        <Button 
                          onClick={handleAddReferral}
                          className="bg-purple-600 hover:bg-purple-700"
                        >
                          Ajouter la recommandation
                        </Button>
                      </CardFooter>
                    </Card>
                    
                    <Card className="bg-white dark:bg-slate-900 border-gray-200 dark:border-gray-800">
                      <CardHeader>
                        <CardTitle>Vos recommandations</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {recruitments.length > 0 ? (
                          <div className="overflow-x-auto">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Nom</TableHead>
                                  <TableHead>Pseudo TikTok</TableHead>
                                  <TableHead>Date</TableHead>
                                  <TableHead>Statut</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {recruitments.map((recruit) => (
                                  <TableRow key={recruit.id}>
                                    <TableCell className="font-medium">{recruit.name}</TableCell>
                                    <TableCell>{recruit.tiktok_handle}</TableCell>
                                    <TableCell>
                                      {format(new Date(recruit.created_at), 'dd MMM yyyy', { locale: fr })}
                                    </TableCell>
                                    <TableCell>
                                      {getStatusBadge(recruit.status)}
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        ) : (
                          <div className="text-center py-8">
                            <p className="text-gray-500 dark:text-gray-400">
                              Vous n'avez pas encore ajouté de recommandations.
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="rewards" className="space-y-4">
                    <Card className="bg-white dark:bg-slate-900 border-gray-200 dark:border-gray-800">
                      <CardHeader>
                        <CardTitle>Programme de récompenses</CardTitle>
                        <CardDescription>
                          Découvrez comment vous pouvez gagner des récompenses
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 p-4 rounded-lg border border-purple-100 dark:border-purple-800/30">
                          <h3 className="text-xl font-bold text-purple-700 dark:text-purple-400 mb-2">
                            Récompense de base
                          </h3>
                          <p className="text-gray-700 dark:text-gray-300">
                            Recevez <span className="font-bold">10€</span> pour chaque créateur qui rejoint l'agence avec votre code d'invitation.
                          </p>
                        </div>
                        
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-4 rounded-lg border border-green-100 dark:border-green-800/30">
                          <h3 className="text-xl font-bold text-green-700 dark:text-green-400 mb-2">
                            Bonus de performance
                          </h3>
                          <p className="text-gray-700 dark:text-gray-300">
                            Bonus supplémentaire de <span className="font-bold">50€</span> si vous recommandez plus de 5 créateurs qui sont acceptés dans l'agence.
                          </p>
                        </div>
                        
                        <div className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 p-4 rounded-lg border border-amber-100 dark:border-amber-800/30">
                          <h3 className="text-xl font-bold text-amber-700 dark:text-amber-400 mb-2">
                            Bonus de qualité
                          </h3>
                          <p className="text-gray-700 dark:text-gray-300">
                            Bonus de <span className="font-bold">20€</span> pour chaque créateur recommandé qui atteint les objectifs de l'agence pendant 3 mois consécutifs.
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-white dark:bg-slate-900 border-gray-200 dark:border-gray-800">
                      <CardHeader>
                        <CardTitle>Historique des récompenses</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center py-8">
                          <Calendar className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                          <p className="text-gray-500 dark:text-gray-400">
                            L'historique de vos récompenses sera affiché ici.
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </>
            )}
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Ambassador;
