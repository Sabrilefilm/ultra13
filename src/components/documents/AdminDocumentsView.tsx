
import { FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DocumentCard } from './DocumentCard';

interface Document {
  id: string;
  user_id: string;
  document_front: string;
  document_back: string;
  uploaded_at: string;
  verified: boolean;
  username: string;
  document_type?: string;
}

interface AdminDocumentsViewProps {
  documents: Document[];
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
  onVerifyDocument: (docId: string, verified: boolean) => Promise<void>;
}

export const AdminDocumentsView = ({ 
  documents, 
  selectedTab, 
  setSelectedTab, 
  onVerifyDocument 
}: AdminDocumentsViewProps) => {
  const filteredDocuments = documents.filter(doc => {
    if (selectedTab === 'all') return true;
    if (selectedTab === 'verified') return doc.verified;
    if (selectedTab === 'unverified') return !doc.verified;
    if (selectedTab === 'identity') return doc.document_type === 'identity' || !doc.document_type;
    if (selectedTab === 'other') return doc.document_type === 'other';
    return true;
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Documents d'identité</CardTitle>
        <Tabs defaultValue="all" value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList>
            <TabsTrigger value="all">Tous</TabsTrigger>
            <TabsTrigger value="verified">Vérifiés</TabsTrigger>
            <TabsTrigger value="unverified">Non vérifiés</TabsTrigger>
            <TabsTrigger value="identity">Cartes d'identité</TabsTrigger>
            <TabsTrigger value="other">Autres documents</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        {filteredDocuments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDocuments.map((doc) => (
              <DocumentCard
                key={doc.id}
                id={doc.id}
                username={doc.username}
                uploadedAt={doc.uploaded_at}
                verified={doc.verified}
                documentFront={doc.document_front}
                documentBack={doc.document_back}
                documentType={doc.document_type || 'identity'}
                onVerify={onVerifyDocument}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
              <FileText className="h-8 w-8 text-gray-500 dark:text-gray-400" />
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-2">Aucun document trouvé</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
