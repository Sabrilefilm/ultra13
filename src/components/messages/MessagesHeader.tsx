
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
    <div className="flex flex-col sm:flex-row items-center justify-between p-3 gap-2 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-b dark:border-gray-700/30">
      <h1 className="text-lg sm:text-xl font-bold flex items-center gap-2 text-gray-800 dark:text-gray-200">
        <MessageSquare className="h-5 w-5 text-blue-500" />
        {!isMobile ? "Messagerie Ultra" : "Messages"}
      </h1>
      
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <Button 
          onClick={() => navigate('/')}
          variant="outline"
          className="flex items-center gap-1 flex-1 sm:flex-initial justify-center bg-white dark:bg-slate-900 border-blue-100 dark:border-blue-900/30 h-8 text-xs"
          size="sm"
        >
          <HomeIcon className="h-3 w-3" />
          {!isMobile && "Retour"}
        </Button>
        
        <Button 
          onClick={onNewMessage}
          className="flex items-center gap-1 flex-1 sm:flex-initial justify-center bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 h-8 text-xs"
          size="sm"
        >
          <Plus className="h-3 w-3" />
          {isMobile ? "Nouveau" : "Nouveau message"}
        </Button>
      </div>
    </div>
  );
}
