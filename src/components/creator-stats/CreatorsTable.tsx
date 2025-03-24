
import React from "react";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { PencilLine, Diamond, UserMinus } from "lucide-react";

interface Creator {
  id: string;
  username: string;
  live_schedules?: Array<{ hours: number; days: number }>;
  profiles?: Array<{ total_diamonds: number }>;
}

interface CreatorsTableProps {
  creators: Creator[];
  isMobile: boolean;
  rewardThreshold: number;
  onEditSchedule: (creator: Creator) => void;
  onEditDiamonds: (creator: Creator) => void;
  onRemoveCreator: (creator: Creator) => void;
}

export const CreatorsTable: React.FC<CreatorsTableProps> = ({
  creators,
  isMobile,
  rewardThreshold,
  onEditSchedule,
  onEditDiamonds,
  onRemoveCreator
}) => {
  if (creators.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Aucun créateur n'est assigné à votre compte
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Créateur</TableHead>
            <TableHead>Heures de live</TableHead>
            <TableHead>Jours streamés</TableHead>
            <TableHead>Diamants</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {creators.map((creator) => (
            <TableRow key={creator.id}>
              <TableCell className="font-medium">{creator.username}</TableCell>
              <TableCell>{creator.live_schedules?.[0]?.hours || 0}h</TableCell>
              <TableCell>{creator.live_schedules?.[0]?.days || 0}j</TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span>{(creator.profiles?.[0]?.total_diamonds || 0).toLocaleString()} 💎</span>
                  {(creator.profiles?.[0]?.total_diamonds || 0) >= rewardThreshold && (
                    <span className="text-xs text-green-500 animate-pulse">
                      🏆 Récompense disponible!
                    </span>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onEditSchedule(creator)}
                  >
                    <PencilLine className="h-4 w-4 mr-1" />
                    {isMobile ? '' : 'Modifier les horaires'}
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-purple-500 text-purple-500 hover:bg-purple-100 hover:text-purple-700"
                    onClick={() => onEditDiamonds(creator)}
                  >
                    <Diamond className="h-4 w-4 mr-1" />
                    {isMobile ? '' : 'Modifier les diamants'}
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-red-500 border-red-500 hover:bg-red-100 hover:text-red-700"
                    onClick={() => onRemoveCreator(creator)}
                  >
                    <UserMinus className="h-4 w-4 mr-1" />
                    {isMobile ? '' : 'Retirer'}
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
