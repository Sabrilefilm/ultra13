
import { useEffect, useRef } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Check, CheckCheck } from 'lucide-react';

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  message: string;
  created_at: string;
  read: boolean;
  attachment_url?: string;
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

  const formatMessageDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    // Same day, show only time
    if (date.toDateString() === today.toDateString()) {
      return `Aujourd'hui à ${format(date, 'HH:mm', { locale: fr })}`;
    }
    
    // Yesterday, show "Yesterday" and time
    if (date.toDateString() === yesterday.toDateString()) {
      return `Hier à ${format(date, 'HH:mm', { locale: fr })}`;
    }
    
    // Different day, show full date and time
    return format(date, 'dd MMM à HH:mm', { locale: fr });
  };

  // Group messages by date
  const groupedMessages: { [key: string]: Message[] } = {};
  messages.forEach(message => {
    const date = new Date(message.created_at).toDateString();
    if (!groupedMessages[date]) {
      groupedMessages[date] = [];
    }
    groupedMessages[date].push(message);
  });

  if (isLoading) {
    return (
      <div className="flex flex-col h-full items-center justify-center p-6">
        <div className="w-8 h-8 border-4 border-t-transparent border-blue-600 rounded-full animate-spin mb-3"></div>
        <p className="text-gray-500 dark:text-gray-400">Chargement des messages...</p>
      </div>
    );
  }

  if (!messages || messages.length === 0) {
    return (
      <div className="flex flex-col h-full items-center justify-center p-6 text-center">
        <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4">
          <span className="text-blue-600 dark:text-blue-400 text-2xl">💬</span>
        </div>
        <p className="text-gray-600 dark:text-gray-300 mb-2">Aucun message</p>
        <p className="text-gray-400 dark:text-gray-500 text-sm">Commencez la conversation en envoyant un message</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full px-4">
      <div className="flex flex-col space-y-4 py-4">
        {Object.keys(groupedMessages).map(date => (
          <div key={date} className="space-y-4">
            <div className="flex justify-center">
              <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs px-3 py-1 rounded-full">
                {formatMessageDate(groupedMessages[date][0].created_at)}
              </div>
            </div>
            
            {groupedMessages[date].map((message) => {
              const isOwnMessage = message.sender_id === currentUserId;
              const messageTime = format(new Date(message.created_at), 'HH:mm', { locale: fr });
              
              return (
                <div 
                  key={message.id} 
                  className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'} items-end gap-2 max-w-[80%]`}>
                    {!isOwnMessage && (
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-blue-200 text-blue-700 text-xs">
                          {message.sender_id.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    
                    <div className={`flex flex-col ${isOwnMessage ? 'items-end' : 'items-start'}`}>
                      <div 
                        className={`px-4 py-2 rounded-2xl ${
                          isOwnMessage 
                            ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-tr-none' 
                            : 'bg-gray-200 dark:bg-slate-700 text-gray-800 dark:text-gray-200 rounded-tl-none'
                        }`}
                      >
                        <p className="whitespace-pre-wrap break-words">{message.message}</p>
                        
                        {/* Display attachment if exists */}
                        {message.attachment_url && (
                          <div className="mt-2">
                            <img 
                              src={message.attachment_url} 
                              alt="Attachment" 
                              className="max-w-full rounded cursor-pointer hover:opacity-90 transition-opacity"
                              onClick={() => window.open(message.attachment_url, '_blank')}
                            />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1 px-1">
                        <span>{messageTime}</span>
                        {isOwnMessage && (
                          <span className="ml-1 flex items-center">
                            {message.read ? (
                              <CheckCheck className="h-3 w-3 text-blue-500 ml-1" />
                            ) : (
                              <Check className="h-3 w-3 ml-1" />
                            )}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {isOwnMessage && (
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-blue-200 text-blue-700 text-xs">
                          {currentUserId.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
    </ScrollArea>
  );
};
