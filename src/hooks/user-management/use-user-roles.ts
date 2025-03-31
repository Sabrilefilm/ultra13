
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
      
      // Get user's current manager ID (if user is being changed by a manager)
      const userInfo = await supabase
        .from("user_accounts")
        .select("manager_id")
        .eq("id", userId)
        .single();
      
      const currentManagerId = userInfo.data?.manager_id;
      
      // Get the current logged-in user
      const currentUser = JSON.parse(localStorage.getItem("userInfo") || "{}");
      const currentUserId = currentUser.id;
      const currentUserRole = currentUser.role;
      
      // Set up update data
      const updateData: Record<string, any> = { role: newRole };
      
      // Logic for automatically adding to manager's team when changing roles
      if (currentUserRole === 'manager' && ['creator', 'agent', 'ambassadeur'].includes(newRole)) {
        // If a manager is changing someone's role, add that user to their team
        updateData.manager_id = currentUserId;
      }
      
      // Special case: if changing FROM manager TO another role, and this was done by a founder
      if (currentRole === 'manager' && newRole !== 'manager' && currentUserRole === 'founder') {
        // Clear any team assignments this manager had
        await supabase
          .from("user_accounts")
          .update({ manager_id: null })
          .eq("manager_id", userId);
      }
      
      // If changing to manager role, clear their own manager
      if (newRole === 'manager') {
        updateData.manager_id = null;
      }
      
      // Make the role change
      const { error } = await supabase
        .from("user_accounts")
        .update(updateData)
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
