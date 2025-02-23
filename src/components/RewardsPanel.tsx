
import { useQuery } from "@tanstack/react-query";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Diamond, DollarSign, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface Reward {
  id: string;
  diamonds_count: number;
  amount_earned: number;
  payment_status: string;
  created_at: string;
}

export function RewardsPanel({ role, userId }: { role: string; userId: string }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [diamonds, setDiamonds] = useState("");
  const [amount, setAmount] = useState("");
  const { toast } = useToast();

  const { data: rewards, isLoading, refetch } = useQuery({
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

  const handleAddReward = async () => {
    try {
      const { error } = await supabase
        .from("creator_rewards")
        .insert([
          {
            creator_id: userId,
            diamonds_count: parseInt(diamonds),
            amount_earned: parseFloat(amount),
            payment_status: "pending"
          }
        ]);

      if (error) throw error;

      toast({
        title: "Récompense ajoutée",
        description: "La récompense a été ajoutée avec succès",
      });

      setIsDialogOpen(false);
      setDiamonds("");
      setAmount("");
      refetch();
    } catch (error) {
      console.error('Error adding reward:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter la récompense",
        variant: "destructive",
      });
    }
  };

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
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Diamond className="w-5 h-5" />
          Récompenses
        </CardTitle>
        {role === 'founder' && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Plus className="w-4 h-4" />
                Ajouter une récompense
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Ajouter une récompense</DialogTitle>
                <DialogDescription>
                  Ajoutez une nouvelle récompense pour ce créateur
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="diamonds">Nombre de diamants</Label>
                  <Input
                    id="diamonds"
                    type="number"
                    value={diamonds}
                    onChange={(e) => setDiamonds(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount">Montant (€)</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
                <Button onClick={handleAddReward} className="w-full">
                  Ajouter la récompense
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
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
