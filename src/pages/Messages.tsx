
import { useState } from 'react';
import { useMessages } from '@/hooks/use-messages';
import { Loading } from '@/components/ui/loading';
import { MessageContainer } from '@/components/messages/MessageContainer';
import { NewMessageDialog } from '@/components/messages/NewMessageDialog';
import { toast } from 'sonner';
import { MessagesHeader } from '@/components/messages/MessagesHeader';
import { MessagesLayout } from '@/components/messages/MessagesLayout';
import { useMessagesAuth } from '@/hooks/use-messages-auth';

const Messages = () => {
  const { userId, role, username, loading, handleLogout } = useMessagesAuth();
  const [isNewMessageDialogOpen, setIsNewMessageDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  
  // Use the hook for managing messages
  const messageHook = useMessages(userId);

  const handleStartNewConversation = async () => {
    if (!selectedUser) {
      toast.error('Veuillez sélectionner un destinataire');
      return;
    }

    try {
      // Use the messageHook defined at the top level to refetch conversations
      await messageHook.refetch();
      
      setIsNewMessageDialogOpen(false);
      setSelectedUser('');
      toast.success('Conversation démarrée');
    } catch (error) {
      console.error('Error starting conversation:', error);
      toast.error('Erreur lors du démarrage de la conversation');
    }
  };

  if (loading) {
    return <Loading fullScreen size="large" text="Chargement de la messagerie..." />;
  }

  return (
    <MessagesLayout 
      username={username} 
      role={role} 
      userId={userId} 
      onLogout={handleLogout}
    >
      <MessagesHeader onNewMessage={() => setIsNewMessageDialogOpen(true)} />
      
      <div className="flex-1">
        <MessageContainer 
          username={username}
          role={role}
          userId={userId}
        />
      </div>
      
      <NewMessageDialog 
        isOpen={isNewMessageDialogOpen}
        onOpenChange={setIsNewMessageDialogOpen}
        selectedUser={selectedUser}
        onUserChange={setSelectedUser}
        onStartConversation={handleStartNewConversation}
        currentUserRole={role}
        currentUserId={userId}
        allUsers={allUsers}
        loadingUsers={loadingUsers}
      />
    </MessagesLayout>
  );
};

export default Messages;
