
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface Reward {
  id: string;
  diamonds_count: number;
  creator_id: string;
  created_at: string;
  creator_username?: string;
  payment_status?: string;
  amount_earned?: number;
}

interface RewardsTableProps {
  rewards: Reward[];
}

export function RewardsTable({ rewards }: RewardsTableProps) {
  if (!rewards || rewards.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        Aucune récompense à afficher
      </div>
    );
  }

  const totalDiamonds = rewards.reduce((sum, reward) => sum + reward.diamonds_count, 0);
  const pendingRewards = rewards.filter(reward => reward.payment_status === 'pending');
  const pendingDiamonds = pendingRewards.reduce((sum, reward) => sum + reward.diamonds_count, 0);
  
  // Calculate total earnings
  const totalEarnings = rewards.reduce((sum, reward) => sum + (reward.amount_earned || 0), 0);
  const pendingEarnings = pendingRewards.reduce((sum, reward) => sum + (reward.amount_earned || 0), 0);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="p-4 bg-accent/5 rounded-lg">
          <div className="text-center">
            <p className="text-sm font-medium text-muted-foreground">Total des diamants</p>
            <p className="text-3xl font-bold">{totalDiamonds.toLocaleString()}</p>
          </div>
        </div>
        <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
          <div className="text-center">
            <p className="text-sm font-medium text-muted-foreground">Diamants en attente</p>
            <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{pendingDiamonds.toLocaleString()}</p>
          </div>
        </div>
        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <div className="text-center">
            <p className="text-sm font-medium text-muted-foreground">Gains totaux</p>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">{totalEarnings.toFixed(2)}€</p>
          </div>
        </div>
        <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
          <div className="text-center">
            <p className="text-sm font-medium text-muted-foreground">Gains en attente</p>
            <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">{pendingEarnings.toFixed(2)}€</p>
          </div>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Créateur</TableHead>
              <TableHead className="text-right">Diamants</TableHead>
              <TableHead className="text-right">Montant</TableHead>
              <TableHead>Statut</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rewards.map((reward) => (
              <TableRow key={reward.id}>
                <TableCell>
                  {new Date(reward.created_at).toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </TableCell>
                <TableCell>{reward.creator_username || reward.creator_id}</TableCell>
                <TableCell className="text-right">{reward.diamonds_count.toLocaleString()}</TableCell>
                <TableCell className="text-right">{reward.amount_earned ? `${reward.amount_earned.toFixed(2)}€` : '-'}</TableCell>
                <TableCell>
                  {reward.payment_status === 'pending' ? (
                    <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800">
                      En attente
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">
                      Payé
                    </Badge>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
