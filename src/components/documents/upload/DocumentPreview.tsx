
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface DocumentPreviewProps {
  previewUrl: string | null;
  onClear: () => void;
  alt: string;
}

export const DocumentPreview = ({ previewUrl, onClear, alt }: DocumentPreviewProps) => {
  if (!previewUrl) return null;
  
  return (
    <div className="relative">
      <img 
        src={previewUrl} 
        alt={alt} 
        className="w-full h-36 object-contain rounded-lg"
      />
      <Button
        type="button"
        variant="destructive"
        size="icon"
        className="absolute top-2 right-2 h-6 w-6 rounded-full"
        onClick={onClear}
      >
        <X className="h-3 w-3" />
      </Button>
    </div>
  );
};
