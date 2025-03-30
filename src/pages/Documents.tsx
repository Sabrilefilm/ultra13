
import React, { useState, useEffect } from "react";
import { useIndexAuth } from "@/hooks/use-index-auth";
import { UltraSidebar } from "@/components/layout/UltraSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DocumentUploadDialog } from "@/components/documents/upload/DocumentUploadDialog";
import { UserDocumentView } from "@/components/documents/UserDocumentView";
import { AdminDocumentsView } from "@/components/documents/AdminDocumentsView";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { IdentityDocument } from "@/types/documents";

const Documents = () => {
  const { isAuthenticated, username, role, userId, handleLogout } = useIndexAuth();
  const [documents, setDocuments] = useState<IdentityDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [documentType, setDocumentType] = useState<'identity' | 'other'>('identity');
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    // Fetch documents logic would go here
    // For now, we'll use an empty array
    setDocuments([]);
    setLoading(false);
  }, []);

  const handleUploadSuccess = () => {
    setIsDialogOpen(false);
    // Refresh documents
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const filteredDocuments = documents.filter(doc => {
    if (activeTab === "all") return true;
    if (activeTab === "verified") return doc.verified;
    if (activeTab === "pending") return !doc.verified;
    return true;
  });

  if (!isAuthenticated) return null;

  return (
    <SidebarProvider>
      <UltraSidebar
        username={username}
        role={role}
        userId={userId || ''}
        onLogout={handleLogout}
        currentPage="documents"
      >
        <div className="p-6 max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Documents</h1>
            
            <Button onClick={() => setIsDialogOpen(true)} className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Upload Document
            </Button>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
            </div>
          ) : (
            <>
              {role === 'creator' ? (
                <UserDocumentView 
                  documents={documents as IdentityDocument[]} 
                  onUpload={() => setIsDialogOpen(true)} 
                />
              ) : (
                <AdminDocumentsView 
                  documents={documents as IdentityDocument[]} 
                />
              )}
            </>
          )}
          
          <DocumentUploadDialog 
            isOpen={isDialogOpen} 
            onClose={() => setIsDialogOpen(false)} 
            documentType={documentType} 
            onSuccess={handleUploadSuccess}
          />
        </div>
      </UltraSidebar>
    </SidebarProvider>
  );
};

export default Documents;
