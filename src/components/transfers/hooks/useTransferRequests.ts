
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
      
      // Use separate queries instead of foreign key joins
      const { data, error } = await supabase
        .from('transfer_requests')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      if (data) {
        // Filter based on role
        let filteredData;
        if (roleParam === 'founder') {
          filteredData = data;
        } else if (roleParam === 'manager' || roleParam === 'agent') {
          filteredData = data.filter(request => 
            request.current_agent_id === userIdParam || 
            request.requested_agent_id === userIdParam
          );
        } else {
          filteredData = data.filter(request => request.creator_id === userIdParam);
        }
        
        // Now fetch the related user data for each request
        const enrichedRequests = await Promise.all(
          filteredData.map(async (request) => {
            const [creatorData, currentAgentData, requestedAgentData] = await Promise.all([
              fetchUserById(request.creator_id),
              fetchUserById(request.current_agent_id),
              fetchUserById(request.requested_agent_id)
            ]);
            
            return {
              ...request,
              creator: creatorData,
              current_agent: currentAgentData,
              requested_agent: requestedAgentData
            };
          })
        );
        
        setTransferRequests(enrichedRequests);
      }
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

  // Helper function to fetch user data by ID
  const fetchUserById = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_accounts')
        .select('id, username')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error('Error fetching user:', error);
        return { id: userId, username: 'Inconnu' };
      }
      
      return data;
    } catch (error) {
      console.error('Error in fetchUserById:', error);
      return { id: userId, username: 'Inconnu' };
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
