
import React from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Archive, User } from 'lucide-react';

interface MessageHeaderProps {
  contact?: {
    id: string;
    username: string;
    role: string;
  };
  onArchive?: () => void;
  onNewMessage?: () => void;
  role?: string;
  unreadCount?: number;
  isMobile?: boolean;
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
  onBack?: () => void;
}

export const MessageHeader = ({ 
  contact, 
  onArchive, 
  role,
  unreadCount,
  isMobile,
  activeTab,
  setActiveTab,
  onBack
}: MessageHeaderProps) => {
  if (isMobile) {
    return (
      <div className="w-full border-b dark:border-gray-700 p-3 flex flex-col space-y-2">
        {contact && activeTab === 'messages' && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="icon"
                className="h-8 w-8"
                onClick={onBack}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <span className="font-medium">{contact.username}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                ({contact.role})
              </span>
            </div>
            
            {onArchive && role === 'founder' && (
              <Button 
                variant="ghost" 
                size="icon"
                className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                onClick={onArchive}
              >
                <Archive className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}
        
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="contacts" className="relative">
              Contacts
              {unreadCount && unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="messages" disabled={!contact}>
              Messages
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    );
  }
  
  if (!contact) return null;
  
  return (
    <div className="border-b dark:border-gray-700 p-4 flex justify-between items-center">
      <div className="flex items-center space-x-2">
        <div className="h-8 w-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
          <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h3 className="font-medium">{contact.username}</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">{contact.role}</p>
        </div>
      </div>
      
      {onArchive && role === 'founder' && (
        <Button 
          variant="outline" 
          size="sm"
          className="text-red-500 border-red-200 dark:border-red-900 hover:bg-red-50 dark:hover:bg-red-900/20"
          onClick={onArchive}
        >
          <Archive className="h-4 w-4 mr-2" />
          Archiver
        </Button>
      )}
    </div>
  );
};
