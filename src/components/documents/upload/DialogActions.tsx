
import { Button } from '@/components/ui/button';

interface DialogActionsProps {
  onCancel: () => void;
  onSubmit: () => void;
  uploading: boolean;
}

export const DialogActions = ({ onCancel, onSubmit, uploading }: DialogActionsProps) => {
  return (
    <>
      <Button 
        type="button" 
        variant="outline" 
        onClick={onCancel} 
        disabled={uploading}
        className="bg-slate-700 hover:bg-slate-600 border-slate-600 text-white"
      >
        Annuler
      </Button>
      <Button 
        type="button" 
        onClick={onSubmit} 
        disabled={uploading}
        className="bg-purple-600 hover:bg-purple-700 text-white"
      >
        {uploading ? (
          <>
            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-transparent border-t-current"></div>
            Téléchargement...
          </>
        ) : (
          'Télécharger'
        )}
      </Button>
    </>
  );
};
