
import { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { Upload, Loader2, FileText, X } from 'lucide-react';

interface DocumentUploadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  existingDocument?: {
    id: string;
    document_front: string;
    document_back: string;
  };
  onSuccess: () => void;
}

export const DocumentUploadDialog = ({
  isOpen,
  onClose,
  userId,
  existingDocument,
  onSuccess
}: DocumentUploadDialogProps) => {
  const { toast } = useToast();
  const [frontFile, setFrontFile] = useState<File | null>(null);
  const [backFile, setBackFile] = useState<File | null>(null);
  const [frontPreview, setFrontPreview] = useState<string>(existingDocument?.document_front || '');
  const [backPreview, setBackPreview] = useState<string>(existingDocument?.document_back || '');
  const [loading, setLoading] = useState(false);

  const handleFrontFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFrontFile(file);
      const previewUrl = URL.createObjectURL(file);
      setFrontPreview(previewUrl);
    }
  };

  const handleBackFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBackFile(file);
      const previewUrl = URL.createObjectURL(file);
      setBackPreview(previewUrl);
    }
  };

  const clearFrontFile = () => {
    setFrontFile(null);
    if (frontPreview && !existingDocument?.document_front) {
      URL.revokeObjectURL(frontPreview);
    }
    setFrontPreview(existingDocument?.document_front || '');
  };

  const clearBackFile = () => {
    setBackFile(null);
    if (backPreview && !existingDocument?.document_back) {
      URL.revokeObjectURL(backPreview);
    }
    setBackPreview(existingDocument?.document_back || '');
  };

  const uploadDocument = async () => {
    if (!frontFile && !backFile && !existingDocument) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez sélectionner au moins un fichier à télécharger",
      });
      return;
    }

    try {
      setLoading(true);

      // Upload front image if exists
      let frontPath = existingDocument?.document_front || '';
      if (frontFile) {
        const fileName = `${userId}_front_${Date.now()}`;
        const { data: frontData, error: frontError } = await supabase.storage
          .from('identity_documents')
          .upload(fileName, frontFile);

        if (frontError) throw frontError;
        
        frontPath = `${supabase.storageUrl}/object/public/identity_documents/${frontData.path}`;
      }

      // Upload back image if exists
      let backPath = existingDocument?.document_back || '';
      if (backFile) {
        const fileName = `${userId}_back_${Date.now()}`;
        const { data: backData, error: backError } = await supabase.storage
          .from('identity_documents')
          .upload(fileName, backFile);

        if (backError) throw backError;
        
        backPath = `${supabase.storageUrl}/object/public/identity_documents/${backData.path}`;
      }

      // Update or insert document record
      if (existingDocument) {
        const { error } = await supabase
          .from('identity_documents')
          .update({
            document_front: frontPath || existingDocument.document_front,
            document_back: backPath || existingDocument.document_back,
            uploaded_at: new Date().toISOString(),
            verified: false // Reset verification status on update
          })
          .eq('id', existingDocument.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('identity_documents')
          .insert({
            user_id: userId,
            document_front: frontPath,
            document_back: backPath,
            verified: false
          });

        if (error) throw error;
      }

      toast({
        title: "Succès",
        description: "Document téléchargé avec succès",
      });

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error uploading document:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors du téléchargement du document",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Télécharger un document d'identité</DialogTitle>
          <DialogDescription>
            Téléchargez une pièce d'identité valide (carte d'identité ou passeport)
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="front">Recto de la pièce d'identité</Label>
            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-4 h-48 relative">
                {frontPreview ? (
                  <>
                    <img 
                      src={frontPreview} 
                      alt="Front preview" 
                      className="max-h-full max-w-full object-contain"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 bg-black/20 hover:bg-black/30 text-white rounded-full h-8 w-8 p-1"
                      onClick={clearFrontFile}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center text-center space-y-2">
                    <FileText className="h-10 w-10 text-gray-400" />
                    <div className="font-medium text-gray-900 dark:text-gray-100">
                      Glissez-déposez ici ou
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <label htmlFor="front-upload">
                        Parcourir
                        <input
                          id="front-upload"
                          type="file"
                          className="sr-only"
                          accept="image/*"
                          onChange={handleFrontFileChange}
                        />
                      </label>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="back">Verso de la pièce d'identité</Label>
            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-4 h-48 relative">
                {backPreview ? (
                  <>
                    <img 
                      src={backPreview} 
                      alt="Back preview" 
                      className="max-h-full max-w-full object-contain"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 bg-black/20 hover:bg-black/30 text-white rounded-full h-8 w-8 p-1"
                      onClick={clearBackFile}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center text-center space-y-2">
                    <FileText className="h-10 w-10 text-gray-400" />
                    <div className="font-medium text-gray-900 dark:text-gray-100">
                      Glissez-déposez ici ou
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <label htmlFor="back-upload">
                        Parcourir
                        <input
                          id="back-upload"
                          type="file"
                          className="sr-only"
                          accept="image/*"
                          onChange={handleBackFileChange}
                        />
                      </label>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Annuler
          </Button>
          <Button 
            onClick={uploadDocument} 
            disabled={loading || (!frontFile && !backFile && !existingDocument)}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Téléchargement...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                {existingDocument ? 'Mettre à jour' : 'Télécharger'}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
