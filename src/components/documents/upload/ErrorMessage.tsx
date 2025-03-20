
import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
}

export const ErrorMessage = ({ message }: ErrorMessageProps) => {
  if (!message) return null;
  
  return (
    <div className="p-3 bg-red-900/30 border border-red-700/50 rounded-lg flex items-start gap-2">
      <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
      <div className="text-sm text-red-300">{message}</div>
    </div>
  );
};
