
import { useMemo } from "react";

export const useUserPermissions = (userRole: string) => {
  return useMemo(() => {
    const isFounder = userRole === 'founder';
    const isManager = userRole === 'manager';
    const isAgent = userRole === 'agent';
    const isCreator = userRole === 'creator';
    const isAmbassadeur = userRole === 'ambassadeur';
    
    // Seul le fondateur peut voir et modifier les mots de passe
    const canSeePasswords = isFounder;
    const canEditPasswords = isFounder;
    
    // Définit qui peut modifier les rôles et sous quelles conditions
    const canChangeRole = (userToChange: { role: string }, newRole: string): boolean => {
      if (isFounder) return true; // Founder can change to any role
      
      // Managers can change users to 'agent', 'creator', or 'ambassadeur' roles
      if (isManager && (newRole === 'agent' || newRole === 'creator' || newRole === 'ambassadeur')) {
        return true;
      }
      
      return false;
    };
    
    // Détermine qui peut modifier les noms d'utilisateur - now only founders can edit usernames
    const canEditUsername = (userToEdit: { role: string }): boolean => {
      return isFounder;
    };
    
    // Détermine qui peut supprimer des utilisateurs
    const canDeleteUser = (userToDelete: { role: string }): boolean => {
      return isFounder || (isManager && userToDelete.role !== 'manager' && userToDelete.role !== 'founder');
    };
    
    // Détermine qui peut voir les détails de performance
    const canSeeDetailedPerformance = isFounder || isManager || isCreator;
    
    // Détermine qui peut voir le résumé de performance
    const canSeeSummaryPerformance = isFounder || isManager || isAgent;
    
    return {
      isFounder,
      isManager,
      isAgent,
      isCreator,
      isAmbassadeur,
      canSeePasswords,
      canEditPasswords,
      canChangeRole,
      canEditUsername,
      canDeleteUser,
      canSeeDetailedPerformance,
      canSeeSummaryPerformance
    };
  }, [userRole]);
};
