
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DocumentUploadForm } from './DocumentUploadForm';

export interface DocumentUploadDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  documentType: string;
}

export const DocumentUploadDialog: React.FC<DocumentUploadDialogProps> = ({
  isOpen,
  onOpenChange,
  onSuccess,
  documentType
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Document</DialogTitle>
        </DialogHeader>
        <DocumentUploadForm 
          onSuccess={onSuccess}
          onCancel={() => onOpenChange(false)}
          documentType={documentType}
        />
      </DialogContent>
    </Dialog>
  );
};
