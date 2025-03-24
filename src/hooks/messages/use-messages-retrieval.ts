
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useEffect } from 'react';
import { toast } from 'sonner';

interface MessagesRetrievalProps {
  userId: string;
  activeContact: string | null;
}

export const useMessagesRetrieval = ({ userId, activeContact }: MessagesRetrievalProps) => {
  const queryClient = useQueryClient();

  // Fetch messages for the active conversation
  const { data: messages, isLoading: loadingMessages, refetch: refetchMessages } = useQuery({
    queryKey: ['messages', userId, activeContact],
    queryFn: async () => {
      if (!activeContact || !userId) return [];
      
      try {
        const { data, error } = await supabase
          .from('chats')
          .select('*')
          .or(`and(sender_id.eq.${userId},receiver_id.eq.${activeContact}),and(sender_id.eq.${activeContact},receiver_id.eq.${userId})`)
          .is('archived', null) // Exclude archived messages
          .order('created_at', { ascending: true });
        
        if (error) throw error;
        return data || [];
      } catch (error) {
        console.error('Error fetching messages:', error);
        toast.error('Erreur lors du chargement des messages');
        return [];
      }
    },
    enabled: !!activeContact && !!userId,
    retry: 1,
  });

  // Get unread message count
  const { data: unreadCount, isLoading: loadingUnread, refetch: refetchUnread } = useQuery({
    queryKey: ['unread', userId],
    queryFn: async () => {
      if (!userId) return 0;
      
      try {
        const { data, error, count } = await supabase
          .from('chats')
          .select('*', { count: 'exact' })
          .eq('receiver_id', userId)
          .eq('read', false)
          .is('archived', null);
        
        if (error) throw error;
        return count || 0;
      } catch (error) {
        console.error('Error fetching unread count:', error);
        return 0;
      }
    },
    enabled: !!userId,
    retry: 1,
  });

  // Mark messages as read when conversation is opened
  useEffect(() => {
    const markAsRead = async () => {
      if (!activeContact || !messages?.length || !userId) return;
      
      const unreadMessages = messages.filter(msg => 
        msg.receiver_id === userId && !msg.read
      );
      
      if (unreadMessages.length > 0) {
        try {
          const { error } = await supabase
            .from('chats')
            .update({ read: true })
            .in('id', unreadMessages.map(msg => msg.id));
          
          if (error) {
            console.error('Error marking messages as read:', error);
            return;
          }
          
          queryClient.invalidateQueries({ queryKey: ['messages'] });
          queryClient.invalidateQueries({ queryKey: ['conversations'] });
          queryClient.invalidateQueries({ queryKey: ['unread'] });
        } catch (error) {
          console.error('Error marking messages as read:', error);
        }
      }
    };
    
    markAsRead();
  }, [activeContact, messages, userId, queryClient]);

  return {
    messages,
    loadingMessages,
    refetchMessages,
    unreadCount,
    loadingUnread,
    refetchUnread
  };
};
