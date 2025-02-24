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
import { UserSearchBar } from "@/components/UserSearchBar";
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
  const [searchQuery, setSearchQuery] = React.useState("");
  const [showRoleConfirmDialog, setShowRoleConfirmDialog] = React.useState(false);
  const [pendingRoleChange, setPendingRoleChange] = React.useState<{userId: string; newRole: string; username: string} | null>(null);

  const { data: users, isLoading } = useQuery({
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

  const filteredUsers = React.useMemo(() => {
    if (!users) return [];
    return users.filter(user => 
      user.username.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [users, searchQuery]);

  const groupedUsers = React.useMemo(() => {
    const groups = {
      manager: [] as typeof filteredUsers,
      creator: [] as typeof filteredUsers,
      agent: [] as typeof filteredUsers,
    };

    filteredUsers.forEach(user => {
      if (user.role in groups) {
        groups[user.role as keyof typeof groups].push(user);
      }
    });

    return groups;
  }, [filteredUsers]);

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

        <div className="w-full max-w-sm mx-auto mb-6">
          <UserSearchBar onSearch={setSearchQuery} />
        </div>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Managers */}
            <div className="bg-card rounded-lg border border-border/50 shadow-lg overflow-hidden">
              <div className="p-4 border-b border-border/50">
                <h2 className="text-lg font-semibold">Managers</h2>
              </div>
              <div className="divide-y divide-border/50">
                {groupedUsers.manager.map((user) => (
                  <UserRow 
                    key={user.id} 
                    user={user} 
                    onRoleChange={handleRoleChange}
                    onDelete={handleDeleteUser}
                    showPassword={showPasswords[user.id]}
                    onTogglePassword={() => togglePasswordVisibility(user.id)}
                    onViewDetails={handleViewDetails}
                    onEdit={handleUsernameEdit}
                    isEditing={editingUser?.id === user.id}
                    editedUsername={editedUsername}
                    onEditChange={setEditedUsername}
                    onSave={handleUsernameSave}
                    onCancel={() => setEditingUser(null)}
                  />
                ))}
              </div>
            </div>

            {/* Creators */}
            <div className="bg-card rounded-lg border border-border/50 shadow-lg overflow-hidden">
              <div className="p-4 border-b border-border/50">
                <h2 className="text-lg font-semibold">Créateurs</h2>
              </div>
              <div className="divide-y divide-border/50">
                {groupedUsers.creator.map((user) => (
                  <UserRow 
                    key={user.id} 
                    user={user}
                    onRoleChange={handleRoleChange}
                    onDelete={handleDeleteUser}
                    showPassword={showPasswords[user.id]}
                    onTogglePassword={() => togglePasswordVisibility(user.id)}
                    onViewDetails={handleViewDetails}
                    onEdit={handleUsernameEdit}
                    isEditing={editingUser?.id === user.id}
                    editedUsername={editedUsername}
                    onEditChange={setEditedUsername}
                    onSave={handleUsernameSave}
                    onCancel={() => setEditingUser(null)}
                    showStats
                  />
                ))}
              </div>
            </div>

            {/* Agents */}
            <div className="bg-card rounded-lg border border-border/50 shadow-lg overflow-hidden">
              <div className="p-4 border-b border-border/50">
                <h2 className="text-lg font-semibold">Agents</h2>
              </div>
              <div className="divide-y divide-border/50">
                {groupedUsers.agent.map((user) => (
                  <UserRow 
                    key={user.id} 
                    user={user}
                    onRoleChange={handleRoleChange}
                    onDelete={handleDeleteUser}
                    showPassword={showPasswords[user.id]}
                    onTogglePassword={() => togglePasswordVisibility(user.id)}
                    onViewDetails={handleViewDetails}
                    onEdit={handleUsernameEdit}
                    isEditing={editingUser?.id === user.id}
                    editedUsername={editedUsername}
                    onEditChange={setEditedUsername}
                    onSave={handleUsernameSave}
                    onCancel={() => setEditingUser(null)}
                  />
                ))}
              </div>
            </div>
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

interface UserRowProps {
  user: Account & { live_schedules?: { hours: number; days: number }[] };
  onRoleChange: (userId: string, newRole: string, username: string) => void;
  onDelete: (id: string, username: string) => void;
  showPassword: boolean;
  onTogglePassword: () => void;
  onViewDetails: (userId: string) => void;
  onEdit: (user: Account) => void;
  isEditing: boolean;
  editedUsername: string;
  onEditChange: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
  showStats?: boolean;
}

const UserRow = ({
  user,
  onRoleChange,
  onDelete,
  showPassword,
  onTogglePassword,
  onViewDetails,
  onEdit,
  isEditing,
  editedUsername,
  onEditChange,
  onSave,
  onCancel,
  showStats,
}: UserRowProps) => {
  return (
    <div className="p-4 space-y-3">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1 flex-1">
          {isEditing ? (
            <div className="flex items-center gap-2">
              <Input
                value={editedUsername}
                onChange={(e) => onEditChange(e.target.value)}
                className="max-w-[200px]"
              />
              <Button
                size="icon"
                variant="ghost"
                onClick={onSave}
                disabled={!editedUsername.trim() || editedUsername === user.username}
              >
                <Check className="h-4 w-4 text-green-500" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={onCancel}
              >
                <X className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="font-medium">{user.username}</span>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => onEdit(user)}
              >
                <UserCog className="h-4 w-4" />
              </Button>
            </div>
          )}
          {showStats && user.live_schedules && user.live_schedules[0] && (
            <div className="text-sm text-muted-foreground">
              <p>Heures de live : {user.live_schedules[0].hours}h</p>
              <p>Jours streamés : {user.live_schedules[0].days}j</p>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Select
            value={user.role}
            onValueChange={(value) => onRoleChange(user.id, value, user.username)}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="creator">Créateur</SelectItem>
              <SelectItem value="manager">Manager</SelectItem>
              <SelectItem value="agent">Agent</SelectItem>
            </SelectContent>
          </Select>
          {user.role === "creator" && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewDetails(user.id)}
            >
              <Info className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm">
            {showPassword ? user.password : "••••••••"}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={onTogglePassword}
          >
            {showPassword ? "Masquer" : "Afficher"}
          </Button>
        </div>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onDelete(user.id, user.username)}
        >
          Supprimer
        </Button>
      </div>
    </div>
  );
};

export default UserManagement;
