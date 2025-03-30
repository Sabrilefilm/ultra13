
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileDropzone } from './FileDropzone';
import { ErrorMessage } from './ErrorMessage';
import { DocumentTypeSelector } from './DocumentTypeSelector';
import { DocumentPreview } from './DocumentPreview';
import { DialogActions } from './DialogActions';
import { useDocumentUpload } from './useDocumentUpload';

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

  const { uploadDocument, isUploading } = useDocumentUpload();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!frontFile) {
      setError('Please upload at least the front side of your document');
      return;
    }
    
    try {
      await uploadDocument(frontFile, backFile, selectedType);
      onSuccess();
    } catch (err) {
      setError('An error occurred while uploading your document');
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <DocumentTypeSelector 
        selectedType={selectedType} 
        onChange={setSelectedType} 
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="text-sm font-medium mb-2">Front Side</h3>
          {frontFile ? (
            <DocumentPreview 
              file={frontFile} 
              onRemove={() => setFrontFile(null)} 
            />
          ) : (
            <FileDropzone 
              onFileDrop={setFrontFile} 
              accept="image/*" 
              label="Front Side" 
            />
          )}
        </div>
        
        <div>
          <h3 className="text-sm font-medium mb-2">Back Side (Optional)</h3>
          {backFile ? (
            <DocumentPreview 
              file={backFile} 
              onRemove={() => setBackFile(null)} 
            />
          ) : (
            <FileDropzone 
              onFileDrop={setBackFile} 
              accept="image/*" 
              label="Back Side" 
              optional 
            />
          )}
        </div>
      </div>
      
      {error && <ErrorMessage message={error} />}
      
      <DialogActions
        onCancel={onCancel}
        isSubmitting={isUploading}
      />
    </form>
  );
};
