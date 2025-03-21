
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export interface Agent {
  id: string;
  username: string;
}

export interface Creator {
  id: string;
  username: string;
  agent_id?: string;
}

export function useTransferRequestForm(
  isOpen: boolean,
  userId: string,
  role: string,
  onSuccess: () => void,
  onClose: () => void
) {
  const { toast } = useToast();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [creators, setCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<string>('');
  const [selectedCreator, setSelectedCreator] = useState<string>('');
  const [reason, setReason] = useState<string>('');
  const [currentAgent, setCurrentAgent] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchAgents();
      if (role === 'agent') {
        fetchCreators();
      } else if (role === 'creator') {
        fetchCreatorAgentId();
      }
    } else {
      // Reset form when dialog closes
      setSelectedAgent('');
      setSelectedCreator('');
      setReason('');
    }
  }, [isOpen, role, userId]);

  const fetchCreatorAgentId = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('user_accounts')
        .select('agent_id')
        .eq('id', userId)
        .single();
        
      if (error) throw error;
      
      console.log("Creator's current agent_id:", data?.agent_id);
      setCurrentAgent(data?.agent_id || null);
    } catch (error) {
      console.error('Error fetching creator agent_id:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAgents = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('user_accounts')
        .select('id, username')
        .eq('role', 'agent')
        .order('username');
        
      if (error) throw error;
      
      // If creator role, filter out current agent
      if (role === 'creator') {
        const { data: userData, error: userError } = await supabase
          .from('user_accounts')
          .select('agent_id')
          .eq('id', userId)
          .single();
          
        if (userError) throw userError;
        
        setCurrentAgent(userData?.agent_id || null);
        
        // Filter out current agent from the list
        if (userData?.agent_id) {
          setAgents(data.filter(agent => agent.id !== userData.agent_id) || []);
        } else {
          setAgents(data || []);
        }
      } else {
        setAgents(data || []);
      }
    } catch (error) {
      console.error('Error fetching agents:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger la liste des agents",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCreators = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('user_accounts')
        .select('id, username, agent_id')
        .eq('role', 'creator')
        .eq('agent_id', userId)
        .order('username');
        
      if (error) throw error;
      
      setCreators(data || []);
    } catch (error) {
      console.error('Error fetching creators:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger la liste des créateurs",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      
      let creatorId = userId;
      let currentAgentId = currentAgent;
      
      // If agent role, use selected creator
      if (role === 'agent') {
        if (!selectedCreator) {
          toast({
            variant: "destructive",
            title: "Erreur",
            description: "Veuillez sélectionner un créateur",
          });
          return false;
        }
        
        creatorId = selectedCreator;
        currentAgentId = userId;
      }
      
      // Validate required fields
      if (!selectedAgent) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Veuillez sélectionner un agent",
        });
        return false;
      }
      
      if (!reason.trim()) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Veuillez fournir une raison pour la demande de transfert",
        });
        return false;
      }
      
      // For creator role, validate that we have a current agent
      if (role === 'creator' && !currentAgentId) {
        console.log("Creator has no current agent to transfer from");
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Vous n'êtes pas assigné à un agent actuellement",
        });
        return false;
      }
      
      console.log("Submitting transfer request with:", { 
        creatorId, 
        currentAgentId, 
        selectedAgent, 
        reason 
      });
      
      // Create transfer request
      const { error } = await supabase
        .from('transfer_requests')
        .insert({
          creator_id: creatorId,
          current_agent_id: currentAgentId,
          requested_agent_id: selectedAgent,
          reason: reason.trim(),
          status: 'pending'
        });
        
      if (error) {
        console.error('Error submitting transfer request:', error);
        throw error;
      }
      
      toast({
        title: "Succès",
        description: "Demande de transfert envoyée avec succès",
      });
      
      onSuccess();
      onClose();
      
      // Reset form
      setSelectedAgent('');
      setSelectedCreator('');
      setReason('');
      
      return true;
    } catch (error) {
      console.error('Error submitting transfer request:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi de la demande",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = () => {
    if (role === 'agent' && !selectedCreator) return false;
    return !!selectedAgent && !!reason.trim();
  };

  return {
    agents,
    creators,
    loading,
    selectedAgent,
    setSelectedAgent,
    selectedCreator,
    setSelectedCreator,
    reason,
    setReason,
    handleSubmit,
    isFormValid
  };
}
