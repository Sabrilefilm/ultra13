
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import { useScheduleManagement } from '@/hooks/user-management/use-schedule-management';

export type TransferRequest = {
  id: string;
  creator_id: string;
  current_agent_id: string;
  requested_agent_id: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  rejection_reason?: string;
  created_at: string;
  creator?: { id: string; username: string };
  current_agent?: { id: string; username: string };
  requested_agent?: { id: string; username: string };
};

export function useTransferRequests(userId: string, role: string) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [transferRequests, setTransferRequests] = useState<TransferRequest[]>([]);
  const queryClient = useQueryClient();
  
  const { processTransfer } = useScheduleManagement(() => {
    fetchTransferRequests();
    queryClient.invalidateQueries({ queryKey: ["transfers"] });
  });

  const fetchTransferRequests = async (userIdParam = userId, roleParam = role) => {
    try {
      setLoading(true);
      let query;
      
      if (roleParam === 'founder') {
        query = supabase
          .from('transfer_requests')
          .select(`
            *,
            creator:creator_id(id, username),
            current_agent:current_agent_id(id, username),
            requested_agent:requested_agent_id(id, username)
          `)
          .order('created_at', { ascending: false });
      } else if (roleParam === 'manager') {
        query = supabase
          .from('transfer_requests')
          .select(`
            *,
            creator:creator_id(id, username),
            current_agent:current_agent_id(id, username),
            requested_agent:requested_agent_id(id, username)
          `)
          .or(`current_agent_id.eq.${userIdParam},requested_agent_id.eq.${userIdParam}`)
          .order('created_at', { ascending: false });
      } else if (roleParam === 'agent') {
        query = supabase
          .from('transfer_requests')
          .select(`
            *,
            creator:creator_id(id, username),
            current_agent:current_agent_id(id, username),
            requested_agent:requested_agent_id(id, username)
          `)
          .or(`current_agent_id.eq.${userIdParam},requested_agent_id.eq.${userIdParam}`)
          .order('created_at', { ascending: false });
      } else {
        query = supabase
          .from('transfer_requests')
          .select(`
            *,
            creator:creator_id(id, username),
            current_agent:current_agent_id(id, username),
            requested_agent:requested_agent_id(id, username)
          `)
          .eq('creator_id', userIdParam)
          .order('created_at', { ascending: false });
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      setTransferRequests(data || []);
    } catch (error) {
      console.error('Error fetching transfer requests:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors du chargement des demandes de transfert",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApproveTransfer = async (requestId: string) => {
    const success = await processTransfer(requestId, 'approved');
    if (success) {
      fetchTransferRequests();
    }
  };

  const handleRejectTransfer = async (requestId: string, rejectionReason = 'Demande rejetée') => {
    const success = await processTransfer(requestId, 'rejected', rejectionReason);
    if (success) {
      fetchTransferRequests();
    }
  };

  useEffect(() => {
    fetchTransferRequests(userId, role);
  }, [userId, role]);

  return {
    loading,
    transferRequests,
    fetchTransferRequests,
    handleApproveTransfer,
    handleRejectTransfer
  };
}
