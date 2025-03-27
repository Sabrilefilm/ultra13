
import { useNavigate } from 'react-router-dom';
import { UltraSidebar } from '@/components/layout/UltraSidebar';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Upload } from 'lucide-react';
import { Loading } from '@/components/ui/loading';
import { DocumentUploadDialog } from '@/components/documents/upload/DocumentUploadDialog';
import { useDocuments } from '@/hooks/documents/use-documents';
import { UserDocumentView } from '@/components/documents/UserDocumentView';
import { AdminDocumentsView } from '@/components/documents/AdminDocumentsView';
import { LogoutButton } from '@/components/layout/LogoutButton';

const Documents = () => {
  const navigate = useNavigate();
  const {
    loading,
    userId,
    username,
    role,
    documents,
    userDocument,
    showUploadDialog,
    selectedTab,
    documentType,
    setDocumentType,
    setSelectedTab,
    setShowUploadDialog,
    handleVerifyDocument,
    handleLogout,
    fetchUserDocument,
    fetchDocuments
  } = useDocuments();

  if (loading) {
    return <Loading fullScreen size="large" text="Chargement des documents..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex">
      <UltraSidebar 
        username={username}
        role={role}
        onLogout={handleLogout}
        currentPage="documents"
      />
      
      <div className="flex-1 flex flex-col">
        <div className="bg-white dark:bg-slate-950 border-b border-gray-200 dark:border-gray-800 p-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/")}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold">Gestion des Documents</h1>
          </div>
          
          <div className="flex items-center gap-2">
            {role === 'creator' && (
              <Button
                onClick={() => setShowUploadDialog(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                <Upload className="mr-2 h-4 w-4" />
                Télécharger document
              </Button>
            )}
            
            <LogoutButton 
              onLogout={handleLogout} 
              username={username}
              variant="outline"
              size="sm"
              className="hidden sm:flex"
            />
          </div>
        </div>
        
        <div className="flex-1 p-4">
          {(role === 'founder' || role === 'manager') ? (
            <AdminDocumentsView 
              documents={documents}
              selectedTab={selectedTab}
              setSelectedTab={setSelectedTab}
              onVerifyDocument={handleVerifyDocument}
            />
          ) : (
            <UserDocumentView 
              userDocument={userDocument} 
              onShowUploadDialog={() => setShowUploadDialog(true)}
              onChangeDocumentType={setDocumentType}
              documentType={documentType}
              fetchDocuments={fetchDocuments}
            />
          )}
        </div>
      </div>

      <DocumentUploadDialog
        isOpen={showUploadDialog}
        onClose={() => setShowUploadDialog(false)}
        userId={userId}
        existingDocument={userDocument || undefined}
        onSuccess={() => fetchUserDocument(userId)}
        documentType={documentType}
      />
    </div>
  );
};

export default Documents;
