
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageList } from '@/components/messages/MessageList';
import { ContactList } from '@/components/messages/ContactList';
import { MessageComposer } from '@/components/messages/MessageComposer';
import { useMessages } from '@/hooks/use-messages';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Users, MessageSquare, Bell, Archive, Plus, X } from 'lucide-react';
import { UltraSidebar } from '@/components/layout/UltraSidebar';
import { Loading } from '@/components/ui/loading';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { useIsMobile } from '@/hooks/use-mobile';
import { useToast } from '@/hooks/use-toast';

const Messages = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string>('');
  const [role, setRole] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('contacts');
  const [isNewMessageDialogOpen, setIsNewMessageDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const isMobile = useIsMobile();
  const { toast: uiToast } = useToast();
  
  // Classes pour les animations et couleurs bleus
  const blueButtonClass = "bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white";
  const animatedBlueButtonClass = `${blueButtonClass} animate-pulse`;
  
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
    unreadCount,
    allUsers,
    loadingUsers,
    archiveConversation,
    archiving,
    handleAttachment,
    attachmentPreview,
    clearAttachment
  } = useMessages(userId);

  useEffect(() => {
    const checkAuth = () => {
      const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
      const storedUsername = localStorage.getItem('username');
      const storedRole = localStorage.getItem('userRole');
      
      if (!isAuthenticated || !storedUsername || !storedRole) {
        console.log("Authentication failed, redirecting to login");
        toast.error("Session expirée, veuillez vous reconnecter");
        navigate('/');
        return;
      }
      
      console.log("Authentication successful, getting user ID");
      
      // Get user id from user_accounts table
      const fetchUserId = async () => {
        try {
          const { data, error } = await supabase
            .from('user_accounts')
            .select('id')
            .eq('username', storedUsername)
            .single();
            
          if (error) {
            console.error("Error fetching user ID:", error);
            throw error;
          }
          
          if (data?.id) {
            console.log("User ID found:", data.id);
            setUserId(data.id);
            setUsername(storedUsername);
            setRole(storedRole);
          } else {
            console.error("User not found for username:", storedUsername);
            throw new Error('User not found');
          }
        } catch (error) {
          console.error('Error fetching user:', error);
          toast.error("Impossible de récupérer les données utilisateur");
          navigate('/');
        } finally {
          setLoading(false);
        }
      };
      
      fetchUserId();
    };
    
    checkAuth();
  }, [navigate]);

  const handleSendMessage = () => {
    if ((newMessage.trim() || attachmentPreview) && activeContact) {
      sendMessage();
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
    
    setActiveContact(selectedUser);
    setIsNewMessageDialogOpen(false);
    setSelectedUser('');
    if (isMobile) {
      setActiveTab('messages');
    }
  };

  const getUserById = (id: string) => {
    return allUsers?.find(user => user.id === id);
  };

  const handleArchive = () => {
    const isFounder = role === 'founder';
    const confirmMessage = isFounder 
      ? 'Êtes-vous sûr de vouloir archiver définitivement cette conversation ?'
      : 'Êtes-vous sûr de vouloir archiver cette conversation pour 1 mois ?';
      
    if (window.confirm(confirmMessage)) {
      archiveConversation();
    }
  };

  console.log("Rendering Messages component with state:", {
    userId,
    activeTab,
    activeContact,
    conversationsCount: conversations?.length || 0,
    messagesCount: messages?.length || 0
  });

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
            <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600 animate-pulse">
              Messagerie
            </h1>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2 animate-pulse">
                {unreadCount} non lu{unreadCount > 1 ? 's' : ''}
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              className={`hidden md:flex items-center gap-1 ${animatedBlueButtonClass}`}
              onClick={() => setIsNewMessageDialogOpen(true)}
              size="sm"
            >
              <Plus className="h-4 w-4" />
              Nouveau message
            </Button>
            
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
        </div>
        
        <div className="flex-1 p-4 overflow-hidden">
          <Card className="h-full overflow-hidden shadow-lg border-blue-100 dark:border-blue-900/30">
            <CardContent className="p-0 h-full">
              <div className="md:flex h-full">
                <div className={`w-full md:w-1/3 md:border-r border-gray-200 dark:border-gray-800 h-full ${activeTab !== 'contacts' ? 'hidden md:block' : ''}`}>
                  <div className="flex justify-between items-center p-3 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                    <h2 className="font-medium text-gray-900 dark:text-gray-100 flex items-center">
                      <Users className="h-4 w-4 mr-2 text-blue-500" />
                      Contacts
                    </h2>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsNewMessageDialogOpen(true)}
                      className="md:hidden text-blue-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <ContactList
                    contacts={conversations || []}
                    activeContactId={activeContact}
                    onSelectContact={(id) => {
                      console.log("Selecting contact:", id);
                      setActiveContact(id);
                      if (isMobile) {
                        setActiveTab('messages');
                      }
                    }}
                    isLoading={loadingConversations}
                    unreadMessages={unreadCount}
                  />
                </div>
                
                <div className={`flex flex-col w-full md:w-2/3 h-full ${activeTab !== 'messages' ? 'hidden md:block' : ''}`}>
                  {activeContact ? (
                    <>
                      <div className="bg-white dark:bg-slate-900 p-3 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
                        <div className="flex items-center">
                          <span className="font-medium text-blue-600 dark:text-blue-400">
                            {conversations?.find(c => c.id === activeContact)?.username || allUsers?.find(u => u.id === activeContact)?.username || 'Conversation'}
                          </span>
                          <span className="ml-2 text-sm text-gray-500">
                            ({conversations?.find(c => c.id === activeContact)?.role || allUsers?.find(u => u.id === activeContact)?.role || ''})
                          </span>
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleArchive}
                          disabled={archiving}
                          className="text-gray-500 hover:text-red-500"
                        >
                          <Archive className="h-4 w-4 mr-1" />
                          {isMobile ? '' : 'Archiver'}
                        </Button>
                      </div>
                      
                      <div className="flex-1 overflow-hidden bg-gray-50 dark:bg-gray-900/30">
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
                        onAttachFile={handleAttachment}
                        attachmentPreview={attachmentPreview}
                        onClearAttachment={clearAttachment}
                      />
                    </>
                  ) : (
                    <div className="flex flex-col h-full items-center justify-center p-6 text-center">
                      <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4 animate-pulse">
                        <MessageSquare className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 mb-2">Sélectionnez une conversation</p>
                      <p className="text-gray-400 dark:text-gray-500 text-sm">Choisissez un contact pour commencer à discuter</p>
                      
                      <Button
                        className={`mt-4 ${blueButtonClass}`}
                        onClick={() => setIsNewMessageDialogOpen(true)}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Nouveau message
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* New Message Dialog */}
      <Dialog open={isNewMessageDialogOpen} onOpenChange={setIsNewMessageDialogOpen}>
        <DialogContent className="sm:max-w-md bg-white dark:bg-slate-900 border-blue-200 dark:border-blue-800/30">
          <DialogHeader>
            <DialogTitle className="text-blue-600 dark:text-blue-400">Nouveau message</DialogTitle>
            <DialogDescription className="text-gray-500 dark:text-gray-400">
              Sélectionnez un utilisateur pour commencer une nouvelle conversation.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <Select value={selectedUser} onValueChange={setSelectedUser}>
              <SelectTrigger className="border-blue-200 dark:border-blue-700">
                <SelectValue placeholder="Sélectionner un utilisateur" />
              </SelectTrigger>
              <SelectContent>
                {loadingUsers ? (
                  <div className="flex justify-center p-2">
                    <div className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin border-blue-500"></div>
                  </div>
                ) : allUsers?.length === 0 ? (
                  <div className="p-2 text-sm text-gray-500">Aucun utilisateur disponible</div>
                ) : (
                  allUsers?.map(user => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.username} ({user.role})
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewMessageDialogOpen(false)}>
              Annuler
            </Button>
            <Button 
              onClick={handleStartNewConversation}
              className={blueButtonClass}
            >
              Commencer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Messages;
