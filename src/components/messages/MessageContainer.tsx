
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { ContactList } from './ContactList';
import { MessageList } from './MessageList';
import { MessageHeader } from './MessageHeader';
import { MessageComposer } from './MessageComposer';
import { Loading } from '@/components/ui/loading';
import { useIsMobile } from '@/hooks/use-mobile';
import { useMessages } from '@/hooks/use-messages';

interface MessageContainerProps {
  username: string;
  role: string;
  userId: string;
}

export const MessageContainer = ({ username, role, userId }: MessageContainerProps) => {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState('contacts');
  
  // Use the hook to manage messages state
  const {
    conversations,
    messages,
    activeContact: activeContactId,
    setActiveContact: setActiveContactId,
    newMessage: messageText,
    setNewMessage: setMessageText,
    sendMessage,
    sendingMessage: isSending,
    unreadCount,
    loadingConversations: isLoading,
    loadingMessages,
    handleAttachment,
    attachmentPreview,
    clearAttachment
  } = useMessages(userId);

  // Convert unreadCounts to the expected format
  const unreadCounts: Record<string, number> = {};
  conversations?.forEach(contact => {
    if (contact.unreadCount) {
      unreadCounts[contact.id] = contact.unreadCount;
    }
  });

  // Find the active contact details
  const activeContact = conversations?.find(c => c.id === activeContactId);
  
  // Handle message sending
  const handleSendMessage = async () => {
    if (!messageText.trim() && !attachmentPreview) return;
    
    try {
      sendMessage();
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Erreur lors de l\'envoi du message');
    }
  };
  
  // When selecting a contact, change to messages tab on mobile
  useEffect(() => {
    if (activeContactId && isMobile) {
      setActiveTab('messages');
    }
  }, [activeContactId, isMobile]);

  return (
    <div className="h-full flex flex-col">
      <div className="flex h-full">
        {/* Mobile view */}
        {isMobile ? (
          <>
            <MessageHeader 
              contact={activeContact}
              unreadCount={Object.values(unreadCounts).reduce((sum, count) => sum + count, 0)}
              onNewMessage={() => {}} 
              isMobile={true}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              role={role}
              onBack={() => setActiveContactId(null)}
            />
            
            <div className="w-full flex-1 flex flex-col">
              {activeTab === 'contacts' ? (
                <ContactList 
                  contacts={conversations || []}
                  activeContactId={activeContactId || ''}
                  onSelectContact={setActiveContactId}
                  isLoading={isLoading}
                  unreadCounts={unreadCounts}
                />
              ) : (
                activeContactId ? (
                  <div className="flex-1 flex flex-col h-full">
                    <div className="flex-1 overflow-y-auto">
                      <MessageList 
                        messages={messages || []} 
                        currentUserId={userId}
                        isLoading={loadingMessages}
                      />
                    </div>
                    
                    <MessageComposer 
                      message={messageText}
                      onChange={setMessageText}
                      onSend={handleSendMessage}
                      isSending={isSending}
                      onAttachFile={handleAttachment}
                      attachmentPreview={attachmentPreview}
                      onClearAttachment={clearAttachment}
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500 dark:text-gray-400 p-4 text-center">
                      Sélectionnez un contact pour commencer à discuter
                    </p>
                  </div>
                )
              )}
            </div>
          </>
        ) : (
          /* Desktop view */
          <>
            <div className="w-1/3 border-r dark:border-gray-700 h-full">
              <ContactList 
                contacts={conversations || []}
                activeContactId={activeContactId || ''}
                onSelectContact={setActiveContactId}
                isLoading={isLoading}
                unreadCounts={unreadCounts}
              />
            </div>
            
            <div className="w-2/3 flex flex-col h-full">
              {activeContactId ? (
                <>
                  <MessageHeader 
                    contact={activeContact}
                    role={role}
                  />
                  
                  <div className="flex-1 overflow-y-auto">
                    <MessageList 
                      messages={messages || []} 
                      currentUserId={userId}
                      isLoading={loadingMessages} 
                    />
                  </div>
                  
                  <MessageComposer 
                    message={messageText}
                    onChange={setMessageText}
                    onSend={handleSendMessage}
                    isSending={isSending}
                    onAttachFile={handleAttachment}
                    attachmentPreview={attachmentPreview}
                    onClearAttachment={clearAttachment}
                  />
                </>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500 dark:text-gray-400">
                    Sélectionnez un contact pour commencer à discuter
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
