
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/lib/utils";

interface Reward {
  id: string;
  diamonds_count: number;
  creator_id: string;
  created_at: string;
  creator_username?: string;
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

  return (
    <div className="space-y-4">
      <div className="p-4 bg-accent/5 rounded-lg">
        <div className="text-center">
          <p className="text-sm font-medium text-muted-foreground">Total des diamants</p>
          <p className="text-3xl font-bold">{totalDiamonds.toLocaleString()}</p>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Créateur</TableHead>
              <TableHead className="text-right">Diamants</TableHead>
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
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
