import React, { useState, useEffect } from "react";
import { UltraDashboard } from "@/components/dashboard/UltraDashboard";
import { useIndexAuth } from "@/hooks/use-index-auth";
import { useAccountManagement } from "@/hooks/use-account-management";
import { usePlatformSettings } from "@/hooks/use-platform-settings";
import { useToast } from "@/hooks/use-toast";
import { useInactivityTimer } from "@/hooks/use-inactivity-timer";
import { motion } from "framer-motion";
import {
  AdminDocumentsView,
  UserDocumentView,
  DocumentUploadDialog,
} from "@/components/documents";
import { useDocuments } from "@/hooks/use-documents";

const Documents = () => {
  const {
    isAuthenticated,
    username,
    role,
    userId,
    handleLogout,
  } = useIndexAuth();

  const { toast } = useToast();
  const { handleCreateAccount } = useAccountManagement();

  // Inactivity timer setup
  const { showWarning, dismissWarning, formattedTime } = useInactivityTimer({
    timeout: 120000, // 2 minutes
    onTimeout: () => {
      handleLogout();
      toast({
        title: "Déconnexion automatique",
        description: "Vous avez été déconnecté en raison d'inactivité.",
      });
    },
    warningTime: 30000, // Show warning 30 seconds before timeout
    onWarning: () => {
      // Warning is handled by the hook and displayed via showWarning
    }
  });

  const { platformSettings, handleUpdateSettings } = usePlatformSettings(role);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const { documents, uploadDocument } = useDocuments();

  useEffect(() => {
    document.title = "Documents | Ultra";
  }, []);

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };
  
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const handleShowUploadDialog = () => {
    setIsUploadDialogOpen(true);
  };

  const handleCloseUploadDialog = () => {
    setIsUploadDialogOpen(false);
  };

  const handleDocumentUpload = async (file: File) => {
    try {
      await uploadDocument(file);
      toast({
        title: "Succès",
        description: "Document téléversé avec succès.",
      });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: `Erreur lors du téléversement du document: ${error.message || error}`,
      });
    } finally {
      handleCloseUploadDialog();
    }
  };

  if (!isAuthenticated) {
    return <p>Vous n'êtes pas connecté.</p>;
  }

  return (
    <UltraDashboard
      username={username}
      role={role || ''}
      userId={userId || ''}
      onLogout={handleLogout}
      platformSettings={platformSettings}
      handleCreateAccount={handleCreateAccount}
      handleUpdateSettings={handleUpdateSettings}
      showWarning={showWarning}
      dismissWarning={dismissWarning}
      formattedTime={formattedTime}
      currentPage="documents"
    >
      <motion.div 
        className="p-6 space-y-6"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        <h1 className="text-3xl font-bold mb-4">Documents</h1>
        
        {role === 'creator' ? (
          <UserDocumentView 
            documents={documents as any[]} 
            onUpload={handleShowUploadDialog} 
          />
        ) : (
          <AdminDocumentsView 
            documents={documents as any[]} 
          />
        )}

        <DocumentUploadDialog 
          isOpen={isUploadDialogOpen}
          onClose={handleCloseUploadDialog}
          onUpload={handleDocumentUpload}
        />
      </motion.div>
    </UltraDashboard>
  );
};

export default Documents;
