
import { useState } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Search, MessageCircle, Circle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format, isToday, isYesterday } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Contact {
  id: string;
  username: string;
  role: string;
  unreadCount?: number;
  lastMessage?: string;
  lastMessageTime?: string;
}

interface ContactListProps {
  contacts: Contact[];
  activeContactId: string | null;
  onSelectContact: (contactId: string) => void;
  isLoading: boolean;
  unreadMessages?: number;
}

export const ContactList = ({ 
  contacts, 
  activeContactId, 
  onSelectContact, 
  isLoading,
  unreadMessages = 0
}: ContactListProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredContacts = searchQuery.trim() 
    ? contacts.filter(contact => 
        contact.username.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : contacts;

  // Sort contacts: unread first, then by last message time
  const sortedContacts = [...filteredContacts].sort((a, b) => {
    // First sort by unread count (desc)
    if ((a.unreadCount || 0) > 0 && (b.unreadCount || 0) === 0) return -1;
    if ((a.unreadCount || 0) === 0 && (b.unreadCount || 0) > 0) return 1;
    
    // Then sort by last message time (desc)
    if (a.lastMessageTime && b.lastMessageTime) {
      return new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime();
    }
    
    return 0;
  });

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'founder':
        return 'bg-red-500';
      case 'manager':
        return 'bg-amber-500';
      case 'agent':
        return 'bg-emerald-500';
      case 'creator':
        return 'bg-blue-500';
      case 'ambassadeur':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getRoleName = (role: string) => {
    switch (role) {
      case 'founder':
        return 'Fondateur';
      case 'manager':
        return 'Manager';
      case 'agent':
        return 'Agent';
      case 'creator':
        return 'Créateur';
      case 'ambassadeur':
        return 'Ambassadeur';
      default:
        return role;
    }
  };

  const formatMessageTime = (dateString?: string) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    
    if (isToday(date)) {
      return format(date, 'HH:mm', { locale: fr });
    } else if (isYesterday(date)) {
      return 'Hier';
    } else {
      return format(date, 'dd/MM', { locale: fr });
    }
  };

  const truncateMessage = (message?: string, length = 30) => {
    if (!message) return '';
    if (message.length <= length) return message;
    return message.substring(0, length) + '...';
  };

  if (isLoading) {
    return (
      <div className="flex flex-col h-full items-center justify-center p-6">
        <div className="w-8 h-8 border-4 border-t-transparent border-blue-600 rounded-full animate-spin mb-3"></div>
        <p className="text-gray-500 dark:text-gray-400">Chargement des contacts...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
          <Input
            placeholder="Rechercher un contact..."
            className="pl-10 bg-gray-100 dark:bg-slate-800 border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-2">
          {sortedContacts.length > 0 ? (
            sortedContacts.map((contact) => (
              <div
                key={contact.id}
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                  activeContactId === contact.id
                    ? 'bg-blue-100 dark:bg-blue-900/30'
                    : 'hover:bg-gray-100 dark:hover:bg-slate-800'
                }`}
                onClick={() => onSelectContact(contact.id)}
              >
                <div className="relative">
                  <Avatar className="h-12 w-12 border-2 border-transparent transition-all">
                    <AvatarFallback className={`${getRoleColor(contact.role)} text-white`}>
                      {contact.username.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {(contact.unreadCount || 0) > 0 && (
                    <div className="absolute -top-1 -right-1">
                      <Badge variant="destructive" className="h-5 min-w-5 flex items-center justify-center rounded-full px-1.5 text-xs animate-pulse">
                        {contact.unreadCount}
                      </Badge>
                    </div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className={`font-medium text-gray-900 dark:text-gray-100 truncate ${(contact.unreadCount || 0) > 0 ? 'font-bold' : ''}`}>
                      {contact.username}
                    </p>
                    {contact.lastMessageTime && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {formatMessageTime(contact.lastMessageTime)}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {getRoleName(contact.role)}
                    </p>
                  </div>
                  {contact.lastMessage && (
                    <p className={`text-sm text-gray-600 dark:text-gray-300 truncate mt-1 ${(contact.unreadCount || 0) > 0 ? 'font-semibold' : ''}`}>
                      {truncateMessage(contact.lastMessage)}
                    </p>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center p-6 text-center">
              <MessageCircle className="h-10 w-10 text-blue-400 mb-2" />
              <p className="text-gray-500 dark:text-gray-400">Aucun contact trouvé</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
