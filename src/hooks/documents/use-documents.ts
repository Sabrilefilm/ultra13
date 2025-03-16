
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface Document {
  id: string;
  user_id: string;
  document_front: string;
  document_back: string;
  uploaded_at: string;
  verified: boolean;
  username: string;
}

export const useDocuments = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState('');
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('');
  const [documents, setDocuments] = useState<Document[]>([]);
  const [userDocument, setUserDocument] = useState<Document | null>(null);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [selectedTab, setSelectedTab] = useState('all');

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        
        if (!data.session?.user) {
          navigate('/');
          return;
        }
        
        setUserId(data.session.user.id);
        
        const { data: userData, error } = await supabase
          .from('profiles')
          .select('role, username')
          .eq('id', data.session.user.id)
          .single();
          
        if (error) throw error;
        
        setRole(userData?.role || 'creator');
        setUsername(userData?.username || data.session.user.email || 'User');
        
        if (userData?.role === 'founder' || userData?.role === 'manager') {
          await fetchAllDocuments();
        } else {
          await fetchUserDocument(data.session.user.id);
        }
      } catch (error) {
        console.error('Error checking session:', error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Une erreur est survenue lors de la vérification de session",
        });
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    
    checkSession();
  }, [navigate]);

  const fetchAllDocuments = async () => {
    try {
      const { data, error } = await supabase
        .from('identity_documents')
        .select(`
          *,
          user:user_id(username)
        `)
        .order('uploaded_at', { ascending: false });
        
      if (error) throw error;
      
      const formattedDocs = data.map(doc => ({
        ...doc,
        username: doc.user?.username || 'Utilisateur inconnu'
      }));
      
      setDocuments(formattedDocs);
    } catch (error) {
      console.error('Error fetching documents:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les documents",
      });
    }
  };

  const fetchUserDocument = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('identity_documents')
        .select('*')
        .eq('user_id', userId)
        .single();
        
      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      
      if (data) {
        setUserDocument(data as Document);
      }
    } catch (error) {
      console.error('Error fetching user document:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger votre document",
      });
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
        title: "Succès",
        description: verified 
          ? "Document vérifié avec succès" 
          : "Document marqué comme non vérifié",
      });
      
      if (role === 'founder' || role === 'manager') {
        await fetchAllDocuments();
      } else {
        await fetchUserDocument(userId);
      }
    } catch (error) {
      console.error('Error verifying document:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour le statut du document",
      });
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return {
    loading,
    userId,
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
