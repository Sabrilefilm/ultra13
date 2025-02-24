
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Info, UserCog, Check, X } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Account } from "@/types/accounts";
import { CreatorDetailsDialog } from "@/components/creator/CreatorDetailsDialog";
import { useIndexAuth } from "@/hooks/use-index-auth";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

const UserManagement = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { role } = useIndexAuth();
  const [showPasswords, setShowPasswords] = React.useState<{[key: string]: boolean}>({});
  const [selectedUser, setSelectedUser] = React.useState<string | null>(null);
  const [creatorDetails, setCreatorDetails] = React.useState(null);
  const [editingUser, setEditingUser] = React.useState<Account | null>(null);
  const [editedUsername, setEditedUsername] = React.useState("");
  const [showRoleConfirmDialog, setShowRoleConfirmDialog] = React.useState(false);
  const [pendingRoleChange, setPendingRoleChange] = React.useState<{userId: string; newRole: string; username: string} | null>(null);

  const { data: users, isLoading, refetch } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_accounts")
        .select("*")
        .order("role", { ascending: true });

      if (error) throw error;
      return data as Account[];
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

  const togglePasswordVisibility = (id: string) => {
    setShowPasswords(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/10 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
            className="h-10 w-10"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Gestion des Utilisateurs</h1>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        ) : (
          <div className="bg-card rounded-lg border border-border/50 shadow-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom d'utilisateur</TableHead>
                  <TableHead>Rôle</TableHead>
                  <TableHead>Mot de passe</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users?.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      {editingUser?.id === user.id ? (
                        <div className="flex items-center gap-2">
                          <Input
                            value={editedUsername}
                            onChange={(e) => setEditedUsername(e.target.value)}
                            className="max-w-[200px]"
                          />
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={handleUsernameSave}
                            disabled={!editedUsername.trim() || editedUsername === user.username}
                          >
                            <Check className="h-4 w-4 text-green-500" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => setEditingUser(null)}
                          >
                            <X className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span>{user.username}</span>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleUsernameEdit(user)}
                          >
                            <UserCog className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <Select
                        defaultValue={user.role}
                        onValueChange={(value) => handleRoleChange(user.id, value, user.username)}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="creator">Créateur</SelectItem>
                          <SelectItem value="manager">Manager</SelectItem>
                          <SelectItem value="agent">Agent</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-mono">
                          {showPasswords[user.id] ? user.password : "••••••••"}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => togglePasswordVisibility(user.id)}
                        >
                          {showPasswords[user.id] ? "Masquer" : "Afficher"}
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {user.role === "creator" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewDetails(user.id)}
                          >
                            <Info className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteUser(user.id, user.username)}
                        >
                          Supprimer
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        <CreatorDetailsDialog
          isOpen={!!selectedUser}
          onClose={() => setSelectedUser(null)}
          creatorDetails={creatorDetails}
          isFounder={role === 'founder'}
        />

        <Dialog open={showRoleConfirmDialog} onOpenChange={setShowRoleConfirmDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmer le changement de rôle</DialogTitle>
              <DialogDescription>
                Êtes-vous sûr de vouloir changer le rôle de {pendingRoleChange?.username} en {pendingRoleChange?.newRole} ?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setShowRoleConfirmDialog(false);
                  setPendingRoleChange(null);
                }}
              >
                Annuler
              </Button>
              <Button onClick={handleRoleChangeConfirm}>
                Confirmer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default UserManagement;
