
import { DocumentSideForm } from './DocumentSideForm';
import { DocumentTypeSelector } from './DocumentTypeSelector';
import { ErrorMessage } from './ErrorMessage';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Info } from 'lucide-react';

interface DocumentUploadFormProps {
  selectedDocType: 'identity' | 'other';
  setSelectedDocType: (value: 'identity' | 'other') => void;
  frontFile: File | null;
  backFile: File | null;
  frontPreview: string | null;
  backPreview: string | null;
  errors: { front?: string; back?: string };
  fileError: string | null;
  handleFileChange: (side: 'front' | 'back', file: File | null) => void;
  clearFile: (side: 'front' | 'back') => void;
}

export const DocumentUploadForm = ({
  selectedDocType,
  setSelectedDocType,
  frontFile,
  backFile,
  frontPreview,
  backPreview,
  errors,
  fileError,
  handleFileChange,
  clearFile
}: DocumentUploadFormProps) => {
  return (
    <div className="grid gap-6 py-4">
      {fileError && <ErrorMessage message={fileError} />}
      
      <Card className="border-blue-100 dark:border-blue-900/30 shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-start gap-3 mb-4">
            <Info className="h-5 w-5 text-blue-500 mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-700 dark:text-blue-300 mb-1">Instructions</h3>
              <ul className="text-sm text-blue-600/80 dark:text-blue-400/80 space-y-1 list-disc pl-4">
                <li>Les fichiers doivent être au format JPEG, PNG ou PDF</li>
                <li>Taille maximale par fichier: 10MB</li>
                <li>Assurez-vous que les documents sont clairement lisibles</li>
              </ul>
            </div>
          </div>
          
          <div className="mb-4">
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800/50">
              {selectedDocType === 'identity' ? 'Document d\'identité' : 'Autre document'}
            </Badge>
          </div>
          
          <DocumentTypeSelector 
            selectedDocType={selectedDocType} 
            onTypeChange={setSelectedDocType} 
          />
        </CardContent>
      </Card>

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
  );
};
