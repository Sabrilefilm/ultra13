
import { DocumentSideForm } from './DocumentSideForm';
import { DocumentTypeSelector } from './DocumentTypeSelector';
import { ErrorMessage } from './ErrorMessage';

interface DocumentUploadFormProps {
  selectedDocType: 'identity' | 'other';
  setSelectedDocType: (value: 'identity' | 'other') => void;
  frontFile: File | null;
  backFile: File | null;
  frontPreview: string | null;
  backPreview: string | null;
  errors: { front?: string; back?: string };
  fileError: string | null;
  handleFileChange: (side: 'front' | 'back', file: File | null) => void;
  clearFile: (side: 'front' | 'back') => void;
}

export const DocumentUploadForm = ({
  selectedDocType,
  setSelectedDocType,
  frontFile,
  backFile,
  frontPreview,
  backPreview,
  errors,
  fileError,
  handleFileChange,
  clearFile
}: DocumentUploadFormProps) => {
  return (
    <div className="grid gap-6 py-4">
      {fileError && <ErrorMessage message={fileError} />}
      
      <DocumentTypeSelector 
        selectedDocType={selectedDocType} 
        onTypeChange={setSelectedDocType} 
      />

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
    </div>
  );
};
