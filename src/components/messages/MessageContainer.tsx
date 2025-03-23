
import React, { useState, useEffect } from 'react';
import { ContactList } from './ContactList';
import { MessageList } from './MessageList';
import { MessageComposer } from './MessageComposer';
import { MessageHeader } from './MessageHeader';
import { NewMessageDialog } from './NewMessageDialog';
import { useMediaQuery } from '../../hooks/use-media-query';
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
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const isMobile = !useMediaQuery('(min-width: 768px)');
  
  // These would typically come from your hook, we'll use dummy data for now
  const contacts = [];
  const messages = {};
  const unreadCounts = {};
  const allUsers = [];
  const loadingUsers = false;
  const error = null;
  
  useEffect(() => {
    if (error) {
      toast.error("Erreur lors du chargement des messages: " + error);
    }
  }, [error]);
  
  const totalUnreadCount = Object.values(unreadCounts).reduce((a, b) => (a as number) + (b as number), 0);
  
  const handleContactSelect = (contactId: string) => {
    setSelectedContact(contactId);
    if (isMobile) {
      setActiveTab('messages');
    }
    // Mark as read would be implemented in your hook
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
      
      // If this is an existing contact, select it
      const existingContact = contacts.find(contact => contact.id === selectedUserForNewMessage);
      if (existingContact) {
        setSelectedContact(existingContact.id);
        if (isMobile) {
          setActiveTab('messages');
        }
      } else {
        // Initialize conversation with a first message
        handleSendMessage("Bonjour, j'aimerais discuter avec vous.");
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
      // Send message would be implemented in your hook
      console.log("Sending message to", selectedContact, ":", message);
    }
  };
  
  const handleNewMessageClick = () => {
    setIsNewMessageOpen(true);
  };

  return (
    <div className="h-screen flex flex-col bg-white dark:bg-slate-950">
      <MessageHeader 
        username={username}
        unreadCount={totalUnreadCount as number}
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
              activeContactId={selectedContact} 
              onSelectContact={handleContactSelect} 
              isLoading={isLoading}
              unreadMessages={totalUnreadCount as number}
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
                  isLoading={isLoading}
                />
                <MessageComposer 
                  message={newMessage}
                  onChange={setNewMessage}
                  onSend={() => handleSendMessage(newMessage)}
                  isSending={false}
                />
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
