
import { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

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

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b dark:border-gray-700">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher..."
            className="pl-9"
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
                className={`w-full flex items-start gap-3 p-3 rounded-lg hover:bg-muted transition-colors ${
                  activeContactId === contact.id ? 'bg-muted' : ''
                }`}
                onClick={() => onSelectContact(contact.id)}
              >
                <div className="flex-1 overflow-hidden text-left">
                  <div className="flex items-center justify-between">
                    <span className="font-medium truncate">{contact.username}</span>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {contact.lastMessageTime ? new Date(contact.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-sm text-muted-foreground truncate max-w-[70%]">
                      {contact.lastMessage || 'Aucun message'}
                    </p>
                    {(unreadCounts[contact.id] || 0) > 0 && (
                      <Badge variant="default" className="bg-primary text-white">
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
            <p className="text-center">Aucun contact trouvé</p>
          </div>
        )}
      </ScrollArea>
    </div>
  );
};
