
import { Button } from '@/components/ui/button';
import { HomeIcon, Plus, MessageSquare } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useNavigate } from 'react-router-dom';

interface MessagesHeaderProps {
  onNewMessage: () => void;
}

export function MessagesHeader({ onNewMessage }: MessagesHeaderProps) {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 gap-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-b dark:border-gray-700/30">
      <h1 className="text-xl sm:text-2xl font-bold flex items-center gap-2 text-gray-800 dark:text-gray-200">
        <MessageSquare className="h-6 w-6 text-blue-500" />
        Messagerie Ultra
      </h1>
      
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <Button 
          onClick={() => navigate('/')}
          variant="outline"
          className="flex items-center gap-2 flex-1 sm:flex-initial justify-center bg-white dark:bg-slate-900 border-blue-100 dark:border-blue-900/30"
          size={isMobile ? "sm" : "default"}
        >
          <HomeIcon className="h-4 w-4" />
          {!isMobile && "Retour au tableau de bord"}
        </Button>
        
        <Button 
          onClick={onNewMessage}
          className="flex items-center gap-2 flex-1 sm:flex-initial justify-center bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800"
          size={isMobile ? "sm" : "default"}
        >
          <Plus className="h-4 w-4" />
          {!isMobile && "Nouveau message"}
        </Button>
      </div>
    </div>
  );
}
