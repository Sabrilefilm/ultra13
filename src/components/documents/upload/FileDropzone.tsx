
import { Button } from '@/components/ui/button';
import { UploadCloud, AlertCircle } from 'lucide-react';

interface FileDropzoneProps {
  onFileSelect: (file: File | null) => void;
  error?: string;
}

export const FileDropzone = ({ onFileSelect, error }: FileDropzoneProps) => {
  return (
    <div className="border-2 border-dashed rounded-lg p-6 border-gray-300 dark:border-gray-700 relative">
      <div className="flex flex-col items-center">
        <UploadCloud className="mb-4 h-10 w-10 text-gray-400" />
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Cliquez ou glissez-déposez votre fichier</p>
        <input
          type="file"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          accept="image/*"
          onChange={(e) => onFileSelect(e.target.files?.[0] || null)}
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
      {error && (
        <div className="mt-2 text-red-500 text-xs flex items-center">
          <AlertCircle className="h-3 w-3 mr-1" />
          {error}
        </div>
      )}
    </div>
  );
};
