
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface Sponsorship {
  id: string;
  creator_tiktok: string;
  sponsor_tiktok: string;
  invitation_code: string;
  agent_name: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

interface SponsorshipListProps {
  isFounder?: boolean;
}

export const SponsorshipList = ({ isFounder }: SponsorshipListProps) => {
  const { toast } = useToast();

  const { data: sponsorships, isLoading, refetch } = useQuery({
    queryKey: ['sponsorships'],
    queryFn: async () => {
      let query = supabase
        .from('sponsorships')
        .select('*')
        .order('created_at', { ascending: false });

      const { data, error } = await query;

      if (error) {
        console.error("Erreur lors de la récupération des parrainages:", error);
        throw error;
      }
      
      console.log("Parrainages récupérés:", data); // Pour le débogage
      return data as Sponsorship[];
    }
  });

  const updateStatus = async (id: string, status: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('sponsorships')
        .update({ status })
        .eq('id', id);

      if (error) {
        console.error("Erreur de mise à jour:", error);
        throw error;
      }

      toast({
        title: "Statut mis à jour",
        description: `La demande de parrainage a été ${status === 'approved' ? 'approuvée' : 'refusée'}`,
        duration: 60000,
      });

      refetch();
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut:", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut",
        variant: "destructive",
        duration: 60000,
      });
    }
  };

  if (isLoading) {
    return <div>Chargement des parrainages...</div>;
  }

  if (!sponsorships || sponsorships.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">
            {isFounder ? "Aucune demande de parrainage à traiter" : "Vous n'avez pas encore de demande de parrainage"}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isFounder ? "Demandes de parrainage" : "Mes parrainages"}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sponsorships.map((sponsorship) => (
            <Card key={sponsorship.id} className="p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-medium">Créateur TikTok:</p>
                  <p className="text-muted-foreground">{sponsorship.creator_tiktok}</p>
                </div>
                <div>
                  <p className="font-medium">Parrain TikTok:</p>
                  <p className="text-muted-foreground">{sponsorship.sponsor_tiktok}</p>
                </div>
                <div>
                  <p className="font-medium">Code d'invitation:</p>
                  <p className="text-muted-foreground">{sponsorship.invitation_code}</p>
                </div>
                <div>
                  <p className="font-medium">Agent/Créateur:</p>
                  <p className="text-muted-foreground">{sponsorship.agent_name}</p>
                </div>
              </div>
              <div className="mt-4">
                <p className="font-medium">Statut:</p>
                <div className="flex items-center gap-2 mt-2">
                  {isFounder && sponsorship.status === 'pending' ? (
                    <>
                      <Button
                        size="sm"
                        onClick={() => updateStatus(sponsorship.id, 'approved')}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Approuver
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => updateStatus(sponsorship.id, 'rejected')}
                        variant="destructive"
                      >
                        Refuser
                      </Button>
                    </>
                  ) : (
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      sponsorship.status === 'approved'
                        ? 'bg-green-100 text-green-700'
                        : sponsorship.status === 'rejected'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {sponsorship.status === 'approved'
                        ? 'Approuvé'
                        : sponsorship.status === 'rejected'
                        ? 'Refusé'
                        : 'En attente'}
                    </span>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
