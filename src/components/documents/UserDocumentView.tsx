
import { AlertTriangle, FileText, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

interface UserDocumentViewProps {
  userDocument: {
    id: string;
    uploaded_at: string;
    verified: boolean;
    document_front?: string;
    document_back?: string;
    document_type?: string;
  } | null;
  onShowUploadDialog: () => void;
  onChangeDocumentType: (type: 'identity' | 'other') => void;
  documentType: 'identity' | 'other';
  fetchDocuments: () => Promise<void>;
}

export const UserDocumentView = ({ 
  userDocument, 
  onShowUploadDialog, 
  onChangeDocumentType,
  documentType,
  fetchDocuments
}: UserDocumentViewProps) => {

  const handleTabChange = (value: string) => {
    onChangeDocumentType(value as 'identity' | 'other');
    fetchDocuments();
  };

  const getDocumentTitle = () => {
    return documentType === 'identity' ? "Carte d'identité" : "Autre document";
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Mes documents</CardTitle>
          <Tabs defaultValue="identity" value={documentType} onValueChange={handleTabChange}>
            <TabsList>
              <TabsTrigger value="identity">Carte d'identité</TabsTrigger>
              <TabsTrigger value="other">Autre document</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">{getDocumentTitle()}</h2>
        </div>

        {userDocument ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Document téléchargé le {new Date(userDocument.uploaded_at).toLocaleDateString('fr-FR')}
                </p>
              </div>
              <Badge 
                variant={userDocument.verified ? "secondary" : "outline"} 
                className={userDocument.verified ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100" : "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100"}
              >
                {userDocument.verified ? 'Vérifié' : 'En attente de vérification'}
              </Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium mb-2">
                  {documentType === 'identity' ? 'Recto' : 'Première page'}
                </h3>
                {userDocument.document_front ? (
                  <div className="border border-gray-200 dark:border-gray-800 rounded-md overflow-hidden">
                    <img 
                      src={userDocument.document_front} 
                      alt={documentType === 'identity' ? 'Recto' : 'Première page'} 
                      className="w-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-48 bg-gray-100 dark:bg-gray-800 rounded-md">
                    <FileText className="h-10 w-10 text-gray-400" />
                  </div>
                )}
              </div>
              <div>
                <h3 className="font-medium mb-2">
                  {documentType === 'identity' ? 'Verso' : 'Deuxième page'}
                </h3>
                {userDocument.document_back ? (
                  <div className="border border-gray-200 dark:border-gray-800 rounded-md overflow-hidden">
                    <img 
                      src={userDocument.document_back} 
                      alt={documentType === 'identity' ? 'Verso' : 'Deuxième page'} 
                      className="w-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-48 bg-gray-100 dark:bg-gray-800 rounded-md">
                    <FileText className="h-10 w-10 text-gray-400" />
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-center mt-4">
              <Button 
                onClick={() => {
                  onShowUploadDialog();
                }}
                variant="outline"
              >
                <Upload className="mr-2 h-4 w-4" />
                Mettre à jour le document
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-20 h-20 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mb-6">
              <AlertTriangle className="h-10 w-10 text-amber-500" />
            </div>
            <h3 className="text-xl font-medium mb-2">Aucun document téléchargé</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6 text-center max-w-md">
              {documentType === 'identity' 
                ? 'Vous devez télécharger une pièce d\'identité valide (carte d\'identité ou passeport).'
                : 'Vous pouvez télécharger un autre document important (justificatif de domicile, etc.).'}
            </p>
            <Button 
              onClick={() => {
                onShowUploadDialog();
              }}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              <Upload className="mr-2 h-4 w-4" />
              Télécharger mon document
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
