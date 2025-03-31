
import { DocumentPreview } from './DocumentPreview';
import { FileDropzone } from './FileDropzone';

interface DocumentSideFormProps {
  label: string;
  file: File | null;
  preview: string | null;
  error?: string;
  onFileChange: (file: File | null) => void;
  onClearFile: () => void;
}

export const DocumentSideForm = ({ 
  label, 
  file, 
  preview, 
  error, 
  onFileChange, 
  onClearFile 
}: DocumentSideFormProps) => {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">{label}</label>
      {preview ? (
        <DocumentPreview 
          url={preview} 
          onRemove={onClearFile} 
          alt={label} 
        />
      ) : (
        <FileDropzone 
          onFileSelect={onFileChange} 
          accept="image/*" 
          label={label}
          error={error}
        />
      )}
    </div>
  );
};
