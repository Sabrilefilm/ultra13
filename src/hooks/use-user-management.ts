import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Account } from "@/types/accounts";
import { useQuery } from "@tanstack/react-query";

interface PendingRoleChange {
  userId: string;
  newRole: string;
  username: string;
}

export const useUserManagement = () => {
  const { toast } = useToast();
  const [showPasswords, setShowPasswords] = useState<{[key: string]: boolean}>({});
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [creatorDetails, setCreatorDetails] = useState(null);
  const [editingUser, setEditingUser] = useState<Account | null>(null);
  const [editedUsername, setEditedUsername] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showRoleConfirmDialog, setShowRoleConfirmDialog] = useState(false);
  const [pendingRoleChange, setPendingRoleChange] = useState<PendingRoleChange | null>(null);

  const { data: users, isLoading, refetch } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_accounts")
        .select(`
          *,
          live_schedules (
            hours,
            days
          )
        `)
        .order("role", { ascending: true });

      if (error) throw error;
      return data as (Account & { live_schedules: { hours: number; days: number }[] })[];
    },
  });

  const filteredUsers = users
    ?.filter(user => {
      if (!searchQuery) return true;
      const search = searchQuery.toLowerCase();
      return (
        user.username.toLowerCase().includes(search) ||
        (user.email && user.email.toLowerCase().includes(search))
      );
    }) || [];

  const handleCreateAccount = async (role: 'creator' | 'manager' | 'agent', username: string, password: string) => {
    try {
      const email = `${username.toLowerCase().replace(/\s+/g, '.')}_${Date.now()}@phoceen.agency`;
      
      const { data, error } = await supabase
        .from("user_accounts")
        .insert([
          { username, password, role, email }
        ])
        .select();

      if (error) {
        toast({
          variant: "destructive",
          title: "Erreur!",
          description: "Impossible de créer le compte: " + error.message,
        });
        return;
      }

      toast({
        title: "Succès!",
        description: `Le compte ${username} a été créé avec succès.`,
      });
      
      refetch();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur!",
        description: "Une erreur s'est produite lors de la création du compte.",
      });
    }
  };

  const handleDeleteUser = async (userId: string, username: string) => {
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
      const { userId, newRole } = pendingRoleChange;
      const { error } = await supabase
        .from("user_accounts")
        .update({ role: newRole })
        .eq("id", userId);

      if (error) {
        toast({
          variant: "destructive",
          title: "Erreur!",
          description: "Impossible de modifier le rôle de l'utilisateur.",
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
      toast({
        variant: "destructive",
        title: "Erreur!",
        description: "Une erreur s'est produite lors de la modification du rôle de l'utilisateur.",
      });
    }
  };

  const handleRoleChange = (userId: string, newRole: string, username: string) => {
    setPendingRoleChange({ userId, newRole, username });
    setShowRoleConfirmDialog(true);
  };

  const handleUsernameEdit = (user: Account) => {
    setEditingUser(user);
    setEditedUsername(user.username);
  };

  const handleUsernameSave = async (userId: string) => {
    if (!editingUser) return;

    try {
      const { error } = await supabase
        .from("user_accounts")
        .update({ username: editedUsername })
        .eq("id", userId);

      if (error) {
        toast({
          variant: "destructive",
          title: "Erreur!",
          description: "Impossible de modifier le nom d'utilisateur.",
        });
        return;
      }

      toast({
        title: "Succès!",
        description: "Nom d'utilisateur modifié avec succès.",
      });
      setEditingUser(null);
      setEditedUsername("");
      refetch();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur!",
        description: "Une erreur s'est produite lors de la modification du nom d'utilisateur.",
      });
    }
  };

  const handleViewDetails = async (userId: string) => {
    setSelectedUser(userId);
    try {
      const { data, error } = await supabase
        .from("user_accounts")
        .select(`*, live_schedules (*)`)
        .eq("id", userId)
        .single();

      if (error) {
        toast({
          variant: "destructive",
          title: "Erreur!",
          description: "Impossible de récupérer les détails de l'utilisateur.",
        });
        return;
      }

      setCreatorDetails(data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur!",
        description: "Une erreur s'est produite lors de la récupération des détails de l'utilisateur.",
      });
    }
  };

  const togglePasswordVisibility = (userId: string) => {
    setShowPasswords(prevState => ({
      ...prevState,
      [userId]: !prevState[userId],
    }));
  };

  return {
    users: {
      manager: filteredUsers.filter(user => user.role === "manager"),
      creator: filteredUsers.filter(user => user.role === "creator"),
      agent: filteredUsers.filter(user => user.role === "agent"),
    },
    isLoading,
    selectedUser,
    setSelectedUser,
    creatorDetails,
    editingUser,
    editedUsername,
    setEditedUsername,
    searchQuery,
    setSearchQuery,
    showRoleConfirmDialog,
    setShowRoleConfirmDialog,
    pendingRoleChange,
    setPendingRoleChange,
    showPasswords,
    handleDeleteUser,
    handleRoleChangeConfirm,
    handleRoleChange,
    handleUsernameEdit,
    handleUsernameSave,
    handleViewDetails,
    togglePasswordVisibility,
    handleCreateAccount,
  };
};
