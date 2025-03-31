
import React, { useCallback } from 'react';
import { Upload } from 'lucide-react';

export interface FileDropzoneProps {
  onFileSelect: (file: File) => void;
  accept: string;
  label: string;
  optional?: boolean;
}

export const FileDropzone: React.FC<FileDropzoneProps> = ({ 
  onFileSelect, 
  accept, 
  label,
  optional = false
}) => {
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  }, [onFileSelect]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files[0]);
    }
  };
  
  return (
    <div 
      className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-md p-6 text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      onClick={() => document.getElementById(`file-input-${label}`)?.click()}
    >
      <input
        id={`file-input-${label}`}
        type="file"
        className="hidden"
        accept={accept}
        onChange={handleChange}
      />
      <Upload className="mx-auto h-12 w-12 text-gray-400" />
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
        Click to upload or drag and drop
      </p>
      <p className="text-xs text-gray-500 dark:text-gray-500">
        {optional ? '(Optional) ' : ''}Upload your {label.toLowerCase()}
      </p>
    </div>
  );
};
