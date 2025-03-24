
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMessages } from '@/hooks/use-messages';
import { UltraSidebar } from '@/components/layout/UltraSidebar';
import { Loading } from '@/components/ui/loading';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { MessageContainer } from '@/components/messages/MessageContainer';
import { NewMessageDialog } from '@/components/messages/NewMessageDialog';
import { Button } from '@/components/ui/button';
import { HomeIcon, Plus } from 'lucide-react';
import { Footer } from '@/components/layout/Footer';
import { useIsMobile } from '@/hooks/use-mobile';

const Messages = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [userId, setUserId] = useState<string>('');
  const [role, setRole] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [isNewMessageDialogOpen, setIsNewMessageDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  
  // Move the hook call to the top level
  const messageHook = useMessages(userId);
  
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
    // This is just a fallback for backward compatibility
    setLoadingUsers(true);
    try {
      const { data, error } = await supabase
        .from('user_accounts')
        .select('id, username, role')
        .not('id', 'eq', currentUserId);
        
      if (error) throw error;
      
      setAllUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Erreur lors du chargement des utilisateurs');
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const handleStartNewConversation = async () => {
    if (!selectedUser) {
      toast.error('Veuillez sélectionner un destinataire');
      return;
    }

    try {
      // Use the messageHook defined at the top level to refetch conversations
      await messageHook.refetch();
      
      setIsNewMessageDialogOpen(false);
      setSelectedUser('');
      toast.success('Conversation démarrée');
    } catch (error) {
      console.error('Error starting conversation:', error);
      toast.error('Erreur lors du démarrage de la conversation');
    }
  };

  if (loading) {
    return <Loading fullScreen size="large" text="Chargement de la messagerie..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-col md:flex-row relative">
      <UltraSidebar 
        username={username}
        role={role}
        userId={userId}
        onLogout={handleLogout}
        currentPage="messages"
      />
      
      <div className="flex-1 flex flex-col relative">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 gap-3">
          <h1 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
            💬 Messages
          </h1>
          
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button 
              onClick={() => navigate('/')}
              variant="outline"
              className="flex items-center gap-2 flex-1 sm:flex-initial justify-center"
              size={isMobile ? "sm" : "default"}
            >
              <HomeIcon className="h-4 w-4" />
              {!isMobile && "Retour au tableau de bord"}
            </Button>
            
            <Button 
              onClick={() => setIsNewMessageDialogOpen(true)}
              className="flex items-center gap-2 flex-1 sm:flex-initial justify-center"
              size={isMobile ? "sm" : "default"}
            >
              <Plus className="h-4 w-4" />
              {!isMobile && "Nouveau message"}
            </Button>
          </div>
        </div>
        
        <div className="flex-1">
          <MessageContainer 
            username={username}
            role={role}
            userId={userId}
          />
        </div>
        
        <Footer className="mt-auto" />
      </div>
      
      <NewMessageDialog 
        isOpen={isNewMessageDialogOpen}
        onOpenChange={setIsNewMessageDialogOpen}
        selectedUser={selectedUser}
        onUserChange={setSelectedUser}
        onStartConversation={handleStartNewConversation}
        currentUserRole={role}
        currentUserId={userId}
        allUsers={allUsers}
        loadingUsers={loadingUsers}
      />
    </div>
  );
};

export default Messages;
