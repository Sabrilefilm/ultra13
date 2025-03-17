
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useIndexAuth } from '@/hooks/use-index-auth';
import { useToast } from '@/hooks/use-toast';

export const useDocuments = () => {
  const { toast } = useToast();
  const { isAuthenticated, username, role, handleLogout } = useIndexAuth();
  const [loading, setLoading] = useState(true);
  const [documents, setDocuments] = useState<any[]>([]);
  const [userDocument, setUserDocument] = useState<any>(null);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [selectedTab, setSelectedTab] = useState('all');

  const fetchDocuments = async () => {
    try {
      if (!isAuthenticated) return;
      
      setLoading(true);
      
      // Admin users get all documents
      if (role === 'founder' || role === 'manager') {
        const { data, error } = await supabase
          .from('identity_documents')
          .select(`
            *,
            user_accounts(username)
          `)
          .order('uploaded_at', { ascending: false });
        
        if (error) throw error;
        
        // Format the data to include username
        const formattedDocs = data.map(doc => ({
          ...doc,
          username: doc.user_accounts?.username || 'Inconnu'
        }));
        
        setDocuments(formattedDocs);
      } else {
        // Regular users only get their own document
        // Get user id from username
        const { data: userData, error: userError } = await supabase
          .from('user_accounts')
          .select('id')
          .eq('username', username)
          .single();
          
        if (userError) throw userError;
        
        await fetchUserDocument(userData.id);
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les documents.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchUserDocument = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('identity_documents')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();
      
      if (error) throw error;
      setUserDocument(data);
      return data;
    } catch (error) {
      console.error('Error fetching user document:', error);
      return null;
    }
  };

  const handleVerifyDocument = async (docId: string, verified: boolean) => {
    try {
      const { error } = await supabase
        .from('identity_documents')
        .update({ verified })
        .eq('id', docId);
      
      if (error) throw error;
      
      toast({
        title: verified ? "Document vérifié" : "Document non vérifié",
        description: `Le document a été marqué comme ${verified ? 'vérifié' : 'non vérifié'}.`,
        variant: verified ? "default" : "default",
      });
      
      fetchDocuments();
    } catch (error) {
      console.error('Error verifying document:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut du document.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchDocuments();
    }
  }, [isAuthenticated]);

  return {
    loading,
    username,
    role,
    documents,
    userDocument,
    showUploadDialog,
    selectedTab,
    setSelectedTab,
    setShowUploadDialog,
    handleVerifyDocument,
    handleLogout,
    fetchUserDocument
  };
};
