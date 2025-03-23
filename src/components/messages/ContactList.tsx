
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Search, Users, Check, CheckCheck, Clock } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { format, isToday, isYesterday } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Contact {
  id: string;
  username: string;
  role: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount: number;
}

export interface ContactListProps {
  contacts: Contact[];
  activeContactId: string;
  onSelectContact: (contactId: string) => void;
  isLoading: boolean;
  unreadCounts: number;
}

export const ContactList = ({
  contacts,
  activeContactId,
  onSelectContact,
  isLoading,
  unreadCounts
}: ContactListProps) => {
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter contacts based on the current tab and search query
  const filteredContacts = contacts?.filter(contact => {
    const matchesSearch = contact.username.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filter === 'unread') {
      return matchesSearch && contact.unreadCount > 0;
    }
    
    return matchesSearch;
  });
  
  // Sort contacts: unread first, then by last message time
  const sortedContacts = filteredContacts?.sort((a, b) => {
    // Unread contacts go first
    if (a.unreadCount > 0 && b.unreadCount === 0) return -1;
    if (a.unreadCount === 0 && b.unreadCount > 0) return 1;
    
    // Then sort by time (assuming ISO format strings)
    if (a.lastMessageTime && b.lastMessageTime) {
      return new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime();
    }
    
    return 0;
  });
  
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'founder':
        return 'bg-blue-500';
      case 'manager':
        return 'bg-amber-500';
      case 'agent':
        return 'bg-emerald-500';
      case 'creator':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };
  
  const formatMessageTime = (timestamp: string) => {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    
    if (isToday(date)) {
      return format(date, 'HH:mm');
    } else if (isYesterday(date)) {
      return 'Hier';
    } else {
      return format(date, 'dd MMM', { locale: fr });
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full p-8">
        <div className="w-8 h-8 border-4 border-t-transparent border-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-950">
      <div className="p-3 border-b border-gray-200 dark:border-gray-800">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
          <Input
            type="text"
            placeholder="Rechercher une conversation..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-gray-100 dark:bg-slate-800 border-gray-200 dark:border-gray-700"
          />
        </div>
        
        <Tabs value={filter} onValueChange={setFilter} className="mt-2">
          <TabsList className="w-full">
            <TabsTrigger value="all" className="flex-1">
              Tous
            </TabsTrigger>
            <TabsTrigger value="unread" className="flex-1">
              Non lus 
              {unreadCounts > 0 && (
                <Badge variant="destructive" className="ml-2 animate-pulse">
                  {unreadCounts}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <ScrollArea className="flex-1">
        {sortedContacts?.length > 0 ? (
          <div className="divide-y divide-gray-200 dark:divide-gray-800">
            {sortedContacts.map((contact) => (
              <div
                key={contact.id}
                onClick={() => onSelectContact(contact.id)}
                className={`p-3 cursor-pointer ${
                  activeContactId === contact.id
                    ? 'bg-blue-50 dark:bg-blue-900/20'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-900/50'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <Avatar className={`h-10 w-10 border-2 ${activeContactId === contact.id ? 'border-blue-300 dark:border-blue-600' : 'border-gray-200 dark:border-gray-700'}`}>
                    <AvatarFallback className={`${getRoleColor(contact.role)} text-white`}>
                      {contact.username.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <div className="font-medium truncate dark:text-white">
                        {contact.username}
                      </div>
                      {contact.lastMessageTime && (
                        <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap ml-2">
                          {formatMessageTime(contact.lastMessageTime)}
                        </span>
                      )}
                    </div>
                    
                    <div className="text-sm truncate text-gray-500 dark:text-gray-400 pr-6">
                      {contact.lastMessage || "Début de la conversation"}
                    </div>
                    
                    <div className="flex items-center justify-between mt-1">
                      <div className="text-xs text-gray-500 capitalize">
                        {contact.role}
                      </div>
                      
                      <div className="flex items-center">
                        {contact.unreadCount > 0 ? (
                          <Badge 
                            variant="destructive" 
                            className="animate-pulse text-xs px-2 py-0 h-5 min-w-5 flex items-center justify-center"
                          >
                            {contact.unreadCount}
                          </Badge>
                        ) : (
                          <CheckCheck className="h-4 w-4 text-blue-500" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center text-gray-500 dark:text-gray-400">
            <Users className="h-12 w-12 mb-3 text-gray-300 dark:text-gray-600" />
            <h3 className="text-lg font-medium mb-1">Aucune conversation</h3>
            <p className="text-sm">
              {searchQuery 
                ? "Aucun résultat pour cette recherche." 
                : filter === 'unread'
                  ? "Vous n'avez pas de messages non lus."
                  : "Commencez une nouvelle conversation avec le bouton '+'."}
            </p>
          </div>
        )}
      </ScrollArea>
    </div>
  );
};
