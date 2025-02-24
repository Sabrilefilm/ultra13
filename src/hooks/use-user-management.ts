
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Account } from "@/types/accounts";
import { useQuery } from "@tanstack/react-query";

export const useUserManagement = () => {
  const { toast } = useToast();
  const [showPasswords, setShowPasswords] = useState<{[key: string]: boolean}>({});
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [creatorDetails, setCreatorDetails] = useState(null);
  const [editingUser, setEditingUser] = useState<Account | null>(null);
  const [editedUsername, setEditedUsername] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showRoleConfirmDialog, setShowRoleConfirmDialog] = useState(false);
  const [pendingRoleChange, setPendingRoleChange] = useState<{
    userId: string;
    newRole: string;
    username: string;
  } | null>(null);

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

  const handleDeleteUser = async (id: string, username: string) => {
    try {
      const { error } = await supabase
        .from("user_accounts")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Compte supprimé",
        description: `Le compte ${username} a été supprimé avec succès`,
      });
      
      refetch();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le compte",
        variant: "destructive",
      });
    }
  };

  const handleRoleChangeConfirm = async () => {
    if (!pendingRoleChange) return;
    
    try {
      const { error } = await supabase
        .from("user_accounts")
        .update({ role: pendingRoleChange.newRole })
        .eq("id", pendingRoleChange.userId);

      if (error) throw error;

      toast({
        title: "Rôle modifié",
        description: `Le rôle de ${pendingRoleChange.username} a été changé en ${pendingRoleChange.newRole}`,
        duration: 3000,
      });
      
      setShowRoleConfirmDialog(false);
      setPendingRoleChange(null);
      refetch();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de modifier le rôle",
        variant: "destructive",
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

  const handleUsernameSave = async () => {
    if (!editingUser || !editedUsername.trim()) return;

    try {
      const { error } = await supabase
        .from("user_accounts")
        .update({ username: editedUsername.trim() })
        .eq("id", editingUser.id);

      if (error) throw error;

      toast({
        title: "Nom d'utilisateur modifié",
        description: `Le nom d'utilisateur a été changé en ${editedUsername.trim()}`,
      });
      
      setEditingUser(null);
      refetch();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de modifier le nom d'utilisateur",
        variant: "destructive",
      });
    }
  };

  const handleViewDetails = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("creator_profiles")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (error && error.code !== "PGRST116") throw error;
      
      setCreatorDetails(data);
      setSelectedUser(userId);
    } catch (error) {
      console.error("Error fetching creator details:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les détails du créateur",
        variant: "destructive",
      });
    }
  };

  const togglePasswordVisibility = (id: string) => {
    setShowPasswords(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const filteredUsers = users?.filter(user => 
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  ) ?? [];

  const groupedUsers = {
    manager: filteredUsers.filter(user => user.role === "manager"),
    creator: filteredUsers.filter(user => user.role === "creator"),
    agent: filteredUsers.filter(user => user.role === "agent"),
  };

  return {
    users: groupedUsers,
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
    showPasswords,
    handleDeleteUser,
    handleRoleChangeConfirm,
    handleRoleChange,
    handleUsernameEdit,
    handleUsernameSave,
    handleViewDetails,
    togglePasswordVisibility,
  };
};
