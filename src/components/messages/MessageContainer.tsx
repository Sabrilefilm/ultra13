
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { ContactList } from './ContactList';
import { MessageList } from './MessageList';
import { MessageHeader } from './MessageHeader';
import { MessageComposer } from './MessageComposer';
import { Loading } from '@/components/ui/loading';

interface Contact {
  id: string;
  username: string;
  role: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

interface MessageContainerProps {
  username: string;
  role: string;
  userId: string;
}

export const MessageContainer = ({ username, role, userId }: MessageContainerProps) => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [activeContactId, setActiveContactId] = useState<string>('');
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    fetchContacts();
    
    // Set up real-time subscription for new messages
    const channel = supabase
      .channel('new-messages')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'chats' 
      }, (payload) => {
        const newMessage = payload.new;
        
        // Update messages if from active conversation
        if (
          (newMessage.sender_id === activeContactId && newMessage.receiver_id === userId) || 
          (newMessage.sender_id === userId && newMessage.receiver_id === activeContactId)
        ) {
          setMessages(prev => [...prev, newMessage]);
        }
        
        // Update contact list with new message info
        fetchContacts();
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, activeContactId]);
  
  useEffect(() => {
    if (activeContactId) {
      fetchMessages();
    }
  }, [activeContactId]);
  
  const fetchContacts = async () => {
    try {
      setIsLoading(true);
      
      // Fetch all users except current user
      const { data: usersData, error: usersError } = await supabase
        .from('user_accounts')
        .select('id, username, role')
        .not('id', 'eq', userId);
        
      if (usersError) throw usersError;
      
      // For each user, get the last message between them and current user
      const contactsWithMessages = await Promise.all(
        usersData.map(async (user) => {
          // Get last message and unread count
          const { data: lastMessageData, error: messageError } = await supabase
            .from('chats')
            .select('*')
            .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
            .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
            .order('created_at', { ascending: false })
            .limit(1);
            
          if (messageError) throw messageError;
          
          // Count unread messages
          const { count, error: countError } = await supabase
            .from('chats')
            .select('*', { count: 'exact', head: false })
            .eq('sender_id', user.id)
            .eq('receiver_id', userId)
            .eq('read', false);
            
          if (countError) throw countError;
          
          // Format last message time
          const lastMessage = lastMessageData?.[0] || null;
          const lastMessageText = lastMessage ? lastMessage.message : '';
          const lastMessageTime = lastMessage 
            ? new Date(lastMessage.created_at).toLocaleString() 
            : '';
            
          return {
            ...user,
            lastMessage: lastMessageText,
            lastMessageTime,
            unreadCount: count || 0
          };
        })
      );
      
      // Update unread counts
      const newUnreadCounts: Record<string, number> = {};
      contactsWithMessages.forEach(contact => {
        newUnreadCounts[contact.id] = contact.unreadCount;
      });
      setUnreadCounts(newUnreadCounts);
      
      // Sort contacts by last message time (most recent first)
      const sortedContacts = contactsWithMessages
        .filter(contact => contact.lastMessage) // Only show contacts with messages
        .sort((a, b) => {
          if (!a.lastMessageTime) return 1;
          if (!b.lastMessageTime) return -1;
          return new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime();
        });
      
      setContacts(sortedContacts);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      toast.error('Erreur lors du chargement des contacts');
    } finally {
      setIsLoading(false);
    }
  };
  
  const fetchMessages = async () => {
    if (!activeContactId) return;
    
    try {
      setIsLoading(true);
      
      // Get all messages between current user and active contact
      const { data, error } = await supabase
        .from('chats')
        .select('*')
        .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
        .or(`sender_id.eq.${activeContactId},receiver_id.eq.${activeContactId}`)
        .order('created_at', { ascending: true });
        
      if (error) throw error;
      
      setMessages(data || []);
      
      // Mark messages as read
      if (data && data.length > 0) {
        const unreadMessages = data.filter(msg => 
          msg.sender_id === activeContactId && 
          msg.receiver_id === userId && 
          !msg.read
        );
        
        if (unreadMessages.length > 0) {
          await supabase
            .from('chats')
            .update({ read: true })
            .in('id', unreadMessages.map(msg => msg.id));
          
          // Update unread count after marking as read
          setUnreadCounts(prev => ({
            ...prev,
            [activeContactId]: 0
          }));
        }
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Erreur lors du chargement des messages');
    } finally {
      setIsLoading(false);
    }
  };
  
  const sendMessage = async (message: string) => {
    if (!message.trim() || !activeContactId) return;
    
    try {
      const { error } = await supabase
        .from('chats')
        .insert([
          {
            sender_id: userId,
            receiver_id: activeContactId,
            message,
            read: false
          }
        ]);
        
      if (error) throw error;
      
      // Refresh messages (real-time subscription should handle this)
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Erreur lors de l\'envoi du message');
    }
  };
  
  return (
    <div className="h-full flex flex-col">
      <div className="flex h-full">
        <div className="w-1/3 border-r dark:border-gray-700 h-full">
          <ContactList 
            contacts={contacts}
            activeContactId={activeContactId}
            onSelectContact={setActiveContactId}
            isLoading={isLoading}
            unreadCounts={unreadCounts}
          />
        </div>
        
        <div className="w-2/3 flex flex-col h-full">
          {activeContactId ? (
            <>
              <MessageHeader 
                contact={contacts.find(c => c.id === activeContactId)} 
              />
              
              <div className="flex-1 overflow-auto p-4">
                <MessageList 
                  messages={messages} 
                  currentUserId={userId} 
                  contactId={activeContactId}
                />
              </div>
              
              <MessageComposer onSendMessage={sendMessage} />
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500 dark:text-gray-400">
                Sélectionnez un contact pour commencer à discuter
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
