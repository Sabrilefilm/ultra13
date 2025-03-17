
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle, FileText, XCircle } from 'lucide-react';

interface DocumentCardProps {
  id: string;
  username: string;
  uploadedAt: string;
  verified: boolean;
  documentFront?: string;
  documentBack?: string;
  documentType?: string;
  onVerify: (docId: string, verified: boolean) => Promise<void>;
}

export const DocumentCard = ({
  id,
  username,
  uploadedAt,
  verified,
  documentFront,
  documentBack,
  documentType = 'identity',
  onVerify
}: DocumentCardProps) => {
  return (
    <Card key={id} className="overflow-hidden">
      <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
        <div>
          <h3 className="font-medium">{username}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {new Date(uploadedAt).toLocaleDateString('fr-FR')}
          </p>
          <Badge className="mt-1" variant="outline">
            {documentType === 'identity' ? 'Carte d\'identité' : 'Autre document'}
          </Badge>
        </div>
        <Badge variant={verified ? "secondary" : "destructive"} className={verified ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100" : ""}>
          {verified ? 'Vérifié' : 'Non vérifié'}
        </Badge>
      </div>
      <div className="p-4 grid grid-cols-2 gap-2">
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
            {documentType === 'identity' ? 'Recto' : 'Page 1'}
          </p>
          {documentFront ? (
            <a 
              href={documentFront} 
              target="_blank" 
              rel="noopener noreferrer"
              className="block h-32 border border-gray-200 dark:border-gray-800 rounded-md overflow-hidden"
            >
              <img 
                src={documentFront} 
                alt={documentType === 'identity' ? 'Recto' : 'Page 1'} 
                className="w-full h-full object-cover"
              />
            </a>
          ) : (
            <div className="flex items-center justify-center h-32 bg-gray-100 dark:bg-gray-800 rounded-md">
              <FileText className="h-6 w-6 text-gray-400" />
            </div>
          )}
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
            {documentType === 'identity' ? 'Verso' : 'Page 2'}
          </p>
          {documentBack ? (
            <a 
              href={documentBack} 
              target="_blank" 
              rel="noopener noreferrer"
              className="block h-32 border border-gray-200 dark:border-gray-800 rounded-md overflow-hidden"
            >
              <img 
                src={documentBack} 
                alt={documentType === 'identity' ? 'Verso' : 'Page 2'} 
                className="w-full h-full object-cover"
              />
            </a>
          ) : (
            <div className="flex items-center justify-center h-32 bg-gray-100 dark:bg-gray-800 rounded-md">
              <FileText className="h-6 w-6 text-gray-400" />
            </div>
          )}
        </div>
      </div>
      <div className="p-4 pt-0 flex space-x-2">
        {verified ? (
          <Button 
            variant="outline" 
            size="sm"
            className="w-full text-red-600 border-red-600 hover:bg-red-50 dark:hover:bg-red-950"
            onClick={() => onVerify(id, false)}
          >
            <XCircle className="mr-2 h-4 w-4" />
            Marquer non vérifié
          </Button>
        ) : (
          <Button 
            variant="outline" 
            size="sm"
            className="w-full text-green-600 border-green-600 hover:bg-green-50 dark:hover:bg-green-950"
            onClick={() => onVerify(id, true)}
          >
            <CheckCircle className="mr-2 h-4 w-4" />
            Vérifier
          </Button>
        )}
      </div>
    </Card>
  );
};
