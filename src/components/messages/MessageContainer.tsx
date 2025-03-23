
import React, { useState, useEffect } from 'react';
import { ContactList } from './ContactList';
import { MessageList } from './MessageList';
import { MessageComposer } from './MessageComposer';
import { MessageHeader } from './MessageHeader';
import { NewMessageDialog } from './NewMessageDialog';
import { useMediaQuery } from '../../hooks/use-media-query';
import { useMessages } from '../../hooks/use-messages';
import { Users } from 'lucide-react';
import { toast } from 'sonner';

interface MessageContainerProps {
  username: string;
  role: string;
  userId: string;
}

export const MessageContainer = ({ username, role, userId }: MessageContainerProps) => {
  const [activeTab, setActiveTab] = useState('contacts');
  const [selectedContact, setSelectedContact] = useState<string | null>(null);
  const [isNewMessageOpen, setIsNewMessageOpen] = useState(false);
  const [selectedUserForNewMessage, setSelectedUserForNewMessage] = useState('');
  
  const isMobile = !useMediaQuery('(min-width: 768px)');
  
  const { 
    contacts, 
    messages, 
    sendMessage, 
    markAsRead, 
    unreadCounts,
    allUsers,
    loadingUsers,
    error
  } = useMessages(userId);

  useEffect(() => {
    if (error) {
      toast.error("Erreur lors du chargement des messages: " + error);
    }
  }, [error]);
  
  const totalUnreadCount = Object.values(unreadCounts).reduce((acc, count) => acc + count, 0);
  
  const handleContactSelect = (contactId: string) => {
    setSelectedContact(contactId);
    if (isMobile) {
      setActiveTab('messages');
    }
    markAsRead(contactId);
  };
  
  const handleStartNewConversation = () => {
    if (!selectedUserForNewMessage) {
      toast.error("Veuillez sélectionner un utilisateur.");
      return;
    }
    
    // Vérifier les autorisations basées sur le rôle
    const selectedUser = allUsers?.find(user => user.id === selectedUserForNewMessage);
    
    if (selectedUser) {
      if (role === 'creator') {
        // Le créateur ne peut contacter que le fondateur ou son agent assigné
        if (selectedUser.role !== 'founder' && selectedUser.role !== 'agent') {
          toast.error("En tant que créateur, vous ne pouvez contacter que le fondateur ou votre agent.");
          return;
        }
      } else if (role === 'agent') {
        // L'agent ne peut contacter que les créateurs, managers ou fondateurs
        if (!['creator', 'manager', 'founder'].includes(selectedUser.role)) {
          toast.error("En tant qu'agent, vous ne pouvez contacter que les créateurs, managers ou fondateurs.");
          return;
        }
      }
      
      // Si c'est un contact existant, sélectionner le contact
      const existingContact = contacts.find(contact => contact.id === selectedUserForNewMessage);
      if (existingContact) {
        setSelectedContact(existingContact.id);
        if (isMobile) {
          setActiveTab('messages');
        }
      } else {
        // Initialiser la conversation en envoyant un premier message
        sendMessage(selectedUserForNewMessage, "Bonjour, j'aimerais discuter avec vous.");
        setSelectedContact(selectedUserForNewMessage);
        if (isMobile) {
          setActiveTab('messages');
        }
      }
      setIsNewMessageOpen(false);
    }
  };
  
  const handleSendMessage = (message: string) => {
    if (selectedContact) {
      sendMessage(selectedContact, message);
    }
  };
  
  const handleNewMessageClick = () => {
    setIsNewMessageOpen(true);
  };

  return (
    <div className="h-screen flex flex-col bg-white dark:bg-slate-950">
      <MessageHeader 
        username={username}
        unreadCount={totalUnreadCount}
        onNewMessage={handleNewMessageClick}
        isMobile={isMobile}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        role={role}
      />
      
      <div className="flex flex-1 h-[calc(100vh-64px)] overflow-hidden">
        {(!isMobile || activeTab === 'contacts') && (
          <div className={`${isMobile ? 'w-full' : 'w-1/3 border-r'} border-gray-200 dark:border-gray-800`}>
            <ContactList 
              contacts={contacts} 
              selectedContactId={selectedContact} 
              onContactSelect={handleContactSelect} 
              unreadCounts={unreadCounts}
            />
          </div>
        )}
        
        {(!isMobile || activeTab === 'messages') && (
          <div className={`${isMobile ? 'w-full' : 'w-2/3'} flex flex-col h-full`}>
            {selectedContact ? (
              <>
                <MessageList 
                  messages={messages[selectedContact] || []} 
                  currentUserId={userId}
                />
                <MessageComposer onSendMessage={handleSendMessage} />
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full p-4 text-center text-gray-500 dark:text-gray-400">
                <Users className="h-16 w-16 mb-4 text-gray-300 dark:text-gray-600" />
                <h3 className="text-xl font-semibold mb-2">Aucune conversation sélectionnée</h3>
                <p className="max-w-md">
                  Sélectionnez une conversation existante dans la liste ou créez une nouvelle conversation.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
      
      <NewMessageDialog 
        isOpen={isNewMessageOpen}
        onOpenChange={setIsNewMessageOpen}
        selectedUser={selectedUserForNewMessage}
        onUserChange={setSelectedUserForNewMessage}
        onStartConversation={handleStartNewConversation}
        allUsers={allUsers}
        loadingUsers={loadingUsers}
        currentUserRole={role}
        currentUserId={userId}
      />
    </div>
  );
};
