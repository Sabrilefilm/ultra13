
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageList } from '@/components/messages/MessageList';
import { ContactList } from '@/components/messages/ContactList';
import { MessageComposer } from '@/components/messages/MessageComposer';
import { useMessages } from '@/hooks/use-messages';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Users, MessageSquare, Bell } from 'lucide-react';
import { UltraSidebar } from '@/components/layout/UltraSidebar';
import { Loading } from '@/components/ui/loading';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

const Messages = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string>('');
  const [role, setRole] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('messages');
  const { toast: uiToast } = useToast();
  
  const {
    conversations,
    messages,
    activeContact,
    setActiveContact,
    newMessage,
    setNewMessage,
    sendMessage,
    sendingMessage,
    loadingConversations,
    loadingMessages,
    unreadCount
  } = useMessages(userId);

  useEffect(() => {
    const checkAuth = () => {
      const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
      const storedUsername = localStorage.getItem('username');
      const storedRole = localStorage.getItem('userRole');
      
      if (!isAuthenticated || !storedUsername || !storedRole) {
        uiToast({
          title: "Session expirée",
          description: "Veuillez vous reconnecter",
          variant: "destructive",
          duration: 5000,
        });
        navigate('/');
        return;
      }
      
      // Get user id from user_accounts table
      const fetchUserId = async () => {
        try {
          const { data, error } = await supabase
            .from('user_accounts')
            .select('id')
            .eq('username', storedUsername)
            .single();
            
          if (error) throw error;
          
          if (data?.id) {
            setUserId(data.id);
            setUsername(storedUsername);
            setRole(storedRole);
          } else {
            throw new Error('User not found');
          }
        } catch (error) {
          console.error('Error fetching user:', error);
          uiToast({
            title: "Erreur",
            description: "Impossible de récupérer les données utilisateur",
            variant: "destructive",
            duration: 5000,
          });
          navigate('/');
        } finally {
          setLoading(false);
        }
      };
      
      fetchUserId();
    };
    
    checkAuth();
  }, [navigate, uiToast]);

  const handleSendMessage = () => {
    if (newMessage.trim() && activeContact) {
      sendMessage();
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  if (loading) {
    return <Loading fullScreen size="large" text="Chargement de la messagerie..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex">
      <UltraSidebar 
        username={username}
        role={role}
        onLogout={handleLogout}
        currentPage="messages"
      />
      
      <div className="flex-1 flex flex-col">
        <div className="bg-white dark:bg-slate-950 border-b border-gray-200 dark:border-gray-800 p-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/")}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold">Messagerie</h1>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadCount} non lu{unreadCount > 1 ? 's' : ''}
              </Badge>
            )}
          </div>
          
          <div className="md:hidden">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="contacts">
                  <Users className="h-5 w-5" />
                </TabsTrigger>
                <TabsTrigger value="messages">
                  <MessageSquare className="h-5 w-5" />
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
        
        <div className="flex-1 p-4 overflow-hidden">
          <Card className="h-full overflow-hidden">
            <CardContent className="p-0 h-full">
              <div className="md:flex h-full">
                <div className={`w-full md:w-1/3 md:border-r border-gray-200 dark:border-gray-800 h-full ${activeTab !== 'contacts' ? 'hidden md:block' : ''}`}>
                  <ContactList
                    contacts={conversations || []}
                    activeContactId={activeContact}
                    onSelectContact={(id) => {
                      setActiveContact(id);
                      setActiveTab('messages');
                    }}
                    isLoading={loadingConversations}
                    unreadMessages={unreadCount}
                  />
                </div>
                
                <div className={`flex flex-col w-full md:w-2/3 h-full ${activeTab !== 'messages' ? 'hidden md:block' : ''}`}>
                  {activeContact ? (
                    <>
                      <div className="bg-white dark:bg-slate-900 p-3 border-b border-gray-200 dark:border-gray-800">
                        <div className="flex items-center">
                          <span className="font-medium">
                            {conversations?.find(c => c.id === activeContact)?.username || 'Conversation'}
                          </span>
                          <span className="ml-2 text-sm text-gray-500">
                            ({conversations?.find(c => c.id === activeContact)?.role || ''})
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex-1 overflow-hidden">
                        <MessageList
                          messages={messages || []}
                          currentUserId={userId}
                          isLoading={loadingMessages}
                        />
                      </div>
                      
                      <MessageComposer
                        message={newMessage}
                        onChange={setNewMessage}
                        onSend={handleSendMessage}
                        isSending={sendingMessage}
                      />
                    </>
                  ) : (
                    <div className="flex flex-col h-full items-center justify-center p-6 text-center">
                      <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mb-4">
                        <MessageSquare className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 mb-2">Sélectionnez une conversation</p>
                      <p className="text-gray-400 dark:text-gray-500 text-sm">Choisissez un contact pour commencer à discuter</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Messages;
