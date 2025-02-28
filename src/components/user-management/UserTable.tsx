
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UserRow } from "./UserRow";
import { Account } from "@/types/accounts";

interface UserTableProps {
  users: (Account & { live_schedules: { hours: number; days: number }[] })[];
  title: string;
  onDeleteUser: (id: string, username: string) => void;
  onViewDetails: (userId: string) => void;
  onRoleChange: (userId: string, newRole: string, username: string) => void;
  onUsernameEdit: (user: Account) => void;
  onUsernameSave: () => void;
  editingUser: Account | null;
  editedUsername: string;
  setEditedUsername: (username: string) => void;
  showPasswords: {[key: string]: boolean};
  togglePasswordVisibility: (id: string) => void;
  userRole?: string; // Added prop for current user role
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
  userRole,
}) => {
  const isManager = userRole === 'manager';

  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      <div className="rounded-lg border bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">Utilisateur</TableHead>
              <TableHead>Rôle</TableHead>
              {isManager && <TableHead>Affiliation</TableHead>}
              <TableHead>Statistiques</TableHead>
              <TableHead>Mot de passe</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <UserRow
                key={user.id}
                user={user}
                editingUser={editingUser}
                editedUsername={editedUsername}
                setEditedUsername={setEditedUsername}
                onUsernameSave={onUsernameSave}
                onUsernameEdit={onUsernameEdit}
                onRoleChange={onRoleChange}
                onDeleteUser={onDeleteUser}
                onViewDetails={onViewDetails}
                showPasswords={showPasswords}
                togglePasswordVisibility={togglePasswordVisibility}
                isManager={isManager}
              />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
