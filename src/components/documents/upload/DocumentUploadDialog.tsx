
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DocumentUploadForm } from "./DocumentUploadForm";

interface DocumentUploadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  documentType: string;
  onSuccess: () => void;
}

export const DocumentUploadDialog: React.FC<DocumentUploadDialogProps> = ({
  isOpen,
  onClose,
  documentType,
  onSuccess
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[725px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {documentType === 'identity' ? 'Upload Identity Document' : 'Upload Document'}
          </DialogTitle>
        </DialogHeader>
        
        <DocumentUploadForm 
          documentType={documentType} 
          onCancel={onClose} 
          onSuccess={onSuccess}
        />
      </DialogContent>
    </Dialog>
  );
};
