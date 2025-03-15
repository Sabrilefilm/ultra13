
import { useEffect, useRef } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  message: string;
  created_at: string;
  read: boolean;
}

interface MessageListProps {
  messages: Message[];
  currentUserId: string;
  isLoading: boolean;
}

export const MessageList = ({ messages, currentUserId, isLoading }: MessageListProps) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom when messages change
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (isLoading) {
    return (
      <div className="flex flex-col h-full items-center justify-center p-6">
        <div className="w-8 h-8 border-4 border-t-transparent border-purple-600 rounded-full animate-spin mb-3"></div>
        <p className="text-gray-500 dark:text-gray-400">Chargement des messages...</p>
      </div>
    );
  }

  if (!messages || messages.length === 0) {
    return (
      <div className="flex flex-col h-full items-center justify-center p-6 text-center">
        <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mb-4">
          <span className="text-purple-600 dark:text-purple-400 text-2xl">💬</span>
        </div>
        <p className="text-gray-600 dark:text-gray-300 mb-2">Aucun message</p>
        <p className="text-gray-400 dark:text-gray-500 text-sm">Commencez la conversation en envoyant un message</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full pr-4">
      <div className="flex flex-col space-y-4 p-4">
        {messages.map((message) => {
          const isOwnMessage = message.sender_id === currentUserId;
          
          return (
            <div 
              key={message.id} 
              className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'} items-end gap-2 max-w-[80%]`}>
                {!isOwnMessage && (
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-purple-200 text-purple-700 text-xs">
                      {message.sender_id.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                )}
                
                <div className={`flex flex-col ${isOwnMessage ? 'items-end' : 'items-start'}`}>
                  <div 
                    className={`px-4 py-2 rounded-2xl ${
                      isOwnMessage 
                        ? 'bg-purple-600 text-white rounded-tr-none' 
                        : 'bg-gray-200 dark:bg-slate-700 text-gray-800 dark:text-gray-200 rounded-tl-none'
                    }`}
                  >
                    <p className="whitespace-pre-wrap break-words">{message.message}</p>
                  </div>
                  
                  <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 px-1">
                    {format(new Date(message.created_at), 'dd MMM à HH:mm', { locale: fr })}
                    {isOwnMessage && (
                      <span className="ml-1">
                        {message.read ? '• Lu' : ''}
                      </span>
                    )}
                  </span>
                </div>
                
                {isOwnMessage && (
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-indigo-200 text-indigo-700 text-xs">
                      {currentUserId.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>
    </ScrollArea>
  );
};
