
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileDropzone } from './FileDropzone';
import { ErrorMessage } from './ErrorMessage';
import { DocumentTypeSelector } from './DocumentTypeSelector';
import { DocumentPreview } from './DocumentPreview';
import { DialogActions } from './DialogActions';
import { useToast } from '@/hooks/use-toast';

export interface DocumentUploadFormProps {
  documentType: string;
  onCancel: () => void;
  onSuccess: () => void;
}

export const DocumentUploadForm: React.FC<DocumentUploadFormProps> = ({
  documentType,
  onCancel,
  onSuccess
}) => {
  const [frontFile, setFrontFile] = useState<File | null>(null);
  const [backFile, setBackFile] = useState<File | null>(null);
  const [selectedType, setSelectedType] = useState(documentType);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!frontFile) {
      setError('Please upload at least the front side of your document');
      return;
    }
    
    try {
      setIsUploading(true);
      // Mock upload for now - replace with real implementation
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: "Document uploaded",
        description: "Your document has been uploaded successfully",
      });
      onSuccess();
    } catch (err) {
      setError('An error occurred while uploading your document');
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <DocumentTypeSelector 
        selectedDocType={selectedType} 
        onChange={setSelectedType} 
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="text-sm font-medium mb-2">Front Side</h3>
          {frontFile ? (
            <DocumentPreview 
              url={URL.createObjectURL(frontFile)} 
              onRemove={() => setFrontFile(null)} 
            />
          ) : (
            <FileDropzone 
              onFileSelect={setFrontFile} 
              accept="image/*" 
              label="Front Side" 
            />
          )}
        </div>
        
        <div>
          <h3 className="text-sm font-medium mb-2">Back Side (Optional)</h3>
          {backFile ? (
            <DocumentPreview 
              url={URL.createObjectURL(backFile)} 
              onRemove={() => setBackFile(null)} 
            />
          ) : (
            <FileDropzone 
              onFileSelect={setBackFile} 
              accept="image/*" 
              label="Back Side" 
              optional={true}
            />
          )}
        </div>
      </div>
      
      {error && <ErrorMessage message={error} />}
      
      <DialogActions
        onCancel={onCancel}
        isLoading={isUploading}
      />
    </form>
  );
};
