
import { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { Loading } from '@/components/ui/loading';

interface TransferRequestDialogProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  role: string;
  onSuccess: () => void;
}

export const TransferRequestDialog = ({
  isOpen,
  onClose,
  userId,
  role,
  onSuccess
}: TransferRequestDialogProps) => {
  const { toast } = useToast();
  const [agents, setAgents] = useState<any[]>([]);
  const [creators, setCreators] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<string>('');
  const [selectedCreator, setSelectedCreator] = useState<string>('');
  const [reason, setReason] = useState<string>('');
  const [currentAgent, setCurrentAgent] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      fetchAgents();
      if (role === 'agent') {
        fetchCreators();
      }
    }
  }, [isOpen, role]);

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
        
        setCurrentAgent(userData?.agent_id || '');
        
        // Filter out current agent from the list
        setAgents(data.filter(agent => agent.id !== userData?.agent_id) || []);
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
          return;
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
        return;
      }
      
      if (!reason.trim()) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Veuillez fournir une raison pour la demande de transfert",
        });
        return;
      }
      
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
        
      if (error) throw error;
      
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
    } catch (error) {
      console.error('Error submitting transfer request:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi de la demande",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Nouvelle demande de transfert</DialogTitle>
          <DialogDescription>
            {role === 'creator' 
              ? "Demandez à être transféré à un autre agent" 
              : "Demandez un transfert pour l'un de vos créateurs"}
          </DialogDescription>
        </DialogHeader>
        
        {loading ? (
          <div className="py-6">
            <Loading text="Chargement..." />
          </div>
        ) : (
          <div className="space-y-4 py-4">
            {role === 'agent' && (
              <div className="space-y-2">
                <Label htmlFor="creator">Créateur</Label>
                <Select 
                  value={selectedCreator} 
                  onValueChange={setSelectedCreator}
                >
                  <SelectTrigger id="creator">
                    <SelectValue placeholder="Sélectionnez un créateur" />
                  </SelectTrigger>
                  <SelectContent>
                    {creators.map((creator) => (
                      <SelectItem key={creator.id} value={creator.id}>
                        {creator.username}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="agent">Agent demandé</Label>
              <Select 
                value={selectedAgent} 
                onValueChange={setSelectedAgent}
              >
                <SelectTrigger id="agent">
                  <SelectValue placeholder="Sélectionnez un agent" />
                </SelectTrigger>
                <SelectContent>
                  {agents.map((agent) => (
                    <SelectItem key={agent.id} value={agent.id}>
                      {agent.username}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="reason">Raison de la demande</Label>
              <Textarea
                id="reason"
                placeholder="Expliquez pourquoi vous souhaitez ce transfert..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={4}
              />
            </div>
          </div>
        )}
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Annuler
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={loading || !selectedAgent || (role === 'agent' && !selectedCreator) || !reason.trim()}
          >
            Envoyer la demande
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
