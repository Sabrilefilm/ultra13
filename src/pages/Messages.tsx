
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMessages } from '@/hooks/use-messages';
import { UltraSidebar } from '@/components/layout/UltraSidebar';
import { Loading } from '@/components/ui/loading';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { useIsMobile } from '@/hooks/use-mobile';
import { useToast } from '@/hooks/use-toast';
import { MessageHeader } from '@/components/messages/MessageHeader';
import { MessageContainer } from '@/components/messages/MessageContainer';
import { NewMessageDialog } from '@/components/messages/NewMessageDialog';

const Messages = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string>('');
  const [role, setRole] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('contacts');
  const [isNewMessageDialogOpen, setIsNewMessageDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const isMobile = useIsMobile();
  const { toast: uiToast } = useToast();
  
  const {
    conversations,
    messages,
    activeContact,
    setActiveContact,
    newMessage,
    setNewMessage,
    sendMessage,
    sendingMessage,
    loadingConversations,
    loadingMessages,
    unreadCount,
    allUsers,
    loadingUsers,
    archiveConversation,
    archiving,
    handleAttachment,
    attachmentPreview,
    clearAttachment
  } = useMessages(userId);

  useEffect(() => {
    const checkAuth = async () => {
      const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
      const storedUsername = localStorage.getItem('username');
      const storedRole = localStorage.getItem('userRole');
      const storedUserId = localStorage.getItem('userId');
      
      if (!isAuthenticated || !storedUsername || !storedRole) {
        console.log("Authentication failed, redirecting to login");
        toast.error("Session expirée, veuillez vous reconnecter");
        navigate('/');
        return;
      }
      
      console.log("Authentication successful");
      
      // If we already have the userId in localStorage, use it directly
      if (storedUserId) {
        console.log("User ID found in localStorage:", storedUserId);
        setUserId(storedUserId);
        setUsername(storedUsername);
        setRole(storedRole);
        setLoading(false);
        return;
      }
      
      // Otherwise, get user id from user_accounts table
      console.log("User ID not found in localStorage, fetching from database");
      try {
        const { data, error } = await supabase
          .from('user_accounts')
          .select('id')
          .ilike('username', storedUsername) // Case-insensitive search
          .single();
          
        if (error) {
          console.error("Error fetching user ID:", error);
          throw error;
        }
        
        if (data?.id) {
          console.log("User ID found in database:", data.id);
          setUserId(data.id);
          localStorage.setItem('userId', data.id); // Save to localStorage for future use
          setUsername(storedUsername);
          setRole(storedRole);
        } else {
          console.error("User not found for username:", storedUsername);
          throw new Error('User not found');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast.error("Impossible de récupérer les données utilisateur");
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, [navigate]);

  const handleSendMessage = () => {
    if ((newMessage.trim() || attachmentPreview) && activeContact) {
      sendMessage();
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const handleStartNewConversation = () => {
    if (!selectedUser) {
      toast.error('Veuillez sélectionner un destinataire');
      return;
    }
    
    setActiveContact(selectedUser);
    setIsNewMessageDialogOpen(false);
    setSelectedUser('');
    if (isMobile) {
      setActiveTab('messages');
    }
  };

  const handleArchive = () => {
    const isFounder = role === 'founder';
    const confirmMessage = isFounder 
      ? 'Êtes-vous sûr de vouloir archiver définitivement cette conversation ?'
      : 'Êtes-vous sûr de vouloir archiver cette conversation pour 1 mois ?';
      
    if (window.confirm(confirmMessage)) {
      archiveConversation();
    }
  };

  console.log("Rendering Messages component with state:", {
    userId,
    activeTab,
    activeContact,
    conversationsCount: conversations?.length || 0,
    messagesCount: messages?.length || 0
  });

  if (loading) {
    return <Loading fullScreen size="large" text="Chargement de la messagerie..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex">
      <UltraSidebar 
        username={username}
        role={role}
        onLogout={handleLogout}
        currentPage="messages"
      />
      
      <div className="flex-1 flex flex-col">
        <MessageHeader 
          username={username}
          unreadCount={unreadCount || 0}
          onNewMessage={() => setIsNewMessageDialogOpen(true)}
          isMobile={isMobile}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          role={role}
        />
        
        <MessageContainer 
          conversations={conversations}
          messages={messages}
          activeContact={activeContact}
          userId={userId}
          activeTab={activeTab}
          isMobile={isMobile}
          onSelectContact={(id) => {
            console.log("Selecting contact:", id);
            setActiveContact(id);
            if (isMobile) {
              setActiveTab('messages');
            }
          }}
          onNewMessage={() => setIsNewMessageDialogOpen(true)}
          onArchive={handleArchive}
          archiving={archiving}
          loadingConversations={loadingConversations}
          loadingMessages={loadingMessages}
          unreadCount={unreadCount || 0}
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          handleSendMessage={handleSendMessage}
          sendingMessage={sendingMessage}
          handleAttachment={handleAttachment}
          attachmentPreview={attachmentPreview}
          clearAttachment={clearAttachment}
          allUsers={allUsers}
          role={role}
        />
      </div>
      
      <NewMessageDialog 
        isOpen={isNewMessageDialogOpen}
        onOpenChange={setIsNewMessageDialogOpen}
        selectedUser={selectedUser}
        onUserChange={setSelectedUser}
        onStartConversation={handleStartNewConversation}
        allUsers={allUsers}
        loadingUsers={loadingUsers}
      />
    </div>
  );
};

export default Messages;
