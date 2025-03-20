
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useDocumentUpload } from './useDocumentUpload';
import { DocumentUploadForm } from './DocumentUploadForm';
import { DialogActions } from './DialogActions';

interface DocumentUploadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  existingDocument?: any;
  onSuccess: () => void;
  documentType: 'identity' | 'other';
}

export const DocumentUploadDialog = ({
  isOpen,
  onClose,
  userId,
  existingDocument,
  onSuccess,
  documentType
}: DocumentUploadDialogProps) => {
  const {
    frontFile,
    backFile,
    frontPreview,
    backPreview,
    uploading,
    errors,
    fileError,
    selectedDocType,
    handleFileChange,
    clearFile,
    getDocumentTitle,
    handleSubmit,
    setSelectedDocType
  } = useDocumentUpload({ 
    userId, 
    existingDocument, 
    onSuccess, 
    onClose,
    initialDocType: documentType
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-slate-800 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-white">{getDocumentTitle()}</DialogTitle>
        </DialogHeader>
        
        <DocumentUploadForm
          selectedDocType={selectedDocType}
          setSelectedDocType={setSelectedDocType}
          frontFile={frontFile}
          backFile={backFile}
          frontPreview={frontPreview}
          backPreview={backPreview}
          errors={errors}
          fileError={fileError}
          handleFileChange={handleFileChange}
          clearFile={clearFile}
        />
        
        <DialogFooter>
          <DialogActions 
            onCancel={onClose} 
            onSubmit={handleSubmit} 
            uploading={uploading} 
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
