
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Account } from "@/types/accounts";
import { UserTableRow } from "./UserTableRow";
import { UserTableHeader } from "./UserTableHeader";

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
  // Seul le fondateur peut voir et modifier les mots de passe
  const isFounder = userRole === 'founder';
  const canSeePasswords = isFounder;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <UserTableHeader canSeePasswords={canSeePasswords} />
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
                />
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};
