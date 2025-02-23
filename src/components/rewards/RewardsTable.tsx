
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
          <p className="text-3xl font-bold">{totalDiamonds}</p>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Créateur</TableHead>
            <TableHead>Diamants</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rewards.map((reward) => (
            <TableRow key={reward.id}>
              <TableCell>
                {new Date(reward.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell>{reward.creator_username || reward.creator_id}</TableCell>
              <TableCell>{reward.diamonds_count}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
