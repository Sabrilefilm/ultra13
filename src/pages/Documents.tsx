
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { useIndexAuth } from "@/hooks/use-index-auth";
import { SidebarProvider } from "@/components/ui/sidebar";
import { UltraSidebar } from "@/components/layout/UltraSidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminDocumentsView } from "@/components/documents/AdminDocumentsView";
import { UserDocumentView } from "@/components/documents/UserDocumentView";
import { DocumentUploadDialog } from "@/components/documents/upload/DocumentUploadDialog";
import { useDocuments } from "@/hooks/documents/use-documents";

const Documents = () => {
  const { isAuthenticated, username, role, userId, handleLogout } = useIndexAuth();
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState("verified");
  const [documentType, setDocumentType] = useState("id");
  
  const { 
    userDocuments, 
    allDocuments, 
    isLoading, 
    fetchDocuments, 
    verifyDocument,
    rejectDocument
  } = useDocuments(role);

  useEffect(() => {
    if (!isAuthenticated) {
      window.location.href = '/';
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return null;
  }

  const handleShowUploadDialog = () => {
    setIsUploadDialogOpen(true);
  };

  const handleDocumentTypeChange = (type: string) => {
    setDocumentType(type);
  };

  const handleUploadSuccess = () => {
    toast.success("Document uploaded successfully!");
    fetchDocuments();
  };

  const handleVerifyDocument = async (documentId: string) => {
    await verifyDocument(documentId);
    toast.success("Document verified successfully!");
    fetchDocuments();
  };

  const handleRejectDocument = async (documentId: string) => {
    await rejectDocument(documentId);
    toast.error("Document rejected");
    fetchDocuments();
  };

  return (
    <SidebarProvider>
      <UltraSidebar
        username={username}
        role={role}
        userId={userId || ''}
        onLogout={handleLogout}
        currentPage="documents"
      >
        <div className="p-6 max-w-5xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Documents</h1>
          
          {role === "founder" || role === "manager" ? (
            <Tabs defaultValue="verified" value={selectedTab} onValueChange={setSelectedTab}>
              <TabsList className="mb-6">
                <TabsTrigger value="verified">Verified Documents</TabsTrigger>
                <TabsTrigger value="pending">Pending Verification</TabsTrigger>
                <TabsTrigger value="rejected">Rejected Documents</TabsTrigger>
              </TabsList>
              
              <TabsContent value="verified" className="space-y-4">
                <AdminDocumentsView 
                  documents={allDocuments.filter(doc => doc.status === 'verified')}
                  selectedTab={selectedTab}
                  setSelectedTab={setSelectedTab}
                  onVerifyDocument={handleVerifyDocument}
                />
              </TabsContent>
              
              <TabsContent value="pending" className="space-y-4">
                <AdminDocumentsView 
                  documents={allDocuments.filter(doc => doc.status === 'pending')}
                  selectedTab={selectedTab}
                  setSelectedTab={setSelectedTab}
                  onVerifyDocument={handleVerifyDocument}
                />
              </TabsContent>
              
              <TabsContent value="rejected" className="space-y-4">
                <AdminDocumentsView 
                  documents={allDocuments.filter(doc => doc.status === 'rejected')}
                  selectedTab={selectedTab}
                  setSelectedTab={setSelectedTab}
                  onVerifyDocument={handleVerifyDocument}
                />
              </TabsContent>
            </Tabs>
          ) : (
            <UserDocumentView 
              userDocument={userDocuments}
              onShowUploadDialog={handleShowUploadDialog}
              onChangeDocumentType={handleDocumentTypeChange}
              documentType={documentType}
              fetchDocuments={fetchDocuments}
            />
          )}
          
          <DocumentUploadDialog 
            isOpen={isUploadDialogOpen}
            onOpenChange={setIsUploadDialogOpen}
            onSuccess={handleUploadSuccess}
            documentType={documentType}
          />
        </div>
      </UltraSidebar>
    </SidebarProvider>
  );
};

export default Documents;
