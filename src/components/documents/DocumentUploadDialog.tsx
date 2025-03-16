
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { UploadCloud, X, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { toast } from 'sonner';

interface DocumentUploadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  existingDocument?: any;
  onSuccess: () => void;
}

export const DocumentUploadDialog = ({
  isOpen,
  onClose,
  userId,
  existingDocument,
  onSuccess
}: DocumentUploadDialogProps) => {
  const { toast: uiToast } = useToast();
  const [frontFile, setFrontFile] = useState<File | null>(null);
  const [backFile, setBackFile] = useState<File | null>(null);
  const [frontPreview, setFrontPreview] = useState<string | null>(existingDocument?.document_front || null);
  const [backPreview, setBackPreview] = useState<string | null>(existingDocument?.document_back || null);
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState<{ front?: string; back?: string }>({});

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
        const frontFilePath = `documents/${userId}/front-${Date.now()}`;
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
        const backFilePath = `documents/${userId}/back-${Date.now()}`;
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
            document_back: backUrl
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Télécharger votre document d'identité</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          <div>
            <label className="block text-sm font-medium mb-2">Recto de la carte d'identité</label>
            <div className="border-2 border-dashed rounded-lg p-6 border-gray-300 dark:border-gray-700 relative">
              {frontPreview ? (
                <div className="relative">
                  <img 
                    src={frontPreview} 
                    alt="Document preview" 
                    className="w-full h-36 object-contain rounded-lg"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-6 w-6 rounded-full"
                    onClick={() => clearFile('front')}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <UploadCloud className="mb-4 h-10 w-10 text-gray-400" />
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Cliquez ou glissez-déposez votre fichier</p>
                  <input
                    type="file"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    accept="image/*"
                    onChange={(e) => handleFileChange('front', e.target.files?.[0] || null)}
                  />
                  <Button 
                    type="button" 
                    variant="secondary"
                    size="sm"
                    className="relative z-10"
                  >
                    Choisir un fichier
                  </Button>
                </div>
              )}
              {errors.front && (
                <div className="mt-2 text-red-500 text-xs flex items-center">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {errors.front}
                </div>
              )}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Verso de la carte d'identité</label>
            <div className="border-2 border-dashed rounded-lg p-6 border-gray-300 dark:border-gray-700 relative">
              {backPreview ? (
                <div className="relative">
                  <img 
                    src={backPreview} 
                    alt="Document preview" 
                    className="w-full h-36 object-contain rounded-lg"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-6 w-6 rounded-full"
                    onClick={() => clearFile('back')}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <UploadCloud className="mb-4 h-10 w-10 text-gray-400" />
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Cliquez ou glissez-déposez votre fichier</p>
                  <input
                    type="file"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    accept="image/*"
                    onChange={(e) => handleFileChange('back', e.target.files?.[0] || null)}
                  />
                  <Button 
                    type="button" 
                    variant="secondary"
                    size="sm"
                    className="relative z-10"
                  >
                    Choisir un fichier
                  </Button>
                </div>
              )}
              {errors.back && (
                <div className="mt-2 text-red-500 text-xs flex items-center">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {errors.back}
                </div>
              )}
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            type="button" 
            variant="outline" 
            onClick={onClose} 
            disabled={uploading}
          >
            Annuler
          </Button>
          <Button 
            type="button" 
            onClick={handleSubmit} 
            disabled={uploading}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            {uploading ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-transparent border-t-current"></div>
                Téléchargement...
              </>
            ) : (
              'Télécharger'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
