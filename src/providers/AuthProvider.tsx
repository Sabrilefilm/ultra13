
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

interface AuthContextType {
  user: any;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
  role: string | null;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  login: async () => null,
  logout: async () => {},
  role: null,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for user info in localStorage
    const userId = localStorage.getItem('userId');
    const userRole = localStorage.getItem('userRole');
    const token = localStorage.getItem('token');

    if (userId && userRole && token) {
      setUser({ id: userId });
      setRole(userRole);
      setIsAuthenticated(true);
    }

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          console.log('User signed in:', session.user);
          
          // This would normally get the user's role from database
          const userRole = localStorage.getItem('userRole') || 'creator';
          
          setUser(session.user);
          setRole(userRole);
          setIsAuthenticated(true);
          
          localStorage.setItem('userId', session.user.id);
          localStorage.setItem('userRole', userRole);
          localStorage.setItem('token', session.access_token);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setRole(null);
          setIsAuthenticated(false);
          
          localStorage.removeItem('userId');
          localStorage.removeItem('userRole');
          localStorage.removeItem('token');
          
          navigate('/');
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      // Get user role from database (mocked here)
      // In a real app, you'd query your users table
      const mockRole = email.includes('founder') ? 'founder' : 
                       email.includes('manager') ? 'manager' : 
                       email.includes('agent') ? 'agent' : 
                       email.includes('ambassadeur') ? 'ambassadeur' : 'creator';
      
      setUser(data.user);
      setRole(mockRole);
      setIsAuthenticated(true);
      
      localStorage.setItem('userId', data.user?.id || '');
      localStorage.setItem('userRole', mockRole);
      localStorage.setItem('token', data.session?.access_token || '');
      
      return { user: data.user, role: mockRole };
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setRole(null);
      setIsAuthenticated(false);
      
      localStorage.removeItem('userId');
      localStorage.removeItem('userRole');
      localStorage.removeItem('token');
      
      navigate('/');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const contextValue = {
    user,
    isAuthenticated,
    login,
    logout,
    role
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
