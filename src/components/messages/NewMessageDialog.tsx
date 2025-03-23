
import { useState, useMemo, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, MessageSquare, Info } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";

interface User {
  id: string;
  username: string;
  role: string;
  avatar_url?: string;
}

interface NewMessageDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedUser: string;
  onUserChange: (userId: string) => void;
  onStartConversation: () => void;
  allUsers: User[] | undefined;
  loadingUsers: boolean;
  currentUserRole: string;
  currentUserId: string;
}

export const NewMessageDialog = ({
  isOpen,
  onOpenChange,
  selectedUser,
  onUserChange,
  onStartConversation,
  allUsers,
  loadingUsers,
  currentUserRole,
  currentUserId
}: NewMessageDialogProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<string>('');
  
  // Nettoyage du filtre lors de l'ouverture
  useEffect(() => {
    if (isOpen) {
      setSearchQuery('');
      setFilterRole('');
    }
  }, [isOpen]);

  // Fonctions pour obtenir des valeurs basées sur le rôle
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'founder':
        return 'bg-blue-500';
      case 'manager':
        return 'bg-amber-500';
      case 'agent':
        return 'bg-emerald-500';
      case 'creator':
        return 'bg-purple-500';
      case 'ambassadeur':
        return 'bg-pink-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getRoleName = (role: string) => {
    switch (role) {
      case 'founder':
        return 'Fondateur';
      case 'manager':
        return 'Manager';
      case 'agent':
        return 'Agent';
      case 'creator':
        return 'Créateur';
      case 'ambassadeur':
        return 'Ambassadeur';
      default:
        return role;
    }
  };

  // Filtrer les utilisateurs en fonction des filtres et du rôle actuel
  const filteredUsers = useMemo(() => {
    if (!allUsers) return [];
    
    let filtered = allUsers.filter(user => {
      // Exclure l'utilisateur actuel
      if (user.id === currentUserId) return false;
      
      // Filtres de recherche et de rôle
      const matchesSearch = user.username.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = !filterRole || user.role === filterRole;
      
      // Restrictions basées sur le rôle
      if (currentUserRole === 'creator') {
        // Créateur peut uniquement contacter son agent assigné ou le fondateur
        return (user.role === 'agent' || user.role === 'founder') && matchesSearch && matchesRole;
      } else if (currentUserRole === 'agent') {
        // Agent peut contacter les créateurs, managers et fondateurs
        return (['creator', 'manager', 'founder'].includes(user.role)) && matchesSearch && matchesRole;
      } else if (currentUserRole === 'manager') {
        // Manager peut contacter tout le monde sauf les autres managers
        return (user.role !== 'manager' || user.id === currentUserId) && matchesSearch && matchesRole;
      } else if (currentUserRole === 'founder') {
        // Fondateur peut contacter tout le monde
        return matchesSearch && matchesRole;
      }
      
      return false;
    });
    
    // Trier par rôle puis par nom
    return filtered.sort((a, b) => {
      if (a.role !== b.role) {
        if (a.role === 'founder') return -1;
        if (b.role === 'founder') return 1;
        if (a.role === 'manager') return -1;
        if (b.role === 'manager') return 1;
        if (a.role === 'agent') return -1;
        if (b.role === 'agent') return 1;
      }
      return a.username.localeCompare(b.username);
    });
  }, [allUsers, searchQuery, filterRole, currentUserRole, currentUserId]);

  // Déterminer les rôles disponibles pour le filtre
  const availableRoles = useMemo(() => {
    if (!allUsers) return [];
    
    const roles = new Set<string>();
    filteredUsers.forEach(user => roles.add(user.role));
    return Array.from(roles);
  }, [filteredUsers]);

  const handleStartConversation = () => {
    if (!selectedUser) {
      toast.error("Veuillez sélectionner un utilisateur");
      return;
    }
    onStartConversation();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-700 shadow-lg">
        <DialogHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-t-lg border-b border-blue-100 dark:border-blue-900/30 p-4 -mt-4 -mx-4 mb-4">
          <DialogTitle className="text-xl text-blue-700 dark:text-blue-300 font-semibold flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Nouveau message
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-2">
          {!['founder', 'manager', 'agent'].includes(currentUserRole) && (
            <Alert className="bg-amber-50 border-amber-200 dark:bg-amber-950/30 dark:border-amber-800/50">
              <Info className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              <AlertTitle>Restriction d'accès</AlertTitle>
              <AlertDescription className="text-sm text-amber-700 dark:text-amber-300">
                En tant que créateur, vous pouvez uniquement envoyer des messages au fondateur et à votre agent assigné.
              </AlertDescription>
            </Alert>
          )}
          
          <div className="flex gap-2">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
                <Input
                  placeholder="Rechercher un utilisateur..."
                  className="pl-10 border-gray-300 dark:border-gray-700 focus:ring-blue-500 dark:focus:ring-blue-400"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            {availableRoles.length > 0 && (
              <Select value={filterRole} onValueChange={setFilterRole}>
                <SelectTrigger className="w-[150px] border-gray-300 dark:border-gray-700">
                  <SelectValue placeholder="Tous les rôles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tous les rôles</SelectItem>
                  {availableRoles.map(role => (
                    <SelectItem key={role} value={role}>
                      {getRoleName(role)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
          
          {loadingUsers ? (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-4 border-t-transparent border-blue-600 rounded-full animate-spin"></div>
            </div>
          ) : filteredUsers.length > 0 ? (
            <ScrollArea className="h-[300px] border rounded-md p-2 border-gray-200 dark:border-gray-700">
              {filteredUsers.map(user => (
                <div
                  key={user.id}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedUser === user.id
                      ? 'bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800/50'
                      : 'hover:bg-gray-100 dark:hover:bg-slate-800 border border-transparent'
                  }`}
                  onClick={() => onUserChange(user.id)}
                >
                  <Avatar className="h-10 w-10 border-2 border-white dark:border-gray-800 shadow-sm">
                    {user.avatar_url ? (
                      <AvatarImage src={user.avatar_url} alt={user.username} />
                    ) : (
                      <AvatarFallback className={`${getRoleColor(user.role)} text-white`}>
                        {user.username.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  
                  <div>
                    <p className="font-medium dark:text-white">{user.username}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {getRoleName(user.role)}
                    </p>
                  </div>
                </div>
              ))}
            </ScrollArea>
          ) : (
            <div className="flex flex-col items-center justify-center p-6 text-center h-[300px] border rounded-md border-gray-200 dark:border-gray-700">
              <MessageSquare className="h-10 w-10 text-blue-400 mb-2" />
              <p className="text-gray-500 dark:text-gray-400">Aucun utilisateur trouvé</p>
              {(searchQuery || filterRole) && (
                <Button 
                  variant="link" 
                  onClick={() => { setSearchQuery(''); setFilterRole(''); }}
                  className="mt-2 text-blue-500 dark:text-blue-400"
                >
                  Réinitialiser les filtres
                </Button>
              )}
            </div>
          )}
        </div>
        
        <DialogFooter className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button 
            onClick={handleStartConversation} 
            disabled={!selectedUser || loadingUsers}
            className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800"
          >
            Démarrer la conversation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
