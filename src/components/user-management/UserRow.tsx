
import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Info, UserCog, Check, X, Clock, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Account } from "@/types/accounts";
import { useUserPermissions } from "@/hooks/user-management/use-user-permissions";

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
  userRole: string;
  canSeePasswords: boolean;
  canEditPasswords: boolean;
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
  userRole,
  canSeePasswords,
  canEditPasswords
}) => {
  const permissions = useUserPermissions(userRole);
  const canEditThisUsername = permissions.canEditUsername(user);
  const canChangeRoles = (newRole: string) => permissions.canChangeRole(user, newRole);

  return (
    <TableRow className="hover:bg-slate-700/50 border-b border-slate-700/30">
      <TableCell className="py-3">
        {editingUser?.id === user.id && canEditThisUsername ? (
          <div className="flex items-center gap-2">
            <Input
              value={editedUsername}
              onChange={(e) => setEditedUsername(e.target.value)}
              className="max-w-[200px] bg-slate-800 border-slate-600 text-white"
            />
            <Button
              size="icon"
              variant="ghost"
              onClick={onUsernameSave}
              disabled={!editedUsername.trim() || editedUsername === user.username}
              className="text-green-500 hover:text-green-400 hover:bg-green-900/20"
            >
              <Check className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => onUsernameEdit(null as any)}
              className="text-red-500 hover:text-red-400 hover:bg-red-900/20"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="font-medium text-white">{user.username}</span>
            {canEditThisUsername && (
              <Button
                size="icon"
                variant="ghost"
                onClick={() => onUsernameEdit(user)}
                className="text-slate-400 hover:text-white hover:bg-slate-700"
              >
                <UserCog className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}
      </TableCell>
      <TableCell>
        <Select
          value={user.role}
          onValueChange={(value) => {
            if (canChangeRoles(value)) {
              onRoleChange(user.id, value, user.username);
            }
          }}
          disabled={!canChangeRoles('agent') && !canChangeRoles('creator') && !canChangeRoles('manager')}
        >
          <SelectTrigger className="w-[120px] bg-slate-700 border-slate-600 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-700 text-white">
            <SelectItem value="creator" className="text-white hover:bg-slate-700">Créateur</SelectItem>
            {permissions.isFounder && <SelectItem value="manager" className="text-white hover:bg-slate-700">Manager</SelectItem>}
            <SelectItem value="agent" className="text-white hover:bg-slate-700">Agent</SelectItem>
            {permissions.isFounder && <SelectItem value="ambassadeur" className="text-white hover:bg-slate-700">Ambassadeur</SelectItem>}
          </SelectContent>
        </Select>
      </TableCell>
      <TableCell>
        {user.role === "creator" && user.live_schedules && user.live_schedules[0] && (
          <div className="text-sm text-slate-300 flex flex-col gap-1">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4 text-blue-400" />
              <span>Heures de live: <strong>{user.live_schedules[0].hours}h</strong></span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4 text-purple-400" />
              <span>Jours streamés: <strong>{user.live_schedules[0].days}j</strong></span>
            </div>
          </div>
        )}
      </TableCell>
      {canSeePasswords && (
        <TableCell>
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm text-slate-300">
              {showPasswords[user.id] ? user.password : "••••••••"}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => togglePasswordVisibility(user.id)}
              className="text-xs bg-slate-700/50 hover:bg-slate-600/50 text-slate-300"
            >
              {showPasswords[user.id] ? "Masquer" : "Afficher"}
            </Button>
          </div>
        </TableCell>
      )}
      <TableCell className="text-right">
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewDetails(user.id)}
            className="bg-indigo-900/30 border-indigo-700/30 hover:bg-indigo-800/40 text-white"
          >
            <Info className="h-4 w-4 mr-1" />
            Détails
          </Button>
          {permissions.canDeleteUser(user) && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onDeleteUser(user.id, user.username)}
              className="bg-red-900/70 hover:bg-red-800 text-white"
            >
              Supprimer
            </Button>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
};
