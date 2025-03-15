
import { useState } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Search, MessageCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Contact {
  id: string;
  username: string;
  role: string;
}

interface ContactListProps {
  contacts: Contact[];
  activeContactId: string | null;
  onSelectContact: (contactId: string) => void;
  isLoading: boolean;
}

export const ContactList = ({ 
  contacts, 
  activeContactId, 
  onSelectContact, 
  isLoading 
}: ContactListProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredContacts = searchQuery.trim() 
    ? contacts.filter(contact => 
        contact.username.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : contacts;

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
      default:
        return role;
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col h-full items-center justify-center p-6">
        <div className="w-8 h-8 border-4 border-t-transparent border-purple-600 rounded-full animate-spin mb-3"></div>
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
            className="pl-10 bg-gray-100 dark:bg-slate-800 border-gray-200 dark:border-gray-700"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-2">
          {filteredContacts.length > 0 ? (
            filteredContacts.map((contact) => (
              <div
                key={contact.id}
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                  activeContactId === contact.id
                    ? 'bg-purple-100 dark:bg-purple-900/30'
                    : 'hover:bg-gray-100 dark:hover:bg-slate-800'
                }`}
                onClick={() => onSelectContact(contact.id)}
              >
                <Avatar className="h-10 w-10">
                  <AvatarFallback className={`${getRoleColor(contact.role)} text-white`}>
                    {contact.username.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-gray-900 dark:text-gray-100 truncate">
                      {contact.username}
                    </p>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {getRoleName(contact.role)}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center p-6 text-center">
              <MessageCircle className="h-10 w-10 text-gray-400 mb-2" />
              <p className="text-gray-500 dark:text-gray-400">Aucun contact trouvé</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
