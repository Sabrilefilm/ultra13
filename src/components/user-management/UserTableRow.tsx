import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Account } from "@/types/accounts";
import { Check, Edit, Eye, EyeOff, KeyRound, Pen, Shield, Trash, UserRound, Users, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface UserTableRowProps {
  user: Account;
  onDeleteUser: (userId: string) => void;
  onViewDetails: (userId: string) => void;
  onRoleChange: (userId: string, newRole: string, username: string) => void;
  onUsernameEdit: (user: Account) => void;
  onUsernameSave: () => void;
  editingUser: Account | null;
  editedUsername: string;
  setEditedUsername: (username: string) => void;
  showPasswords: { [key: string]: boolean };
  togglePasswordVisibility: (userId: string) => void;
  userRole: string;
  editingPassword: {userId: string, value: string} | null;
  setEditingPassword: (value: {userId: string, value: string} | null) => void;
  onPasswordEdit: (userId: string) => void;
  onPasswordSave: () => void;
  canSeePasswords: boolean;
  canEditPasswords: boolean;
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
  userRole,
  editingPassword,
  setEditingPassword,
  onPasswordEdit,
  onPasswordSave,
  canSeePasswords,
  canEditPasswords
}) => {
  const navigate = useNavigate();
  const isFounder = userRole === 'founder';
  const isManager = userRole === 'manager';
  
  const canChangeRole = (newRole: string) => {
    if (isFounder) return true;
    if (isManager && user.role === 'creator' && (newRole === 'agent' || newRole === 'ambassadeur')) return true;
    return false;
  };

  return (
    <tr className="border-b last:border-b-0 hover:bg-secondary/10">
      <td className="px-4 py-3">
        {editingUser?.id === user.id ? (
          <div className="flex items-center gap-2">
            <Input
              value={editedUsername}
              onChange={(e) => setEditedUsername(e.target.value)}
              className="h-8 bg-background"
            />
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={onUsernameSave}
            >
              <Check className="h-4 w-4 text-green-500" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onUsernameEdit(null as any)}
            >
              <X className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            {user.username}
            {(isFounder || (isManager && user.role === 'creator')) && (
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 opacity-50 hover:opacity-100"
                onClick={() => onUsernameEdit(user)}
              >
                <Edit className="h-3 w-3" />
              </Button>
            )}
          </div>
        )}
      </td>
      <td className="px-4 py-3">
        {(isFounder || (isManager && user.role === 'creator')) ? (
          <select
            value={user.role}
            onChange={(e) => {
              if (canChangeRole(e.target.value)) {
                onRoleChange(user.id, e.target.value, user.username);
              }
            }}
            className="bg-secondary/20 rounded px-2 py-1 text-sm"
            disabled={!canChangeRole('agent')}
          >
            {isFounder && <option value="manager">Manager</option>}
            <option value="creator">Créateur</option>
            <option value="agent">Agent</option>
            <option value="ambassadeur">Ambassadeur</option>
          </select>
        ) : (
          <span className="bg-secondary/20 rounded px-2 py-1 text-sm">
            {user.role}
          </span>
        )}
      </td>
      {canSeePasswords && (
        <td className="px-4 py-3">
          {editingPassword && editingPassword.userId === user.id ? (
            <div className="flex items-center gap-2">
              <Input
                type="text"
                value={editingPassword.value}
                onChange={(e) => setEditingPassword({
                  userId: user.id,
                  value: e.target.value
                })}
                className="h-8 bg-background"
                placeholder="Nouveau mot de passe"
              />
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={onPasswordSave}
              >
                <Check className="h-4 w-4 text-green-500" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setEditingPassword(null)}
              >
                <X className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span>{showPasswords[user.id] ? user.password : '••••••••'}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => togglePasswordVisibility(user.id)}
              >
                {showPasswords[user.id] ? (
                  <EyeOff className="h-3 w-3" />
                ) : (
                  <Eye className="h-3 w-3" />
                )}
              </Button>
              {canEditPasswords && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 opacity-50 hover:opacity-100"
                  onClick={() => onPasswordEdit(user.id)}
                >
                  <KeyRound className="h-3 w-3" />
                </Button>
              )}
            </div>
          )}
        </td>
      )}
      <td className="px-4 py-3">
        {user.role === 'creator' ? (
          <span>Créateur</span>
        ) : user.role === 'agent' ? (
          <span>Agent</span>
        ) : user.role === 'ambassadeur' ? (
          <span>Ambassadeur</span>
        ) : (
          <span>Manager</span>
        )}
      </td>
      <td className="px-4 py-3 text-right">
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onViewDetails(user.id)}
            title="Voir les détails"
          >
            <UserRound className="h-4 w-4" />
          </Button>
          
          {(isFounder || isManager) && user.role === 'creator' && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(`/live-schedule/${user.username}`)}
              title="Configurer les horaires"
            >
              <Shield className="h-4 w-4" />
            </Button>
          )}
          
          {(isFounder || (isManager && user.role !== 'manager')) && (
            <Button
              variant="ghost"
              size="icon"
              className="text-red-500 hover:text-red-700"
              onClick={() => onDeleteUser(user.id)}
              title="Supprimer"
            >
              <Trash className="h-4 w-4" />
            </Button>
          )}
          
          {(isFounder || isManager) && (user.role === 'agent' || user.role === 'ambassadeur') && (
            <Button
              variant="outline"
              size="sm"
              className="ml-2"
              onClick={() => navigate(`/agency-members/${user.id}`)}
            >
              <Users className="h-4 w-4 mr-1" />
              Membres de l'agence
            </Button>
          )}
          
          {(isFounder || isManager || userRole === 'agent') && (user.role === 'creator') && (
            <Button
              variant="outline"
              size="sm"
              className="ml-2"
              onClick={() => navigate(`/creator-stats`)}
            >
              <Pen className="h-4 w-4 mr-1" />
              Mes créateurs
            </Button>
          )}
        </div>
      </td>
    </tr>
  );
};
