
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DocumentSideForm } from './DocumentSideForm';
import { useDocumentUpload } from './useDocumentUpload';
import { AlertCircle } from 'lucide-react';

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
        
        <div className="grid gap-6 py-4">
          {fileError && (
            <div className="p-3 bg-red-900/30 border border-red-700/50 rounded-lg flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-red-300">{fileError}</div>
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium mb-2 text-white/90">Type de document</label>
            <Select 
              value={selectedDocType} 
              onValueChange={(value) => setSelectedDocType(value as 'identity' | 'other')}
            >
              <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                <SelectValue placeholder="Sélectionner un type de document" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700 text-white">
                <SelectItem value="identity" className="text-white hover:bg-slate-700">Carte d'identité</SelectItem>
                <SelectItem value="other" className="text-white hover:bg-slate-700">Autre document</SelectItem>
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
            className="bg-slate-700 hover:bg-slate-600 border-slate-600 text-white"
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
