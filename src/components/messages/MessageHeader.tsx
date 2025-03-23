
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
}

export const MessageHeader = ({
  username,
  unreadCount,
  onNewMessage,
  isMobile,
  activeTab,
  setActiveTab
}: MessageHeaderProps) => {
  const navigate = useNavigate();
  
  // Classes for animations and blue colors
  const animatedBlueButtonClass = "bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white animate-pulse";
  
  return (
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
          onClick={onNewMessage}
          size="sm"
        >
          <Plus className="h-4 w-4" />
          Nouveau message
        </Button>
        
        {isMobile && (
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
        )}
      </div>
    </div>
  );
};
