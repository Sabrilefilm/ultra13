
import React, { useState, useEffect, useRef } from 'react';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, Paperclip, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useMessages } from '@/hooks/use-messages';
import { ContactList } from './ContactList';
import { MessageList } from './MessageList';
import { Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface MessageContainerProps {
  username?: string;
  role?: string;
  userId?: string;
}

export const MessageContainer = ({
  username = '',
  role = '',
  userId = ''
}: MessageContainerProps) => {
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
    archiveConversation,
    archiving,
    handleAttachment,
    attachmentPreview,
    clearAttachment
  } = useMessages(userId);

  const [isNewMessageOpen, setIsNewMessageOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = () => {
    if ((newMessage.trim() || attachmentPreview) && activeContact) {
      sendMessage();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleAttachment(files[0]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const activeUser = conversations?.find(conv => conv.id === activeContact);

  // Back to dashboard button
  const BackToDashboardButton = () => (
    <Button 
      variant="outline" 
      className="mb-4 w-full"
      onClick={() => window.location.href = '/'}
    >
      Retour au tableau de bord
    </Button>
  );

  if (loadingConversations) {
    return (
      <div className="w-full h-full flex items-center justify-center p-8">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin mx-auto mb-4" />
          <p>Chargement de vos conversations...</p>
          <BackToDashboardButton />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row w-full h-full bg-gray-50 dark:bg-gray-900">
      {/* Sidebar with conversations */}
      <div className="w-full md:w-1/3 lg:w-1/4 border-r border-gray-200 dark:border-gray-800 flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex flex-col space-y-4">
          <BackToDashboardButton />
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Messagerie</h2>
            {unreadCount && unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadCount} non lu{unreadCount > 1 ? 's' : ''}
              </Badge>
            )}
          </div>
        </div>
        
        <ContactList 
          contacts={conversations || []} 
          activeContactId={activeContact || ''}
          onSelectContact={setActiveContact}
          isLoading={loadingConversations}
        />
      </div>
      
      {/* Main chat area */}
      <div className="flex-1 flex flex-col h-full">
        {!activeContact ? (
          <div className="flex-1 flex items-center justify-center p-8 text-gray-500 dark:text-gray-400">
            <div className="text-center">
              <p>Sélectionnez une conversation pour afficher les messages</p>
            </div>
          </div>
        ) : (
          <>
            {/* Chat header */}
            <div className="border-b border-gray-200 dark:border-gray-800 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {activeUser?.username?.charAt(0).toUpperCase() || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="font-bold">{activeUser?.username}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{activeUser?.role}</span>
                  </div>
                </div>
                <div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => archiveConversation()}
                    disabled={archiving}
                  >
                    Archiver
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Messages area */}
            <ScrollArea className="flex-1 p-4 overflow-y-auto">
              {loadingMessages ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : messages && messages.length > 0 ? (
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender_id === userId ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[75%] rounded-lg px-4 py-2 ${
                          message.sender_id === userId
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                        }`}
                      >
                        {message.attachment_url && (
                          <div className="mb-2">
                            <img 
                              src={message.attachment_url} 
                              alt="Attachment" 
                              className="max-w-full rounded" 
                              style={{ maxHeight: '200px' }}
                            />
                          </div>
                        )}
                        <p>{message.message}</p>
                        <p className="text-xs opacity-75 mt-1">
                          {format(new Date(message.created_at), 'Pp', { locale: fr })}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  Commencez la conversation en envoyant un message.
                </div>
              )}
            </ScrollArea>
            
            {/* Message input */}
            <div className="border-t border-gray-200 dark:border-gray-800 p-4">
              {attachmentPreview && (
                <div className="mb-2 relative inline-block">
                  <img 
                    src={attachmentPreview} 
                    alt="Preview" 
                    className="h-20 w-auto rounded border border-gray-300 dark:border-gray-700" 
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                    onClick={clearAttachment}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
              <div className="flex items-center gap-2">
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleFileChange}
                />
                <Button 
                  variant="outline" 
                  size="icon" 
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Paperclip className="h-5 w-5" />
                </Button>
                <Input
                  type="text"
                  placeholder="Écrire un message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1"
                />
                <Button 
                  onClick={handleSendMessage} 
                  disabled={(!newMessage.trim() && !attachmentPreview) || sendingMessage}
                >
                  {sendingMessage ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Send className="h-5 w-5 mr-2" />
                  )}
                  Envoyer
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
