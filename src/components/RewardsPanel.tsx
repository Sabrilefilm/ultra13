
import { useQuery } from "@tanstack/react-query";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Diamond, Plus } from "lucide-react";
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
  creator_id: string;
  created_at: string;
}

export function RewardsPanel({ role, userId }: { role: string; userId: string }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [diamonds, setDiamonds] = useState("");
  const [recipientId, setRecipientId] = useState("");
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
            creator_id: recipientId,
            diamonds_count: parseInt(diamonds),
          }
        ]);

      if (error) throw error;

      toast({
        title: "Récompense ajoutée",
        description: "La récompense a été ajoutée avec succès",
      });

      setIsDialogOpen(false);
      setDiamonds("");
      setRecipientId("");
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
                Ajouter des diamants
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Ajouter des diamants</DialogTitle>
                <DialogDescription>
                  Ajoutez des diamants pour un créateur
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="recipientId">Identifiant du créateur</Label>
                  <Input
                    id="recipientId"
                    value={recipientId}
                    onChange={(e) => setRecipientId(e.target.value)}
                    placeholder="@username"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="diamonds">Nombre de diamants</Label>
                  <Input
                    id="diamonds"
                    type="number"
                    value={diamonds}
                    onChange={(e) => setDiamonds(e.target.value)}
                  />
                </div>
                <Button onClick={handleAddReward} className="w-full">
                  Ajouter les diamants
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
                <TableHead>Identifiant</TableHead>
                <TableHead>Diamants</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rewards.map((reward) => (
                <TableRow key={reward.id}>
                  <TableCell>
                    {new Date(reward.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{reward.creator_id}</TableCell>
                  <TableCell>{reward.diamonds_count}</TableCell>
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
