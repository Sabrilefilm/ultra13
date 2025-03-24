
import React from 'react';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Plus, Minus, Edit } from 'lucide-react';

interface Creator {
  id: string;
  username: string;
  role: string;
  total_diamonds: number;
  diamonds_goal: number;
}

interface UserDiamondsTableProps { 
  users: Creator[];
  diamondValue: number;
  role: string;
  openEditDialog: (user: Creator) => void;
  openDiamondModal: (user: Creator, type: 'add' | 'subtract') => void;
}

export function UserDiamondsTable({ 
  users,
  diamondValue,
  role,
  openEditDialog,
  openDiamondModal
}: UserDiamondsTableProps) {
  const canManageDiamonds = role === 'founder' || role === 'manager';
  
  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Utilisateur</TableHead>
            <TableHead className="text-right">Diamants</TableHead>
            <TableHead className="text-right">Objectif</TableHead>
            <TableHead className="text-right">Progression</TableHead>
            <TableHead className="text-right">Valeur (€)</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length > 0 ? (
            users.map(user => {
              const progressPercentage = user.diamonds_goal > 0 
                ? Math.min(Math.round((user.total_diamonds / user.diamonds_goal) * 100), 100)
                : 0;
                
              return (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="font-medium">{user.username}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{user.role}</div>
                  </TableCell>
                  <TableCell className="text-right">
                    {user.total_diamonds.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    {user.diamonds_goal.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Progress value={progressPercentage} className="w-16 h-2" />
                      <span>{progressPercentage}%</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    {(user.total_diamonds * diamondValue).toLocaleString()}€
                  </TableCell>
                  <TableCell className="text-right">
                    {canManageDiamonds && (
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost" 
                          size="icon"
                          onClick={() => openDiamondModal(user, 'add')}
                          title="Ajouter des diamants"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost" 
                          size="icon"
                          onClick={() => openDiamondModal(user, 'subtract')}
                          title="Retirer des diamants"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost" 
                          size="icon"
                          onClick={() => openEditDialog(user)}
                          title="Modifier l'objectif"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-4">
                Aucun utilisateur trouvé
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
