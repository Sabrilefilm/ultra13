import React from 'react';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
}

interface MessageContainerProps {
  contacts?: any[];
  activeContactId?: string; 
  onSelectContact?: (contactId: string) => void;
  messages?: any[];
  onSendMessage?: (message: string) => void;
  isLoading?: boolean;
  error?: any;
  currentUserId?: string;
  unreadCounts?: Record<string, number>;
  markAsRead?: (contactId: string) => void;
  username?: string;
  role?: string;
  userId?: string;
}

export const MessageContainer = ({
  contacts = [],
  activeContactId = '',
  onSelectContact = () => {},
  messages = [],
  onSendMessage = () => {},
  isLoading = false,
  error = null,
  currentUserId = '',
  unreadCounts = {},
  markAsRead = () => {},
  username = '',
  role = '',
  userId = ''
}: MessageContainerProps) => {
  const activeContact = contacts.find((contact) => contact.id === activeContactId);
  const [messageInput, setMessageInput] = React.useState('');
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center p-4 text-red-500">
        Error: {error.message}
      </div>
    );
  }

  if (!activeContact) {
    return (
      <div className="flex-1 flex items-center justify-center p-4 text-gray-500 dark:text-gray-400">
        Sélectionnez une conversation pour afficher les messages.
      </div>
    );
  }

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      onSendMessage(messageInput);
      setMessageInput('');
    }
  };

  React.useEffect(() => {
    if (activeContactId) {
      markAsRead(activeContactId);
    }
  }, [activeContactId, markAsRead]);
  
  return (
    <div className="flex flex-col h-full">
      <div className="border-b border-gray-200 dark:border-gray-800 p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary/10 text-primary">
              {activeContact.username.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium">{activeContact.username}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">{activeContact.role}</span>
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4" ref={scrollRef}>
        <ScrollArea className="h-full">
          <div className="flex flex-col gap-2">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex flex-col ${
                  message.senderId === currentUserId ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`rounded-xl px-4 py-2 text-sm max-w-[75%] ${
                    message.senderId === currentUserId
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                  }`}
                >
                  {message.content}
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {format(new Date(message.timestamp), 'Pp', { locale: fr })}
                </span>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
      
      <div className="border-t border-gray-200 dark:border-gray-800 p-4">
        <div className="flex items-center gap-3">
          <Input
            type="text"
            placeholder="Écrire un message..."
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSendMessage();
              }
            }}
          />
          <Button onClick={handleSendMessage}>
            <Send className="w-4 h-4 mr-2" />
            Envoyer
          </Button>
        </div>
      </div>
    </div>
  );
};
