
export interface IdentityDocument {
  id: string;
  user_id: string;
  document_front: string;
  document_back?: string;
  uploaded_at: string;
  verified: boolean;
  username?: string;
  document_type?: 'identity' | 'other';
}

export interface UserDocument {
  id: string;
  uploaded_at: string;
  verified: boolean;
  document_front?: string;
  document_back?: string;
  document_type?: 'identity' | 'other';
}
