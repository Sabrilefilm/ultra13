
import React from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

export interface DocumentTypeSelectorProps {
  selectedDocType: string;
  onChange: (value: string) => void;
}

export const DocumentTypeSelector: React.FC<DocumentTypeSelectorProps> = ({ 
  selectedDocType, 
  onChange 
}) => {
  return (
    <div className="space-y-3">
      <Label>Document Type</Label>
      <RadioGroup
        value={selectedDocType}
        onValueChange={onChange}
        className="flex flex-col space-y-2"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="identity" id="identity" />
          <Label htmlFor="identity" className="cursor-pointer">Identity Card/Passport</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="other" id="other" />
          <Label htmlFor="other" className="cursor-pointer">Other Document</Label>
        </div>
      </RadioGroup>
    </div>
  );
};
