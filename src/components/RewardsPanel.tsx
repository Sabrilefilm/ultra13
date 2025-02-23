
import { useQuery } from "@tanstack/react-query";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Diamond, DollarSign } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Reward {
  id: string;
  diamonds_count: number;
  amount_earned: number;
  payment_status: string;
  created_at: string;
}

export function RewardsPanel({ role, userId }: { role: string; userId: string }) {
  const { data: rewards, isLoading } = useQuery({
    queryKey: ["rewards", userId],
    queryFn: async () => {
      let query = supabase
        .from("creator_rewards")
        .select("*")
        .order("created_at", { ascending: false });

      if (role === "creator") {
        query = query.eq("creator_id", userId);
      } else if (role === "manager") {
        const { data: creatorIds } = await supabase
          .from("profiles")
          .select("id")
          .eq("manager_id", userId);
        
        if (creatorIds && creatorIds.length > 0) {
          query = query.in(
            "creator_id",
            creatorIds.map((c) => c.id)
          );
        }
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Reward[];
    },
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Chargement des récompenses...</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Diamond className="w-5 h-5" />
          Récompenses
        </CardTitle>
      </CardHeader>
      <CardContent>
        {rewards && rewards.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Diamants</TableHead>
                <TableHead>Montant (€)</TableHead>
                <TableHead>Statut</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rewards.map((reward) => (
                <TableRow key={reward.id}>
                  <TableCell>
                    {new Date(reward.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{reward.diamonds_count}</TableCell>
                  <TableCell>{reward.amount_earned.toFixed(2)} €</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                      reward.payment_status === "paid"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}>
                      {reward.payment_status === "paid" ? "Payé" : "En attente"}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center text-muted-foreground py-8">
            Aucune récompense à afficher
          </div>
        )}
      </CardContent>
    </Card>
  );
}
