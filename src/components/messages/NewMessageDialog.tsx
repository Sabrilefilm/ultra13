
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Loading } from "@/components/ui/loading";

export interface NewMessageDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedUser: string;
  onUserChange: (userId: string) => void;
  onStartConversation: () => void;
  currentUserRole: string;
  currentUserId: string;
  allUsers: any[];
  loadingUsers: boolean;
}

export const NewMessageDialog = ({
  isOpen,
  onOpenChange,
  selectedUser,
  onUserChange,
  onStartConversation,
  currentUserRole,
  currentUserId,
  allUsers: initialUsers,
  loadingUsers: initialLoading
}: NewMessageDialogProps) => {
  const [initialMessage, setInitialMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [recipients, setRecipients] = useState<any[]>([]);
  const [loadingRecipients, setLoadingRecipients] = useState(true);
  
  // Fetch appropriate recipients based on user role
  useEffect(() => {
    if (!isOpen || !currentUserId) return;
    
    const fetchRecipients = async () => {
      setLoadingRecipients(true);
      try {
        let query = supabase
          .from('user_accounts')
          .select('id, username, role');
          
        // Filter based on role
        if (currentUserRole === 'creator') {
          // Creators can message agents, managers, and founders
          query = query.in('role', ['agent', 'manager', 'founder']);
          
          // If creator has an assigned agent, get that info
          const { data: userData } = await supabase
            .from('user_accounts')
            .select('agent_id')
            .eq('id', currentUserId)
            .single();
            
          if (userData?.agent_id) {
            // Highlight the creator's agent in the list
            const { data: agentData } = await supabase
              .from('user_accounts')
              .select('id, username, role')
              .eq('id', userData.agent_id)
              .single();
              
            if (agentData) {
              setRecipients([
                { ...agentData, isAssigned: true },
                ...(await query).data || []
              ]);
              setLoadingRecipients(false);
              return;
            }
          }
        } else if (currentUserRole === 'agent') {
          // Agents can message creators (assigned to them), managers and founders
          query = query.in('role', ['creator', 'manager', 'founder']);
          
          // Also get assigned creators
          const { data: assignedCreators } = await supabase
            .from('user_accounts')
            .select('id, username, role')
            .eq('agent_id', currentUserId)
            .eq('role', 'creator');
            
          if (assignedCreators && assignedCreators.length > 0) {
            // Add assigned flag to these creators
            const assigned = assignedCreators.map(creator => ({
              ...creator,
              isAssigned: true
            }));
            
            // Get other users (managers, founders)
            const { data: otherUsers } = await supabase
              .from('user_accounts')
              .select('id, username, role')
              .in('role', ['manager', 'founder']);
              
            setRecipients([
              ...assigned,
              ...(otherUsers || [])
            ]);
            setLoadingRecipients(false);
            return;
          }
        } else if (currentUserRole === 'manager') {
          // Managers can message all users
          query = query.neq('id', currentUserId);
        } else if (currentUserRole === 'founder') {
          // Founders can message all users
          query = query.neq('id', currentUserId);
        }
        
        const { data } = await query;
        setRecipients(data || []);
      } catch (error) {
        console.error('Error fetching recipients:', error);
        toast.error('Erreur lors du chargement des destinataires');
      } finally {
        setLoadingRecipients(false);
      }
    };
    
    fetchRecipients();
  }, [isOpen, currentUserId, currentUserRole]);

  const handleSendMessage = async () => {
    if (!selectedUser) {
      toast.error('Veuillez sélectionner un destinataire');
      return;
    }
    
    if (!initialMessage.trim()) {
      toast.error('Veuillez écrire un message');
      return;
    }
    
    setIsSending(true);
    
    try {
      // Use RPC instead of direct insert to avoid row-level security issues
      const { error } = await supabase.rpc('send_message', {
        p_sender_id: currentUserId,
        p_receiver_id: selectedUser,
        p_message: initialMessage.trim(),
        p_attachment_url: null
      });
      
      if (error) throw error;
      
      toast.success('Message envoyé');
      onOpenChange(false);
      setInitialMessage('');
      onUserChange('');
      onStartConversation();
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Erreur lors de l\'envoi du message. Vérifiez vos permissions.');
    } finally {
      setIsSending(false);
    }
  };

  // Reset form when dialog closes
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setInitialMessage('');
      onUserChange('');
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Nouvelle conversation 💬</DialogTitle>
          <DialogDescription>
            Commencez une nouvelle conversation en envoyant un message.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="recipient">Destinataire</Label>
            <Select 
              value={selectedUser} 
              onValueChange={onUserChange}
            >
              <SelectTrigger id="recipient">
                <SelectValue placeholder="Sélectionner un destinataire" />
              </SelectTrigger>
              <SelectContent className="max-h-72 z-50 bg-card">
                {loadingRecipients ? (
                  <div className="flex justify-center p-4">
                    <Loading size="small" text="Chargement..." />
                  </div>
                ) : recipients.length > 0 ? (
                  recipients.map(user => (
                    <SelectItem key={user.id} value={user.id} className="py-2">
                      <div className="flex items-center">
                        <span className="font-medium">{user.username}</span>
                        <span className="ml-2 text-xs text-muted-foreground">({user.role})</span>
                        {user.isAssigned && (
                          <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                            {currentUserRole === 'creator' ? 'Mon agent' : 'Assigné'}
                          </span>
                        )}
                      </div>
                    </SelectItem>
                  ))
                ) : (
                  <div className="p-2 text-center text-muted-foreground">
                    Aucun destinataire disponible
                  </div>
                )}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Message initial</Label>
            <Textarea
              id="message"
              value={initialMessage}
              onChange={(e) => setInitialMessage(e.target.value)}
              className="min-h-[100px]"
              placeholder="Écrivez votre message ici..."
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button 
            onClick={handleSendMessage} 
            disabled={!selectedUser || !initialMessage.trim() || isSending}
          >
            {isSending ? (
              <span className="flex items-center">
                <span className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Envoi...
              </span>
            ) : (
              'Envoyer'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
