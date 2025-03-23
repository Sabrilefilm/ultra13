
import { useState, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, MessageSquare } from 'lucide-react';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface User {
  id: string;
  username: string;
  role: string;
}

interface NewMessageDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedUser: string;
  onUserChange: (userId: string) => void;
  onStartConversation: () => void;
  allUsers: User[] | undefined;
  loadingUsers: boolean;
}

export const NewMessageDialog = ({
  isOpen,
  onOpenChange,
  selectedUser,
  onUserChange,
  onStartConversation,
  allUsers,
  loadingUsers,
}: NewMessageDialogProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<string>('');
  
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'founder':
        return 'bg-red-500';
      case 'manager':
        return 'bg-amber-500';
      case 'agent':
        return 'bg-emerald-500';
      case 'creator':
        return 'bg-blue-500';
      case 'ambassadeur':
        return 'bg-purple-500';
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

  const filteredUsers = useMemo(() => {
    if (!allUsers) return [];
    
    return allUsers.filter(user => {
      const matchesSearch = user.username.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = !filterRole || user.role === filterRole;
      return matchesSearch && matchesRole;
    });
  }, [allUsers, searchQuery, filterRole]);

  const availableRoles = useMemo(() => {
    if (!allUsers) return [];
    
    const roles = new Set<string>();
    allUsers.forEach(user => roles.add(user.role));
    return Array.from(roles);
  }, [allUsers]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Nouveau message</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-2">
          <div className="flex gap-2">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
                <Input
                  placeholder="Rechercher un utilisateur..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <Select value={filterRole} onValueChange={setFilterRole}>
              <SelectTrigger className="w-[150px]">
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
          </div>
          
          {loadingUsers ? (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-4 border-t-transparent border-blue-600 rounded-full animate-spin"></div>
            </div>
          ) : filteredUsers.length > 0 ? (
            <ScrollArea className="h-[300px] border rounded-md p-2">
              {filteredUsers.map(user => (
                <div
                  key={user.id}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedUser === user.id
                      ? 'bg-blue-100 dark:bg-blue-900/30'
                      : 'hover:bg-gray-100 dark:hover:bg-slate-800'
                  }`}
                  onClick={() => onUserChange(user.id)}
                >
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className={`${getRoleColor(user.role)} text-white`}>
                      {user.username.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div>
                    <p className="font-medium">{user.username}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {getRoleName(user.role)}
                    </p>
                  </div>
                </div>
              ))}
            </ScrollArea>
          ) : (
            <div className="flex flex-col items-center justify-center p-6 text-center h-[300px] border rounded-md">
              <MessageSquare className="h-10 w-10 text-blue-400 mb-2" />
              <p className="text-gray-500 dark:text-gray-400">Aucun utilisateur trouvé</p>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button 
            onClick={onStartConversation} 
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
