
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  message: string;
  created_at: string;
  read: boolean;
}

export const useMessages = (userId: string) => {
  const queryClient = useQueryClient();
  const [activeContact, setActiveContact] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');

  // Fetch conversations (unique users the current user has chatted with)
  const { data: conversations, isLoading: loadingConversations } = useQuery({
    queryKey: ['conversations', userId],
    queryFn: async () => {
      if (!userId) return [];
      
      // Get all messages involving the current user
      const { data: sentMessages, error: sentError } = await supabase
        .from('chats')
        .select('receiver_id, sender_id, created_at')
        .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
        .order('created_at', { ascending: false });
      
      if (sentError) throw sentError;
      
      // Extract unique user IDs (conversation partners)
      const uniqueUsers = new Set<string>();
      sentMessages?.forEach(msg => {
        const partnerId = msg.sender_id === userId ? msg.receiver_id : msg.sender_id;
        uniqueUsers.add(partnerId);
      });
      
      // Get user details for all conversation partners
      const partnerIds = Array.from(uniqueUsers);
      if (partnerIds.length === 0) return [];
      
      const { data: userDetails, error: userError } = await supabase
        .from('user_accounts')
        .select('id, username, role')
        .in('id', partnerIds);
      
      if (userError) throw userError;
      
      return userDetails || [];
    },
    enabled: !!userId,
    retry: 1,
  });

  // Fetch messages for the active conversation
  const { data: messages, isLoading: loadingMessages } = useQuery({
    queryKey: ['messages', userId, activeContact],
    queryFn: async () => {
      if (!activeContact || !userId) return [];
      
      const { data, error } = await supabase
        .from('chats')
        .select('*')
        .or(`and(sender_id.eq.${userId},receiver_id.eq.${activeContact}),and(sender_id.eq.${activeContact},receiver_id.eq.${userId})`)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!activeContact && !!userId,
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
        const { error } = await supabase
          .from('chats')
          .update({ read: true })
          .in('id', unreadMessages.map(msg => msg.id));
        
        if (error) console.error('Error marking messages as read:', error);
        else queryClient.invalidateQueries({ queryKey: ['messages'] });
      }
    };
    
    markAsRead();
  }, [activeContact, messages, userId, queryClient]);

  // Send a new message
  const { mutate: sendMessage, isPending: sendingMessage } = useMutation({
    mutationFn: async () => {
      if (!activeContact || !newMessage.trim() || !userId) return;
      
      const { error } = await supabase
        .from('chats')
        .insert({
          sender_id: userId,
          receiver_id: activeContact,
          message: newMessage.trim(),
          read: false
        });
      
      if (error) throw error;
      setNewMessage('');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
    onError: (error) => {
      console.error('Error sending message:', error);
      toast.error('Erreur lors de l\'envoi du message');
    }
  });

  // Get unread message count
  const { data: unreadCount, isLoading: loadingUnread } = useQuery({
    queryKey: ['unread', userId],
    queryFn: async () => {
      if (!userId) return 0;
      
      const { data, error, count } = await supabase
        .from('chats')
        .select('*', { count: 'exact' })
        .eq('receiver_id', userId)
        .eq('read', false);
      
      if (error) throw error;
      return count || 0;
    },
    enabled: !!userId,
    retry: 1,
  });

  // Set up real-time subscription for new messages
  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel('public:chats')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'chats',
        filter: `receiver_id=eq.${userId}`
      }, (payload) => {
        queryClient.invalidateQueries({ queryKey: ['messages'] });
        queryClient.invalidateQueries({ queryKey: ['conversations'] });
        queryClient.invalidateQueries({ queryKey: ['unread'] });
        
        // Show notification for new message
        if (payload.new && payload.new.sender_id !== userId) {
          const sender = conversations?.find(c => c.id === payload.new.sender_id);
          toast.success(`Nouveau message de ${sender?.username || 'Utilisateur'}`);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, conversations, queryClient]);

  return {
    conversations,
    messages,
    activeContact,
    setActiveContact,
    newMessage,
    setNewMessage,
    sendMessage,
    sendingMessage,
    unreadCount,
    loadingConversations,
    loadingMessages,
    loadingUnread
  };
};
