
import { useState } from 'react';

export interface IdentityDocument {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  uploadDate: string;
  status: "pending" | "approved" | "rejected";
  document_back?: string;
  url: string;
}

export const useDocuments = () => {
  const [documents, setDocuments] = useState<IdentityDocument[]>([
    {
      id: '1',
      fileName: 'passport.jpg',
      fileType: 'image/jpeg',
      fileSize: 2500000,
      uploadDate: '2024-03-15',
      status: 'pending',
      url: 'https://example.com/files/passport.jpg'
    },
    {
      id: '2',
      fileName: 'identity_card.pdf',
      fileType: 'application/pdf',
      fileSize: 1500000,
      uploadDate: '2024-03-10',
      status: 'approved',
      document_back: 'https://example.com/files/identity_card_back.pdf',
      url: 'https://example.com/files/identity_card.pdf'
    }
  ]);

  const uploadDocument = async (file: File): Promise<void> => {
    return new Promise((resolve) => {
      // Simulate upload
      setTimeout(() => {
        const newDoc: IdentityDocument = {
          id: Math.random().toString(36).substr(2, 9),
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
          uploadDate: new Date().toISOString().split('T')[0],
          status: 'pending',
          url: URL.createObjectURL(file)
        };
        setDocuments(prev => [...prev, newDoc]);
        resolve();
      }, 1000);
    });
  };

  return {
    documents,
    uploadDocument
  };
};
