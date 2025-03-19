
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
  const [userId, setUserId] = useState<string>('');
  const [documentType, setDocumentType] = useState<'identity' | 'other'>('identity');

  const fetchDocuments = async () => {
    try {
      if (!isAuthenticated) return;
      
      setLoading(true);
      
      // Get user id from username
      const { data: userData, error: userError } = await supabase
        .from('user_accounts')
        .select('id')
        .eq('username', username)
        .single();
        
      if (userError) {
        console.error('Error fetching user data:', userError);
        toast({
          title: "Erreur",
          description: "Impossible de trouver votre compte utilisateur.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }
      
      setUserId(userData.id);
      
      // Admin users get all documents
      if (role === 'founder' || role === 'manager') {
        try {
          const { data, error } = await supabase
            .from('identity_documents')
            .select('*')
            .order('uploaded_at', { ascending: false });
          
          if (error) throw error;
          
          // Get user data for each document
          const enrichedDocs = await Promise.all(
            (data || []).map(async (doc) => {
              try {
                const { data: userData, error: userError } = await supabase
                  .from('user_accounts')
                  .select('username')
                  .eq('id', doc.user_id)
                  .single();
                
                return {
                  ...doc,
                  username: userError ? 'Inconnu' : userData?.username || 'Inconnu',
                };
              } catch (error) {
                console.error('Error fetching user for document:', error);
                return {
                  ...doc,
                  username: 'Inconnu',
                };
              }
            })
          );
          
          setDocuments(enrichedDocs);
        } catch (error) {
          console.error('Error fetching all documents:', error);
          throw error;
        }
      } else {
        // Regular users only get their own document
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
      
      // Ensure document URLs are correctly formatted
      if (data) {
        const formattedDoc = {
          ...data,
          document_front: data.document_front ? data.document_front : null,
          document_back: data.document_back ? data.document_back : null
        };
        setUserDocument(formattedDoc);
      } else {
        setUserDocument(null);
      }
      
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
    userId,
    documentType,
    setDocumentType,
    setSelectedTab,
    setShowUploadDialog,
    handleVerifyDocument,
    handleLogout,
    fetchUserDocument,
    fetchDocuments
  };
};
