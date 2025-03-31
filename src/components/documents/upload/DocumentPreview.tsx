
import React from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

export interface DocumentPreviewProps {
  url: string;
  onRemove: () => void;
}

export const DocumentPreview: React.FC<DocumentPreviewProps> = ({ url, onRemove }) => {
  return (
    <div className="relative rounded-md overflow-hidden border border-gray-200 dark:border-gray-700">
      <div className="absolute top-2 right-2">
        <Button 
          variant="destructive" 
          size="icon" 
          onClick={onRemove}
          className="h-6 w-6 rounded-full"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      <img 
        src={url} 
        alt="Document preview" 
        className="w-full h-auto max-h-48 object-contain"
      />
    </div>
  );
};
