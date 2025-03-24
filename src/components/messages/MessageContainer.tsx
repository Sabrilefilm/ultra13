
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
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
      <div className="flex h-full backdrop-blur-md bg-gradient-to-b from-white/90 to-white/95 dark:from-slate-900/90 dark:to-slate-900/95 rounded-lg shadow-xl overflow-hidden">
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
            <div className="w-1/3 border-r dark:border-gray-700/30 h-full bg-white/80 dark:bg-slate-950/80">
              <ContactList 
                contacts={conversations || []}
                activeContactId={activeContactId || ''}
                onSelectContact={setActiveContactId}
                isLoading={isLoading}
                unreadCounts={unreadCounts}
              />
            </div>
            
            <div className="w-2/3 flex flex-col h-full bg-white/60 dark:bg-slate-900/60">
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
                  <div className="text-center p-8 bg-blue-50 dark:bg-blue-900/20 rounded-lg max-w-md">
                    <img 
                      src="/public/lovable-uploads/fff0a86e-fec2-4289-99aa-26b936020868.png" 
                      alt="Message Illustration"
                      className="w-64 h-auto mx-auto mb-6 rounded-lg shadow-md"
                    />
                    <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">
                      Bienvenue dans la messagerie Ultra
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Sélectionnez un contact pour commencer à discuter ou créez une nouvelle conversation
                    </p>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
