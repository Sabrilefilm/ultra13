
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export interface DialogActionsProps {
  onCancel: () => void;
  isLoading?: boolean;
}

export const DialogActions: React.FC<DialogActionsProps> = ({ 
  onCancel, 
  isLoading = false 
}) => {
  return (
    <div className="flex justify-end space-x-2 pt-4">
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        disabled={isLoading}
      >
        Cancel
      </Button>
      <Button 
        type="submit"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Uploading...
          </>
        ) : (
          'Upload Document'
        )}
      </Button>
    </div>
  );
};
