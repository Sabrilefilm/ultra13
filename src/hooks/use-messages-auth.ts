import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export function useMessagesAuth() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string>('');
  const [role, setRole] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
      const storedUsername = localStorage.getItem('username');
      const storedRole = localStorage.getItem('userRole');
      const storedUserId = localStorage.getItem('userId');
      
      if (!isAuthenticated || !storedUsername || !storedRole) {
        console.log("Authentication failed, redirecting to login");
        toast.error("Session expirée, veuillez vous reconnecter");
        navigate('/');
        return;
      }
      
      console.log("Authentication successful");
      
      // If we already have the userId in localStorage, use it directly
      if (storedUserId) {
        console.log("User ID found in localStorage:", storedUserId);
        setUserId(storedUserId);
        setUsername(storedUsername);
        setRole(storedRole);
        await fetchAllUsers(storedUserId);
        setLoading(false);
        return;
      }
      
      // Otherwise, get user id from user_accounts table
      console.log("User ID not found in localStorage, fetching from database");
      try {
        const { data, error } = await supabase
          .from('user_accounts')
          .select('id')
          .ilike('username', storedUsername) // Case-insensitive search
          .single();
          
        if (error) {
          console.error("Error fetching user ID:", error);
          throw error;
        }
        
        if (data?.id) {
          console.log("User ID found in database:", data.id);
          setUserId(data.id);
          localStorage.setItem('userId', data.id); // Save to localStorage for future use
          setUsername(storedUsername);
          setRole(storedRole);
          await fetchAllUsers(data.id);
        } else {
          console.error("User not found for username:", storedUsername);
          throw new Error('User not found');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast.error("Impossible de récupérer les données utilisateur");
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, [navigate]);

  const fetchAllUsers = async (currentUserId: string) => {
    // We'll let the NewMessageDialog handle fetching the relevant users based on role
    try {
      const { data, error } = await supabase
        .from('user_accounts')
        .select('id, username, role')
        .not('id', 'eq', currentUserId);
        
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Erreur lors du chargement des utilisateurs');
      return [];
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return {
    userId,
    role,
    username,
    loading,
    handleLogout
  };
}
