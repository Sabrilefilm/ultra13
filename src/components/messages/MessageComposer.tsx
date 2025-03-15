
import { KeyboardEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send } from 'lucide-react';

interface MessageComposerProps {
  message: string;
  onChange: (value: string) => void;
  onSend: () => void;
  isSending: boolean;
  disabled?: boolean;
}

export const MessageComposer = ({
  message,
  onChange,
  onSend,
  isSending,
  disabled = false
}: MessageComposerProps) => {
  
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (message.trim() && !isSending) {
        onSend();
      }
    }
  };
  
  return (
    <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-900">
      <div className="flex items-end gap-2">
        <Textarea
          placeholder="Tapez un message..."
          className="resize-none py-3 min-h-[80px] bg-gray-100 dark:bg-slate-800 border-gray-200 dark:border-gray-700"
          value={message}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled || isSending}
        />
        <Button 
          onClick={onSend}
          disabled={!message.trim() || isSending || disabled}
          className="h-10 bg-purple-600 hover:bg-purple-700 text-white"
        >
          {isSending ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
};
