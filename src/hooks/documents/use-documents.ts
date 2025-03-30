
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface Document {
  id: string;
  user_id: string;
  filename: string;
  file_type: string;
  upload_date: string;
  status: 'pending' | 'verified' | 'rejected';
  document_type: string;
  username?: string;
}

export const useDocuments = (role: string | null) => {
  const [userDocuments, setUserDocuments] = useState<Document[]>([]);
  const [allDocuments, setAllDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const fetchDocuments = async () => {
    setIsLoading(true);
    try {
      const userId = localStorage.getItem('userId');
      
      if (role === 'founder' || role === 'manager') {
        // Fetch all documents for admin view
        const { data, error } = await supabase
          .from('documents')
          .select('*, user_accounts(username)')
          .order('upload_date', { ascending: false });
          
        if (error) throw error;
        
        // Format the data to include username
        const formattedData = data.map((doc: any) => ({
          ...doc,
          username: doc.user_accounts?.username
        }));
        
        setAllDocuments(formattedData);
      } else {
        // Fetch only user's documents
        const { data, error } = await supabase
          .from('documents')
          .select('*')
          .eq('user_id', userId)
          .order('upload_date', { ascending: false });
          
        if (error) throw error;
        
        setUserDocuments(data || []);
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const verifyDocument = async (documentId: string) => {
    try {
      const { error } = await supabase
        .from('documents')
        .update({ status: 'verified' })
        .eq('id', documentId);
        
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error('Error verifying document:', error);
      return false;
    }
  };
  
  const rejectDocument = async (documentId: string) => {
    try {
      const { error } = await supabase
        .from('documents')
        .update({ status: 'rejected' })
        .eq('id', documentId);
        
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error('Error rejecting document:', error);
      return false;
    }
  };
  
  useEffect(() => {
    fetchDocuments();
  }, [role]);
  
  return {
    userDocuments,
    allDocuments,
    isLoading,
    fetchDocuments,
    verifyDocument,
    rejectDocument
  };
};
