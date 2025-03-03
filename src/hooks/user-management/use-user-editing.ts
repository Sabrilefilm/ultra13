
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Account } from "@/types/accounts";

export const useUserEditing = (refetch: () => void) => {
  const { toast } = useToast();
  const [editingUser, setEditingUser] = useState<Account | null>(null);
  const [editedUsername, setEditedUsername] = useState("");
  const [showPasswords, setShowPasswords] = useState<{[key: string]: boolean}>({});

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

  const togglePasswordVisibility = (userId: string) => {
    setShowPasswords(prevState => ({
      ...prevState,
      [userId]: !prevState[userId],
    }));
  };

  return {
    editingUser,
    setEditingUser,
    editedUsername, 
    setEditedUsername,
    showPasswords,
    handleUsernameEdit,
    handleUsernameSave,
    togglePasswordVisibility
  };
};
