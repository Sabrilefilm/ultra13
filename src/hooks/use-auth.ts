
// Ré-exporte useAuth depuis AuthProvider
import { useAuth as useAuthProvider } from '@/providers/AuthProvider';

export interface AuthContextType {
  user: any;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
  role: string | null;
  username: string | null;
  userId: string | null;
}

export const useAuth = useAuthProvider;

export default useAuth;
