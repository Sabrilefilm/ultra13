
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Eye, EyeOff, Save, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

interface UserAccount {
  id: string;
  username: string;
  password: string;
  role: string;
  created_at: string;
}

interface PasswordDialogProps {
  isOpen: boolean;
  onClose: () => void;
  account: UserAccount;
  onSave: (newPassword: string) => Promise<void>;
}

const PasswordDialog = ({ isOpen, onClose, account, onSave }: PasswordDialogProps) => {
  const [newPassword, setNewPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(newPassword);
    setNewPassword("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifier le mot de passe pour {account.username}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="newPassword">Nouveau mot de passe</Label>
            <Input
              id="newPassword"
              type="text"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Entrez le nouveau mot de passe"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit">
              <Save className="w-4 h-4 mr-2" />
              Enregistrer
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default function Accounts() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedAccount, setSelectedAccount] = useState<UserAccount | null>(null);
  const [accountToDelete, setAccountToDelete] = useState<UserAccount | null>(null);
  const [passwordVisibility, setPasswordVisibility] = useState<Record<string, boolean>>({});

  const { data: accounts, isLoading, error, refetch } = useQuery({
    queryKey: ['accounts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_accounts')
        .select('*');
      
      if (error) throw error;
      return data as UserAccount[];
    }
  });

  const togglePasswordVisibility = (accountId: string) => {
    setPasswordVisibility(prev => ({
      ...prev,
      [accountId]: !prev[accountId]
    }));
  };

  const updatePassword = async (newPassword: string) => {
    if (!selectedAccount) return;

    const { error } = await supabase
      .from('user_accounts')
      .update({ password: newPassword })
      .eq('id', selectedAccount.id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour le mot de passe"
      });
    } else {
      toast({
        title: "Succès",
        description: "Mot de passe mis à jour avec succès"
      });
      refetch();
    }
  };

  const deleteAccount = async () => {
    if (!accountToDelete) return;

    const { error } = await supabase
      .from('user_accounts')
      .delete()
      .eq('id', accountToDelete.id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer le compte"
      });
    } else {
      toast({
        title: "Succès",
        description: "Compte supprimé avec succès"
      });
      refetch();
    }
    setAccountToDelete(null);
  };

  if (isLoading) return <div className="p-8">Chargement...</div>;
  if (error) return <div className="p-8 text-red-500">Une erreur est survenue</div>;

  return (
    <div className="p-8">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour
        </Button>
        <h1 className="text-2xl font-bold">Liste des comptes utilisateurs</h1>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Identifiant</TableHead>
              <TableHead>Mot de passe</TableHead>
              <TableHead>Rôle</TableHead>
              <TableHead>Date de création</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {accounts?.map((account) => (
              <TableRow key={account.id}>
                <TableCell>{account.username}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="font-mono">
                      {passwordVisibility[account.id] ? account.password : '••••••••'}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => togglePasswordVisibility(account.id)}
                    >
                      {passwordVisibility[account.id] ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedAccount(account)}
                    >
                      Modifier
                    </Button>
                  </div>
                </TableCell>
                <TableCell>{account.role}</TableCell>
                <TableCell>{new Date(account.created_at).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setAccountToDelete(account)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {selectedAccount && (
        <PasswordDialog
          isOpen={!!selectedAccount}
          onClose={() => setSelectedAccount(null)}
          account={selectedAccount}
          onSave={updatePassword}
        />
      )}

      <AlertDialog open={!!accountToDelete} onOpenChange={() => setAccountToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer ce compte ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Le compte sera définitivement supprimé.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={deleteAccount} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
