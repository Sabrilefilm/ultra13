
import { useState } from 'react';
import { Search, User, UserCheck } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export interface ContactListProps {
  contacts: {
    id: any;
    username: any;
    role: any;
    lastMessage: string;
    lastMessageTime: string;
    unreadCount: number;
  }[];
  activeContactId: string;
  onSelectContact: (id: string) => void;
  isLoading: boolean;
  unreadCounts: Record<string, number>;
}

export const ContactList = ({ 
  contacts, 
  activeContactId, 
  onSelectContact, 
  isLoading,
  unreadCounts
}: ContactListProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredContacts = contacts.filter(contact => 
    contact.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'founder':
        return <Badge className="bg-rose-500">Fondateur</Badge>;
      case 'manager':
        return <Badge className="bg-indigo-500">Manager</Badge>;
      case 'agent':
        return <Badge className="bg-amber-500">Agent</Badge>;
      case 'creator':
        return <Badge className="bg-emerald-500">Créateur</Badge>;
      default:
        return <Badge className="bg-gray-500">{role}</Badge>;
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b dark:border-gray-700/30 bg-blue-50 dark:bg-blue-950/30">
        <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">Conversations</h2>
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher..."
            className="pl-9 bg-white dark:bg-slate-900 border-blue-100 dark:border-blue-900/30"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <ScrollArea className="flex-1">
        {isLoading ? (
          <div className="flex justify-center items-center h-24">
            <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full" />
          </div>
        ) : filteredContacts.length > 0 ? (
          <div className="space-y-1 p-2">
            {filteredContacts.map((contact) => (
              <button
                key={contact.id}
                className={`w-full flex items-start gap-3 p-3 rounded-lg hover:bg-white dark:hover:bg-slate-800 transition-colors ${
                  activeContactId === contact.id 
                    ? 'bg-white dark:bg-slate-800 shadow-sm' 
                    : 'bg-transparent'
                }`}
                onClick={() => onSelectContact(contact.id)}
              >
                <Avatar className="w-10 h-10 border-2 border-blue-100 dark:border-blue-900">
                  <AvatarFallback className="bg-gradient-to-br from-blue-400 to-blue-600 text-white">
                    {contact.username.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 overflow-hidden text-left">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium truncate">{contact.username}</span>
                      <span className="text-xs">{getRoleIcon(contact.role)}</span>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {contact.lastMessageTime ? new Date(contact.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-sm text-muted-foreground truncate max-w-[70%]">
                      {contact.lastMessage || 'Aucun message'}
                    </p>
                    {(unreadCounts[contact.id] || 0) > 0 && (
                      <Badge variant="default" className="bg-blue-500 text-white">
                        {unreadCounts[contact.id]}
                      </Badge>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-40 text-muted-foreground p-4">
            <User className="h-10 w-10 mb-2 text-blue-500/50" />
            <p className="text-center">Aucun contact trouvé</p>
          </div>
        )}
      </ScrollArea>
    </div>
  );
};
