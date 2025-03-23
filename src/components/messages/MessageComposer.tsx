import { useState, KeyboardEvent, ChangeEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Paperclip, X } from 'lucide-react';

interface MessageComposerProps {
  message: string;
  onChange: (value: string) => void;
  onSend: () => void;
  isSending: boolean;
  disabled?: boolean;
  onAttachFile?: (file: File) => void;
  attachmentPreview?: string | null;
  onClearAttachment?: () => void;
}

export const MessageComposer = ({
  message,
  onChange,
  onSend,
  isSending,
  disabled = false,
  onAttachFile,
  attachmentPreview,
  onClearAttachment
}: MessageComposerProps) => {
  const [isDragging, setIsDragging] = useState(false);
  
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if ((message.trim() || attachmentPreview) && !isSending) {
        onSend();
      }
    }
  };
  
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onAttachFile) {
      onAttachFile(file);
      // Reset the input value so the same file can be selected again
      e.target.value = '';
    }
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (onAttachFile && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      onAttachFile(file);
    }
  };
  
  return (
    <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-900">
      {/* File preview */}
      {attachmentPreview && (
        <div className="mb-2 relative rounded overflow-hidden border border-blue-200 dark:border-blue-800 inline-block">
          <img 
            src={attachmentPreview} 
            alt="Attachment" 
            className="h-20 w-auto object-cover"
          />
          <button 
            onClick={onClearAttachment}
            className="absolute top-1 right-1 bg-gray-800/70 text-white rounded-full p-1 hover:bg-gray-700/90"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      )}
      
      <div 
        className={`flex items-end gap-2 ${isDragging ? 'border-2 border-dashed border-blue-500 rounded-lg p-2' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <Textarea
          placeholder="Tapez un message..."
          className="resize-none py-3 min-h-[80px] bg-gray-100 dark:bg-slate-800 border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-blue-500"
          value={message}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled || isSending}
        />
        
        <div className="flex flex-col gap-2">
          {onAttachFile && (
            <div className="relative">
              <input
                type="file"
                id="file-upload"
                className="hidden"
                onChange={handleFileChange}
                accept="image/*"
                disabled={disabled || isSending}
              />
              <label htmlFor="file-upload">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 cursor-pointer border-blue-200 dark:border-blue-800 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                  disabled={disabled || isSending}
                >
                  <Paperclip className="h-4 w-4" />
                </Button>
              </label>
            </div>
          )}
          
          <Button 
            onClick={onSend}
            disabled={(!message.trim() && !attachmentPreview) || isSending || disabled}
            className="h-10 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white"
          >
            {isSending ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
