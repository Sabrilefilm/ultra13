
import { useMemo } from "react";

export const useUserPermissions = (userRole: string) => {
  return useMemo(() => {
    const isFounder = userRole === 'founder';
    const isManager = userRole === 'manager';
    const isAgent = userRole === 'agent';
    
    // Seul le fondateur peut voir et modifier les mots de passe
    const canSeePasswords = isFounder;
    
    // Définit qui peut modifier les rôles et sous quelles conditions
    const canChangeRole = (userToChange: { role: string }, newRole: string): boolean => {
      if (isFounder) return true;
      if (isManager && userToChange.role === 'creator' && (newRole === 'agent' || newRole === 'ambassadeur')) return true;
      return false;
    };
    
    // Détermine qui peut modifier les noms d'utilisateur
    const canEditUsername = (userToEdit: { role: string }): boolean => {
      return isFounder || (isManager && userToEdit.role === 'creator');
    };
    
    // Détermine qui peut supprimer des utilisateurs
    const canDeleteUser = (userToDelete: { role: string }): boolean => {
      return isFounder || (isManager && userToDelete.role !== 'manager');
    };
    
    return {
      isFounder,
      isManager,
      isAgent,
      canSeePasswords,
      canChangeRole,
      canEditUsername,
      canDeleteUser,
    };
  }, [userRole]);
};
