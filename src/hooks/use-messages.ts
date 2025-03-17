
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

interface Contact {
  id: string;
  username: string;
  role: string;
  unreadCount?: number;
  lastMessage?: string;
  lastMessageTime?: string;
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
      const { data: messages, error } = await supabase
        .from('chats')
        .select('receiver_id, sender_id, created_at, message, read')
        .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Extract unique user IDs (conversation partners)
      const userCounts: Record<string, { 
        unreadCount: number, 
        lastMessage?: string,
        lastMessageTime?: string
      }> = {};
      
      messages?.forEach(msg => {
        const partnerId = msg.sender_id === userId ? msg.receiver_id : msg.sender_id;
        
        if (!userCounts[partnerId]) {
          userCounts[partnerId] = { unreadCount: 0 };
        }
        
        // Count unread messages
        if (msg.receiver_id === userId && !msg.read) {
          userCounts[partnerId].unreadCount += 1;
        }
        
        // Track last message
        if (!userCounts[partnerId].lastMessage) {
          userCounts[partnerId].lastMessage = msg.message;
          userCounts[partnerId].lastMessageTime = msg.created_at;
        }
      });
      
      // Get user details for all conversation partners
      const partnerIds = Object.keys(userCounts);
      if (partnerIds.length === 0) return [];
      
      const { data: userDetails, error: userError } = await supabase
        .from('user_accounts')
        .select('id, username, role')
        .in('id', partnerIds);
      
      if (userError) throw userError;
      
      // Combine user details with unread counts
      return userDetails?.map(user => ({
        ...user,
        unreadCount: userCounts[user.id].unreadCount,
        lastMessage: userCounts[user.id].lastMessage,
        lastMessageTime: userCounts[user.id].lastMessageTime
      })) || [];
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
        else {
          queryClient.invalidateQueries({ queryKey: ['messages'] });
          queryClient.invalidateQueries({ queryKey: ['conversations'] });
          queryClient.invalidateQueries({ queryKey: ['unread'] });
        }
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
      queryClient.invalidateQueries({ queryKey: ['unread'] });
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
        
        // Show notification for new message if not from current user and not in active conversation
        if (payload.new && payload.new.sender_id !== userId && 
            (!activeContact || activeContact !== payload.new.sender_id)) {
          const sender = conversations?.find(c => c.id === payload.new.sender_id);
          toast.success(`Nouveau message de ${sender?.username || 'Utilisateur'}`);
        }
      })
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'chats'
      }, () => {
        queryClient.invalidateQueries({ queryKey: ['messages'] });
        queryClient.invalidateQueries({ queryKey: ['conversations'] });
        queryClient.invalidateQueries({ queryKey: ['unread'] });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, conversations, queryClient, activeContact]);

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
