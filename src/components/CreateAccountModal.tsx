
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CreateAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (role: 'creator' | 'manager', username: string) => Promise<void>;
}

export function CreateAccountModal({ isOpen, onClose, onSubmit }: CreateAccountModalProps) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<'creator' | 'manager'>('creator');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!username || !email) return;
    setIsLoading(true);
    try {
      await onSubmit(role, username);
      setUsername("");
      setEmail("");
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Créer un nouveau compte</DialogTitle>
          <DialogDescription>
            Remplissez les informations pour créer un nouveau compte utilisateur.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="role">Rôle</Label>
            <Select
              value={role}
              onValueChange={(value: 'creator' | 'manager') => setRole(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez un rôle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="creator">Créateur</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="username">Nom d'utilisateur</Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Entrez le nom d'utilisateur"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Entrez l'adresse email"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button onClick={handleSubmit} disabled={!username || !email || isLoading}>
            {isLoading ? "Création..." : "Créer le compte"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
