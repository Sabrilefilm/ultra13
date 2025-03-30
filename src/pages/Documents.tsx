
import React, { useState } from "react";
import { useIndexAuth } from "@/hooks/use-index-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from "lucide-react";
import UltraSidebar from "@/components/layout/UltraSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminDocumentsView } from "@/components/documents/AdminDocumentsView";
import { UserDocumentView } from "@/components/documents/UserDocumentView";
import { DocumentUploadDialog } from "@/components/documents/DocumentUploadDialog";
import { useToast } from "@/hooks/use-toast";

type Role = 'client' | 'creator' | 'manager' | 'founder' | 'agent' | 'ambassadeur';

const Documents = () => {
  const { isAuthenticated, username, role, userId, handleLogout } = useIndexAuth();
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const { toast } = useToast();
  
  const handleUploadSuccess = () => {
    setIsUploadDialogOpen(false);
    toast({
      title: "Succès",
      description: "Document téléchargé avec succès",
      duration: 5000,
    });
  };

  if (!isAuthenticated) {
    window.location.href = '/';
    return null;
  }

  return (
    <SidebarProvider>
      <UltraSidebar
        username={username}
        role={role as Role}
        userId={userId || ''}  {/* Added userId prop */}
        onLogout={handleLogout}
        currentPage="documents"
      >
        <div className="p-6 max-w-7xl mx-auto">
          <Card className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm border border-slate-700/50 rounded-xl shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-2xl font-bold">Documents</CardTitle>
              {['founder', 'manager'].includes(role || '') && (
                <Button onClick={() => setIsUploadDialogOpen(true)} size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Nouveau document
                </Button>
              )}
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 mb-4">
                  <TabsTrigger value="all">Tous</TabsTrigger>
                  <TabsTrigger value="contracts">Contrats</TabsTrigger>
                  <TabsTrigger value="guides">Guides</TabsTrigger>
                  <TabsTrigger value="legal">Légal</TabsTrigger>
                </TabsList>
                
                <Separator className="my-4" />
                
                {['founder', 'manager'].includes(role || '') ? (
                  <TabsContent value="all">
                    <AdminDocumentsView />
                  </TabsContent>
                ) : (
                  <TabsContent value="all">
                    <UserDocumentView />
                  </TabsContent>
                )}
                
                <TabsContent value="contracts">
                  <p className="text-muted-foreground">Documents contractuels et accords.</p>
                </TabsContent>
                
                <TabsContent value="guides">
                  <p className="text-muted-foreground">Guides d'utilisation et tutoriels.</p>
                </TabsContent>
                
                <TabsContent value="legal">
                  <p className="text-muted-foreground">Documents légaux et conformité.</p>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        <DocumentUploadDialog 
          open={isUploadDialogOpen} 
          onOpenChange={setIsUploadDialogOpen}
          onSuccess={handleUploadSuccess} 
        />
      </UltraSidebar>
    </SidebarProvider>
  );
};

export default Documents;
