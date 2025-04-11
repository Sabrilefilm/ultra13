
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

interface AuthContextType {
  user: any;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
  role: string | null;
  username: string | null;
  userId: string | null;
  lastLogin: string | null; // Add lastLogin property
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  login: async () => null,
  logout: async () => {},
  role: null,
  username: null,
  userId: null,
  lastLogin: null, // Initialize with null
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [username, setUsername] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [lastLogin, setLastLogin] = useState<string | null>(null); // Add state for lastLogin
  const navigate = useNavigate();

  useEffect(() => {
    // Check for user info in localStorage
    const userId = localStorage.getItem('userId');
    const userRole = localStorage.getItem('userRole');
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    const lastLogin = localStorage.getItem('lastLogin'); // Get lastLogin from localStorage

    if (userId && userRole && token) {
      setUser({ id: userId });
      setRole(userRole);
      setUsername(username);
      setUserId(userId);
      setIsAuthenticated(true);
      if (lastLogin) {
        setLastLogin(lastLogin); // Set lastLogin if it exists
      }
    }

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          console.log('User signed in:', session.user);
          
          // This would normally get the user's role from database
          const userRole = localStorage.getItem('userRole') || 'creator';
          const username = localStorage.getItem('username');
          const lastLoginTime = new Date().toISOString(); // Set current time as lastLogin
          
          setUser(session.user);
          setRole(userRole);
          setUsername(username);
          setUserId(session.user.id);
          setIsAuthenticated(true);
          setLastLogin(lastLoginTime); // Set lastLogin value
          
          localStorage.setItem('userId', session.user.id);
          localStorage.setItem('userRole', userRole);
          localStorage.setItem('token', session.access_token);
          localStorage.setItem('lastLogin', lastLoginTime); // Store lastLogin in localStorage
          if (username) {
            localStorage.setItem('username', username);
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setRole(null);
          setUsername(null);
          setUserId(null);
          setIsAuthenticated(false);
          setLastLogin(null); // Reset lastLogin on logout
          
          localStorage.removeItem('userId');
          localStorage.removeItem('userRole');
          localStorage.removeItem('token');
          localStorage.removeItem('username');
          localStorage.removeItem('lastLogin'); // Remove lastLogin from localStorage
          
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
      
      const mockUsername = email.split('@')[0]; // Simple username from email
      const lastLoginTime = new Date().toISOString(); // Set current login time
      
      setUser(data.user);
      setRole(mockRole);
      setUsername(mockUsername);
      setUserId(data.user?.id);
      setIsAuthenticated(true);
      setLastLogin(lastLoginTime); // Set lastLogin on successful login
      
      localStorage.setItem('userId', data.user?.id || '');
      localStorage.setItem('userRole', mockRole);
      localStorage.setItem('token', data.session?.access_token || '');
      localStorage.setItem('username', mockUsername);
      localStorage.setItem('lastLogin', lastLoginTime); // Store lastLogin
      
      return { user: data.user, role: mockRole, username: mockUsername, lastLogin: lastLoginTime };
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
      setUsername(null);
      setUserId(null);
      setIsAuthenticated(false);
      setLastLogin(null); // Reset lastLogin on logout
      
      localStorage.removeItem('userId');
      localStorage.removeItem('userRole');
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      localStorage.removeItem('lastLogin'); // Remove lastLogin from localStorage
      
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
    role,
    username,
    userId,
    lastLogin // Include lastLogin in context value
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
