
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

interface PendingRoleChange {
  userId: string;
  newRole: string;
  username: string;
  currentRole?: string;
}

export const useUserRoles = (refetch: () => void) => {
  const { toast } = useToast();
  const [showRoleConfirmDialog, setShowRoleConfirmDialog] = useState(false);
  const [pendingRoleChange, setPendingRoleChange] = useState<PendingRoleChange | null>(null);

  const handleDeleteUser = async (userId: string) => {
    try {
      const { error } = await supabase
        .from("user_accounts")
        .delete()
        .eq("id", userId);

      if (error) {
        toast({
          variant: "destructive",
          title: "Erreur!",
          description: "Impossible de supprimer l'utilisateur.",
        });
        return;
      }

      toast({
        title: "Succès!",
        description: "Utilisateur supprimé avec succès.",
      });
      refetch();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur!",
        description: "Une erreur s'est produite lors de la suppression de l'utilisateur.",
      });
    }
  };

  const handleRoleChangeConfirm = async () => {
    if (!pendingRoleChange) return;

    try {
      const { userId, newRole, currentRole } = pendingRoleChange;
      
      // Vérifier que le rôle est valide
      if (!["founder", "manager", "agent", "creator", "ambassadeur"].includes(newRole)) {
        toast({
          variant: "destructive",
          title: "Erreur!",
          description: `Le rôle '${newRole}' n'est pas valide.`,
        });
        return;
      }
      
      // Mettre à jour le rôle de l'utilisateur sans utiliser de colonne manager_id
      const { error } = await supabase
        .from("user_accounts")
        .update({ role: newRole })
        .eq("id", userId);

      if (error) {
        console.error("Role change error:", error);
        toast({
          variant: "destructive",
          title: "Erreur!",
          description: `Impossible de modifier le rôle de l'utilisateur: ${error.message}`,
        });
        return;
      }

      toast({
        title: "Succès!",
        description: "Rôle de l'utilisateur modifié avec succès.",
      });
      setShowRoleConfirmDialog(false);
      setPendingRoleChange(null);
      refetch();
    } catch (error) {
      console.error("Error in role change:", error);
      toast({
        variant: "destructive",
        title: "Erreur!",
        description: "Une erreur s'est produite lors de la modification du rôle de l'utilisateur.",
      });
    }
  };

  const handleRoleChange = (userId: string, newRole: string, username: string, currentRole?: string) => {
    setPendingRoleChange({ userId, newRole, username, currentRole });
    setShowRoleConfirmDialog(true);
  };

  return {
    showRoleConfirmDialog,
    setShowRoleConfirmDialog,
    pendingRoleChange,
    setPendingRoleChange,
    handleDeleteUser,
    handleRoleChangeConfirm,
    handleRoleChange,
  };
};
