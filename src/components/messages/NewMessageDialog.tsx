
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';

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
  loadingUsers
}: NewMessageDialogProps) => {
  // Classes for animations and blue colors
  const blueButtonClass = "bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white";
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white dark:bg-slate-900 border-blue-200 dark:border-blue-800/30">
        <DialogHeader>
          <DialogTitle className="text-blue-600 dark:text-blue-400">Nouveau message</DialogTitle>
          <DialogDescription className="text-gray-500 dark:text-gray-400">
            Sélectionnez un utilisateur pour commencer une nouvelle conversation.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <Select value={selectedUser} onValueChange={onUserChange}>
            <SelectTrigger className="border-blue-200 dark:border-blue-700">
              <SelectValue placeholder="Sélectionner un utilisateur" />
            </SelectTrigger>
            <SelectContent>
              {loadingUsers ? (
                <div className="flex justify-center p-2">
                  <div className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin border-blue-500"></div>
                </div>
              ) : allUsers?.length === 0 ? (
                <div className="p-2 text-sm text-gray-500">Aucun utilisateur disponible</div>
              ) : (
                allUsers?.map(user => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.username} ({user.role})
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button 
            onClick={onStartConversation}
            className={blueButtonClass}
          >
            Commencer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
