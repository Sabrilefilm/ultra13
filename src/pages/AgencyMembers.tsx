
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, UserRound } from "lucide-react";
import { useIndexAuth } from "@/hooks/use-index-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAgencyMembers } from "@/hooks/user-management/use-agency-members";
import { supabase } from "@/lib/supabase";
import { Account } from "@/types/accounts";

const AgencyMembers = () => {
  const { agentId } = useParams<{ agentId: string }>();
  const navigate = useNavigate();
  const { role } = useIndexAuth();
  const [agent, setAgent] = useState<Account | null>(null);
  const { assignedCreators } = useAgencyMembers(agentId || "");

  useEffect(() => {
    // Fix the type comparison error by checking if role is NOT one of the allowed roles
    if (role !== 'founder' && role !== 'manager' && role !== 'agent') {
      navigate('/');
    }

    const fetchAgent = async () => {
      if (!agentId) return;
      
      const { data, error } = await supabase
        .from("user_accounts")
        .select("*")
        .eq("id", agentId)
        .single();
      
      if (error) {
        console.error("Error fetching agent:", error);
        return;
      }
      
      setAgent(data as Account);
    };

    fetchAgent();
  }, [agentId, navigate, role]);

  if (!agent) {
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
            onClick={() => navigate("/users")}
            className="h-10 w-10"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">
            Créateurs assignés à {agent.username}
          </h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Créateurs ({assignedCreators.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {assignedCreators.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Aucun créateur n'est assigné à cet agent
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {assignedCreators.map((creator) => (
                  <Card key={creator.id} className="overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
                          <UserRound className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="font-medium">{creator.username}</div>
                          <div className="text-sm text-muted-foreground">
                            Créateur
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AgencyMembers;
