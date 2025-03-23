
import { Button } from '@/components/ui/button';
import { ArrowLeft, Plus, Users, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface MessageHeaderProps {
  username: string;
  unreadCount: number;
  onNewMessage: () => void;
  isMobile: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  role: string;
}

export const MessageHeader = ({
  username,
  unreadCount,
  onNewMessage,
  isMobile,
  activeTab,
  setActiveTab,
  role
}: MessageHeaderProps) => {
  const navigate = useNavigate();
  
  // Classes pour les animations et les couleurs selon le rôle
  const getRoleButtonClass = () => {
    switch(role) {
      case 'founder':
        return "bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white";
      case 'manager':
        return "bg-gradient-to-r from-amber-500 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-white";
      case 'agent':
        return "bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white";
      case 'creator':
        return "bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white";
      default:
        return "bg-gray-500 hover:bg-gray-600 text-white";
    }
  };
  
  return (
    <div className="bg-white dark:bg-slate-950 border-b border-gray-200 dark:border-gray-800 p-4 flex items-center justify-between shadow-md">
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/")}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
          Messagerie
        </h1>
        {unreadCount > 0 && (
          <Badge variant="destructive" className="ml-2 animate-pulse">
            {unreadCount} non lu{unreadCount > 1 ? 's' : ''}
          </Badge>
        )}
      </div>
      
      <div className="flex items-center gap-2">
        {(role === 'founder' || role === 'manager' || role === 'agent') && (
          <Button
            className={`hidden md:flex items-center gap-1 ${getRoleButtonClass()}`}
            onClick={onNewMessage}
            size="sm"
          >
            <Plus className="h-4 w-4" />
            Nouveau message
          </Button>
        )}
        
        {isMobile && (
          <div className="md:hidden">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="bg-gray-100 dark:bg-gray-800">
                <TabsTrigger value="contacts" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                  <Users className="h-5 w-5" />
                </TabsTrigger>
                <TabsTrigger value="messages" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                  <MessageSquare className="h-5 w-5" />
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  );
};
