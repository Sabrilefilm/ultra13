
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface DocumentTypeSelectorProps {
  selectedDocType: 'identity' | 'other';
  onTypeChange: (value: 'identity' | 'other') => void;
}

export const DocumentTypeSelector = ({ selectedDocType, onTypeChange }: DocumentTypeSelectorProps) => {
  return (
    <div>
      <label className="block text-sm font-medium mb-2 text-white/90">Type de document</label>
      <Select 
        value={selectedDocType} 
        onValueChange={(value) => onTypeChange(value as 'identity' | 'other')}
      >
        <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
          <SelectValue placeholder="Sélectionner un type de document" />
        </SelectTrigger>
        <SelectContent className="bg-slate-800 border-slate-700 text-white">
          <SelectItem value="identity" className="text-white hover:bg-slate-700">Carte d'identité</SelectItem>
          <SelectItem value="other" className="text-white hover:bg-slate-700">Autre document</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
