
import { Button } from '@/components/ui/button';
import { HomeIcon, Plus } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useNavigate } from 'react-router-dom';

interface MessagesHeaderProps {
  onNewMessage: () => void;
}

export function MessagesHeader({ onNewMessage }: MessagesHeaderProps) {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  return (
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
          onClick={onNewMessage}
          className="flex items-center gap-2 flex-1 sm:flex-initial justify-center"
          size={isMobile ? "sm" : "default"}
        >
          <Plus className="h-4 w-4" />
          {!isMobile && "Nouveau message"}
        </Button>
      </div>
    </div>
  );
}
