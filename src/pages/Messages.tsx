
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageList } from '@/components/messages/MessageList';
import { ContactList } from '@/components/messages/ContactList';
import { MessageComposer } from '@/components/messages/MessageComposer';
import { useMessages } from '@/hooks/use-messages';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Users, MessageSquare } from 'lucide-react';
import { UltraSidebar } from '@/components/layout/UltraSidebar';
import { Loading } from '@/components/ui/loading';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

const Messages = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string>('');
  const [role, setRole] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('messages');
  
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
    const checkSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        
        if (!data.session?.user) {
          navigate('/');
          return;
        }
        
        setUserId(data.session.user.id);
        
        // Get user role and username
        const { data: userData, error } = await supabase
          .from('profiles')
          .select('role, username')
          .eq('id', data.session.user.id)
          .single();
          
        if (error) throw error;
        
        setRole(userData?.role || 'creator');
        setUsername(userData?.username || data.session.user.email || 'User');
      } catch (error) {
        console.error('Error checking session:', error);
        toast.error('Une erreur est survenue lors de la vérification de session');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    
    checkSession();
  }, [navigate]);

  const handleSendMessage = () => {
    if (newMessage.trim() && activeContact) {
      sendMessage();
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
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
                  />
                </div>
                
                <div className={`flex flex-col w-full md:w-2/3 h-full ${activeTab !== 'messages' ? 'hidden md:block' : ''}`}>
                  {activeContact ? (
                    <>
                      <div className="bg-white dark:bg-slate-900 p-3 border-b border-gray-200 dark:border-gray-800">
                        <div className="flex items-center">
                          {conversations?.find(c => c.id === activeContact)?.username || 'Conversation'}
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
