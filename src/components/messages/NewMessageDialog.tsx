
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

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
  allUsers,
  loadingUsers
}: NewMessageDialogProps) => {
  const [initialMessage, setInitialMessage] = useState('');
  
  const handleSendMessage = async () => {
    if (!selectedUser) {
      toast.error('Veuillez sélectionner un destinataire');
      return;
    }
    
    if (!initialMessage.trim()) {
      toast.error('Veuillez écrire un message');
      return;
    }
    
    try {
      const { error } = await supabase
        .from('chats')
        .insert([
          {
            sender_id: currentUserId,
            receiver_id: selectedUser,
            message: initialMessage,
            read: false
          }
        ]);
        
      if (error) throw error;
      
      toast.success('Message envoyé');
      onOpenChange(false);
      setInitialMessage('');
      onUserChange('');
      onStartConversation();
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Erreur lors de l\'envoi du message');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Nouvelle conversation 💬</DialogTitle>
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
              <SelectContent>
                {loadingUsers ? (
                  <div className="flex justify-center p-2">
                    <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full" />
                  </div>
                ) : (
                  allUsers.map(user => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.username} ({user.role})
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Message initial</Label>
            <Input
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
          <Button onClick={handleSendMessage} disabled={!selectedUser || !initialMessage.trim()}>
            Envoyer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
