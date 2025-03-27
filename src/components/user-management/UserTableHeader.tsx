
import React from "react";

interface UserTableHeaderProps {
  canSeePasswords: boolean;
}

export const UserTableHeader: React.FC<UserTableHeaderProps> = ({ canSeePasswords }) => {
  return (
    <thead>
      <tr className="border-b">
        <th className="px-4 py-2 text-left">Nom d'utilisateur</th>
        <th className="px-4 py-2 text-left">Rôle</th>
        {canSeePasswords && <th className="px-4 py-2 text-left">Mot de passe</th>}
        <th className="px-4 py-2 text-left">Affiliation</th>
        <th className="px-4 py-2 text-right">Actions</th>
      </tr>
    </thead>
  );
};
