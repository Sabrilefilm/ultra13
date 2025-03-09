
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, Calendar } from "lucide-react";
import { useIndexAuth } from "@/hooks/use-index-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/lib/supabase";
import { Account } from "@/types/accounts";

const CreatorStats = () => {
  const navigate = useNavigate();
  const { role, username } = useIndexAuth();
  const [creators, setCreators] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Only agents should be able to access this page
    if (role !== 'agent') {
      navigate('/');
      return;
    }

    const fetchCreators = async () => {
      setLoading(true);
      try {
        // Step 1: Get the agent's ID
        const { data: agentData, error: agentError } = await supabase
          .from("user_accounts")
          .select("id")
          .eq("username", username)
          .eq("role", "agent")
          .single();

        if (agentError || !agentData) {
          console.error("Error fetching agent:", agentError);
          return;
        }

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
          return;
        }

        setCreators(creatorsData || []);
      } catch (error) {
        console.error("Error:", error);
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

  if (loading) {
    return (
      <div className="min-h-screen p-4 flex justify-center items-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-6xl mx-auto space-y-6">
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
        <Card>
          <CardHeader>
            <CardTitle>Détails des Créateurs ({creators.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {creators.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Aucun créateur n'est assigné à votre compte
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Créateur</TableHead>
                    <TableHead>Heures de live</TableHead>
                    <TableHead>Jours streamés</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {creators.map((creator) => (
                    <TableRow key={creator.id}>
                      <TableCell className="font-medium">{creator.username}</TableCell>
                      <TableCell>{creator.live_schedules?.[0]?.hours || 0}h</TableCell>
                      <TableCell>{creator.live_schedules?.[0]?.days || 0}j</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreatorStats;
