
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Account } from "@/types/accounts";
import { UserTableRow } from "./UserTableRow";
import { UserTableHeader } from "./UserTableHeader";
import { useUserPermissions } from "@/hooks/user-management/use-user-permissions";

interface UserTableProps {
  users: Account[];
  title: string;
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
  userRole?: string;
  editingPassword?: {userId: string, value: string} | null;
  setEditingPassword?: (value: {userId: string, value: string} | null) => void;
  onPasswordEdit?: (userId: string) => void;
  onPasswordSave?: () => void;
}

export const UserTable: React.FC<UserTableProps> = ({
  users,
  title,
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
  onPasswordSave
}) => {
  const permissions = useUserPermissions(userRole);
  const canSeePasswords = permissions.canSeePasswords;
  const canEditPasswords = permissions.canEditPasswords;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <UserTableHeader canSeePasswords={canSeePasswords} userRole={userRole} />
            <tbody>
              {users.map((user) => (
                <UserTableRow
                  key={user.id}
                  user={user}
                  onDeleteUser={onDeleteUser}
                  onViewDetails={onViewDetails}
                  onRoleChange={onRoleChange}
                  onUsernameEdit={onUsernameEdit}
                  onUsernameSave={onUsernameSave}
                  editingUser={editingUser}
                  editedUsername={editedUsername}
                  setEditedUsername={setEditedUsername}
                  showPasswords={showPasswords}
                  togglePasswordVisibility={togglePasswordVisibility}
                  userRole={userRole}
                  editingPassword={editingPassword || null}
                  setEditingPassword={setEditingPassword || (() => {})}
                  onPasswordEdit={onPasswordEdit || (() => {})}
                  onPasswordSave={onPasswordSave || (() => {})}
                  canSeePasswords={canSeePasswords}
                  canEditPasswords={canEditPasswords}
                />
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};
