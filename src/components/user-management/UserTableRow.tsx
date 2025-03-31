
import React from "react";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Edit, Save, X, UserCog, Info, Trash } from "lucide-react";
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

interface UserTableRowProps {
  user: Account;
  onDeleteUser: (userId: string) => void;
  onViewDetails: (userId: string) => void;
  onRoleChange: (userId: string, newRole: string, username: string, currentRole?: string) => void;
  onUsernameEdit: (user: Account) => void;
  onUsernameSave: () => void;
  editingUser: Account | null;
  editedUsername: string;
  setEditedUsername: (username: string) => void;
  showPasswords: { [key: string]: boolean };
  togglePasswordVisibility: (userId: string) => void;
  userRole?: string;
  editingPassword?: {userId: string, value: string} | null;
  setEditingPassword?: (value: {userId: string, value: string} | null) => void;
  onPasswordEdit?: (userId: string) => void;
  onPasswordSave?: () => void;
  canSeePasswords?: boolean;
  canEditPasswords?: boolean;
}

export const UserTableRow: React.FC<UserTableRowProps> = ({
  user,
  onDeleteUser,
  onViewDetails,
  onRoleChange,
  onUsernameEdit,
  onUsernameSave,
  editingUser,
  editedUsername,
  setEditedUsername,
  showPasswords,
  togglePasswordVisibility,
  userRole = 'creator',
  editingPassword,
  setEditingPassword,
  onPasswordEdit,
  onPasswordSave,
  canSeePasswords = false,
  canEditPasswords = false
}) => {
  const permissions = useUserPermissions(userRole);
  
  // Check if the current user has permission to change this user's role
  const canModifyThisUserRole = (newRole: string) => {
    return permissions.canChangeRole(user, newRole);
  };
  
  // Check if current user can delete this user
  const canDeleteThisUser = permissions.canDeleteUser(user);
  
  // Check if current user can edit this user's username
  const canEditThisUsername = permissions.canEditUsername(user);

  return (
    <tr className="border-t border-gray-200 dark:border-gray-800">
      <td className="px-4 py-3">
        {editingUser?.id === user.id ? (
          <div className="flex items-center gap-2">
            <Input
              value={editedUsername}
              onChange={(e) => setEditedUsername(e.target.value)}
              className="h-8 w-40"
            />
            <Button
              size="sm"
              variant="ghost"
              onClick={onUsernameSave}
              className="h-8 w-8 p-0"
              disabled={!editedUsername.trim() || editedUsername === user.username}
            >
              <Save className="h-4 w-4 text-green-500" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onUsernameEdit(null as any)}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span>{user.username}</span>
            {canEditThisUsername && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onUsernameEdit(user)}
                className="h-8 w-8 p-0 opacity-50 hover:opacity-100"
              >
                <Edit className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        )}
      </td>
      <td className="px-4 py-3">
        {permissions.isFounder || (permissions.isManager && user.role === 'creator') ? (
          <Select
            value={user.role}
            onValueChange={(value) => onRoleChange(user.id, value, user.username, user.role)}
            disabled={!canModifyThisUserRole(user.role)}
          >
            <SelectTrigger className="h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="creator">Créateur</SelectItem>
              <SelectItem value="manager">Manager</SelectItem>
              <SelectItem value="agent">Agent</SelectItem>
              <SelectItem value="ambassadeur">Ambassadeur</SelectItem>
            </SelectContent>
          </Select>
        ) : (
          <span className="text-sm text-muted-foreground capitalize">{user.role}</span>
        )}
      </td>
      <td className="px-4 py-3 max-w-[200px]">
        {user.profile && (
          <div className="flex flex-col text-sm">
            {user.profile.total_diamonds !== undefined && (
              <span>💎 {user.profile.total_diamonds}</span>
            )}
            {user.profile.days_streamed !== undefined && (
              <span>📅 {user.profile.days_streamed} jours</span>
            )}
            {user.profile.total_live_hours !== undefined && (
              <span>🎥 {user.profile.total_live_hours} heures</span>
            )}
          </div>
        )}
      </td>
      <td className="px-4 py-3">
        {canSeePasswords ? (
          editingPassword && editingPassword.userId === user.id ? (
            <div className="flex items-center gap-2">
              <Input
                type="text"
                value={editingPassword.value}
                onChange={(e) =>
                  setEditingPassword?.({ userId: user.id, value: e.target.value })
                }
                className="h-8 w-40"
              />
              <Button
                size="sm"
                variant="ghost"
                onClick={onPasswordSave}
                className="h-8 w-8 p-0"
              >
                <Save className="h-4 w-4 text-green-500" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setEditingPassword?.(null)}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <code className="text-xs">
                {showPasswords[user.id] ? user.password : "•••••••••"}
              </code>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => togglePasswordVisibility(user.id)}
                className="h-7 w-7 p-0"
              >
                {showPasswords[user.id] ? (
                  <EyeOff className="h-3.5 w-3.5" />
                ) : (
                  <Eye className="h-3.5 w-3.5" />
                )}
              </Button>
              {canEditPasswords && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onPasswordEdit?.(user.id)}
                  className="h-7 w-7 p-0"
                >
                  <Edit className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>
          )
        ) : (
          <span className="text-xs text-muted-foreground">•••••••••</span>
        )}
      </td>
      <td className="px-4 py-3 text-right">
        <div className="flex items-center justify-end gap-2">
          {user.role === "creator" && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onViewDetails(user.id)}
              className="h-8"
            >
              <Info className="h-3.5 w-3.5 mr-1" />
              Détails
            </Button>
          )}
          {canDeleteThisUser && (
            <Button
              size="sm"
              variant="destructive"
              onClick={() => onDeleteUser(user.id)}
              className="h-8"
            >
              <Trash className="h-3.5 w-3.5 mr-1" />
              Supprimer
            </Button>
          )}
        </div>
      </td>
    </tr>
  );
};
