
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { DocumentSideForm } from './DocumentSideForm';
import { DocumentTypeSelector } from './DocumentTypeSelector';
import { ErrorMessage } from './ErrorMessage';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Info, Save, X } from 'lucide-react';

interface DocumentUploadFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  documentType: string;
}

export const DocumentUploadForm: React.FC<DocumentUploadFormProps> = ({
  onSuccess,
  onCancel,
  documentType: initialDocType
}) => {
  const [selectedDocType, setSelectedDocType] = useState<'identity' | 'other'>(
    initialDocType === 'identity' ? 'identity' : 'other'
  );
  const [frontFile, setFrontFile] = useState<File | null>(null);
  const [backFile, setBackFile] = useState<File | null>(null);
  const [frontPreview, setFrontPreview] = useState<string | null>(null);
  const [backPreview, setBackPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [errors, setErrors] = useState<{ front?: string; back?: string }>({});
  const [fileError, setFileError] = useState<string | null>(null);

  const handleFileChange = (side: 'front' | 'back', file: File | null) => {
    if (!file) return;

    // Validate file type
    if (!(file.type.startsWith('image/') || file.type === 'application/pdf')) {
      setErrors(prev => ({ ...prev, [side]: 'Format invalide. Utilisez JPG, PNG ou PDF.' }));
      return;
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, [side]: 'Fichier trop volumineux (max 10MB)' }));
      return;
    }

    // Clear previous error
    setErrors(prev => ({ ...prev, [side]: undefined }));

    // Update state and preview
    if (side === 'front') {
      setFrontFile(file);
      const reader = new FileReader();
      reader.onload = () => setFrontPreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setBackFile(file);
      const reader = new FileReader();
      reader.onload = () => setBackPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const clearFile = (side: 'front' | 'back') => {
    if (side === 'front') {
      setFrontFile(null);
      setFrontPreview(null);
    } else {
      setBackFile(null);
      setBackPreview(null);
    }
    setErrors(prev => ({ ...prev, [side]: undefined }));
  };

  const handleSubmit = async () => {
    setFileError(null);

    // Validate front side is selected
    if (!frontFile) {
      setFileError("Veuillez sélectionner au moins une image pour la face avant");
      return;
    }

    // Check if any errors exist
    if (Object.values(errors).some(error => !!error)) {
      return;
    }

    setIsUploading(true);

    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        throw new Error("Utilisateur non connecté");
      }

      // Upload front file
      const frontFilePath = `documents/${userId}/${Date.now()}-front`;
      const { data: frontData, error: frontError } = await supabase.storage
        .from('documents')
        .upload(frontFilePath, frontFile);

      if (frontError) throw frontError;

      // Get public URL for front file
      const { data: frontUrlData } = supabase.storage
        .from('documents')
        .getPublicUrl(frontFilePath);

      // Upload back file if provided
      let backUrl = null;
      if (backFile) {
        const backFilePath = `documents/${userId}/${Date.now()}-back`;
        const { error: backError } = await supabase.storage
          .from('documents')
          .upload(backFilePath, backFile);

        if (backError) throw backError;

        // Get public URL for back file
        const { data: backUrlData } = supabase.storage
          .from('documents')
          .getPublicUrl(backFilePath);

        backUrl = backUrlData.publicUrl;
      }

      // Save document info to database
      const { error: docError } = await supabase
        .from('documents')
        .insert([{
          user_id: userId,
          filename: frontFile.name,
          file_type: frontFile.type,
          status: 'pending',
          document_type: selectedDocType,
          upload_date: new Date().toISOString(),
          front_url: frontUrlData.publicUrl,
          back_url: backUrl
        }]);

      if (docError) throw docError;

      toast.success("Document téléchargé avec succès!");
      onSuccess();
    } catch (error) {
      console.error("Error uploading document:", error);
      setFileError("Une erreur est survenue lors du téléchargement. Veuillez réessayer.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      {fileError && <ErrorMessage message={fileError} />}
      
      <Card className="border-blue-100 dark:border-blue-900/30 shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-start gap-3 mb-4">
            <Info className="h-5 w-5 text-blue-500 mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-700 dark:text-blue-300 mb-1">Instructions</h3>
              <ul className="text-sm text-blue-600/80 dark:text-blue-400/80 space-y-1 list-disc pl-4">
                <li>Les fichiers doivent être au format JPEG, PNG ou PDF</li>
                <li>Taille maximale par fichier: 10MB</li>
                <li>Assurez-vous que les documents sont clairement lisibles</li>
              </ul>
            </div>
          </div>
          
          <div className="mb-4">
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800/50">
              {selectedDocType === 'identity' ? 'Document d\'identité' : 'Autre document'}
            </Badge>
          </div>
          
          <DocumentTypeSelector 
            selectedDocType={selectedDocType} 
            onTypeChange={setSelectedDocType} 
          />
        </CardContent>
      </Card>

      <DocumentSideForm
        label={selectedDocType === 'identity' ? 'Recto de la carte d\'identité' : 'Première page'}
        file={frontFile}
        preview={frontPreview}
        error={errors.front}
        onFileChange={(file) => handleFileChange('front', file)}
        onClearFile={() => clearFile('front')}
      />
      
      <DocumentSideForm
        label={selectedDocType === 'identity' ? 'Verso de la carte d\'identité' : 'Deuxième page (optionnel)'}
        file={backFile}
        preview={backPreview}
        error={errors.back}
        onFileChange={(file) => handleFileChange('back', file)}
        onClearFile={() => clearFile('back')}
      />

      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" onClick={onCancel}>
          <X className="mr-2 h-4 w-4" />
          Annuler
        </Button>
        <Button 
          onClick={handleSubmit} 
          disabled={isUploading || !frontFile}
          className="bg-purple-600 hover:bg-purple-700 text-white"
        >
          {isUploading ? (
            <>
              <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
              Téléchargement...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Enregistrer
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
