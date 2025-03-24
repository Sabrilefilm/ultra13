
import { useMessages } from '@/hooks/use-messages';
import { Archive, ArrowLeft, MoreVertical, Phone, Video } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from "sonner";

interface Contact {
  id: string;
  username: string;
  role: string;
  unreadCount?: number;
}

interface MessageHeaderProps {
  contact?: Contact;
  unreadCount?: number;
  onNewMessage?: () => void;
  isMobile?: boolean;
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
  onBack?: () => void;
  role?: string;
}

export const MessageHeader = ({ 
  contact, 
  unreadCount, 
  onNewMessage, 
  isMobile, 
  activeTab, 
  setActiveTab, 
  onBack,
  role
}: MessageHeaderProps) => {
  const isFounder = role === 'founder';
  const { archiveConversation, archiving } = useMessages(localStorage.getItem('userId') || '');

  const handleArchive = () => {
    if (confirm('Êtes-vous sûr de vouloir archiver cette conversation?')) {
      try {
        archiveConversation();
        toast.success("Conversation archivée avec succès");
      } catch (error) {
        console.error("Erreur lors de l'archivage:", error);
        toast.error("Erreur lors de l'archivage de la conversation");
      }
    }
  };

  // For mobile view with tabs
  if (isMobile && setActiveTab && activeTab) {
    return (
      <div className="bg-card border-b p-3 flex items-center justify-between">
        {activeTab === 'messages' && contact ? (
          <>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onBack}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <div className="font-medium">{contact.username}</div>
                <div className="text-xs text-muted-foreground">{contact.role}</div>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem disabled>
                  <Phone className="h-4 w-4 mr-2" />
                  Appeler
                </DropdownMenuItem>
                <DropdownMenuItem disabled>
                  <Video className="h-4 w-4 mr-2" />
                  Appel vidéo
                </DropdownMenuItem>
                {isFounder && (
                  <DropdownMenuItem onClick={handleArchive} disabled={archiving}>
                    <Archive className="h-4 w-4 mr-2" />
                    Archiver la conversation
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : (
          <>
            <div className="font-medium">Messagerie</div>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
              <TabsList className="grid w-[180px] grid-cols-2">
                <TabsTrigger value="contacts">
                  Contacts {unreadCount ? `(${unreadCount})` : ''}
                </TabsTrigger>
                <TabsTrigger value="messages">Messages</TabsTrigger>
              </TabsList>
            </Tabs>
          </>
        )}
      </div>
    );
  }

  // For desktop or no contact selected
  if (!contact) {
    return (
      <div className="bg-card border-b p-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Messagerie</h2>
        {onNewMessage && (
          <Button onClick={onNewMessage} size="sm">
            Nouveau message
          </Button>
        )}
      </div>
    );
  }

  // For selected contact in desktop view
  return (
    <div className="bg-card border-b p-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div>
          <div className="font-medium text-base">{contact.username}</div>
          <div className="text-sm text-muted-foreground">{contact.role}</div>
        </div>
      </div>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-700">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem disabled>
            <Phone className="h-4 w-4 mr-2" />
            Appeler
          </DropdownMenuItem>
          <DropdownMenuItem disabled>
            <Video className="h-4 w-4 mr-2" />
            Appel vidéo
          </DropdownMenuItem>
          {isFounder && (
            <DropdownMenuItem onClick={handleArchive} disabled={archiving}>
              <Archive className="h-4 w-4 mr-2" />
              Archiver la conversation
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
