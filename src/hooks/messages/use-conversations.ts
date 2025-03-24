
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export const useConversations = (userId: string) => {
  // Fetch all users for new conversation creation
  const { data: allUsers, isLoading: loadingUsers, refetch: refetchUsers } = useQuery({
    queryKey: ['all-users'],
    queryFn: async () => {
      if (!userId) return [];
      
      const { data, error } = await supabase
        .from('user_accounts')
        .select('id, username, role')
        .neq('id', userId);
        
      if (error) throw error;
      return data || [];
    },
    enabled: !!userId
  });

  // Fetch conversations (unique users the current user has chatted with)
  const { data: conversations, isLoading: loadingConversations, refetch: refetchConversations } = useQuery({
    queryKey: ['conversations', userId],
    queryFn: async () => {
      if (!userId) return [];
      
      try {
        // Get all messages involving the current user
        const { data: messages, error } = await supabase
          .from('chats')
          .select('receiver_id, sender_id, created_at, message, read, archived')
          .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
          .is('archived', null) // Exclude archived messages
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
      } catch (error) {
        console.error('Error fetching conversations:', error);
        toast.error('Erreur lors du chargement des conversations');
        return [];
      }
    },
    enabled: !!userId,
    retry: 1,
  });

  return {
    conversations,
    loadingConversations,
    refetchConversations,
    allUsers,
    loadingUsers,
    refetchUsers
  };
};
