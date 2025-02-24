
import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Info, UserCog, Check, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Account } from "@/types/accounts";

interface UserRowProps {
  user: Account & { live_schedules: { hours: number; days: number }[] };
  editingUser: Account | null;
  editedUsername: string;
  setEditedUsername: (username: string) => void;
  onUsernameSave: () => void;
  onUsernameEdit: (user: Account) => void;
  onRoleChange: (userId: string, newRole: string, username: string) => void;
  onDeleteUser: (id: string, username: string) => void;
  onViewDetails: (userId: string) => void;
  showPasswords: {[key: string]: boolean};
  togglePasswordVisibility: (id: string) => void;
}

export const UserRow: React.FC<UserRowProps> = ({
  user,
  editingUser,
  editedUsername,
  setEditedUsername,
  onUsernameSave,
  onUsernameEdit,
  onRoleChange,
  onDeleteUser,
  onViewDetails,
  showPasswords,
  togglePasswordVisibility,
}) => {
  return (
    <TableRow>
      <TableCell>
        {editingUser?.id === user.id ? (
          <div className="flex items-center gap-2">
            <Input
              value={editedUsername}
              onChange={(e) => setEditedUsername(e.target.value)}
              className="max-w-[200px]"
            />
            <Button
              size="icon"
              variant="ghost"
              onClick={onUsernameSave}
              disabled={!editedUsername.trim() || editedUsername === user.username}
            >
              <Check className="h-4 w-4 text-green-500" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => onUsernameEdit(null as any)}
            >
              <X className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="font-medium">{user.username}</span>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => onUsernameEdit(user)}
            >
              <UserCog className="h-4 w-4" />
            </Button>
          </div>
        )}
      </TableCell>
      <TableCell>
        <Select
          value={user.role}
          onValueChange={(value) => onRoleChange(user.id, value, user.username)}
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="creator">Créateur</SelectItem>
            <SelectItem value="manager">Manager</SelectItem>
            <SelectItem value="agent">Agent</SelectItem>
          </SelectContent>
        </Select>
      </TableCell>
      <TableCell>
        {user.role === "creator" && user.live_schedules && user.live_schedules[0] && (
          <div className="text-sm text-muted-foreground">
            <p>Heures de live : {user.live_schedules[0].hours}h</p>
            <p>Jours streamés : {user.live_schedules[0].days}j</p>
          </div>
        )}
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm">
            {showPasswords[user.id] ? user.password : "••••••••"}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => togglePasswordVisibility(user.id)}
          >
            {showPasswords[user.id] ? "Masquer" : "Afficher"}
          </Button>
        </div>
      </TableCell>
      <TableCell className="text-right">
        <div className="flex items-center justify-end gap-2">
          {user.role === "creator" && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewDetails(user.id)}
            >
              <Info className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDeleteUser(user.id, user.username)}
          >
            Supprimer
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};
