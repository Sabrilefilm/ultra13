
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DocumentSideForm } from './DocumentSideForm';
import { useDocumentUpload } from './useDocumentUpload';

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
  documentType: initialDocType
}: DocumentUploadDialogProps) => {
  const {
    frontFile,
    backFile,
    frontPreview,
    backPreview,
    uploading,
    errors,
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
    onClose 
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{getDocumentTitle()}</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          <div>
            <label className="block text-sm font-medium mb-2">Type de document</label>
            <Select 
              value={selectedDocType} 
              onValueChange={(value) => setSelectedDocType(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un type de document" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="identity">Carte d'identité</SelectItem>
                <SelectItem value="other">Autre document</SelectItem>
              </SelectContent>
            </Select>
          </div>

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
        
        <DialogFooter>
          <Button 
            type="button" 
            variant="outline" 
            onClick={onClose} 
            disabled={uploading}
          >
            Annuler
          </Button>
          <Button 
            type="button" 
            onClick={handleSubmit} 
            disabled={uploading}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            {uploading ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-transparent border-t-current"></div>
                Téléchargement...
              </>
            ) : (
              'Télécharger'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
