
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { toast } from 'sonner';

interface UseDocumentUploadProps {
  userId: string;
  existingDocument?: any;
  onSuccess: () => void;
  onClose: () => void;
}

export const useDocumentUpload = ({ 
  userId, 
  existingDocument, 
  onSuccess, 
  onClose 
}: UseDocumentUploadProps) => {
  const { toast: uiToast } = useToast();
  const [frontFile, setFrontFile] = useState<File | null>(null);
  const [backFile, setBackFile] = useState<File | null>(null);
  const [frontPreview, setFrontPreview] = useState<string | null>(existingDocument?.document_front || null);
  const [backPreview, setBackPreview] = useState<string | null>(existingDocument?.document_back || null);
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState<{ front?: string; back?: string }>({});
  const [selectedDocType, setSelectedDocType] = useState<string>(existingDocument?.document_type || 'identity');

  const handleFileChange = (side: 'front' | 'back', file: File | null) => {
    if (!file) return;

    // Validation
    if (!file.type.startsWith('image/')) {
      setErrors(prev => ({ ...prev, [side]: 'Veuillez sélectionner une image (JPG, PNG)' }));
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB max
      setErrors(prev => ({ ...prev, [side]: 'La taille maximum est 5MB' }));
      return;
    }

    // Clear previous error
    setErrors(prev => ({ ...prev, [side]: undefined }));

    // Set file and preview
    if (side === 'front') {
      setFrontFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFrontPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setBackFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setBackPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearFile = (side: 'front' | 'back') => {
    if (side === 'front') {
      setFrontFile(null);
      setFrontPreview(existingDocument?.document_front || null);
    } else {
      setBackFile(null);
      setBackPreview(existingDocument?.document_back || null);
    }
    setErrors(prev => ({ ...prev, [side]: undefined }));
  };

  const getDocumentTitle = () => {
    return selectedDocType === 'identity' 
      ? "Télécharger votre carte d'identité" 
      : "Télécharger un autre document";
  };

  const handleSubmit = async () => {
    if (!frontFile && !backFile && !existingDocument) {
      setErrors({
        front: 'Veuillez sélectionner une image',
        back: 'Veuillez sélectionner une image'
      });
      return;
    }

    if (Object.values(errors).some(error => error)) {
      return;
    }

    setUploading(true);

    try {
      // Upload front file if selected
      let frontUrl = existingDocument?.document_front;
      if (frontFile) {
        const frontFilePath = `documents/${userId}/${selectedDocType}-front-${Date.now()}`;
        const { error: frontUploadError } = await supabase.storage
          .from('id_documents')
          .upload(frontFilePath, frontFile);

        if (frontUploadError) throw frontUploadError;
        
        const { data: frontData } = supabase.storage
          .from('id_documents')
          .getPublicUrl(frontFilePath);
          
        frontUrl = frontData.publicUrl;
      }

      // Upload back file if selected
      let backUrl = existingDocument?.document_back;
      if (backFile) {
        const backFilePath = `documents/${userId}/${selectedDocType}-back-${Date.now()}`;
        const { error: backUploadError } = await supabase.storage
          .from('id_documents')
          .upload(backFilePath, backFile);

        if (backUploadError) throw backUploadError;
        
        const { data: backData } = supabase.storage
          .from('id_documents')
          .getPublicUrl(backFilePath);
          
        backUrl = backData.publicUrl;
      }

      // Save document info in database
      if (existingDocument) {
        // Update existing document
        const { error: updateError } = await supabase
          .from('identity_documents')
          .update({
            document_front: frontUrl,
            document_back: backUrl,
            document_type: selectedDocType,
            uploaded_at: new Date().toISOString(),
            verified: false // Reset verification when document is updated
          })
          .eq('id', existingDocument.id);

        if (updateError) throw updateError;
      } else {
        // Insert new document
        const { error: insertError } = await supabase
          .from('identity_documents')
          .insert({
            user_id: userId,
            document_front: frontUrl,
            document_back: backUrl,
            document_type: selectedDocType
          });

        if (insertError) throw insertError;
      }

      toast.success('Document téléchargé avec succès');
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error uploading document:', error);
      uiToast({
        title: "Erreur",
        description: "Impossible de télécharger le document. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return {
    frontFile,
    backFile,
    frontPreview,
    backPreview,
    uploading,
    errors,
    selectedDocType,
    handleFileChange,
    clearFile,
    getDocumentTitle,
    handleSubmit,
    setSelectedDocType
  };
};
