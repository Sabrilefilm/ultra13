
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Clock } from "lucide-react";
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Contact {
  id: string;
  username: string;
  role: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

export interface ContactListProps {
  contacts: Contact[];
  activeContactId: string;
  onSelectContact: (contactId: string) => void;
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
  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (contacts.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-4 text-gray-500 dark:text-gray-400">
        <p>Aucune conversation</p>
      </div>
    );
  }

  return (
    <div className="overflow-y-auto h-full">
      <ul className="divide-y divide-gray-200 dark:divide-gray-800">
        {contacts.map((contact) => {
          const unreadCount = unreadCounts[contact.id] || contact.unreadCount || 0;
          
          return (
            <li
              key={contact.id}
              className={`p-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800/60 transition-colors ${
                contact.id === activeContactId
                  ? "bg-blue-50 dark:bg-blue-900/20"
                  : ""
              }`}
              onClick={() => onSelectContact(contact.id)}
            >
              <div className="flex items-start gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {contact.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col">
                      <span className="font-medium truncate">
                        {contact.username}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {contact.role}
                      </span>
                    </div>
                    
                    <div className="flex flex-col items-end">
                      <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                        <Clock className="w-3 h-3 mr-1" />
                        <span>
                          {formatDistanceToNow(new Date(contact.lastMessageTime), {
                            addSuffix: true,
                            locale: fr
                          })}
                        </span>
                      </div>
                      
                      {unreadCount > 0 && (
                        <Badge variant="destructive" className="mt-1">
                          {unreadCount}
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <p className="truncate text-sm text-gray-600 dark:text-gray-300 mt-1">
                    {contact.lastMessage}
                  </p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
