
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface RealtimeMessagingProps {
  userId: string;
  activeContact: string | null;
  conversations?: any[];
}

export const useRealtimeMessaging = ({ 
  userId, 
  activeContact,
  conversations 
}: RealtimeMessagingProps) => {
  const queryClient = useQueryClient();

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
};
