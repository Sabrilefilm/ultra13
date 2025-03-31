
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Account } from "@/types/accounts";
import { UserTableRow } from "./UserTableRow";
import { UserTableHeader } from "./UserTableHeader";
import { useUserPermissions } from "@/hooks/user-management/use-user-permissions";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  
  const handleExportUsers = () => {
    // Create CSV data
    let csvContent = "data:text/csv;charset=utf-8,";
    // Headers
    csvContent += "Username,Role,Email,Hours,Days\n";
    
    // Data rows
    users.forEach(user => {
      const hours = user.live_schedules && user.live_schedules[0] ? user.live_schedules[0].hours : 0;
      const days = user.live_schedules && user.live_schedules[0] ? user.live_schedules[0].days : 0;
      
      csvContent += `${user.username},${user.role},${user.email || ''},${hours},${days}\n`;
    });
    
    // Create download link
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${title.replace(/[^\w\s]/gi, '')}_export.csv`);
    document.body.appendChild(link);
    
    // Download
    link.click();
    
    // Cleanup
    document.body.removeChild(link);
  };

  return (
    <Card className="bg-slate-800/90 backdrop-blur-sm border-slate-700/50 shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between bg-slate-800/90 border-b border-slate-700/50">
        <CardTitle className="text-white">
          {title} ({users.length})
        </CardTitle>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleExportUsers}
          className="bg-green-900/20 border-green-700/30 hover:bg-green-800/30 text-white"
        >
          <Download className="h-4 w-4 mr-2" />
          Exporter
        </Button>
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
