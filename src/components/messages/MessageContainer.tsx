
import React, { useState, useEffect } from 'react';
import { ContactList } from './ContactList';
import { MessageList } from './MessageList';
import { MessageComposer } from './MessageComposer';
import { MessageHeader } from './MessageHeader';
import { NewMessageDialog } from './NewMessageDialog';
import { useMediaQuery } from '../../hooks/use-media-query';
import { toast } from 'sonner';
import { Users } from 'lucide-react';
import { useMessages } from '@/hooks/use-messages';

interface MessageContainerProps {
  username: string;
  role: string;
  userId: string;
}

export const MessageContainer = ({ username, role, userId }: MessageContainerProps) => {
  const [activeTab, setActiveTab] = useState('contacts');
  const [isNewMessageOpen, setIsNewMessageOpen] = useState(false);
  const [selectedUserForNewMessage, setSelectedUserForNewMessage] = useState('');
  const [newMessage, setNewMessage] = useState('');
  
  const isMobile = !useMediaQuery('(min-width: 768px)');
  
  const {
    conversations,
    messages,
    activeContact,
    setActiveContact,
    newMessage: messageText,
    setNewMessage: setMessageText,
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
    // If active contact is selected, switch to messages tab on mobile
    if (activeContact && isMobile) {
      setActiveTab('messages');
    }
  }, [activeContact, isMobile]);
  
  const handleContactSelect = (contactId: string) => {
    setActiveContact(contactId);
    if (isMobile) {
      setActiveTab('messages');
    }
  };
  
  const handleSendMessage = () => {
    if ((messageText.trim() || attachmentPreview) && activeContact) {
      sendMessage();
    }
  };
  
  const handleNewMessageClick = () => {
    setIsNewMessageOpen(true);
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
      const existingContact = conversations.find(contact => contact.id === selectedUserForNewMessage);
      if (existingContact) {
        setActiveContact(existingContact.id);
        if (isMobile) {
          setActiveTab('messages');
        }
      } else {
        // Initialize conversation
        setActiveContact(selectedUserForNewMessage);
        if (isMobile) {
          setActiveTab('messages');
        }
      }
      setIsNewMessageOpen(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-white dark:bg-slate-950">
      <MessageHeader 
        username={username}
        unreadCount={unreadCount}
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
              contacts={conversations}
              activeContactId={activeContact} 
              onSelectContact={handleContactSelect} 
              isLoading={loadingConversations}
              unreadCounts={unreadCount}
            />
          </div>
        )}
        
        {(!isMobile || activeTab === 'messages') && (
          <div className={`${isMobile ? 'w-full' : 'w-2/3'} flex flex-col h-full`}>
            {activeContact ? (
              <>
                <MessageList 
                  messages={messages} 
                  currentUserId={userId}
                  isLoading={loadingMessages}
                />
                <MessageComposer 
                  message={messageText}
                  onChange={setMessageText}
                  onSend={handleSendMessage}
                  isSending={sendingMessage}
                  onAttachFile={handleAttachment}
                  attachmentPreview={attachmentPreview}
                  onClearAttachment={clearAttachment}
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
