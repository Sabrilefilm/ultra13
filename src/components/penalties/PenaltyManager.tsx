
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { PlusCircle, AlertTriangle, CheckCircle, XCircle, User } from "lucide-react";
import { AddPenaltyDialog } from "./AddPenaltyDialog";
import { PenaltyList } from "./PenaltyList";

interface PenaltyManagerProps {
  username: string;
  role: string;
}

export const PenaltyManager = ({ username, role }: PenaltyManagerProps) => {
  const { toast } = useToast();
  const [isAddPenaltyOpen, setIsAddPenaltyOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [creatorResults, setCreatorResults] = useState<any[]>([]);
  const [selectedCreator, setSelectedCreator] = useState<string | null>(null);
  const [penalties, setPenalties] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const canManagePenalties = ['founder', 'manager', 'agent'].includes(role);

  const searchCreators = async (query: string) => {
    if (query.length < 2) {
      setCreatorResults([]);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_accounts')
        .select('id, username, role')
        .ilike('username', `%${query}%`)
        .eq('role', 'creator')
        .limit(5);

      if (error) throw error;
      setCreatorResults(data || []);
    } catch (error) {
      console.error("Erreur lors de la recherche:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de rechercher des créateurs"
      });
    }
  };

  const fetchPenalties = async (creatorId?: string) => {
    setLoading(true);
    try {
      let query = supabase
        .from('penalties')
        .select(`
          id,
          reason,
          duration_days,
          created_at,
          active,
          user_accounts:user_id (username, role),
          creators:created_by (username, role)
        `)
        .order('created_at', { ascending: false });

      if (creatorId) {
        query = query.eq('user_id', creatorId);
      } else if (role === 'creator') {
        // Si l'utilisateur est un créateur, ne montrer que ses pénalités
        const { data: userData } = await supabase.auth.getSession();
        if (userData.session) {
          query = query.eq('user_id', userData.session.user.id);
        }
      }

      const { data, error } = await query;

      if (error) throw error;
      setPenalties(data || []);
    } catch (error) {
      console.error("Erreur lors du chargement des pénalités:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les pénalités"
      });
      setPenalties([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPenalties();
  }, [role]);

  const handleSelectCreator = (creatorId: string) => {
    setSelectedCreator(creatorId);
    setSearchQuery("");
    setCreatorResults([]);
    fetchPenalties(creatorId);
  };

  const refreshPenalties = () => {
    fetchPenalties(selectedCreator || undefined);
  };

  return (
    <Card className="bg-[#1E293B]/70 border-gray-700/50 shadow-xl">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-white text-xl">Gestion des pénalités</CardTitle>
        {canManagePenalties && (
          <Button 
            onClick={() => setIsAddPenaltyOpen(true)}
            variant="default"
            className="bg-purple-600 hover:bg-purple-700"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Ajouter une pénalité
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        {canManagePenalties && (
          <div className="relative">
            <Input
              placeholder="Rechercher un créateur..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                searchCreators(e.target.value);
              }}
              className="bg-slate-800/50 border-gray-700 text-white placeholder:text-gray-400"
            />
            
            {creatorResults.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-slate-800 border border-gray-700 rounded-md shadow-xl">
                {creatorResults.map((creator) => (
                  <div
                    key={creator.id}
                    className="flex items-center gap-2 p-2 hover:bg-slate-700 cursor-pointer"
                    onClick={() => handleSelectCreator(creator.id)}
                  >
                    <User className="h-4 w-4 text-gray-400" />
                    <span className="text-white">{creator.username}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {selectedCreator && (
          <div className="flex items-center justify-between bg-slate-800/50 p-2 rounded-md">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-purple-400" />
              <span className="text-white">
                {creatorResults.find(c => c.id === selectedCreator)?.username || "Créateur sélectionné"}
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedCreator(null);
                fetchPenalties();
              }}
              className="text-gray-400 hover:text-white"
            >
              <XCircle className="h-4 w-4" />
            </Button>
          </div>
        )}

        <PenaltyList 
          penalties={penalties} 
          loading={loading} 
          onRefresh={refreshPenalties}
          role={role}
        />
      </CardContent>
      
      <AddPenaltyDialog
        isOpen={isAddPenaltyOpen}
        onClose={() => setIsAddPenaltyOpen(false)}
        userId={selectedCreator}
        onSuccess={refreshPenalties}
      />
    </Card>
  );
};
