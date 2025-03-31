
import React from 'react';

// Types
interface Document {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  uploadDate: string;
  status: "pending" | "approved" | "rejected";
  document_back?: string;
  url: string;
}

// Props interfaces
export interface UserDocumentViewProps {
  documents: Document[];
  onUpload: () => void;
}

export interface AdminDocumentsViewProps {
  documents: Document[];
}

export interface DocumentUploadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (file: File) => void;
}

// Placeholder components
export const UserDocumentView: React.FC<UserDocumentViewProps> = ({ documents, onUpload }) => {
  return (
    <div>
      <h2>Documents utilisateur</h2>
      <button onClick={onUpload}>Téléverser un document</button>
      <ul>
        {documents.map(doc => (
          <li key={doc.id}>
            {doc.fileName} - {doc.status}
          </li>
        ))}
      </ul>
    </div>
  );
};

export const AdminDocumentsView: React.FC<AdminDocumentsViewProps> = ({ documents }) => {
  return (
    <div>
      <h2>Documents administrateur</h2>
      <ul>
        {documents.map(doc => (
          <li key={doc.id}>
            {doc.fileName} - {doc.status}
          </li>
        ))}
      </ul>
    </div>
  );
};

export const DocumentUploadDialog: React.FC<DocumentUploadDialogProps> = ({ 
  isOpen, 
  onClose, 
  onUpload 
}) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(file);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg">
        <h3>Téléverser un document</h3>
        <input type="file" onChange={handleFileChange} />
        <div className="flex gap-2 mt-4">
          <button onClick={onClose}>Annuler</button>
          <button>Téléverser</button>
        </div>
      </div>
    </div>
  );
};
