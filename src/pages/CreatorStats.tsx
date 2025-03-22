
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, Calendar, UserMinus, PencilLine } from "lucide-react";
import { useIndexAuth } from "@/hooks/use-index-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/lib/supabase";
import { Account } from "@/types/accounts";
import { toast } from "sonner";
import { UltraSidebar } from "@/components/layout/UltraSidebar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useIsMobile } from "@/hooks/use-mobile";

const CreatorStats = () => {
  const navigate = useNavigate();
  const { role, username, userId } = useIndexAuth();
  const [creators, setCreators] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCreator, setSelectedCreator] = useState<any>(null);
  const [isEditingSchedule, setIsEditingSchedule] = useState(false);
  const [hours, setHours] = useState(0);
  const [days, setDays] = useState(0);
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    // Only agents, managers and founders should be able to access this page
    if (!['agent', 'manager', 'founder', 'ambassadeur'].includes(role || '')) {
      navigate('/');
      return;
    }

    const fetchCreators = async () => {
      setLoading(true);
      try {
        console.log("Fetching creators for agent:", username);
        
        // For founder or manager, fetch all creators
        if (role === 'founder' || role === 'manager') {
          const { data: creatorsData, error: creatorsError } = await supabase
            .from("user_accounts")
            .select(`
              id,
              username,
              live_schedules (
                hours,
                days
              )
            `)
            .eq("role", "creator");

          if (creatorsError) {
            console.error("Error fetching creators:", creatorsError);
            toast.error("Erreur lors de la récupération des créateurs");
            return;
          }

          console.log("All creators found:", creatorsData);
          setCreators(creatorsData || []);
          return;
        }
        
        // For agents, fetch only their assigned creators
        // Step 1: Get the agent's ID
        const { data: agentData, error: agentError } = await supabase
          .from("user_accounts")
          .select("id")
          .eq("username", username)
          .eq("role", role)
          .single();

        if (agentError) {
          console.error("Error fetching agent:", agentError);
          toast.error("Erreur lors de la récupération des informations de l'agent");
          return;
        }

        if (!agentData || !agentData.id) {
          console.error("Agent data not found:", username);
          toast.error("Données de l'agent introuvables");
          return;
        }

        console.log("Agent ID found:", agentData.id);

        // Step 2: Get all creators assigned to this agent
        const { data: creatorsData, error: creatorsError } = await supabase
          .from("user_accounts")
          .select(`
            id,
            username,
            live_schedules (
              hours,
              days
            )
          `)
          .eq("role", "creator")
          .eq("agent_id", agentData.id);

        if (creatorsError) {
          console.error("Error fetching creators:", creatorsError);
          toast.error("Erreur lors de la récupération des créateurs");
          return;
        }

        console.log("Creators found:", creatorsData);
        setCreators(creatorsData || []);
      } catch (error) {
        console.error("Error:", error);
        toast.error("Une erreur est survenue");
      } finally {
        setLoading(false);
      }
    };

    fetchCreators();
  }, [navigate, role, username]);

  const getTotalHours = () => {
    return creators.reduce((total, creator) => {
      const hours = creator.live_schedules?.[0]?.hours || 0;
      return total + Number(hours);
    }, 0);
  };

  const getTotalDays = () => {
    return creators.reduce((total, creator) => {
      const days = creator.live_schedules?.[0]?.days || 0;
      return total + Number(days);
    }, 0);
  };

  const handleEditSchedule = (creator: any) => {
    setSelectedCreator(creator);
    setHours(creator.live_schedules?.[0]?.hours || 0);
    setDays(creator.live_schedules?.[0]?.days || 0);
    setIsEditingSchedule(true);
  };

  const handleSaveSchedule = async () => {
    if (!selectedCreator) return;
    
    try {
      // Check if the creator already has a schedule
      if (selectedCreator.live_schedules && selectedCreator.live_schedules.length > 0) {
        // Update existing schedule
        const scheduleId = selectedCreator.live_schedules[0].id;
        const { error } = await supabase
          .from("live_schedules")
          .update({ hours, days })
          .eq("creator_id", selectedCreator.id);
        
        if (error) throw error;
      } else {
        // Create new schedule
        const { error } = await supabase
          .from("live_schedules")
          .insert([
            { creator_id: selectedCreator.id, hours, days }
          ]);
        
        if (error) throw error;
      }
      
      toast.success("Horaires mis à jour avec succès");
      
      // Update local state
      setCreators(creators.map(c => {
        if (c.id === selectedCreator.id) {
          return {
            ...c,
            live_schedules: [{ hours, days }]
          };
        }
        return c;
      }));
      
      setIsEditingSchedule(false);
    } catch (error) {
      console.error("Error updating schedule:", error);
      toast.error("Erreur lors de la mise à jour des horaires");
    }
  };

  const handleRemoveCreator = (creator: any) => {
    setSelectedCreator(creator);
    setRemoveDialogOpen(true);
  };

  const confirmRemoveCreator = async () => {
    if (!selectedCreator) return;
    
    try {
      const { error } = await supabase
        .from("user_accounts")
        .update({ agent_id: null })
        .eq("id", selectedCreator.id);
      
      if (error) throw error;
      
      toast.success("Créateur retiré avec succès");
      
      // Update local state
      setCreators(creators.filter(c => c.id !== selectedCreator.id));
      setRemoveDialogOpen(false);
    } catch (error) {
      console.error("Error removing creator:", error);
      toast.error("Erreur lors du retrait du créateur");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen p-4 flex justify-center items-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <UltraSidebar 
        username={username || ''}
        role={role || ''}
        onLogout={() => {
          localStorage.clear();
          navigate('/');
        }}
        currentPage="creator-stats"
      />
      
      <div className="flex-1 p-4 max-w-full md:max-w-6xl mx-auto space-y-6 overflow-x-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
            className="h-10 w-10"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">
            Mes Créateurs
          </h1>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Total heures de live
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{getTotalHours()}h</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Total jours streamés
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{getTotalDays()}j</p>
            </CardContent>
          </Card>
        </div>

        {/* Creators table */}
        <Card className="w-full overflow-hidden">
          <CardHeader>
            <CardTitle>Détails des Créateurs ({creators.length})</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            {creators.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {role === 'agent' || role === 'ambassadeur' ? 
                  "Aucun créateur n'est assigné à votre compte" : 
                  "Aucun créateur n'est enregistré"
                }
              </div>
            ) : (
              <div className="w-full overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Créateur</TableHead>
                      <TableHead>Heures de live</TableHead>
                      <TableHead>Jours streamés</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {creators.map((creator) => (
                      <TableRow key={creator.id}>
                        <TableCell className="font-medium">{creator.username}</TableCell>
                        <TableCell>{creator.live_schedules?.[0]?.hours || 0}h</TableCell>
                        <TableCell>{creator.live_schedules?.[0]?.days || 0}j</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleEditSchedule(creator)}
                            >
                              <PencilLine className="h-4 w-4 mr-1" />
                              {isMobile ? '' : 'Modifier les horaires'}
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="text-red-500 border-red-500 hover:bg-red-100 hover:text-red-700"
                              onClick={() => handleRemoveCreator(creator)}
                            >
                              <UserMinus className="h-4 w-4 mr-1" />
                              {isMobile ? '' : 'Retirer'}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Edit Schedule Dialog */}
        <Dialog open={isEditingSchedule} onOpenChange={setIsEditingSchedule}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Modifier les horaires</DialogTitle>
              <DialogDescription>
                Ajustez les heures de streaming et les jours pour {selectedCreator?.username}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="hours" className="text-right">
                  Heures
                </Label>
                <Input
                  id="hours"
                  type="number"
                  value={hours}
                  onChange={(e) => setHours(Number(e.target.value))}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="days" className="text-right">
                  Jours
                </Label>
                <Input
                  id="days"
                  type="number"
                  value={days}
                  onChange={(e) => setDays(Number(e.target.value))}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleSaveSchedule}>Sauvegarder</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Remove Creator Dialog */}
        <Dialog open={removeDialogOpen} onOpenChange={setRemoveDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Retirer le créateur</DialogTitle>
              <DialogDescription>
                Êtes-vous sûr de vouloir retirer {selectedCreator?.username} de votre agence ?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setRemoveDialogOpen(false)}>Annuler</Button>
              <Button variant="destructive" onClick={confirmRemoveCreator}>Confirmer</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default CreatorStats;
