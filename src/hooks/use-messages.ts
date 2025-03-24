
import { useState } from 'react';
import { useConversations } from './messages/use-conversations';
import { useMessagesRetrieval } from './messages/use-messages-retrieval';
import { useMessageOperations } from './messages/use-message-operations';
import { useRealtimeMessaging } from './messages/use-realtime-messaging';

export const useMessages = (userId: string) => {
  const [activeContact, setActiveContact] = useState<string | null>(null);
  
  // Use the separate hooks for different functionalities
  const {
    conversations,
    loadingConversations,
    refetchConversations,
    allUsers,
    loadingUsers,
    refetchUsers
  } = useConversations(userId);
  
  const {
    messages,
    loadingMessages,
    refetchMessages,
    unreadCount,
    loadingUnread,
    refetchUnread
  } = useMessagesRetrieval({ userId, activeContact });
  
  const {
    newMessage,
    setNewMessage,
    attachment,
    attachmentPreview,
    handleAttachment,
    clearAttachment,
    sendMessage,
    sendingMessage,
    archiveConversation,
    archiving
  } = useMessageOperations({ userId, activeContact });
  
  // Set up real-time messaging
  useRealtimeMessaging({ 
    userId, 
    activeContact, 
    conversations 
  });

  // Function to refetch all message data
  const refetch = () => {
    refetchConversations();
    refetchMessages();
    refetchUnread();
    refetchUsers();
  };

  return {
    // Conversations
    conversations,
    loadingConversations,
    
    // Messages
    messages,
    activeContact,
    setActiveContact,
    loadingMessages,
    
    // Message operations
    newMessage,
    setNewMessage,
    sendMessage,
    sendingMessage,
    archiveConversation,
    archiving,
    
    // Attachments
    handleAttachment,
    attachment,
    attachmentPreview,
    clearAttachment,
    
    // Unread counts
    unreadCount,
    loadingUnread,
    
    // User data for new messages
    allUsers,
    loadingUsers,
    
    // Utility function to refetch all data
    refetch
  };
};
