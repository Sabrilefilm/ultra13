
import React from "react";
import { useUserPermissions } from "@/hooks/user-management/use-user-permissions";

interface UserTableHeaderProps {
  canSeePasswords: boolean;
  userRole: string;
}

export const UserTableHeader: React.FC<UserTableHeaderProps> = ({ 
  canSeePasswords,
  userRole 
}) => {
  const permissions = useUserPermissions(userRole);
  
  return (
    <thead>
      <tr className="border-b">
        <th className="px-4 py-2 text-left">Nom d'utilisateur</th>
        <th className="px-4 py-2 text-left">Rôle</th>
        {canSeePasswords && <th className="px-4 py-2 text-left">Mot de passe</th>}
        <th className="px-4 py-2 text-left">Affiliation</th>
        {permissions.canSeeDetailedPerformance && (
          <th className="px-4 py-2 text-left">Performance</th>
        )}
        <th className="px-4 py-2 text-right">Actions</th>
      </tr>
    </thead>
  );
};
