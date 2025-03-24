
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { useState } from 'react';

interface MessageOperationsProps {
  userId: string;
  activeContact: string | null;
}

export const useMessageOperations = ({ userId, activeContact }: MessageOperationsProps) => {
  const queryClient = useQueryClient();
  const [newMessage, setNewMessage] = useState('');
  const [attachment, setAttachment] = useState<File | null>(null);
  const [attachmentPreview, setAttachmentPreview] = useState<string | null>(null);

  // Clear attachment
  const clearAttachment = () => {
    setAttachment(null);
    setAttachmentPreview(null);
  };

  // Handle file attachment
  const handleAttachment = (file: File) => {
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast.error("La taille maximale de fichier est de 5MB");
      return;
    }
    
    if (!file.type.startsWith('image/')) {
      toast.error("Seules les images sont acceptées");
      return;
    }
    
    setAttachment(file);
    
    // Generate preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setAttachmentPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Send a new message
  const { mutate: sendMessage, isPending: sendingMessage } = useMutation({
    mutationFn: async () => {
      if (!activeContact || (!newMessage.trim() && !attachment) || !userId) {
        throw new Error('Informations manquantes pour l\'envoi du message');
      }
      
      try {
        let attachmentUrl = null;
        
        // Upload attachment if exists
        if (attachment) {
          const fileName = `${userId}_${Date.now()}_${attachment.name}`;
          const filePath = `message_attachments/${fileName}`;
          
          const { error: uploadError } = await supabase.storage
            .from('chat_attachments')
            .upload(filePath, attachment);
            
          if (uploadError) {
            throw new Error(`Error uploading file: ${uploadError.message}`);
          }
          
          // Get public URL
          const { data } = supabase.storage
            .from('chat_attachments')
            .getPublicUrl(filePath);
            
          attachmentUrl = data.publicUrl;
        }
        
        // Insert message with RPC call instead of direct insert
        const { error } = await supabase.rpc('send_message', {
          p_sender_id: userId,
          p_receiver_id: activeContact,
          p_message: newMessage.trim(),
          p_attachment_url: attachmentUrl
        });
        
        if (error) throw error;
        
        setNewMessage('');
        clearAttachment();
      } catch (error) {
        console.error('Error sending message:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      queryClient.invalidateQueries({ queryKey: ['unread'] });
    },
    onError: (error) => {
      console.error('Error sending message:', error);
      toast.error('Erreur lors de l\'envoi du message. Vérifiez vos permissions.');
    }
  });

  // Archive conversation (for founder)
  const { mutate: archiveConversation, isPending: archiving } = useMutation({
    mutationFn: async () => {
      if (!activeContact || !userId) {
        throw new Error('Contact actif ou ID utilisateur non défini');
      }
      
      try {
        // Calculate archive date (1 month from now for normal users, never for founder)
        const isFounder = localStorage.getItem('userRole') === 'founder';
        const archiveDate = isFounder ? null : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
        
        const { error } = await supabase
          .from('chats')
          .update({ 
            archived: true,
            archive_date: archiveDate 
          })
          .or(`and(sender_id.eq.${userId},receiver_id.eq.${activeContact}),and(sender_id.eq.${activeContact},receiver_id.eq.${userId})`);
        
        if (error) throw error;
      } catch (error) {
        console.error('Error archiving conversation:', error);
        throw error;
      }
    },
    onSuccess: () => {
      const isFounder = localStorage.getItem('userRole') === 'founder';
      const message = isFounder 
        ? 'Conversation archivée définitivement'
        : 'Conversation archivée pour 1 mois';
        
      toast.success(message);
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      queryClient.invalidateQueries({ queryKey: ['unread'] });
    },
    onError: (error) => {
      console.error('Error archiving conversation:', error);
      toast.error('Erreur lors de l\'archivage de la conversation');
    }
  });

  return {
    newMessage,
    setNewMessage,
    attachment,
    attachmentPreview,
    handleAttachment,
    clearAttachment,
    sendMessage,
    sendingMessage,
    archiveConversation,
    archiving
  };
};
