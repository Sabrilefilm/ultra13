
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

const Messages = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string>('');
  const [role, setRole] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [isNewMessageDialogOpen, setIsNewMessageDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  
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

  const handleStartNewConversation = () => {
    if (!selectedUser) {
      toast.error('Veuillez sélectionner un destinataire');
      return;
    }
    
    setIsNewMessageDialogOpen(false);
    setSelectedUser('');
  };

  // Username watermark
  const usernameWatermark = (
    <div className="fixed inset-0 pointer-events-none select-none z-0 flex items-center justify-center">
      <div className="w-full h-full flex items-center justify-center rotate-[-30deg]">
        <p className="text-slate-200/30 text-[6vw] font-bold whitespace-nowrap">
          {username.toUpperCase()}
        </p>
      </div>
    </div>
  );

  if (loading) {
    return <Loading fullScreen size="large" text="Chargement de la messagerie..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex relative overflow-hidden">
      {/* Watermark */}
      {usernameWatermark}
      
      <UltraSidebar 
        username={username}
        role={role}
        userId={userId}
        onLogout={handleLogout}
        currentPage="messages"
      />
      
      <div className="flex-1 flex flex-col relative">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            💬 Messages
          </h1>
          
          <div className="flex items-center gap-2">
            <Button 
              onClick={() => navigate('/')}
              variant="outline"
              className="flex items-center gap-2"
            >
              <HomeIcon className="h-4 w-4" />
              Retour au tableau de bord
            </Button>
            
            <Button 
              onClick={() => setIsNewMessageDialogOpen(true)}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Nouveau message
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
