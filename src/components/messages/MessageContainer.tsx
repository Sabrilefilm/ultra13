import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageList } from '@/components/messages/MessageList';
import { ContactList } from '@/components/messages/ContactList';
import { MessageComposer } from '@/components/messages/MessageComposer';
import { Plus, Archive, MessageSquare, Users } from 'lucide-react';

interface Contact {
  id: string;
  username: string;
  role: string;
  unreadCount?: number;
  lastMessage?: string;
  lastMessageTime?: string;
}

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  message: string;
  created_at: string;
  read: boolean;
  attachment_url?: string;
}

interface MessageContainerProps {
  conversations: Contact[] | null;
  messages: Message[] | null;
  activeContact: string | null;
  userId: string;
  activeTab: string;
  isMobile: boolean;
  onSelectContact: (id: string) => void;
  onNewMessage: () => void;
  onArchive: () => void;
  archiving: boolean;
  loadingConversations: boolean;
  loadingMessages: boolean;
  unreadCount: number;
  newMessage: string;
  setNewMessage: (message: string) => void;
  handleSendMessage: () => void;
  sendingMessage: boolean;
  handleAttachment: (file: File) => void;
  attachmentPreview: string | null;
  clearAttachment: () => void;
  allUsers?: any[];
}

export const MessageContainer = ({
  conversations,
  messages,
  activeContact,
  userId,
  activeTab,
  isMobile,
  onSelectContact,
  onNewMessage,
  onArchive,
  archiving,
  loadingConversations,
  loadingMessages,
  unreadCount,
  newMessage,
  setNewMessage,
  handleSendMessage,
  sendingMessage,
  handleAttachment,
  attachmentPreview,
  clearAttachment,
  allUsers
}: MessageContainerProps) => {
  const blueButtonClass = "bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white";
  
  const getUserById = (id: string) => {
    return allUsers?.find(user => user.id === id);
  };

  return (
    <div className="flex-1 p-4 overflow-hidden">
      <Card className="h-full overflow-hidden shadow-lg border-blue-100 dark:border-blue-900/30">
        <CardContent className="p-0 h-full">
          <div className="md:flex h-full">
            <div className={`w-full md:w-1/3 md:border-r border-gray-200 dark:border-gray-800 h-full ${activeTab !== 'contacts' ? 'hidden md:block' : ''}`}>
              <div className="flex justify-between items-center p-3 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                <h2 className="font-medium text-gray-900 dark:text-gray-100 flex items-center">
                  <Users className="h-4 w-4 mr-2 text-blue-500" />
                  Contacts
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onNewMessage}
                  className="md:hidden text-blue-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <ContactList
                contacts={conversations || []}
                activeContactId={activeContact}
                onSelectContact={onSelectContact}
                isLoading={loadingConversations}
                unreadMessages={unreadCount}
              />
            </div>
            
            <div className={`flex flex-col w-full md:w-2/3 h-full ${activeTab !== 'messages' ? 'hidden md:block' : ''}`}>
              {activeContact ? (
                <>
                  <div className="bg-white dark:bg-slate-900 p-3 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
                    <div className="flex items-center">
                      <span className="font-medium text-blue-600 dark:text-blue-400">
                        {conversations?.find(c => c.id === activeContact)?.username || allUsers?.find(u => u.id === activeContact)?.username || 'Conversation'}
                      </span>
                      <span className="ml-2 text-sm text-gray-500">
                        ({conversations?.find(c => c.id === activeContact)?.role || allUsers?.find(u => u.id === activeContact)?.role || ''})
                      </span>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={onArchive}
                      disabled={archiving}
                      className="text-gray-500 hover:text-red-500"
                    >
                      <Archive className="h-4 w-4 mr-1" />
                      {isMobile ? '' : 'Archiver'}
                    </Button>
                  </div>
                  
                  <div className="flex-1 overflow-hidden bg-gray-50 dark:bg-gray-900/30">
                    <MessageList
                      messages={messages || []}
                      currentUserId={userId}
                      isLoading={loadingMessages}
                    />
                  </div>
                  
                  <MessageComposer
                    message={newMessage}
                    onChange={setNewMessage}
                    onSend={handleSendMessage}
                    isSending={sendingMessage}
                    onAttachFile={handleAttachment}
                    attachmentPreview={attachmentPreview}
                    onClearAttachment={clearAttachment}
                  />
                </>
              ) : (
                <div className="flex flex-col h-full items-center justify-center p-6 text-center">
                  <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4 animate-pulse">
                    <MessageSquare className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-2">Sélectionnez une conversation</p>
                  <p className="text-gray-400 dark:text-gray-500 text-sm">Choisissez un contact pour commencer à discuter</p>
                  
                  <Button
                    className={`mt-4 ${blueButtonClass}`}
                    onClick={onNewMessage}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Nouveau message
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
